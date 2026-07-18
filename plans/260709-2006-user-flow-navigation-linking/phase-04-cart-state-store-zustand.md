---
phase: 4
title: "Cart State Store (Zustand)"
status: completed
effort: "L"
---

# Phase 4: Cart State Store (Zustand)

<!-- Added: Validation Session 1 - user requested a real Zustand cart store instead of alert-only add-to-cart -->

## Overview

Introduce a real persistent cart store so add-to-cart actually stores products,
the Header badge shows the real count, and cart/checkout read from shared state.
Replaces the current per-view mock `useState` arrays.

## Requirements

- Functional:
  - `addItem(product, qty)` — add or increment by matching id.
  - `updateQuantity(id, qty)` — set quantity (min 1); `removeItem(id)`; `clearCart()`.
  - Derived: `totalCount` (sum of quantities), `subtotal` (sum price×qty).
  - Persist to `localStorage` so cart survives reload/navigation.
- Non-functional: match existing store convention (`src/stores/*Store.js`,
  `useXStore` export, `create` from zustand). Client-only.

## Architecture

- Convention reference: `src/stores/adminAuthStore.js` (uses `create((set,get)=>...)`,
  `"use client"`, `useAdminAuthStore` export). Add `persist` middleware for cart.
- Single source of truth `useCartStore`; consumers:
  - `ProductInfo` / `ProductInfoSingle` → `addItem` on "Thêm vào giỏ".
  - `CartView` → read `items`, `updateQuantity`, `removeItem`, `subtotal`.
  - `CheckoutView` → read `items`/`subtotal`; `clearCart()` on success.
  - `Header` `CartLink` → `totalCount` for the badge (replaces hardcoded "12").
- **Behavior change**: cart/checkout no longer show Figma mock arrays; they start
  empty until items are added. Existing empty-state UIs already cover this
  (`CartView` lines 172–190, `CheckoutView` lines 120–131).

## Related Code Files

- Create: `src/stores/cartStore.js`
- Modify: `src/components/product-detail/ProductInfo.jsx` (add-to-cart → store; coordinate with Phase 3)
- Modify: `src/components/product-detail/ProductInfoSingle.jsx` (same)
- Modify: `src/views/CartView.jsx` (replace local `useState` cart mock with store)
- Modify: `src/views/CheckoutView.jsx` (read store; `clearCart()` on success)
- Modify: `src/components/shared/Header.jsx` (badge → `totalCount`, hide when 0)

## Implementation Steps

1. Create `src/stores/cartStore.js`:

   ```jsx
   "use client";

   import { create } from "zustand";
   import { persist } from "zustand/middleware";

   export const useCartStore = create(
     persist(
       (set, get) => ({
         items: [], // { id, name, sku, price, salePrice, image, quantity }

         addItem(product, qty = 1) {
           set((state) => {
             const existing = state.items.find((it) => it.id === product.id);
             if (existing) {
               return {
                 items: state.items.map((it) =>
                   it.id === product.id
                     ? { ...it, quantity: it.quantity + qty }
                     : it,
                 ),
               };
             }
             return { items: [...state.items, { ...product, quantity: qty }] };
           });
         },

         updateQuantity(id, quantity) {
           set((state) => ({
             items: state.items.map((it) =>
               it.id === id ? { ...it, quantity: Math.max(1, quantity) } : it,
             ),
           }));
         },

         removeItem(id) {
           set((state) => ({ items: state.items.filter((it) => it.id !== id) }));
         },

         clearCart() {
           set({ items: [] });
         },

         totalCount() {
           return get().items.reduce((n, it) => n + (it.quantity || 0), 0);
         },

         subtotal() {
           return get().items.reduce(
             (sum, it) => sum + (it.price || 0) * (it.quantity || 0),
             0,
           );
         },
       }),
       { name: "vugia-cart" }, // localStorage key
     ),
   );
   ```

   - `price` should be a numeric VND value for math. Product-detail demo prices are
     display strings ("2.000.000đ") — when building the product object to add,
     parse to number (e.g. `2000000`) or store a numeric `price` field explicitly.

