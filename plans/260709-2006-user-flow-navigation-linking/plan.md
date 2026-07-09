---
title: "User Flow Navigation & Linking Spec"
description: "Wire up client-side navigation across shopping/news flows + a global slide-out altar-customizer widget so QA can click through the entire UX."
status: pending
priority: P2
branch: "main"
tags: [frontend, navigation, ux, nextjs]
blockedBy: []
blocks: []
created: "2026-07-09T13:12:33.236Z"
createdBy: "ck:plan"
source: skill
---

# User Flow Navigation & Linking Spec

## Overview

Make the entire public UX click-navigable end-to-end for QA/testers using Next.js
client-side routing (`<Link>` / `useRouter`). Three concerns:

1. **Global altar-customizer widget** — promote the existing product-detail-only
   `FixedActionWidget` into a single global slide-out drawer mounted in
   `PublicLayout`, visible on all public pages except the purchase pages.
2. **ProductCard → detail routing** — convert the static `ProductCard` `div` into
   a `<Link>` to `/san-pham/[slug]`, and pass `id`/`slug` from all 6 consumers.
3. **Shopping flow actions** — replace `console.log`/`window.location`/no-op click
   handlers with real client-side navigation (Buy Now → checkout, Add to Cart →
   cart, Cart → checkout, Checkout success → orders).

News flow already works (`NewsCard` links with slug) — no change needed.

## Decisions (confirmed with user)

- **Widget**: Remove old `FixedActionWidget` from `ProductDetailView`; use the new
  global `GlobalAltarWidget` everywhere. (Q1)
- **Checkout success**: `toast.success` "mua hàng thành công, chờ phản hồi" → redirect to
  `ROUTES.ORDERS` (`/tai-khoan/don-hang`). (Q2)
- **Checkout redirect location**: implemented in `CheckoutView.handleCheckoutSubmit`
  (the view/orchestrator), NOT in `CheckoutForm` — the spec's sample code would
  double-toast since `CheckoutView` already toasts. Aligns with README "logic ở views/".

### Validation Session 1 decisions
- **Widget breakpoint**: `hidden md:flex` (≥768px, desktop + tablet). Confirmed.
- **Cart state**: build a REAL Zustand cart store (added as Phase 4) — add-to-cart
  persists items, drives Header badge, feeds cart/checkout. This EXPANDS original
  navigation-only scope. Trade-off: cart/checkout stop showing Figma mock data and
  start empty until the user adds items (existing empty-state UI already handles this).
- **Old widget file**: DELETE `FixedActionWidget.jsx` (not optional). No remaining consumers.

## Phases

| Phase | Name | Status |
|-------|------|--------|
| 1 | [Global Altar Widget](./phase-01-global-altar-widget.md) | Pending |
| 2 | [ProductCard Routing](./phase-02-productcard-routing.md) | Pending |
| 3 | [Shopping Flow Actions](./phase-03-shopping-flow-actions.md) | Pending |
| 4 | [Cart State Store (Zustand)](./phase-04-cart-state-store-zustand.md) | Pending |

## Dependencies

Phases 1 & 2 are fully independent. **Phase 3 depends on Phase 4** for the
add-to-cart action (`addItem`) and cart→checkout state — do Phase 4 first, then
Phase 3. Suggested order: 4 → 3, with 1 & 2 anytime (parallel-safe).

## Acceptance Criteria

- [ ] Clicking any `ProductCard` navigates to `/san-pham/<slug|sp-{id}>` (client-side, no full reload).
- [ ] `GlobalAltarWidget` shows on Home/Products/News/About etc., is hidden on `/thanh-toan`, `/gio-hang`, `/tuy-chinh-bo-do-tho`, and does NOT double up with the old widget on product detail.
- [ ] Product detail "Mua ngay" → `/thanh-toan`; "Thêm vào giỏ" → `toast.success` then `/gio-hang` (both `ProductInfo` and `ProductInfoSingle`).
- [ ] Cart "Thanh toán" → `/thanh-toan` via `router.push` (no page flash).
- [ ] Checkout "Hoàn tất" → success toast (chờ phản hồi) → `/tai-khoan/don-hang`.
- [ ] Add-to-cart persists to Zustand store; Header badge reflects real item count; cart/checkout read store; checkout success clears cart.
- [ ] `npm run lint` and `npm run build` pass.

## Constraints

- All internal links MUST use `ROUTES` from `src/utils/routes.js` (README rule).
- Use `<Link>` / `useRouter` from `next/navigation` — no `window.location`.
- Components using `useRouter` must be Client Components (`"use client"`).
- Keep changes scoped to navigation wiring; do not restructure demo/mock data.

## Notes / Bonus

- Pre-existing bug at `CheckoutView.jsx:126` — `ROUTES.SAN_PHAM` is undefined
  (should be `ROUTES.PRODUCTS`). Optional fix in Phase 3.

## Validation Log

### Verification Results (Standard tier, 3 phases)
- Claims checked: ~14 (file paths, line anchors, route keys, client directives)
- Verified: 14 | Failed: 0 | Unverified: 0
- Evidence:
  - `ROUTES.{PRODUCTS,NEWS,CART,CHECKOUT,ORDERS,ALTAR_CUSTOMIZER,HOME}` all exist in `src/utils/routes.js`.
  - `FixedActionWidget` imported ONLY by `ProductDetailView.jsx` (lines 10, 44) — safe to delete.
  - `ProductInfo.jsx` handlers at 557–563; `ProductInfoSingle.jsx` at 489–494; both `"use client"`.
  - `CartView.handleCheckout` uses `window.location.href` (line 144).
  - `CheckoutView.handleCheckoutSubmit` already alerts (88–98); `ROUTES.SAN_PHAM` bug confirmed at line 126.
  - `[slug]` page renders `<ProductDetailView slug={slug} type={type}/>` for any slug — fallback URLs resolve.
  - All 6 `ProductCard` consumers pass mock objects with `id` (or string id) but do not forward it.

### Interview (Validation Session 1)
- Questions asked: 3. Decisions:
  1. Widget breakpoint → `hidden md:flex` (≥768px). Propagated: Phase 1 (already md).
  2. Cart state → build real Zustand store. Propagated: NEW Phase 4 + Phase 3 dependency + acceptance criteria.
  3. Delete old `FixedActionWidget.jsx` → yes, mandatory. Propagated: Phase 1 (removed "optional").

### Whole-Plan Consistency Sweep
- Re-read plan.md + phases 1–4. Reconciled:
  - `CheckoutView.handleCheckoutSubmit` edited in BOTH Phase 3 & Phase 4 → Phase 3 now
    defers state-clear to `clearCart()` (Phase 4 form), with a fallback note if order reversed.
  - Add-to-cart handler split across Phase 3 (nav) + Phase 4 (state) → cross-referenced,
    "implement once" note added; Phase 3 marked `dependencies: [4]`.
  - Widget file delete wording unified to "mandatory" across Related Files + steps.
  - Store convention verified against `adminAuthStore.js`; Header badge "12" flagged for replacement.
- Unresolved contradictions: NONE.
- Verification: Failed: 0 → plan eligible for implementation.
