---
phase: 6
title: "SEO Layer"
status: completed
priority: P1
dependencies:
  - 2
  - 3
  - 4
  - 5
---

# Phase 6: SEO Layer

## Overview

Add the full SEO layer now that every page has real data to describe: `sitemap.xml`,
`robots.txt`, dynamic `generateMetadata` (replacing the current weak slug-string-based
metadata on `san-pham/[slug]`/`tin-tuc/[slug]` too), JSON-LD structured data, and OG
images per entity. No `sitemap.js`/`robots.js`/JSON-LD exists today.

<!-- Updated: Validation Session 1 - `src/app/layout.js:64-72` (note: `.js`, not `.jsx`)
already sets `metadataBase: new URL("https://gomvugia.vn")` hardcoded — this phase
RECONCILES that existing value with `siteConfig.SITE_URL` (Phase 1 migrates it into
`NEXT_PUBLIC_SITE_URL`), it does not "add" `metadataBase` from scratch. -->

## Requirements

- Functional: `src/app/sitemap.js` (Next.js App Router convention) — static routes
  (homepage, listings, gallery, showroom, factory, about, contact, 4 policies) +
  dynamically generated entries for every published product slug and news slug (paginate
  through the backend if `totalElements` is large — do not assume a single page covers all
  records).
- Functional: `src/app/robots.js` — allow all public routes, disallow any `/admin`,
  `/tai-khoan` (account), `/gio-hang`/`/thanh-toan` (cart/checkout, low SEO value + user's
  cart), reference the sitemap URL.
- Functional: `generateMetadata` on every page touched in Phases 2-5, using real
  `seoTitle`/`seoDescription`/`seoImage` where the entity has them (`Product`, `News`,
  `ProductCategory`, `Page`), falling back to a sensible generated title/description when
  the entity lacks explicit SEO fields (e.g. `GalleryImage`, `Showroom`, `Faq` list pages —
  synthesize from page purpose, not empty strings). Every `generateMetadata` sets
  `alternates.canonical` via `siteConfig.absoluteUrl(path)` and `openGraph`/`twitter` card
  fields using `seoImage` or `DEFAULT_OG_IMAGE`.
- Functional: fix `san-pham/[slug]`/`tin-tuc/[slug]`'s existing weak `generateMetadata`
  (currently built from raw `slug` string per the scout finding) to use the fetched
  entity's real `seoTitle`/`seoDescription`/`seoImage`/`name`/`title` — this is a
  correction of already-shipped code from the block-builder plan, in scope here since this
  plan owns the SEO layer.
- Functional: JSON-LD via a shared `<JsonLd data={...} />` component (renders a
  `<script type="application/ld+json">` with `dangerouslySetInnerHTML` on
  `JSON.stringify`, standard Next.js pattern) —
  - `Product` schema on product detail (name, image, description, offers/price).
  - `Article`/`NewsArticle` schema on news detail (headline, image, datePublished,
    author if available).
  - `BreadcrumbList` on listing + detail pages (Home > San phẩm > {category} > {product}).
  - `Organization` schema once in the root layout (site name, logo, contact info — reuse
    `siteConfig`).
- Non-functional: root layout (`src/app/layout.js`) reads `metadataBase: new
  URL(siteConfig.SITE_URL)` (replacing the hardcoded string) so all relative OG/canonical
  URLs resolve correctly without repeating the full domain in every page.

## Architecture

- `src/app/sitemap.js`: exports `default async function sitemap()`, fetches all
  published product/news slugs via `publicApi` (looping pages if needed), returns the
  `MetadataRoute.Sitemap` array (static entries + dynamic entries with `lastModified` from
  `updatedAt`).
- `src/app/robots.js`: exports `default function robots()`, returns
  `MetadataRoute.Robots` object.
