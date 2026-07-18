---
phase: 2
title: "ProductCard Routing"
status: superseded
effort: "M"
---

# Phase 2: ProductCard Routing

> **Superseded (2026-07-13):** absorbed by `260713-1234-storefront-api-seo-wiring`'s
> Phase 3 ("Product Listing & Card Routing"), which wired real product data into all 6
> `ProductCard` consumers. `ProductCard.jsx` is confirmed already `Link`-based with
> `slug`/`id`-driven routing, matching this phase's design exactly — no separate
> implementation needed. Kept here for history, not implemented as a standalone phase.

## Overview

Convert the static `ProductCard` wrapper `div` into a Next.js `<Link>` pointing
to the product detail page, and pass `id`/`slug` from all 6 consumers so clicks
land on `/san-pham/<slug|sp-{id}>`. Enables QA to click any product card and
reach the (static demo) detail page via client-side routing.

## Requirements

- Functional: Whole card is a link to `/san-pham/[slug]`. Prefer `slug`; fall
  back to `sp-{id}` when only a numeric id exists (current mock data).
- Non-functional: Preserve existing card layout/styles exactly (only the wrapper
  element changes `div` → `Link`); keep hover/scale animations.

## Architecture

- Detail route already exists: `src/app/(main)/san-pham/[slug]/page.jsx` (static
  demo — renders same `ProductDetailView` for any slug, so any URL works for QA).
- `ProductCard` currently has NO `id`/`slug` prop. All 6 consumers pass mock data
  objects that contain a numeric `id` but never forward it to the card. Each
  consumer must add `id={product.id}` (and `slug` if/when available).

## Related Code Files

- Modify: `src/components/shared/ProductCard.jsx` (div → Link, add `id`/`slug` props + URL builder)
- Modify (add `id` prop): 
  - `src/components/home/HomeProductList.jsx` (~line 178)
  - `src/components/products/ProductGrid.jsx` (~line 94)
  - `src/views/CartView.jsx` (~line 215, related products)
  - `src/components/product-detail/SimilarProducts.jsx` (~line 63)
  - `src/components/news/NewsRelatedProducts.jsx` (~line 65)
  - `src/components/altar-customizer/AltarSimilarProductsSection.jsx` (~line 20)

## Implementation Steps

1. `src/components/shared/ProductCard.jsx` — imports + signature + wrapper:

   ```jsx
   import Image from "next/image";
   import Link from "next/link";
   import { ROUTES } from "@/utils/routes";
   import productImageThumb from "@/assets/images/products/product-image-thumb.png";

   export default function ProductCard({
     id,
     slug,
     image = productImageThumb,
     name = "Bình hút lộc\nMã đáo thành công",
     sku = "MSP: VG001",
     originalPrice = "2.500.000đ",
     salePrice = "2.000.000đ",
     soldCount = 12,
     hasTwoLineTitle = false,
   }) {
     // Prefer real slug; fall back to sp-{id} for current mock data.
     const productUrl = slug
       ? `${ROUTES.PRODUCTS}/${slug}`
       : `${ROUTES.PRODUCTS}/sp-${id ?? "1"}`;

     return (
       <Link
         href={productUrl}
         className="flex flex-col group cursor-pointer border border-[#E6E8EC] rounded-[8px] bg-white overflow-hidden hover:shadow-lg transition-all duration-300 h-full w-full"
       >
         {/* ... KEEP the entire existing inner markup (image container + info block) unchanged ... */}
       </Link>
     );
   }
   ```

   - IMPORTANT: Only swap the outermost `<div className="flex flex-col group cursor-pointer ...">` for `<Link href={productUrl} ...>` and its closing tag. The inner JSX (image, title, sku, price, sold count) stays byte-for-byte identical.
   - `cursor-pointer` can remain; `<Link>` renders an `<a>` so it is inherently clickable.

2. Update each consumer to forward `id` (and `slug` when the data has one). Example for `HomeProductList.jsx`:

   ```jsx
   <ProductCard
     key={product.id}
     id={product.id}          // ← add
     name={product.name}
     sku={product.sku}
     salePrice={product.salePrice}
     originalPrice={product.originalPrice}
     soldCount={product.soldCount}
     hasTwoLineTitle={hasTwoLineTitle}
   />
   ```

   Apply the same one-line `id={product.id}` (or `id={prod.id}`) addition to:
   `ProductGrid`, `CartView` related list, `SimilarProducts`, `NewsRelatedProducts`,
   `AltarSimilarProductsSection`. Verify each mock/data object exposes `id`
   (all verified except confirm `SIMILAR_PRODUCTS` in
   `src/components/altar-customizer/data/altarCustomizerData.js` has `id`; if not,
   fall back to array index).

## Success Criteria

- [ ] Clicking a card on Home, Products, Cart-related, Similar, News-related, and Altar-similar navigates to a `/san-pham/...` URL.
- [ ] Navigation is client-side (no full page reload / white flash).
- [ ] Card visual layout & hover animations unchanged.
- [ ] No console warning about nested `<a>`/interactive elements inside the card.
- [ ] Build/lint pass.

## Risk Assessment

- **Nested interactive elements**: card has no buttons/links inside → safe to wrap in `<Link>`. (If a future "add to cart" button is added inside the card, revisit.)
- **Missing `id`**: fallback `sp-1` prevents broken `undefined` URLs.
- **SEO/prefetch**: `<Link>` prefetches by default; fine for a demo. No action needed.
- Rollback: revert `ProductCard` wrapper to `div` and drop `id` props (cards become non-clickable again).
