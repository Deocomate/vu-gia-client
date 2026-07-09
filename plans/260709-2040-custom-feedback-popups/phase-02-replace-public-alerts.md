---
phase: 2
title: "Replace Public Alerts"
status: completed
priority: P1
dependencies: [1]
---

# Phase 2: Replace Public Alerts

## Overview

Replace every public `alert()` with typed `toast.*` via `@/utils/feedback`. Leave
`confirm()` for Phase 3.

## Requirements

- Functional: same Vietnamese messages; map to success/error/info
- Non-functional: no behavior change beyond UI; shopping redirects after toast still work

## Architecture

| Signal | Toast type |
|--------|------------|
| Success (added cart, promo OK, profile saved, order cancel sent, checkout done) | `toast.success` |
| Validation / invalid promo / empty cart | `toast.error` |
| Placeholder / CS connect / search stub | `toast.info` |

Add-to-cart UX (Validation Session 1): `toast.success` then `router.push(ROUTES.CART)` — **no** "Xem giỏ" action button (user stays on current navigate-to-cart flow).

## Related Code Files

- Modify: `src/components/product-detail/ProductInfo.jsx` (L579)
- Modify: `src/components/product-detail/ProductInfoSingle.jsx` (L511)
- Modify: `src/views/CartView.jsx` (alerts only; keep confirm)
- Modify: `src/views/CheckoutView.jsx` (alerts only; keep confirm)
- Modify: `src/components/checkout/CheckoutForm.jsx` (4 validation alerts)
- Modify: `src/views/ProfileView.jsx`
- Modify: `src/views/OrdersView.jsx` (alerts only; keep confirm)
- Modify: `src/components/news-detail/NewsDetailSidebar.jsx`
- Modify: `plans/260709-2006-user-flow-navigation-linking/plan.md` + `phase-03-*.md` — replace "alert" acceptance wording with toast

## Implementation Steps

1. Import `{ toast } from "@/utils/feedback"` in each file (ensure `"use client"` already present)
2. Map call sites:

| File | Lines (approx) | Mapping |
|------|----------------|---------|
| ProductInfo / Single | 579 / 511 | `toast.success("Đã thêm sản phẩm vào giỏ hàng!")` then `router.push(ROUTES.CART)` |
| CartView | 94, 100, 106, 108, 110, 116 | info / error / success / error / error / error |
| CheckoutView | 42, 48–50, 52, 54, 69, 73–79 | error / success / error / error / info / success |
| CheckoutForm | 22, 26, 30, 34 | `toast.error` each |
| ProfileView | 22 | `toast.success` |
| OrdersView | 297, 302 | success / info |
| NewsDetailSidebar | 31, 38 | info / error |

3. Checkout success (`CheckoutView.jsx:73-79`): **do not** dump the multi-line `\n` string into a single toast title. Use:
   ```js
   toast.success("Đặt hàng thành công!", {
     description: "Vui lòng đợi phản hồi từ Gốm Vũ Gia.",
     duration: 5000,
   });
   ```
   Keep order details out of the toast (already cleared from cart / shown on orders page). Then `clearCart()` + `router.push(ROUTES.ORDERS)`.
4. Add-to-cart (`ProductInfo.jsx:577-580`, Single twin): `toast.success` then immediate `router.push(ROUTES.CART)` under same `PublicLayout` (Toaster stays mounted). Do not add action button; do not block navigation on toast dismiss. <!-- Updated: Validation Session 1 - Q2A -->
5. Grep verify: no `alert(` left under public views/components (admin excluded)
6. Update navigation plan acceptance criteria that mention `alert`

## Success Criteria

- [ ] `rg "\\balert\\s*\\(" src/views src/components` → only false positives / none in public paths (admin ConfirmDialog consumers OK; no alert there)
- [ ] Manual: add to cart, bad promo, empty cart checkout, profile save, checkout submit — all show branded toasts
- [ ] Navigation plan docs no longer require native alert

## Risk Assessment

- **CheckoutForm + CheckoutView**: form validates with toast; view also toasts on submit success — OK if validation returns early
- **Toast then navigate**: soft nav stays inside PublicLayout route groups — Toaster persists. Hard full reload would kill toast (not used).
- **Long checkout alert**: native alert showed full order summary; toast must use title+short description (see step 3) — intentional UX change, not a silent truncation bug
