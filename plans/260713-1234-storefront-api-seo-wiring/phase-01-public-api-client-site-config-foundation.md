---
phase: 1
title: "Public API Client & Site Config Foundation"
status: completed
priority: P1
dependencies: []
---

# Phase 1: Public API Client & Site Config Foundation

## Overview

Extend `publicApi.js` with list/pagination support for every public-GET entity, add POST
helpers for the two public write endpoints, and add a small site-config module for SEO
defaults. This is the shared foundation Phases 2-6 depend on — no page wiring happens here.

## Requirements

- Functional: `publicGet(path, { params })` supports query-string building for pagination/
  filter/sort params (currently `publicGet` only takes a bare path).
- Functional: pagination convention MUST match the backend exactly — **1-based** `page`
  (default 1), `size` (default 10, clamp 1-100 server-side), `sortBy` (per-resource
  whitelist, invalid falls back to `id` server-side), `sortDirection` (`ASC`/`DESC`, default
  `ASC`). Do NOT translate to/from 0-based — this differs from a naive Spring `Pageable`
  assumption and was confirmed against `docs/PRODUCT_API.md`.
- Functional: response envelope for list endpoints is
  `{code,message,data:{content,pageNumber,pageSize,totalElements,totalPages,first,last},timestamp}`
  — `publicGet` already unwraps `data`; list callers destructure `content`/pagination fields
  from there.
- Functional: add `publicPost(path, body)` — unauthenticated POST, same envelope unwrap,
  used by Phase 5 for `contact-requests`/`newsletter-subscribers`.
- Functional: new `src/lib/seo/siteConfig.js` — exports `SITE_URL` (from new
  `NEXT_PUBLIC_SITE_URL` env var), `SITE_NAME`, `DEFAULT_OG_IMAGE` (reuse existing
  `/default-og.png` referenced today in `san-pham/[slug]`/`tin-tuc/[slug]`
  `generateMetadata`), `absoluteUrl(path)` helper.
  <!-- Updated: Validation Session 1 - root layout already hardcodes
  `metadataBase: new URL("https://gomvugia.vn")` (`src/app/layout.js:64-72`). Migrate that
  value into `NEXT_PUBLIC_SITE_URL=https://gomvugia.vn`; `SITE_URL` reads from the env var
  with `https://gomvugia.vn` as the fallback (not `localhost:3000` — this is the real
  production domain already in use, not a placeholder to invent). Phase 6 updates the root
  layout to read `metadataBase` from `siteConfig.SITE_URL` instead of the hardcoded string. -->
- Non-functional: add `NEXT_PUBLIC_SITE_URL=https://gomvugia.vn` to `.env.example`
  (currently only has `NEXT_PUBLIC_API_BASE_URL`/`NEXT_PUBLIC_IMAGE_BASE_URL`) with a
  comment explaining it's used for canonical/OG/sitemap absolute URLs and mirrors the
  domain already hardcoded in the root layout.

## Architecture

- `src/lib/publicApi.js` (modify): add a `buildQuery(params)` helper (drop
  null/undefined/empty values, standard `URLSearchParams`), thread it through `publicGet`.
  Add `publicPost`.
- `src/lib/seo/siteConfig.js` (create): plain constants + `absoluteUrl()`, no React.
- No component changes in this phase.

## Related Code Files

- Modify: `vu-gia-client/src/lib/publicApi.js`
- Create: `vu-gia-client/src/lib/seo/siteConfig.js`
- Modify: `vu-gia-client/.env.example`
- Read (reference contract, do not modify): `vu-gia-client/src/lib/adminApi.js` (envelope
  pattern to mirror), `docs/PRODUCT_API.md`, `docs/NEWS_API.md`, `docs/BASIC_MODULES_API.md`,
  `docs/PAGE_API.md`, `docs/CONTACT_API.md`, `docs/NEWSLETTER_API.md` (backend contract
  source of truth — read from the backend repo if these docs live there, otherwise the
  facts already gathered in this plan's Validation Log are sufficient)

## Implementation Steps

1. Add `buildQuery(params)` to `publicApi.js` — filters falsy/undefined, encodes via
   `URLSearchParams`.
2. Update `publicGet` signature to `publicGet(path, params)`, appending the query string
   when `params` is provided; keep backward compatibility with existing no-arg calls
   (`san-pham/[slug]`, `tin-tuc/[slug]` continue to work unchanged).
3. Add `publicPost(path, body)` — JSON body, same envelope unwrap/error handling as
   `publicGet`, no auth header.
4. Create `siteConfig.js` with `SITE_URL`/`SITE_NAME`/`DEFAULT_OG_IMAGE`/`absoluteUrl()`.
5. Add `NEXT_PUBLIC_SITE_URL` to `.env.example` with a one-line comment.
6. Smoke-test against a running backend: one paginated call
   (`publicGet('/products', { status: 'PUBLISHED', page: 1, size: 5 })`) and one POST
   (`publicPost('/newsletter-subscribers', { email })` with a throwaway email) to confirm
   both helpers work end-to-end before Phase 2+ build on them.
   <!-- Updated: Validation Session 1 - `API_BASE_URL` (adminApi.js:1-2) already includes
   `/api`; `publicGet`/`publicPost` paths must NOT repeat it (confirmed against the one real
   existing call site, `san-pham/[slug]/page.jsx:18`: `publicGet('/products/slug/'+slug)`).
   All example paths in this plan (here and in later phases) are relative to the API base,
   no leading `/api` — e.g. `/products`, not `/api/products`. -->

## Success Criteria

- [ ] `publicGet` accepts optional query params without breaking existing 2 call sites.
- [ ] `publicPost` exists, correctly unwraps envelope, throws a catchable error with
      server-provided `message` on non-1000 code (for toast display in Phase 5).
- [ ] Pagination params verified 1-based against a real backend response
      (`pageNumber` in the response echoes the requested `page`, not `page - 1`).
- [ ] `siteConfig.js` exports all 4 named items; `absoluteUrl('/san-pham/abc')` returns a
      well-formed absolute URL using `SITE_URL`.
- [ ] `.env.example` documents `NEXT_PUBLIC_SITE_URL`.

## Risk Assessment

- **Risk:** assuming 0-based pagination (common Spring default) would silently off-by-one
  every listing page. **Mitigation:** Step 6's smoke test explicitly checks
  `pageNumber` echoes back `1` when requesting `page=1`, not `0`.
- **Risk:** `publicPost` error shape diverges from `adminApi`'s, causing inconsistent toast
  messages in Phase 5. **Mitigation:** reuse the exact same `PublicApiError`/error-class
  pattern already established for `publicGet`, just adding the POST verb.
