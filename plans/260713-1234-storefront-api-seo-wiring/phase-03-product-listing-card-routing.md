---
phase: 3
title: "Product Listing & Card Routing"
status: completed
priority: P1
dependencies:
  - 1
---

# Phase 3: Product Listing & Card Routing

## Overview

Wire `/san-pham` to real product data with category filter/sort/pagination, and update
every real `ProductCard` consumer to pass real `slug`/`id` so cards link correctly. This
phase absorbs `260709-2006-user-flow-navigation-linking`'s Phase 2 ("ProductCard Routing")
— that phase assumed mock objects already carried `id`; once real product data flows in,
the routing fix is the same commit as the data fix.

<!-- Updated: Validation Session 1 - `ProductCard.jsx:18-20` already builds the link inline
(`${ROUTES.PRODUCTS}/${slug}`, falls back to `sp-${id}`) — there is no separate `ROUTES`
helper to "reuse," and no new routing code is needed anywhere in this phase. Every "wire
ProductCard" step below means: pass a real `slug` prop into the existing card, nothing more. -->

## Requirements

- Functional: `ProductsView.jsx` fetches real products via
  `publicGet('/products', { status: 'PUBLISHED', productCategoryId, sortBy, sortDirection,
  page, size })`, replacing its inline mock list + client-only filter state. Category
  filter options come from `publicGet('/product-categories')`.
- Functional: pagination UI (if `ProductsView` already has page-number controls for the mock
  list) now drives real `page`/`size` params and reflects `totalPages`/`totalElements` from
  the response.
- Functional: `ProductGrid.jsx` (shared listing-grid consumer of `ProductCard`) renders the
  real product array, passing each product's real `slug` to `ProductCard` — `ProductCard`
  itself needs no changes, it already resolves the link from `slug`/`id`.
- Functional: the other 4 `ProductCard` consumers get real data feeds appropriate to their
  context:
  - `AltarSimilarProductsSection.jsx` — real related/featured products (simple approach:
    same `isFeatured=true` query as homepage, or by shared category if the altar
    customizer has a category concept; keep query simple per YAGNI unless a "related
    products" endpoint already exists — check backend first).
  - `NewsRelatedProducts.jsx` — real products (same simple featured/category query;
    genuine "related to this news article" logic is out of scope unless a backend relation
    already exists).
  - `SimilarProducts.jsx` (product detail page) — real products, likely same category as
    the current product (`productCategoryId` filter using the current product's
    `category.id`).
  - `CartView.jsx`'s `relatedProducts` widget (real products, same simple approach as
    `AltarSimilarProductsSection`/`NewsRelatedProducts`).
    <!-- Updated: Validation Session 1 - confirmed `src/stores/cartStore.js` already
    provides a real, persisted cart (line-items, `addItem`/`updateQuantity`/`removeItem`/
    `clearCart`/`totalCount`/`subtotal`), already consumed by `Header.jsx` and `CartView.jsx`
    — cart state itself is NOT part of this plan's scope. `CartView.jsx`'s separate
    `relatedProducts` section (`ProductCard` consumer, ~line 45+) is a distinct mock
    "suggested products" widget, structurally identical to the other 3 non-listing
    consumers above — user confirmed narrowing the original blanket `CartView.jsx`
    exclusion to cart line-item rendering only. Do NOT touch cart line-item rendering,
    `cartStore.js`, checkout, or orders in this phase. -->
- Non-functional: cart line-item rendering (the actual `cartStore.js`-driven list) is
  explicitly NOT touched by this phase — only the separate `relatedProducts` widget is
  in scope.

## Architecture

- `src/app/(main)/san-pham/page.jsx`: becomes async Server Component (or stays a thin
  wrapper with `ProductsView` doing client-side fetch via `useEffect` IF the page already
  needs client-side interactivity for filter/sort — audit `ProductsView.jsx`'s current
  `"use client"` status and filter-state mechanism before deciding fetch location, same
  audit discipline as Phase 3 of the block-builder plan).
  - If filters must be client-interactive (likely, since users toggle category/sort/page
    without full navigation): keep `page.jsx` a thin Server Component that reads
    `searchParams` (Next.js supports this natively) and does the initial fetch, passing
    initial data + `searchParams`-driven state to a client `ProductsView`; subsequent
    filter changes update the URL query string (`router.push` with new searchParams) so
    the Server Component re-fetches — this is the standard Next.js App Router pattern for
    filterable listings and avoids duplicating fetch logic client + server side.
