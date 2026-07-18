---
title: "Storefront API Integration & SEO"
description: "Wire every public storefront page (except cart/checkout) to real backend data via publicApi.js, matching the Server-Component-fetch contract already proven in san-pham/[slug] and tin-tuc/[slug]; add full SEO layer (sitemap, robots, dynamic metadata, JSON-LD, OG)."
status: completed
priority: P1
branch: "main"
tags: [frontend, nextjs, api-integration, seo]
blockedBy: []
blocks: []
created: "2026-07-13T05:36:05.186Z"
createdBy: "ck:plan"
source: skill
---

# Storefront API Integration & SEO

## Overview

Today only `san-pham/[slug]` and `tin-tuc/[slug]` render real backend data (added in the
`260713-1110-custom-block-builder` plan). Every other public page — homepage, product
listing, news listing, gallery, showroom, factory, contact, about, 4 policy pages, and the
altar customizer's related-products widget — is 100% hardcoded/mock JSX. Cart/checkout are
explicitly out of scope (see Non-Goals) since a separate pending plan
(`260709-2006-user-flow-navigation-linking`) owns cart state/navigation.

This plan:
1. Extends `publicApi.js` with list/pagination support and wires all public GET endpoints
   already permitted by the backend (`Product`, `ProductCategory`, `News`, `NewsCategory`,
   `Banner`, `Showroom`, `GalleryImage`, `Faq`, `Page`) into their corresponding storefront
   views.
2. Wires the two public POST endpoints (`contact-requests`, `newsletter-subscribers`) into
   the existing (currently no-op) contact form and footer newsletter form.
3. Absorbs the old nav plan's "ProductCard Routing" concern (Phase 2 there) since it's the
   same work as wiring product data — once cards render real products, `slug`/`id` naturally
   flow into the link.
4. Adds a full SEO layer: `sitemap.xml`, `robots.txt`, dynamic `generateMetadata` for every
   entity-backed page (not just slug string), JSON-LD (`Product`, `Article`,
   `BreadcrumbList`, `Organization`), and per-entity OG images.

## Scope

**In scope (full sweep, all validated with user):**
- Homepage: banners (`Banner` entity, positions `HOME_HERO`/`HOME_CATEGORY`/`HOME_PROMO`),
  featured products (`isFeatured=true`), latest news, category nav (Header mega-menu +
  Footer).
- `/san-pham` listing: real products, category filter, sort, pagination.
- `/tin-tuc` listing: real news, category filter, pagination.
- `/thu-vien-hinh-anh` gallery: `GalleryImage` entity.
- `/showroom`: `Showroom` entity.
- `/nha-xuong` (factory): `Page` entity by `key` — hero + SEO fields only (see below).
- `/lien-he` contact: static info stays as-is; form wired to `POST /contact-requests`
  (mapping the form's local `message` field to the backend's `content` field).
- Footer newsletter form wired to `POST /newsletter-subscribers`.
- `/ve-chung-toi` (about) + 4 `(policies)` pages (privacy, return, shipping) — legal body
  copy stays static JSX (rarely changes, YAGNI); `heroTitle/heroSubtitle/heroDes/heroImage/
  seoTitle/seoDescription/seoImage` come from `Page` entity by `key` so admin can edit
  hero/SEO without a redeploy. `cau-hoi-thuong-gap` (FAQ) instead maps to the dedicated
  `Faq` entity (has its own admin resource), NOT `Page`.
- `/tuy-chinh-bo-do-tho` altar customizer: `AltarSimilarProductsSection` (a `ProductCard`
  consumer) gets real product data.
- All 6 `ProductCard` consumers get real `slug`/`id`, including `CartView.jsx`'s
  `relatedProducts` widget (confirmed in Validation Session 1 to be a separate mock
  "suggested products" section, structurally identical to the other consumers — NOT the
  cart line-items themselves, which are already real via `src/stores/cartStore.js`, see
  Non-Goals).
- New: a real product-category submenu under Header's "Sản phẩm" nav (confirmed in
  Validation Session 1 — today it's static demo links, not a category list; this is new UI,
  not a data swap).
- Full SEO layer across every page touched above.

