// Thin wrappers over the customer-authenticated HTTP client for the Order API
// (`vu-gia-backend-api/docs/ORDER_API.md`). Every endpoint requires a customer
// JWT and operates only on orders belonging to the caller.
//
// Deliberately NOT marked "use client" — same reasoning as `cart-service.js`/
// `customer-api.js`: a plain data-access module shouldn't force a client
// boundary on anything that imports it transitively.
import { customerApi } from "@/features/auth/customer-api";

/**
 * `POST /api/orders` — places an order from the payload's `items[]` (the
 * endpoint does not take a cartId). Same `idempotencyKey` on retry returns
 * the same order instead of creating a duplicate (ORDER_API.md §3.1).
 */
export function placeOrder(payload) {
  return customerApi.post("/orders", payload);
}

/** `GET /api/orders/{id}` — a single order belonging to the authenticated customer (4059 if not found/not theirs). */
export function getOrder(id) {
  return customerApi.get(`/orders/${id}`);
}

/** `GET /api/orders` — paginated order history for the authenticated customer. */
export function listOrders(params) {
  return customerApi.get("/orders", params);
}

/**
 * `POST /api/orders/{id}/cancel` — owner-only cancel (BE-3, Phase 5). No
 * request body; returns the updated `OrderResponse`. Only allowed while the
 * order is `PENDING_PAYMENT`/`PROCESSING` (`4107` otherwise); `4059` if the
 * order doesn't exist or doesn't belong to the caller (existence hidden, not
 * a 403).
 */
export function cancelOrder(id) {
  return customerApi.post(`/orders/${id}/cancel`);
}
