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

export class AdminApiError extends Error {
  constructor(message, { status, code, data } = {}) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
    this.code = code;
    this.data = data;
  }
}

const buildUrl = (path, query) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${API_BASE_URL}${normalizedPath}`);

  Object.entries(query || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
};

const parseResponse = async (response) => {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
};

// Single-flight refresh: concurrent 401s share one refresh promise.
let refreshPromise = null;

function getAuthStore() {
  // Lazy require to avoid a circular import (adminAuthStore -> adminApi).
  return require("@/stores/adminAuthStore").useAdminAuthStore;
}

async function performRefresh() {
  const store = getAuthStore();
  const refreshToken = store.getState().refreshToken;
  if (!refreshToken) {
    throw new AdminApiError("Không có phiên đăng nhập.", { status: 401 });
  }

  const response = await fetch(buildUrl("/auth/refresh"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  const envelope = await parseResponse(response);

  if (!response.ok || envelope?.code !== 1000) {
    throw new AdminApiError(envelope?.message || "Phiên đăng nhập đã hết hạn.", {
      status: response.status,
      code: envelope?.code,
    });
  }

  const { accessToken, refreshToken: nextRefreshToken } = envelope.data || {};
  store.getState().setTokens({ accessToken, refreshToken: nextRefreshToken });
  return accessToken;
}

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = performRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

async function rawRequest(path, options) {
  const { query, body, headers, ...init } = options;
  const isFormData = body instanceof FormData;
  const store = getAuthStore();
  const accessToken = store.getState().accessToken;

  let response;
  let envelope;
  try {
    response = await fetch(buildUrl(path, query), {
      ...init,
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
      throw new AdminApiError(
        "Yêu cầu API bị lỗi hoặc bị chặn. Nếu bạn đang bật trình chặn quảng cáo (Adblocker), vui lòng tắt nó trên localhost (Lỗi có thể là ERR_BLOCKED_BY_CLIENT).",
        { status: 0 }
      );
    }
    throw error;
  }

  return { response, envelope };
}

export async function adminRequest(path, options = {}) {
  const isAuthCall = path.startsWith("/auth/");
  let { response, envelope } = await rawRequest(path, options);

  if (response.status === 401 && !isAuthCall) {
    try {
      await refreshAccessToken();
      ({ response, envelope } = await rawRequest(path, options));
    } catch (refreshError) {
      getAuthStore().getState().logout();
      throw new AdminApiError("Phiên đăng nhập đã hết hạn.", { status: 401 });
    }
  }

  if (!response.ok || (envelope && typeof envelope === "object" && envelope.code !== undefined && envelope.code !== 1000)) {
    const message = envelope?.message || "Không thể hoàn tất yêu cầu.";
    throw new AdminApiError(message, {
      status: response.status,
      code: envelope?.code,
      data: envelope?.data,
    });
  }

  // Envelope responses carry the payload in `data`; plain 204/text bodies pass through.
  return envelope && typeof envelope === "object" && "data" in envelope ? envelope.data : envelope;
}

export const adminApi = {
  get: (path, query) => adminRequest(path, { method: "GET", query }),
  post: (path, body) => adminRequest(path, { method: "POST", body }),
  put: (path, body) => adminRequest(path, { method: "PUT", body }),
  patch: (path, query) => adminRequest(path, { method: "PATCH", query }),
  patchBody: (path, body) => adminRequest(path, { method: "PATCH", body }),
  delete: (path) => adminRequest(path, { method: "DELETE" }),
  upload: (path, formData) => adminRequest(path, { method: "POST", body: formData }),
};

export function formatVnd(value) {
  const number = Number(value || 0);
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(number);
}

export function parseVnd(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(String(value).replace(/[^\d-]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

export function getValueByPath(row, path) {
  if (!path) {
    return undefined;
  }

  return path.split(".").reduce((value, key) => value?.[key], row);
}
