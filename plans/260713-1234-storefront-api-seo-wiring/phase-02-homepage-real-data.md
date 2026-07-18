---
phase: 2
title: "Homepage Real Data"
status: completed
priority: P1
dependencies:
  - 1
---

# Phase 2: Homepage Real Data

## Overview

Wire the homepage's banner/featured-product/featured-news sections plus the Header/Footer
global nav to real backend data. `HomeView.jsx` and its section components currently hold
inline mock arrays.

## Requirements

- Functional: `HomeHero`/`HomeCategoryBanners` (and any promo banner section) render
  `Banner` entities filtered by `position` (`HOME_HERO`, `HOME_CATEGORY`, `HOME_PROMO`),
  `isActive=true`, respecting `startsAt`/`endsAt` scheduling if the backend doesn't already
  filter server-side (confirm; if backend filters by active window automatically, client
  just renders what's returned), ordered by `sortOrder`.
- Functional: `HomeProductList` renders real products (`publicGet('/products', {
  isFeatured: true, status: 'PUBLISHED', size: 8 })`).
- Functional: `HomeNews` renders latest real news (`publicGet('/news', { status:
  'PUBLISHED', sortBy: 'publishedAt', sortDirection: 'DESC', size: N })`).
- Functional: Header's "Sản phẩm" nav gets a **new** real category submenu sourced from
  `publicGet('/product-categories', { isActive: true })`.
  <!-- Updated: Validation Session 1 - `Header.jsx:12-33` `NAV_LINKS`'s "Sản phẩm" children
  are static demo product-detail links (`/san-pham/mau-demo?type=single`), NOT a category
  menu — there is nothing to "swap." This is new UI: build a real category submenu and
  replace the demo links entirely. -->
- Functional: Footer newsletter form submission wired to `publicPost('/newsletter-
  subscribers', { email })` — real success/error toast via `src/utils/feedback.js`
  (`toast.success`/`toast.error`), replacing whatever no-op currently exists.
- Non-functional: `page.jsx` for `/` becomes an async Server Component fetching all
  homepage data once and passing it down as props to `HomeView` (mirrors the
  `san-pham/[slug]` pattern) — do NOT introduce client-side `useEffect` fetching for
  sections that don't need it. Interactive bits (newsletter input, any carousel) stay
  client subcomponents receiving server-fetched data as props.

## Architecture

- `src/app/(main)/page.jsx`: becomes `async function Page()`, calls
  `publicGet('/banners', {...})`, `publicGet('/products', {...featured})`,
  `publicGet('/news', {...latest})`, `publicGet('/product-categories', {...})` in
  parallel (`Promise.all`), passes results as props to `HomeView`.
- `src/views/HomeView.jsx`: accepts the fetched props, forwards to each section component
  (replacing internal mock-generation).
- `src/components/home/{HomeHero,HomeCategoryBanners,HomeProductList,HomeNews}.jsx`: drop
  inline mock arrays, accept data via props, keep existing Tailwind/markup structure
  unchanged (visual regression risk otherwise).
- `src/components/shared/Header.jsx` (confirmed path — `"use client"`, per Validation
  Session 1): since Header is a client component, it cannot fetch itself; category data is
  fetched in `src/app/(main)/layout.js` (confirmed exists — renders `PublicLayout.jsx` →
  `Header`/`Footer`) and passed down as a prop, avoiding a duplicate fetch on every page.
- Footer newsletter form: existing form component gets an `onSubmit` handler calling
  `publicPost`, using local `useState` for pending/error, unrelated to the page's server
  fetch (this is inherently a client interaction).

## Related Code Files

- Modify: `src/app/(main)/page.jsx`, `src/views/HomeView.jsx`
- Modify: `src/components/home/HomeHero.jsx`, `HomeCategoryBanners.jsx`,
  `HomeProductList.jsx`, `HomeNews.jsx`
- Modify: `src/components/shared/Header.jsx` (new category submenu, replacing static
  `NAV_LINKS` demo children), `src/app/(main)/layout.js` (category fetch feeding Header),
  Footer component (newsletter form — confirm exact path under `src/components/shared/`
  at implementation time)
- Not modified: `HomeHighlights`, `HomeFeatures`, `HomeCraftsmanship`, `HomeAboutStats`,
  `HomeVideoProcess` — these are marketing/brand copy sections with no backing entity; stay
  static per Non-Goals (no speculative entity invented for them).

## Implementation Steps

1. Confirm `src/app/(main)/layout.js`'s current structure (already confirmed to exist and
   render `PublicLayout.jsx` — read it in full before adding the category fetch).
2. Wire `page.jsx`'s parallel fetch (banners, featured products, latest news); wire
   `layout.js`'s category fetch (separate from `page.jsx`, since layout wraps every page).
3. Update `HomeView.jsx` + the 3 mock-holding section components to accept props instead of
   generating mock data internally.
4. Build a new real category submenu in `Header.jsx`, replacing the static `NAV_LINKS`
   demo children — not a like-for-like data swap, genuinely new UI.
5. Wire Footer newsletter form to `publicPost`, add loading/error/success states with the
   shared `toast` helper.
6. Manual check: homepage loads with real banners/products/news for at least one seeded
   record each; newsletter form submits successfully and shows a toast; submitting an
   already-subscribed email shows the server's error message (not a generic crash).

## Success Criteria

- [ ] Homepage renders zero mock arrays — every dynamic section backed by a real fetch.
- [ ] Static brand sections (`HomeHighlights` etc.) untouched.
- [ ] Header category menu reflects real active `ProductCategory` rows.
- [ ] Newsletter form successfully POSTs and shows real success/error feedback.
- [ ] No new client-side loading spinner on first paint for server-fetched sections.

## Risk Assessment

- **Risk:** homepage becoming an async Server Component might conflict with an existing
  `"use client"` directive somewhere in the tree (e.g. if `HomeView` itself is currently a
  client component for an unrelated reason, like a carousel). **Mitigation:** audit
  `HomeView.jsx`'s current top-of-file directive before changing `page.jsx`; if `HomeView`
  must stay client, fetch in `page.jsx` (still a Server Component) and pass data down as
  props — client components can receive server-fetched props fine, they just can't do the
  `fetch` themselves without `useEffect`.
- **Risk:** banner scheduling (`startsAt`/`endsAt`) logic duplicated client-side if backend
  doesn't filter it. **Mitigation:** verify server behavior first (check
  `BannerController`/service filtering logic or docs) before adding redundant client-side
  date filtering.
