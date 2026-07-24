// Thin binding of the shared session-aware HTTP client (`@/shared/api/api-client`)
// to the admin CMS session. Kept at this exact path/export surface — 17 admin
// feature files import from here (`grep -rl "@/lib/adminApi" src`), 2 of them
// check `instanceof AdminApiError`/`.name === "AdminApiError"` — so the export
// set (`adminApi`, `adminRequest`, `AdminApiError`, `API_BASE_URL`, `formatVnd`,
// `parseVnd`, `getValueByPath`) and the `AdminApiError` name must not change.
//
// Deliberately NOT marked "use client" (the original file wasn't either): this
// module is imported transitively by Server Components too (`publicApi.js` ->
// this file, for `API_BASE_URL`, from every storefront page/layout/sitemap
// route). Adding a client-boundary directive here forced Next.js to create a
// client reference for every one of those Server Component call sites, which
// blew up static-generation time enough to trip the 60s-per-page watchdog
// during `next build` (reproduced: builds reliably hung/timed out with the
// directive present, and reliably succeeded once removed).
import { apiRequest, ApiError, API_BASE_URL } from "@/shared/api/api-client";

export { API_BASE_URL };

export class AdminApiError extends Error {
  constructor(message, { status, code, data, cause } = {}) {
    super(message, cause ? { cause } : undefined);
    this.name = "AdminApiError";
    this.status = status;
    this.code = code;
    this.data = data;
  }
}

// Lazy require (not a top-level import): `publicApi.js` imports `API_BASE_URL`
// from this module for every storefront page, and eagerly importing the admin
// zustand/persist store there would load the whole admin-session module graph
// into every public page's render just to read a URL constant. `adminRequest`
// is the only thing that actually needs the store, and only at call time.
function getAdminAuthStore() {
  return require("@/stores/adminAuthStore").useAdminAuthStore;
}

export async function adminRequest(path, options = {}) {
  try {
    return await apiRequest(getAdminAuthStore(), path, options);
  } catch (error) {
    if (error instanceof ApiError) {
      throw new AdminApiError(error.message, {
        status: error.status,
        code: error.code,
        data: error.data,
        cause: error.cause,
      });
    }
    throw error;
  }
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