- `src/components/seo/JsonLd.jsx`: tiny shared component, `{ data }` prop, no other logic.
- `src/lib/seo/schemas.js`: pure functions building each schema object (`buildProductSchema
  (product)`, `buildArticleSchema(news)`, `buildBreadcrumbSchema(crumbs)`,
  `buildOrganizationSchema()`) — keeps schema-shape logic out of page components.
- Update `src/app/layout.js`: replace hardcoded `metadataBase` with `siteConfig.SITE_URL`,
  render `<JsonLd data={buildOrganizationSchema()} />` once.

## Related Code Files

- Create: `src/app/sitemap.js`, `src/app/robots.js`, `src/components/seo/JsonLd.jsx`,
  `src/lib/seo/schemas.js`
- Modify: `src/app/layout.js` (metadataBase reconciliation + Organization JSON-LD)
- Modify: `src/app/(main)/san-pham/[slug]/page.jsx`, `src/app/(main)/tin-tuc/[slug]/
  page.jsx` (fix weak metadata, add Product/Article JSON-LD + breadcrumb)
- Modify: every `page.jsx` touched in Phases 2-5 (add/upgrade `generateMetadata`; add
  `BreadcrumbList` JSON-LD on listing pages)

## Implementation Steps

1. Replace root layout's hardcoded `metadataBase` string with `siteConfig.SITE_URL`; build
   `siteConfig`-based `Organization` schema and render it once.
2. Build `schemas.js` schema-builder functions.
3. Build `JsonLd.jsx` shared component.
4. Fix `san-pham/[slug]`/`tin-tuc/[slug]`'s `generateMetadata` to use real entity fields;
   add `Product`/`Article` JSON-LD to those detail pages.
5. Add `generateMetadata` + `BreadcrumbList` JSON-LD to each listing/info page from
   Phases 2-5, reusing `getPageByKey`'s `seoTitle`/`seoDescription`/`seoImage` for the
   `Page`-backed pages (about/policies/factory).
6. Build `sitemap.js` (paginate through all published products/news) and `robots.js`.
7. Manual verification: view page source for at least one product detail, one news
   detail, one listing page — confirm real title/description/OG tags/canonical/JSON-LD
   present (use a JSON-LD validator or just visually check the `<script
   type="application/ld+json">` block parses as valid JSON). Load `/sitemap.xml` and
   `/robots.txt` directly and confirm they render.

## Success Criteria

- [ ] `/sitemap.xml` lists all static routes + every published product/news slug.
- [ ] `/robots.txt` allows public routes, disallows admin/account/cart/checkout, references
      the sitemap.
- [ ] Every page from Phases 2-5 has `generateMetadata` with real title/description
      (never a raw slug string), canonical URL, and OG/Twitter card tags.
- [ ] `san-pham/[slug]`/`tin-tuc/[slug]` metadata upgraded from the original weak
      slug-based version to real entity fields.
- [ ] JSON-LD present and valid (parses as JSON) for Product, Article, BreadcrumbList
      (listing+detail), Organization (root layout, once).
- [ ] `metadataBase` in root layout reads from `siteConfig.SITE_URL`; no hardcoded domain
      string remains in `layout.js`.

## Risk Assessment

- **Risk:** sitemap generation timing out or being huge if there are thousands of
  products/news. **Mitigation:** paginate the backend calls inside `sitemap.js`; if the
  catalog is large enough to matter, Next.js supports a sitemap index / generateSitemaps —
  only add that complexity if the actual seeded/production data volume warrants it (check
  approximate row counts first; don't build multi-sitemap infra for a catalog of a few
  hundred items).
- **Risk:** re-touching `san-pham/[slug]`/`tin-tuc/[slug]` (already-shipped, reviewed code
  from the block-builder plan) introduces a regression in the recently-verified
  `BlockRenderer` wiring. **Mitigation:** scope the edit strictly to the `generateMetadata`
  export and an added JSON-LD render — do not touch the `BlockRenderer`/data-fetch body of
  those files; re-run `npm run build` after to confirm no regression.
