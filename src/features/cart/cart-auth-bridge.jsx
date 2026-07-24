"use client";

import { useEffect, useRef } from "react";
import { useCustomerAuthStore } from "@/shared/stores/customer-auth-store";
import { useCartStore } from "@/shared/stores/cartStore";

/**
 * Wires `customerAuthStore` (session state) to `cartStore` (guest/server
 * cart) WITHOUT either store importing the other directly.
 *
 * Why this exists: `cartStore` already depends on `customer-auth-store`
 * transitively (`cart-service.js` → `customer-api.js` → `useCustomerAuthStore`,
 * for the Authorization header). If `customer-auth-store` also imported
 * `cartStore` to trigger a merge on login, that would close a
 * store↔store circular import. Instead, this component — a client-only leaf
 * with no UI — sits above both, reads auth status, and calls the cart
 * store's actions directly via `getState()`. Neither store imports the other.
 *
 * Mounted once in `PublicLayout` (shared by every storefront route group:
 * `(main)`, `(shop)`, `(user)`, `(auth)`, `(policies)`), so it observes every
 * auth transition regardless of which page triggered it.
 */
export default function CartAuthBridge() {
  const status = useCustomerAuthStore((state) => state.status);
  const userId = useCustomerAuthStore((state) => state.user?.id ?? null);
  const previousRef = useRef({ status, userId });

  useEffect(() => {
    const previous = previousRef.current;
    previousRef.current = { status, userId };

    if (status === "authenticated" && userId != null) {
      // Covers both a fresh login AND a reload where the session bootstraps
      // back to "authenticated" — `mergeGuestCartToServer` itself decides
      // (via its persisted mutex) whether that means a full convergence or
      // just a cheap resync.
      useCartStore.getState().mergeGuestCartToServer(userId);
      return;
    }

    if (previous.status === "authenticated" && status === "unauthenticated") {
      useCartStore.getState().resetForLogout(previous.userId);
    }
  }, [status, userId]);

  return null;
}
