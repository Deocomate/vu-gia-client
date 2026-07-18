---
phase: 3
title: "Shopping Flow Actions"
status: completed
effort: "M"
dependencies: [4]
---

# Phase 3: Shopping Flow Actions

<!-- Updated: Validation Session 1 - add-to-cart now writes to the Zustand cart store (Phase 4); do Phase 4 first -->
> **Depends on Phase 4** (Cart State Store): the "Thêm vào giỏ" handler calls
> `useCartStore.addItem` (see Phase 4 step 2). Implement Phase 4 first, then this.

## Overview

Wire the purchase-flow buttons to real client-side navigation:
Buy Now → checkout, Add to Cart → toast + cart, Cart → checkout,
Checkout success → toast (chờ phản hồi) + orders page. Replaces current
`console.log` / `window.location` / view-only alert handlers.

## Requirements

- Functional:
  - `ProductInfo` + `ProductInfoSingle`: "Mua ngay" → `ROUTES.CHECKOUT`;
    "Thêm vào giỏ" → `toast.success("Đã thêm sản phẩm vào giỏ hàng!")` then `ROUTES.CART`.
  - `CartView` "Thanh toán" → `router.push(ROUTES.CHECKOUT)` (no reload).
  - `CheckoutView` success → `toast.success` with short title + description ("Vui lòng đợi
    phản hồi từ Gốm Vũ Gia.") then `router.push(ROUTES.ORDERS)`.
- Non-functional: All via `useRouter` from `next/navigation`; components already
  `"use client"`. No `window.location`.

## Architecture

- `ProductInfo.jsx` / `ProductInfoSingle.jsx` own the `handleBuyNow` /
  `handleAddToCart` handlers (currently `console.log`) and pass them down to
  purchase panels — change the handler bodies only.
- `CartView.handleCheckout` currently uses `window.location.href` — swap for
  `router.push`.
- **Checkout redirect belongs in `CheckoutView`, not `CheckoutForm`**:
  `CheckoutView.handleCheckoutSubmit` (passed as `onSubmit`) already toasts success.
  Adding toast+push in `CheckoutForm` (per spec's
  literal sample) would double-toast. So edit `CheckoutView` and leave
  `CheckoutForm` untouched. This respects README "logic ở views/".

## Related Code Files

- Modify: `src/components/product-detail/ProductInfo.jsx` (handlers at ~lines 557–563)
- Modify: `src/components/product-detail/ProductInfoSingle.jsx` (handlers at ~lines 489–494)
- Modify: `src/views/CartView.jsx` (`handleCheckout` ~lines 138–145)
- Modify: `src/views/CheckoutView.jsx` (`handleCheckoutSubmit` ~lines 88–98; + bonus bug at line 126)
- Do NOT modify: `src/components/checkout/CheckoutForm.jsx`

## Implementation Steps

1. `ProductInfo.jsx` (and identical change in `ProductInfoSingle.jsx`):

   ```jsx
   // top of file
   import { useRouter } from "next/navigation";
   import { ROUTES } from "@/utils/routes";

   // inside the default-export component, near other hooks:
   const router = useRouter();

   const handleBuyNow = () => {
     router.push(ROUTES.CHECKOUT);
   };

   const handleAddToCart = () => {
     // Phase 4: persist to cart store, then navigate. See Phase 4 step 2 for the
     // full addItem(product, mainQuantity) call and product-object shape.
     alert("Đã thêm sản phẩm vào giỏ hàng!");
     router.push(ROUTES.CART);
   };
   ```

   - `ProductInfo` and `ProductInfoSingle` are both `"use client"` (verified).
   - Verify `React`/`useState` imports stay; just add `useRouter` + `ROUTES` (+ `useCartStore` from Phase 4).
   - The `alert` + `router.push(CART)` here is the navigation half; the `addItem`
     call is the state half from Phase 4 — implement together to avoid touching the
     same handler twice.

2. `CartView.jsx` — replace `window.location`:

   ```jsx
   import { useRouter } from "next/navigation";
   // ... existing imports (ROUTES already imported)

   export default function CartView() {
     const router = useRouter();
     // ...
     const handleCheckout = () => {
       if (cartItems.length === 0) {
         alert("Giỏ hàng của bạn đang trống!");
         return;
       }
       router.push(ROUTES.CHECKOUT);
     };
   ```

   - Remove the `alert("Bắt đầu chuyển hướng...")` + `window.location.href` lines.

3. `CheckoutView.jsx` — redirect after success:

   ```jsx
   import { useRouter } from "next/navigation";
   // ... existing imports (ROUTES already imported)

   export default function CheckoutView() {
     const router = useRouter();
     // ...
     const handleCheckoutSubmit = (formData) => {
       alert(
         `Đặt hàng thành công!\n\n... (keep existing summary lines) ...\n\nVui lòng đợi phản hồi từ Gốm Vũ Gia.`
       );
       clearCart();            // Phase 4: store action (replaces setCheckoutItems([]))
       router.push(ROUTES.ORDERS);
     };
   ```

   - Keep the existing detailed summary; append the "chờ phản hồi" line; add `router.push(ROUTES.ORDERS)` last.
   - NOTE (Phase 4 overlap): once the cart store lands, `checkoutItems`/`discountAmount`
     local `useState` are replaced by store reads, so the clear becomes `clearCart()`
     instead of `setCheckoutItems([]); setDiscountAmount(0)`. Implement this handler
     ONCE, in its Phase-4 form. If Phase 3 is (against the recommended order) done
     before Phase 4, use `setCheckoutItems([]); setDiscountAmount(0)` temporarily.

4. (Bonus) Fix pre-existing bug at `CheckoutView.jsx:126`:
   `href={ROUTES.SAN_PHAM}` → `href={ROUTES.PRODUCTS}` (`ROUTES.SAN_PHAM` is undefined).

## Success Criteria

- [ ] Product detail (both variants): "Mua ngay" → `/thanh-toan`; "Thêm vào giỏ" → toast then `/gio-hang`.
- [ ] Cart "Thanh toán" → `/thanh-toan` client-side (no white flash); empty cart still shows error toast.
- [ ] Checkout "Hoàn tất" → single success toast (with "chờ phản hồi") → `/tai-khoan/don-hang`.
- [ ] No `window.location` / `console.log` navigation left in these files.
- [ ] Build/lint pass.

## Risk Assessment

- **Double alert on checkout**: avoided by editing `CheckoutView` (not `CheckoutForm`).
- **`useRouter` outside client component**: all four files are client components — verified for 3, confirm `ProductInfoSingle` header.
- **Mock cart not persisted**: navigating cart→checkout→orders shows static demo data; acceptable for QA click-through (no real cart state store yet).
- Rollback: revert handler bodies; re-add `window.location` if needed.

## Open Questions

- None. (Add-to-cart currently just alerts + navigates; no cart state is persisted
  yet — out of scope for this navigation-wiring plan.)
