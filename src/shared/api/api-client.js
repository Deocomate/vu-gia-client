// Session-aware HTTP engine shared by the admin CMS and customer storefront.
//
// This is a single concrete module, not a factory/class abstraction (per the
// plan's Phase 2 red-team finding #10) — every function takes the target
// zustand auth store (`useAdminAuthStore` or `useCustomerAuthStore`) as an
// explicit first argument, so admin and customer traffic share the exact
// same request/refresh/error logic while keeping their sessions, tokens, and
// single-flight refresh promises fully independent (never shared).
//
// SSR-safe: `document`/`window` are only ever touched inside functions that
// run at request time (never at module-evaluation time), and every access is
// guarded so this module can be safely imported from code that also runs on
// the server (e.g. Server Components importing a store module transitively).

// NEXT_PUBLIC_API_BASE_URL is inlined at build time and reaches the browser —
// it must be the public-facing backend URL. Server Components/route handlers
// (SSR, generateMetadata) run inside this app's own container though, so a
// browser-facing "localhost:8080" resolves to the container itself, not the
// backend. INTERNAL_API_BASE_URL is a plain (non-NEXT_PUBLIC_) runtime env var
// read only on the server, for reaching the backend over the Docker network
// (e.g. "http://app:8080/api") — never sent to the client bundle.
export const API_BASE_URL =
  (typeof window === "undefined" && process.env.INTERNAL_API_BASE_URL) ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8080/api";

export class ApiError extends Error {
  constructor(message, { status, code, data, cause } = {}) {
    super(message, cause ? { cause } : undefined);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.data = data;
  }
}

function buildUrl(path, query) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${API_BASE_URL}${normalizedPath}`);

  Object.entries(query || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
}

async function parseResponse(response) {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

/**
 * Reads the `XSRF-TOKEN` cookie value out of `document.cookie`. SSR-guarded —
 * returns `null` when `document` doesn't exist (server render) or the cookie
 * isn't present yet (no session established).
 */
function readCsrfToken() {
  if (typeof document === "undefined") {
    return null;
  }
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

// Single-flight refresh: concurrent 401s for the SAME session share one
// refresh promise. Keyed per session store (never a shared promise across
// admin/customer) so refreshing one session can never race or clobber the
// other's tokens.
const refreshPromises = new WeakMap();

async function rawFetch(sessionStore, path, options) {
  const { query, body, headers, ...init } = options;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const accessToken = sessionStore.getState().accessToken;

  let response;
  let envelope;
  try {
    response = await fetch(buildUrl(path, query), {
      ...init,
      credentials: "include", // send the httpOnly refresh_token / XSRF-TOKEN cookies
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...headers,
      },
      body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
    });
    envelope = await parseResponse(response);
  } catch (error) {
    if (path.includes("banner") || path.includes("ad")) {
      throw new ApiError(
        "Yêu cầu API bị lỗi hoặc bị chặn. Nếu bạn đang bật trình chặn quảng cáo (Adblocker), vui lòng tắt nó trên localhost (Lỗi có thể là ERR_BLOCKED_BY_CLIENT).",
        { status: 0, cause: error },
      );
    }
    throw new ApiError("Không thể kết nối máy chủ.", { status: 0, cause: error });
  }

  return { response, envelope };
}

async function performRefresh(sessionStore) {
  const csrfToken = readCsrfToken();
  if (!csrfToken) {
    throw new ApiError("Không có phiên đăng nhập.", { status: 401 });
  }

  const response = await fetch(buildUrl("/auth/refresh"), {
    method: "POST",
    credentials: "include",
    headers: { "X-XSRF-TOKEN": csrfToken },
  });
  const envelope = await parseResponse(response);

  if (!response.ok || envelope?.code !== 1000) {
    throw new ApiError(envelope?.message || "Phiên đăng nhập đã hết hạn.", {
      status: response.status,
      code: envelope?.code,
    });
  }

  const { accessToken } = envelope.data || {};
  sessionStore.getState().setAccessToken(accessToken);
  return accessToken;
}

/**
 * Rotates the given session's access token via `POST /auth/refresh` (cookie +
 * CSRF header, no body — see `docs/AUTH_USER_API.md` §3.4). Concurrent calls
 * for the same `sessionStore` share one in-flight promise.
 */
export function refreshSession(sessionStore) {
  let promise = refreshPromises.get(sessionStore);
  if (!promise) {
    promise = performRefresh(sessionStore).finally(() => {
      refreshPromises.delete(sessionStore);
    });
    refreshPromises.set(sessionStore, promise);
  }
  return promise;
}

/**
 * Performs an authenticated request bound to `sessionStore` (an `useXxxAuthStore`
 * zustand hook). On a 401 from a non-auth endpoint, transparently refreshes the
 * session once and retries; a failed refresh clears ONLY that session
 * (`sessionStore.getState().clearSession()`), never another session's state.
 *
 * `sessionStore.getState()` must implement:
 *   - `accessToken`            — current access token (or null)
 *   - `setAccessToken(token)`  — persist a freshly rotated access token
 *   - `clearSession()`         — local-only session clear (no network call)
 */
export async function apiRequest(sessionStore, path, options = {}) {
  const isAuthCall = path.startsWith("/auth/");
  let { response, envelope } = await rawFetch(sessionStore, path, options);

  if (response.status === 401 && !isAuthCall) {
    try {
      await refreshSession(sessionStore);
      ({ response, envelope } = await rawFetch(sessionStore, path, options));
    } catch {
      sessionStore.getState().clearSession();
      throw new ApiError("Phiên đăng nhập đã hết hạn.", { status: 401 });
    }
  }

  if (
    !response.ok ||
    (envelope && typeof envelope === "object" && envelope.code !== undefined && envelope.code !== 1000)
  ) {
    const message = envelope?.message || "Không thể hoàn tất yêu cầu.";
    throw new ApiError(message, {
      status: response.status,
      code: envelope?.code,
      data: envelope?.data,
    });
  }

  // Envelope responses carry the payload in `data`; plain 204/text bodies pass through.
  return envelope && typeof envelope === "object" && "data" in envelope ? envelope.data : envelope;
}