- `src/components/products/ProductGrid.jsx`, `SimilarProducts.jsx`,
  `NewsRelatedProducts.jsx`, `AltarSimilarProductsSection.jsx`, `CartView.jsx`'s
  `relatedProducts` section: accept a `products` prop instead of importing/generating mock
  data. None of these need any `<Link>`/routing code changes — `ProductCard` already
  resolves navigation from `slug`/`id`.

## Related Code Files

- Modify: `src/app/(main)/san-pham/page.jsx`, `src/views/ProductsView.jsx`
- Modify: `src/components/products/ProductGrid.jsx`
- Modify: `src/components/altar-customizer/AltarSimilarProductsSection.jsx`
- Modify: `src/components/news/NewsRelatedProducts.jsx`
- Modify: `src/components/product-detail/SimilarProducts.jsx`
- Modify: `src/views/CartView.jsx` — **only** the `relatedProducts` widget section; cart
  line-item rendering (`cartStore.js`-driven) is untouched.
- Modify: `src/components/home/HomeProductList.jsx` (if not already completed in Phase 2 —
  confirm sequencing; Phase 2 covers homepage's featured list, this phase covers all other
  consumers, no double work)
- Not modified: `src/stores/cartStore.js` (already real/complete), cart line-item rendering
  logic within `CartView.jsx`, checkout, orders.

## Implementation Steps

1. Audit `ProductsView.jsx`'s current filter/sort/pagination state mechanism and
   `"use client"` status; decide the searchParams-driven fetch pattern described above.
2. Wire `/san-pham` listing: category filter dropdown/sidebar from real
   `product-categories`, product grid from real paginated products, pagination controls
   driving real `page`/`size`.
3. Update `ProductGrid.jsx` and the 4 remaining `ProductCard` consumers (including
   `CartView.jsx`'s `relatedProducts` widget) to accept and render real product arrays with
   correct `slug`/`id` propagation — no `ROUTES`/link code changes needed, `ProductCard`
   already handles it.
4. Manual check: change category filter → grid updates + URL reflects filter; click any
   card from listing, similar-products, altar-customizer, news-related-products, and cart's
   related-products widget → lands on the correct real product detail page; cart
   line-items themselves remain untouched/still real via `cartStore.js`.

## Success Criteria

- [ ] `/san-pham` renders real, filterable, paginated product data — zero mock array left
      in `ProductsView.jsx`.
- [ ] Category filter options are real `ProductCategory` rows.
- [ ] All 6 `ProductCard` consumers (`ProductGrid`, `AltarSimilarProductsSection`,
      `NewsRelatedProducts`, `SimilarProducts`, `HomeProductList` if not done in Phase 2,
      `CartView`'s `relatedProducts`) render real products with working slug-based
      navigation.
- [ ] `CartView.jsx`'s cart line-item rendering (`cartStore.js`-driven) is unchanged —
      verified via `git diff` showing only the `relatedProducts` section touched.
- [ ] Filter/sort/pagination state round-trips through the URL (shareable/bookmarkable
      listing URL), consistent with Next.js App Router conventions.

## Risk Assessment

- **Risk:** duplicating the old nav plan's Phase 2 work if both plans proceed
  independently. **Mitigation:** Phase 7 of this plan explicitly resyncs
  `260709-2006-user-flow-navigation-linking` to remove that phase and cross-reference this
  one — do not implement Phase 3 here without also completing Phase 7's resync before
  calling this plan done.
- **Risk:** searchParams-driven Server Component refetch pattern is more complex than the
  existing purely-client filter state. **Mitigation:** this is the standard, well-documented
  Next.js App Router idiom for filterable listings (not a novel invention) — keep the
  client-side piece limited to reading/writing `searchParams` via `useRouter`/
  `useSearchParams`, not managing a duplicate copy of the fetched data.