2. Product detail add-to-cart (merge with Phase 3 step 1). In `ProductInfo.jsx`
   / `ProductInfoSingle.jsx` build a product object from the static demo fields and
   call the store:

   ```jsx
   import { useCartStore } from "@/stores/cartStore";
   // ...
   const addItem = useCartStore((s) => s.addItem);

   const handleAddToCart = () => {
     addItem(
       {
         id: "dt026", // demo product id/slug
         name: "Bộ đồ thờ Phật vẽ hoa sen men rạn cổ đơn giản DT026",
         sku: "MSP: VG001",
         price: 2000000,
         image: mainImage, // or the static thumbnail import
       },
       mainQuantity,
     );
     alert("Đã thêm sản phẩm vào giỏ hàng!");
     router.push(ROUTES.CART);
   };
   ```

3. `CartView.jsx` — swap local mock `useState(cartItems)` for the store:

   ```jsx
   const items = useCartStore((s) => s.items);
   const updateQuantity = useCartStore((s) => s.updateQuantity);
   const removeItem = useCartStore((s) => s.removeItem);
   const storeSubtotal = useCartStore((s) => s.subtotal);
   ```

   - Map store `items` to whatever shape `CartItemList` expects (title vs name,
     classification, packSize). Provide sane defaults for fields the store lacks.
   - Remove the two hardcoded initial cart objects; keep the related-products list.
   - Wire `onQuantityChange`/`onRemoveItem` to store actions.

4. `CheckoutView.jsx` — read store; clear on success:

   ```jsx
   const items = useCartStore((s) => s.items);
   const clearCart = useCartStore((s) => s.clearCart);
   // handleCheckoutSubmit: ... clearCart(); router.push(ROUTES.ORDERS);
   ```

   - Remove the hardcoded `checkoutItems` mock; drive summary from store items.
   - Keep the pre-applied discount logic OR reset it — decide (mock discount 2,000,000 may not apply to a real subtotal; recommend starting discount at 0).

5. `Header.jsx` `CartLink` — real badge:

   ```jsx
   const count = useCartStore((s) => s.totalCount());
   // render badge only when count > 0; show count
   ```

   - Note SSR/hydration: `persist` reads localStorage on client. Guard against
     hydration mismatch (render badge after mount, e.g. `useEffect`+`mounted` flag,
     or `useCartStore.persist` hydration check) to avoid "12" vs real-count flash.

## Success Criteria

- [ ] Adding from product detail increments `totalCount`; Header badge updates live.
- [ ] Cart page lists exactly the added items; quantity +/- and remove update the store; subtotal recomputes.
- [ ] Reloading the page keeps the cart (localStorage persist).
- [ ] Checkout reads the same items; "Hoàn tất" clears the cart and redirects to orders.
- [ ] No hydration-mismatch warning for the Header badge.
- [ ] Build/lint pass.

## Risk Assessment

- **Scope expansion** beyond original navigation wiring — user-approved (Validation Session 1). Larger blast radius: touches Header, Cart, Checkout, both product panels.
- **Hydration mismatch** with persisted store + SSR badge → mitigate with mounted-guard (step 5).
- **Shape mismatch**: `CartItemList`/`CheckoutOrderSummary` expect specific fields (title, classification, packSize, price). Store items are simpler — map/default carefully; verify these components before wiring.
- **Price parsing**: display strings vs numeric — store numeric `price`, format for display only.
- **Demo data loss**: Figma-matched mock cart disappears (starts empty). Acceptable per user; empty-state UIs exist.
- Rollback: keep local `useState` mocks; store is additive — revert consumer wiring to restore demo behavior.

## Open Questions

- Discount handling in checkout once cart is real: keep the demo `VUGIA10` promo
  (10%) only, drop the pre-applied 2,000,000 mock discount? (Recommend: start
  discount at 0, keep VUGIA10.) Confirm during implementation if it matters for QA.