**Non-goals (explicit, confirmed with user):**
- Cart/checkout/orders pages and cart line-item rendering — `src/stores/cartStore.js`
  already exists and is real (Validation Session 1 finding: the old nav plan's Phase 4,
  "build a real Zustand cart store," appears already implemented despite that plan's
  frontmatter still saying `pending` — Phase 7 confirms and resyncs this). This plan does
  NOT touch cart-line-item rendering, checkout, or orders. It DOES wire `CartView.jsx`'s
  separate `relatedProducts` widget (Phase 3) — that's a distinct mock section, not cart
  state.
- The generic `Page.content` block-content field (rich block editor) — already decided
  admin-only in the block-builder plan (no storefront consumer). This plan reads `Page`'s
  hero/SEO scalar fields only, never `content`.
- `GlobalAltarWidget`, checkout redirect flow, `FixedActionWidget` deletion — untouched,
  stay with the nav plan.
- No new admin UI work — all consuming entities (`Banner`, `Showroom`, `GalleryImage`,
  `Faq`, `Page`) already have admin CRUD per `adminResources.js`; this plan is storefront-
  read-side only.
- No config-driven generic list component (admin's `DataTable`/`adminResources.js` style)
  for storefront listings — per user decision, storefront mirrors san-pham/tin-tuc's
  Server-Component-fetch style and `publicApi.js`'s envelope contract, not the admin
  resource-schema pattern. UI/UX stays fully custom per page.

## Phases

| Phase | Name | Status |
|-------|------|--------|
| 1 | [Public API Client & Site Config Foundation](./phase-01-public-api-client-site-config-foundation.md) | Completed |
| 2 | [Homepage Real Data](./phase-02-homepage-real-data.md) | Completed |
| 3 | [Product Listing & Card Routing](./phase-03-product-listing-card-routing.md) | Completed |
| 4 | [News Listing Wiring](./phase-04-news-listing-wiring.md) | Completed |
| 5 | [Content & Info Pages](./phase-05-content-info-pages.md) | Completed |
| 6 | [SEO Layer](./phase-06-seo-layer.md) | Completed |
| 7 | [Cleanup & Nav-Plan Resync QA](./phase-07-cleanup-nav-plan-resync-qa.md) | Completed |

## Dependencies

- Phase 1 blocks all others (shared `publicApi.js` extensions + `siteConfig.js`).
- Phases 2-5 are otherwise independent of each other (different pages/files) and can be
  done in any order after Phase 1, though numeric order is recommended (homepage feeds the
  featured-product/news pattern reused in Phase 3/4).
- Phase 6 (SEO) depends on Phases 2-5 — needs real entity data present to generate
  meaningful metadata/JSON-LD.
- Phase 7 depends on all prior phases.
- **Cross-plan:** `blockedBy`/`blocks` set against
  `260709-2006-user-flow-navigation-linking` — that plan's Phase 2 ("ProductCard Routing")
  is superseded/absorbed by this plan's Phase 3; Phase 7 here updates that plan's frontmatter
  and phase files to remove the duplicated scope (see Phase 7).

## Acceptance Criteria

- [ ] Every page listed in Scope renders real backend data server-side (Server Component
      fetch, no client-side loading spinner on first paint) where the page isn't already
      `"use client"` for unrelated interactivity.
- [ ] `publicApi.js` supports paginated list calls with the backend's actual convention:
      1-based `page` (default 1), `size`, `sortBy`, `sortDirection` — verified against
      `docs/PRODUCT_API.md` etc., NOT 0-based like a naive Spring-`Pageable` assumption.
- [ ] Contact form submits to `POST /contact-requests` (with `message`→`content` field
      mapping); footer newsletter form submits to `POST /newsletter-subscribers`; both show
      real success/error toast (not no-op/simulated).
- [ ] All 6 `ProductCard` consumers — including `CartView.jsx`'s `relatedProducts` widget,
      excluding cart line-item rendering itself — pass a real product `slug`/`id` that
      resolves to a working `/san-pham/[slug]` detail page.
- [ ] `sitemap.xml` and `robots.txt` exist and list/allow every public route including
      dynamic product/news slugs.
- [ ] Every entity-backed page has `generateMetadata` using real `seoTitle`/
      `seoDescription`/`seoImage` (falling back to sensible defaults, never raw slug
      strings), a canonical URL, and Open Graph tags.
- [ ] JSON-LD present for: `Product` (product detail), `Article`/`NewsArticle` (news
      detail), `BreadcrumbList` (listing + detail pages), `Organization` (root layout).
- [ ] No leftover unused mock-data consts/arrays in any touched component file.
- [ ] `260709-2006-user-flow-navigation-linking`'s plan.md + phase files updated to remove
      the now-duplicated "ProductCard Routing" scope and cross-reference this plan.
- [ ] `npm run lint` and `npm run build` pass with no new warnings.

## Open Questions

None outstanding — all scope decisions (page coverage, nav-plan overlap resolution, SEO
depth, admin-pattern interpretation, `Page` hero/SEO field usage, Header submenu scope,
`CartView` exclusion boundary, site-URL source of truth, `Page.key` naming) were confirmed
with the user across the Scope Challenge and Validation Session 1 (see Validation Log).
One item remains a runtime confirmation, not an open design question: `Page.key` values
default to route-slug convention, to be double-checked against live admin/DB data at
Phase 5 implementation time (not blocking plan approval).

## Validation Log

### Scope Challenge (pre-plan, via AskUserQuestion)
1. **Page coverage**: "Toàn bộ trừ cart/checkout" (full sweep except cart/checkout) —
   confirmed. Propagated to Scope + all phases.
2. **Nav-plan overlap** (`260709-2006`): "Gộp luôn phần nav wiring liên quan data vào plan
   mới" (merge data-related nav wiring into this plan) — confirmed. Propagated: Phase 3
   absorbs old Phase 2 (ProductCard Routing); Phase 7 resyncs the old plan's frontmatter/
   phase files to drop that scope and link `blockedBy`/`blocks` between the two plans.
3. **SEO depth**: "Đầy đủ: sitemap.xml, robots.txt, metadata động, JSON-LD, OG image theo
   từng entity" (full SEO) — confirmed. Propagated to Phase 6 + Acceptance Criteria.
4. **"Chuẩn theo admin UI" interpretation**: "Đồng bộ data contract + kiểu Server Component
   fetch như san-pham/tin-tuc đã làm" (sync data contract + Server Component fetch style,
   NOT admin's config-driven DataTable pattern) — confirmed. Propagated to Non-Goals +
   Phase 1 architecture (mirrors `publicApi.js`'s existing envelope-unwrap pattern, not
   `adminResources.js`).
5. **`Page` hero/SEO fields for static pages**: "Có — lấy hero+SEO từ Page.key, nội dung
   chính vẫn static JSX" (yes, hero+SEO from Page.key, main content stays static) —
   confirmed. Propagated to Scope + Phase 5. Does NOT reverse the block-builder plan's
   `Page.content` admin-only decision — different fields, additive only.

### Fact-gathering (2 scout passes, this session)
- Pass 1: storefront page inventory (mock vs real), backend public endpoint surface
  (`SecurityConfig.java` permit list), admin API pattern (`adminApi.js`/`adminResources.js`),
  current SEO state (none), overlap check against `260709-2006` (confirmed: that plan's
  scope is pure `<Link>`/cart-store wiring, does NOT touch listing/content data — file-level
  overlap only, e.g. `ProductCard`, `CheckoutView`).
- Pass 2: exact file paths for every page's mock-data location, all 6 `ProductCard`
  consumers, backend DTO field names (via `docs/PRODUCT_API.md`, `NEWS_API.md`,
  `BASIC_MODULES_API.md`, `PAGE_API.md`, `CONTACT_API.md`, `NEWSLETTER_API.md`),
  pagination convention (1-based `page`, confirmed against docs — differs from a naive
  0-based Spring `Pageable` assumption), confirmed no existing SEO helpers/`siteConfig`/
  `NEXT_PUBLIC_SITE_URL`.

### Validation Session 1 — 2026-07-13
**Trigger:** `/ck:plan validate` after initial plan write, before implementation handoff.
**Tier:** Full (7 phases). **Claims checked:** 12. **Verified:** 4 | **Failed:** 7 |
**Unverified:** 1.

#### Verification Results (Full tier — Fact Checker, Flow Tracer, Scope Auditor, Contract Verifier)

**Verified (no issue):**
- `src/app/(main)/layout.js` exists → `PublicLayout.jsx` → `Header`/`Footer`; `Header` is
  `"use client"` (category data must arrive as props, not its own fetch).
- `san-pham/[slug]/page.jsx:4-14` `generateMetadata` really does build title/description
  from the raw slug string, as the plan claimed.
- `FactoryView.jsx` confirmed pure composition (7 sub-sections), matching the assumed
  Showroom-style pattern.
- All 5 admin resources (`faqs`, `galleryImages`, `showrooms`, `banners`, `pages`) exist in
  `adminResources.js` (lines 113/138/163/190/357) — Phase 5's data sources are real.

**Failed (corrected below, propagated to phases):**
1. `API_BASE_URL` (`adminApi.js:1-2`) already includes `/api`; every phase's example URLs
   had a stray extra `/api` prefix that would double up and 404. **Corrected** in Phases
   1-6's example URLs (drop the leading `/api`).
2. No `ROUTES` product-detail helper exists to "reuse" — `ProductCard.jsx:18-20` already
   builds the link inline (`${ROUTES.PRODUCTS}/${slug}`, falls back to `sp-${id}`). Phase 3
   needs zero new routing code, just a real `slug` prop. **Corrected** in Phase 3.
3. Header's "Sản phẩm" submenu (`Header.jsx:12-33` `NAV_LINKS`) is static demo links, not a
   category menu — there is nothing to "swap," this is new UI. → **Interview Q1.**
4. `src/stores/cartStore.js` is a complete, real, `persist`-backed Zustand store already
   consumed by `Header.jsx` (badge) and `CartView.jsx` — the old nav plan's Phase 4 looks
   already done despite `pending` status. → **Interview Q2.**
5. `CartView.jsx`'s `ProductCard` usage (`relatedProducts`, line ~45+) is a separate mock
   "suggested products" widget, not cart line-items (already real per #4) — the blanket
   exclusion was over-scoped. → **Interview Q2.**
6. Root layout (`src/app/layout.js:64-72`) already sets
   `metadataBase: new URL("https://gomvugia.vn")` — Phase 6's "add metadataBase" assumption
   was wrong (it exists, hardcoded). → **Interview Q3.**
7. `ContactView.jsx:52-68` submit is confirmed fake (setTimeout-simulated) as claimed, but
   its local form field is named `message` while the backend expects `content` — needs an
   explicit rename/mapping, not just an `onSubmit` swap. **Corrected** in Phase 5.

**Unverified:**
8. `Page.key` real values — no seed data accessible from the verification fork. Only clue:
   `adminResources.js:374` field hint `"vd: home, about-us, chinh-sach-van-chuyen"`, which
   matches `ROUTES.SHIPPING_POLICY`'s slug. → **Interview Q4.**

#### Questions & Answers

1. **[Scope]** "Header hiện không có category mega-menu thật — 'Sản phẩm' submenu đang là
   link demo tĩnh. Phạm vi Phase 2 có nên bao gồm xây mới UI submenu category thật không?"
   - Options: Có, xây mới trong Phase 2 (Recommended) | Không, bỏ khỏi Phase 2
   - **Answer:** Có — xây submenu category thật trong Phase 2.
   - **Rationale:** matches user's original "hoàn thiện đầy đủ" (fully complete) intent;
     category filtering already exists on `/san-pham` (Phase 3), so the data source is
     proven, just needs a new Header UI consumer.

2. **[Scope]** "Cart thật (Zustand store) thực ra đã được xây rồi... CartView.jsx's
   ProductCard usage đang bị loại trừ thực ra là widget 'related products' riêng (mock),
   không phải cart line-items. Xử lý thế nào?"
   - Options: Thu hẹp loại trừ, wire relatedProducts trong Phase 3 (Recommended) | Giữ
     nguyên loại trừ toàn bộ `CartView.jsx`
   - **Answer:** Thu hẹp loại trừ — wire `relatedProducts` in Phase 3; cart line-items stay
     untouched.
   - **Rationale:** `relatedProducts` is structurally identical to the other 4 already-wired
     `ProductCard` consumers; leaving it mock while everything else is real would be an
     inconsistent, arbitrary gap.

3. **[Architecture]** "Root layout đã có sẵn metadataBase hardcode
   (`https://gomvugia.vn`). Phase 1's siteConfig.js/NEXT_PUBLIC_SITE_URL nên xử lý thế nào?"
   - Options: Migrate hardcode → `NEXT_PUBLIC_SITE_URL`, layout reads from siteConfig
     (Recommended) | Keep layout hardcoded, siteConfig only for sitemap/canonical/JSON-LD
   - **Answer:** Migrate — `NEXT_PUBLIC_SITE_URL=https://gomvugia.vn`, layout reads from
     `siteConfig.SITE_URL`.
   - **Rationale:** single source of truth; avoids the two values silently diverging if the
     domain ever changes (staging vs. production).

4. **[Assumptions]** "Page.key cho các trang tĩnh chưa có seed data xác nhận — dùng quy ước
   route-slug làm key mặc định hay xác nhận lại với admin/DB trước?"
   - Options: Dùng quy ước route-slug, xác nhận lại khi implement Phase 5 (Recommended) |
     Dừng lại, kiểm tra DB/admin ngay bây giờ
   - **Answer:** Dùng quy ước route-slug mặc định, xác nhận lại khi implement Phase 5.
   - **Rationale:** only concrete evidence available (`adminResources.js:374` hint) supports
     this convention; blocking plan approval on live DB access (not available this session)
     is disproportionate — Phase 5 already has a verification step for this.

#### Confirmed Decisions
- Header gets a new real category submenu (Phase 2 scope expanded).
- `CartView.jsx` exclusion narrowed to cart line-items only; `relatedProducts` widget is a
  Phase 3 target.
- Site URL: migrate existing hardcoded domain into `NEXT_PUBLIC_SITE_URL`/`siteConfig.js`,
  root layout reads from there.
- `Page.key` values default to route-slug convention pending live confirmation at Phase 5.

#### Action Items
- [x] Fix stray `/api` prefix in all phase example URLs (Phases 1-6).
- [x] Remove Phase 3's false "reuse ROUTES helper" framing — no new routing code needed.
- [x] Expand Phase 2 to include a new real category submenu (was: swap existing menu).
- [x] Narrow Phase 3/Non-Goals' `CartView.jsx` exclusion to line-items only; add
      `relatedProducts` as an in-scope consumer.
- [x] Update Phase 6 to reconcile-with (not "add") the existing `metadataBase`.
- [x] Add `ContactView.jsx` `message`→`content` field-name mapping to Phase 5.
- [x] Add a note to Phase 7 to verify/mark the old nav plan's Phase 4 (cart store) as
      likely-already-complete during resync, rather than assuming it's still pending work.

#### Impact on Phases
- Phase 1: fixed example URLs; `siteConfig.SITE_URL` now documented as migrating the
  existing hardcoded domain, not introducing a fresh default.
- Phase 2: added real category-submenu build-out (new UI, not data-only); fixed example
  URLs.
- Phase 3: removed false ROUTES-helper-reuse step; added `CartView.jsx`'s `relatedProducts`
  as an in-scope consumer; fixed example URLs.
- Phase 4: fixed example URLs.
- Phase 5: added `ContactView.jsx` field-name mapping (`message`→`content`); `Page.key`
  convention documented as route-slug default pending confirmation; fixed example URLs.
- Phase 6: changed "add metadataBase" to "reconcile existing hardcoded metadataBase with
  siteConfig".
- Phase 7: added a check/resync note for the old nav plan's Phase 4 (cart store) likely
  already being complete; updated `CartView.jsx` exclusion wording to match the narrowed
  scope.

### Whole-Plan Consistency Sweep
- Files reread: `plan.md`, all 7 `phase-*.md` files (post-edit).
- Decision deltas checked: 8 (4 interview answers + 4 corrected factual findings).
- Reconciled stale references: `/api`-prefixed URLs (6 phases), ROUTES-helper claim
  (Phase 3), Header "swap" framing (Phase 2), `CartView.jsx` blanket exclusion (Non-Goals +
  Phase 3 + Phase 7), `metadataBase` "add" framing (Phase 6), `ContactView.jsx` field
  mismatch (Phase 5).
- Unresolved contradictions: **0.**
- Verification: Failed: 0 (all 7 corrected) → plan eligible for implementation.
