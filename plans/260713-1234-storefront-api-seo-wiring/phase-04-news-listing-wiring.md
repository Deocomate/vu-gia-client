---
phase: 4
title: "News Listing Wiring"
status: completed
priority: P1
dependencies:
  - 1
---

# Phase 4: News Listing Wiring

## Overview

Wire `/tin-tuc` to real news data with category filter and pagination, mirroring Phase 3's
approach for products. `NewsView.jsx` currently holds an inline mock list + client-side
category filter.

## Requirements

- Functional: `NewsView.jsx` fetches real news via
  `publicGet('/news', { status: 'PUBLISHED', newsCategoryId, sortBy: 'publishedAt',
  sortDirection: 'DESC', page, size })`. Category filter options from
  `publicGet('/news-categories')`.
- Functional: pagination UI drives real `page`/`size`, reflects `totalPages`/
  `totalElements`.
- Functional: `NewsCard` (confirmed already correct — links via slug per the old nav plan's
  finding "News flow already works, no change needed") continues to receive real `slug`
  automatically once the list is real; no separate card-routing fix needed here (unlike
  Phase 3's `ProductCard`).
- Non-functional: same searchParams-driven Server-Component-refetch pattern as Phase 3, for
  consistency (shareable/bookmarkable filtered listing URLs).

## Architecture

- `src/app/(main)/tin-tuc/page.jsx`: async Server Component (or thin wrapper reading
  `searchParams`), initial fetch, passes to `NewsView`.
- `src/views/NewsView.jsx`: accepts real news array + category list as props, drops mock
  generation and internal-only filter state; filter changes update `searchParams`.

## Related Code Files

- Modify: `src/app/(main)/tin-tuc/page.jsx`, `src/views/NewsView.jsx`
- Not modified: `src/components/news/NewsCard.jsx` (already correct per prior nav-plan
  audit — no routing change needed, only real data flowing through it)

## Implementation Steps

1. Audit `NewsView.jsx`'s current filter/pagination mechanism and `"use client"` status.
2. Wire `/tin-tuc` listing: category filter from real `news-categories`, news grid from
   real paginated news, pagination controls driving real `page`/`size`.
3. Manual check: change category filter → grid updates + URL reflects filter; click any
   card → lands on the correct real news detail page (`tin-tuc/[slug]`, already wired).

## Success Criteria

- [ ] `/tin-tuc` renders real, filterable, paginated news data — zero mock array left in
      `NewsView.jsx`.
- [ ] Category filter options are real `NewsCategory` rows.
- [ ] Filter/sort/pagination state round-trips through the URL.
- [ ] `NewsCard` requires no code change (data-only fix) — confirmed via `git diff`.

## Risk Assessment

- **Risk:** `viewCount` auto-increments on every `GET /news/slug/{slug}` per the backend
  contract — repeated dev-time reloads inflate view counts on seeded articles.
  **Mitigation:** not a bug to fix (existing backend behavior, already true for the
  already-wired `tin-tuc/[slug]`), just note it so QA doesn't misread inflated counts as a
  defect.
- **Risk:** duplicating Phase 3's searchParams pattern inconsistently. **Mitigation:**
  implement this phase after Phase 3 lands so the same helper/convention (if one emerges,
  e.g. a small `useListingSearchParams` hook) can be reused rather than re-invented — if
  Phase 3 didn't produce a reusable helper, keep both implementations parallel/consistent
  in shape rather than force an abstraction (YAGNI: only extract a shared hook if a third
  listing page needs the same pattern).
