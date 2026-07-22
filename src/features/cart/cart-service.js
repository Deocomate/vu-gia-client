// Thin wrappers over the customer-authenticated HTTP client for the Cart API
// (`vu-gia-backend-api/docs/CART_API.md`). Every endpoint requires a customer
// JWT (all roles allowed) and returns the *entire* cart in its response —
// callers reconcile the whole store from the returned `CartResponse`, they
// never need to call `getCart()` again after a mutation.
//
// Deliberately NOT marked "use client" — same reasoning as `customer-api.js`:
// a plain data-access module shouldn't force a client boundary on anything
// that imports it transitively.
import { customerApi } from "@/features/auth/customer-api";

/** `GET /api/cart` — current cart for the authenticated customer. */
export function getCart() {
  return customerApi.get("/cart");
}

/**
 * `POST /api/cart/items` — always additive server-side: adding a product
 * already in the cart accumulates `quantity` onto the existing line rather
 * than creating a second row (CART_API.md §3.2). `comboItems` is an optional
 * FE-defined JSON string, only meaningful for COMBO-type products.
 */
export function addItem(productId, quantity, comboItems) {
  const body = { productId, quantity };
  if (comboItems !== undefined && comboItems !== null) {
    body.comboItems = comboItems;
  }
  return customerApi.post("/cart/items", body);
}

/**
 * `PUT /api/cart/items/{itemId}` — sets the line's quantity to an *absolute*
 * value (not additive). `itemId` is the cart-line id (`CartItemResponse.id`),
 * not the product id.
 */
export function updateItem(lineId, quantity) {
  return customerApi.put(`/cart/items/${lineId}`, { quantity });
}

/** `DELETE /api/cart/items/{itemId}` — removes a single line from the cart. */
export function removeItem(lineId) {
  return customerApi.delete(`/cart/items/${lineId}`);
}

/** `DELETE /api/cart` — empties the cart entirely. */
export function clearCart() {
  return customerApi.delete("/cart");
}
