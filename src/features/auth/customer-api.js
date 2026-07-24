// Thin binding of the shared session-aware HTTP client (`@/shared/api/api-client`)
// to the customer session, for OTHER feature code (cart/checkout/orders,
// Phase 3-5) to make customer-authenticated calls without touching
// `api-client.js` internals directly — same method-surface shape as
// `@/shared/api/adminApi`'s `adminApi`.
//
// Deliberately NOT marked "use client" — see the equivalent note in
// `@/shared/api/adminApi.js`: a plain data-access module like this one shouldn't
// force a client boundary on whatever Server Component ends up importing it
// transitively (adding "use client" to `adminApi.js` measurably broke
// `next build` static generation for every storefront page).
import { apiRequest, ApiError } from "@/shared/api/api-client";
import { useCustomerAuthStore } from "@/shared/stores/customer-auth-store";

export { ApiError };

export async function customerRequest(path, options = {}) {
  return apiRequest(useCustomerAuthStore, path, options);
}

export const customerApi = {
  get: (path, query) => customerRequest(path, { method: "GET", query }),
  post: (path, body) => customerRequest(path, { method: "POST", body }),
  put: (path, body) => customerRequest(path, { method: "PUT", body }),
  patch: (path, query) => customerRequest(path, { method: "PATCH", query }),
  patchBody: (path, body) => customerRequest(path, { method: "PATCH", body }),
  delete: (path) => customerRequest(path, { method: "DELETE" }),
  upload: (path, formData) => customerRequest(path, { method: "POST", body: formData }),
};
