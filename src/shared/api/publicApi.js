import { API_BASE_URL } from "@/lib/adminApi";

export class PublicApiError extends Error {
  constructor(message, { status, code, cause } = {}) {
    super(message, cause ? { cause } : undefined);
    this.name = "PublicApiError";
    this.status = status;
    this.code = code;
  }
}

function buildQuery(params) {
  if (!params) return "";
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    searchParams.set(key, value);
  });
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

// Runs `fetch` and normalizes a network-level failure (backend unreachable,
// DNS failure, connection refused/reset, timeout — thrown by fetch() itself as
// a bare TypeError/AggregateError, not an HTTP response) into a PublicApiError
// too. Every call site already only knows how to gracefully handle
// PublicApiError (see the many `instanceof PublicApiError` catches across
// src/app and src/views) — without this, a transient backend outage would
// throw an unhandled error type instead and crash the page/build (this is
// what happens during `next build`'s static generation, and would happen for
// any SSR request hitting a temporarily-down backend).
async function safeFetch(url, options, fallbackMessage) {
  try {
    return await fetch(url, options);
  } catch (error) {
    throw new PublicApiError(fallbackMessage, { status: 0, code: "NETWORK_ERROR", cause: error });
  }
}

/**
 * Unauthenticated GET for public storefront endpoints. Unwraps the
 * `{code, message, data, timestamp}` envelope like `adminApi.js`, but sends
 * no Authorization header and never attempts a token refresh.
 */
export async function publicGet(path, params) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const response = await safeFetch(
    `${API_BASE_URL}${normalizedPath}${buildQuery(params)}`,
    { method: "GET" },
    "Không thể kết nối máy chủ.",
  );

  const envelope = await response.json().catch(() => null);

  if (!response.ok || envelope?.code !== 1000) {
    throw new PublicApiError(envelope?.message || "Không thể tải dữ liệu.", {
      status: response.status,
      code: envelope?.code,
    });
  }

  return envelope.data;
}

/**
 * Unauthenticated POST for public storefront write endpoints (contact form,
 * newsletter signup). Same envelope unwrap/error handling as `publicGet`.
 */
export async function publicPost(path, body) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const response = await safeFetch(
    `${API_BASE_URL}${normalizedPath}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
    "Không thể kết nối máy chủ.",
  );

  const envelope = await response.json().catch(() => null);

  if (!response.ok || envelope?.code !== 1000) {
    throw new PublicApiError(envelope?.message || "Không thể gửi yêu cầu.", {
      status: response.status,
      code: envelope?.code,
    });
  }

  return envelope.data;
}
