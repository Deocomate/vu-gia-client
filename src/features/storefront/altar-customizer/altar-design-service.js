// Thin bindings of the shared session-aware HTTP client to the customer session, for the
// altar-design "save to library" feature (phase 5) — same shape/convention as
// `@/features/orders/order-service.js`. Every endpoint requires a customer JWT and operates only
// on designs owned by the caller; ownership is enforced server-side (404, not 403, for another
// user's design id — existence is never leaked).
//
// Deliberately NOT marked "use client" — same reasoning as `order-service.js`: a plain
// data-access module shouldn't force a client boundary on anything that imports it transitively.
import { customerApi } from "@/features/auth/customer-api";

/** `GET /api/altar-designs` — the current customer's saved designs, paged. */
export function listAltarDesigns(params) {
  return customerApi.get("/altar-designs", params);
}

/**
 * `GET /api/altar-designs/{id}` — detail. `items`/`accessories` come back post-recompute (any
 * dropped-missing-product entries already removed) alongside `droppedItemCount` and both the
 * saved `totalPrice` snapshot and a recomputed `currentTotalPrice` — callers should surface a
 * notice when these differ or `droppedItemCount > 0` rather than hide it.
 */
export function getAltarDesign(id) {
  return customerApi.get(`/altar-designs/${id}`);
}

/**
 * `POST /api/altar-designs` — create. Body: `{ name, thumb, altarModelSizeId, altarStyleId,
 * items, accessories, totalPrice }`. Throws `ApiError` with `status === 409` once the per-account
 * cap (20 designs, decision D5) is hit — callers should show the specific "xóa bớt trước khi lưu"
 * message, not a generic failure toast.
 */
export function createAltarDesign(payload) {
  return customerApi.post("/altar-designs", payload);
}

/** `PATCH /api/altar-designs/{id}` — rename only. */
export function renameAltarDesign(id, name) {
  return customerApi.patchBody(`/altar-designs/${id}`, { name });
}

/** `DELETE /api/altar-designs/{id}` */
export function deleteAltarDesign(id) {
  return customerApi.delete(`/altar-designs/${id}`);
}
