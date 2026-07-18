---
phase: 5
title: "Content & Info Pages"
status: completed
priority: P2
dependencies:
  - 1
---

# Phase 5: Content & Info Pages

## Overview

Wire the remaining static/info storefront pages: gallery, showroom, factory, FAQ, contact
form, and the hero/SEO fields (only) of about + 3 legal policy pages. Each of these is a
distinct small entity, handled independently within this phase since they don't share
fetch/filter complexity like Phases 3-4's listings.

## Requirements

- Functional: `GalleryView.jsx` renders real `GalleryImage` entities
  (`publicGet('/gallery-images', { isActive: true, sortBy: 'sortOrder', sortDirection:
  'ASC' })`), replacing the `GALLERY_IMAGES` const array. Preserve any existing
  category-tab UI by grouping on the entity's `category` field if the UI currently
  supports category tabs.
- Functional: `ShowroomView.jsx`'s `ShowroomGallery`/`ShowroomMap`/list sections render real
  `Showroom` entities (`publicGet('/showrooms', { isActive: true })`) — `mapEmbedUrl`,
  `openingHours`, `phone`, `address` per showroom.
- Functional: `FactoryView.jsx` — hero title/subtitle/description/image driven by `Page`
  entity fetched by `key` (default convention: route-slug, i.e. `factory` page's key is
  `nha-xuong` — confirmed only by an indirect hint in `adminResources.js:374`
  (`"vd: home, about-us, chinh-sach-van-chuyen"`); reconfirm against live admin/DB at
  implementation time before hardcoding into 5 files, per Validation Session 1), main body
  content stays static JSX (no dedicated "factory" entity exists; per user decision,
  `Page`'s hero/SEO fields only, never `content`).
- Functional: `AboutView.jsx` + 3 policy views (`PrivacyPolicyView`, `ReturnPolicyView`,
  `ShippingPolicyView`) — same `Page`-by-key pattern for hero/SEO fields only (keys default
  to route slugs: `ve-chung-toi`, `bao-mat-thong-tin`, `chinh-sach-doi-tra`,
  `chinh-sach-van-chuyen`); legal body copy stays static JSX. `FaqView.jsx` instead maps to
  `publicGet('/faqs', { isActive: true })` (real dedicated entity, NOT `Page`) — replace
  `FAQ_DATA` const, preserve category grouping if the UI has it (entity has a `category`
  field).
- Functional: `ContactView.jsx`'s form `onSubmit` calls `publicPost('/contact-requests', {
  name, email, phone, content })` — `name` and `content` required per backend contract,
  `email`/`phone` optional; show `toast.success`/`toast.error` via
  `src/utils/feedback.js`, clear form on success. Static address/phone/map info on this
  page stays as-is (no entity mapping requested for contact's own display info).
  <!-- Updated: Validation Session 1 - `ContactView.jsx:52-68`'s local form state field is
  named `message`, but the backend contract expects `content` — this is a field rename/
  mapping (`content: formState.message`), not just a bare `onSubmit` swap. Confirmed the
  submit itself is fake (setTimeout-simulated), not a real request, as originally assumed. -->
- Non-functional: each of these fetches is independent and low-traffic — plain per-page
  Server Component fetch (no shared pagination/searchParams complexity needed here, unlike
  Phases 3-4).

## Architecture

- One `Page`-by-key helper worth extracting given 5 consumers (about + 3 policies +
  factory): a small `getPageByKey(key)` wrapper in `src/lib/publicApi.js` or a thin
  `src/lib/seo/pageByKey.js` that calls `publicGet('/pages/key/' + key)` and returns
  `{heroTitle,heroSubtitle,heroDes,heroImage,seoTitle,seoDescription,seoImage}` (explicitly
  never returns/exposes `content` from this helper, to keep the "admin-only block editor"
  boundary structurally enforced, not just by convention).
- Each view's `page.jsx` becomes/stays an async Server Component fetching its own entity
  (single `Page`-by-key call, or `Showroom`/`GalleryImage`/`Faq` list call) and passing
  props down; the interactive contact form is a client subcomponent under a server-fetched
  page shell (form doesn't need server data, just needs to exist under `"use client"`).

## Related Code Files

- Create: `src/lib/seo/pageByKey.js` (or equivalent — exact location decided at
  implementation time based on where Phase 6 also needs `Page`-by-key SEO fields, since
  Phase 6 reuses this same helper for those pages' `generateMetadata`)
- Modify: `src/app/(main)/thu-vien-hinh-anh/page.jsx`, `src/views/GalleryView.jsx`
- Modify: `src/app/(main)/showroom/page.jsx`, `src/views/ShowroomView.jsx`
- Modify: `src/app/(main)/nha-xuong/page.jsx`, `src/views/FactoryView.jsx`
- Modify: `src/app/(main)/ve-chung-toi/page.jsx`, `src/views/AboutView.jsx`
- Modify: `src/app/(policies)/bao-mat-thong-tin/page.jsx`, `src/views/PrivacyPolicyView.jsx`
- Modify: `src/app/(policies)/chinh-sach-doi-tra/page.jsx`, `src/views/ReturnPolicyView.jsx`
- Modify: `src/app/(policies)/chinh-sach-van-chuyen/page.jsx`,
  `src/views/ShippingPolicyView.jsx`
- Modify: `src/app/(policies)/cau-hoi-thuong-gap/page.jsx`, `src/views/FaqView.jsx`
- Modify: `src/app/(main)/lien-he/page.jsx` (if fetch needed) or just
  `src/views/ContactView.jsx` (form wiring only, likely no new server fetch needed for the
  form itself)

## Implementation Steps

1. Confirm actual `Page` `key` values seeded/used in the admin for about/3-policies/factory
   (check admin `Page` resource list or ask backend seed data) before hardcoding key
   strings in 5 different files — get this right once, centrally, rather than guessing per
   file.
2. Build `getPageByKey(key)` helper.
3. Wire `GalleryView`, `ShowroomView`, `FaqView` to their real list entities.
4. Wire `FactoryView`/`AboutView`/3 policy views' hero sections to `getPageByKey`; leave
   legal body JSX untouched.
5. Wire `ContactView`'s form to `publicPost('/api/contact-requests', ...)` with toast
   feedback and form reset on success.
6. Manual check: each page loads without error against a seeded/empty backend (empty state
   for gallery/showroom/faq if no rows seeded yet — should not crash, should show a
   reasonable empty state consistent with existing empty-state conventions elsewhere in the
   app); submit contact form successfully and with a deliberately invalid payload (missing
   required `content`) to confirm server validation error surfaces as a toast, not a crash.

## Success Criteria

- [ ] `GalleryView`, `ShowroomView`, `FaqView` render real entities, zero mock consts
      remaining (`GALLERY_IMAGES`, `FAQ_DATA` removed).
- [ ] `FactoryView`/`AboutView`/3 policy views pull hero+SEO fields from `Page` by key;
      main legal/marketing body copy is unchanged static JSX (verified via diff — no
      wholesale rewrite of body content).
- [ ] `getPageByKey` helper never exposes the `content` field (structural boundary, checked
      by reading its return shape, not just its usage sites).
- [ ] Contact form successfully posts to the real endpoint with correct required-field
      validation surfaced from the server, not just client-side guessing.
- [ ] All pages in this phase handle an empty-data response gracefully (no crash, sensible
      empty state).

## Risk Assessment

- **Risk:** wrong/guessed `Page.key` strings silently 404 or return empty for
  about/policy/factory pages. **Mitigation:** Step 1 confirms real key values against
  actual admin-seeded data before wiring 5 files, rather than guessing and finding out at
  QA time.
- **Risk:** scope creep — turning legal policy body text into a full block-content-driven
  page (re-opening the block-builder plan's "admin-only, no storefront render" decision for
  `content`). **Mitigation:** Requirements explicitly restrict this phase to hero/SEO
  scalar fields only; `content` stays untouched/unread by any code this phase adds.
