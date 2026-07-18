---
title: "User Flow Navigation & Linking Spec"
description: "Wire up client-side navigation across shopping/news flows + a global slide-out altar-customizer widget so QA can click through the entire UX."
status: completed
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

> **Resynced (2026-07-13):** Phase 7 of `260713-1234-storefront-api-seo-wiring` verified
> the current codebase and found all 4 phases already implemented. Phase 2 ("ProductCard
> Routing") was absorbed by that plan's Phase 3 (same work — wiring real product data
> into cards); Phases 1, 3, 4 were implemented independently (not by that plan) but are
> confirmed complete via direct code inspection (see Validation Log's "Phase 7 Resync
> Verification" entry below for evidence). This plan is done; no phases remain pending.

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
| 1 | [Global Altar Widget](./phase-01-global-altar-widget.md) | Completed |
| 2 | [ProductCard Routing](./phase-02-productcard-routing.md) | Superseded (absorbed by 260713-1234 Phase 3) |
| 3 | [Shopping Flow Actions](./phase-03-shopping-flow-actions.md) | Completed |
| 4 | [Cart State Store (Zustand)](./phase-04-cart-state-store-zustand.md) | Completed |

## Dependencies

None outstanding — all phases implemented and verified.

## Acceptance Criteria

- [x] Clicking any `ProductCard` navigates to `/san-pham/<slug|sp-{id}>` (client-side, no full reload) — superseded by `260713-1234-storefront-api-seo-wiring` Phase 3, which wires real `slug`s through the same `Link`-based `ProductCard`.
- [x] `GlobalAltarWidget` shows on public pages, mounted globally in `PublicLayout.jsx`; `FixedActionWidget` deleted (zero remaining references).
- [x] Product detail "Mua ngay" → `/thanh-toan`; "Thêm vào giỏ" → cart store `addItem` then `/gio-hang` (both `ProductInfo` and `ProductInfoSingle`, verified via `useCartStore` import + `router.push`).
- [x] Cart "Thanh toán" → `/thanh-toan` via `router.push` (verified, zero `window.location` left in `CartView.jsx`/`CheckoutView.jsx`).
- [x] Checkout "Hoàn tất" → success toast → `/tai-khoan/don-hang` (verified, `router.push(ROUTES.ORDERS)`).
- [x] Add-to-cart persists to Zustand store (`src/stores/cartStore.js`); Header badge reads `totalCount()`; cart/checkout read store; checkout success clears cart. All verified via direct `useCartStore` usage grep across `Header.jsx`, `CartView.jsx`, `CheckoutView.jsx`, `ProductInfo.jsx`, `ProductInfoSingle.jsx`.
- [x] `npm run lint` and `npm run build` pass (verified as part of `260713-1234-storefront-api-seo-wiring`'s Phase 7 full-repo gate, which covers this plan's files too).

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

### Phase 7 Resync Verification — 2026-07-13
**Trigger:** `260713-1234-storefront-api-seo-wiring`'s Phase 7 (cleanup + this plan's resync),
run after its own Phases 1-6 completed.

Direct codebase inspection found all 4 phases here already implemented (not by the sibling
plan — pre-existing work from an earlier session not tracked against this plan's phase
statuses):
- `grep -rn "FixedActionWidget" src/` → zero matches (deleted, Phase 1 requirement met).
- `src/components/shared/PublicLayout.jsx:3,13` imports and mounts `GlobalAltarWidget`
  (Phase 1 requirement met).
- `src/components/shared/ProductCard.jsx` — already `Link`-based with `slug`/`sp-{id}`
  fallback routing, byte-for-byte matching Phase 2's designed implementation (Phase 2
  requirement met, but superseded — see Phase 2's own file for the supersede note).
- `src/views/CartView.jsx`, `src/views/CheckoutView.jsx` — zero `window.location` matches;
  both import `useRouter` and call `router.push(ROUTES.CHECKOUT)` /
  `router.push(ROUTES.ORDERS)` (Phase 3 requirement met). `ROUTES.SAN_PHAM` bug: zero
  matches (already fixed).
- `src/stores/cartStore.js` exists; `useCartStore` imported and used in `Header.jsx`
  (`totalCount()`), `CartView.jsx` (`items`/`updateQuantity`/`removeItem`), `CheckoutView.jsx`
  (`items`/`clearCart`), `ProductInfo.jsx`/`ProductInfoSingle.jsx` (`addItem`) — Phase 4
  requirement met in full.
- `npm run build` + `npm run lint` both pass clean on the full repo (run as part of the
  sibling plan's Phase 7 gate, which covers every file this plan touches).

**Outcome:** all 4 phases marked `completed` (Phase 2 marked `superseded` instead, since it
was never separately implemented as its own commit — its scope was carried out as part of
whatever produced the current `ProductCard.jsx`). Plan status → `completed`. No
implementation work remains under this plan.
