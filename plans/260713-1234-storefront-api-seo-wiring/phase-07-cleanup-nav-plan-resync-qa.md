---
phase: 7
title: "Cleanup & Nav-Plan Resync QA"
status: completed
priority: P1
dependencies:
  - 2
  - 3
  - 4
  - 5
  - 6
---

# Phase 7: Cleanup & Nav-Plan Resync QA

## Overview

Remove dead mock-data code, resync `260709-2006-user-flow-navigation-linking`'s frontmatter
and phase files (this plan absorbed its "ProductCard Routing" phase), run the full manual
QA matrix across every page touched, and gate on lint/build.

## Requirements

- Functional: `grep -rn` for any remaining unused mock consts (`GALLERY_IMAGES`, `FAQ_DATA`,
  inline product/news/banner/showroom arrays) across every file touched in Phases 2-5 —
  confirm zero remain.
- Functional: `260709-2006-user-flow-navigation-linking/plan.md` updated — remove Phase 2
  ("ProductCard Routing") from its phase table, renumber remaining phases (old 3→2 Shopping
  Flow Actions, old 4→3 Cart State Store), update the `Dependencies` section (old Phase 3's
  dependency on old Phase 4 becomes new Phase 2's dependency on new Phase 3), update
  Acceptance Criteria to drop the ProductCard-routing bullet (now satisfied by this plan),
  add a note in that plan's Validation Log documenting the split.
  <!-- Updated: Validation Session 1 - bidirectional `blockedBy`/`blocks` frontmatter was
  already added to both plans at plan-creation time (this plan: `blocks:
  [260709-2006-user-flow-navigation-linking]`; nav plan: `blockedBy:
  [260713-1234-storefront-api-seo-wiring]`) plus a pending-resync note in the nav plan's
  body. This step just verifies that frontmatter is still accurate after the resync edits,
  not adding it fresh. -->
  <!-- Updated: Validation Session 1 - `src/stores/cartStore.js` was found to already be a
  complete, real, persisted store (`addItem`/`updateQuantity`/`removeItem`/`clearCart`/
  `totalCount`/`subtotal`), already consumed by `Header.jsx` and `CartView.jsx`, despite the
  nav plan's Phase 4 ("Cart State Store") still being marked `pending`. Before renumbering,
  check whether old Phase 4 (new Phase 3 after renumbering) is actually already done —
  if so, mark it `completed` in that plan rather than leaving it as pending future work,
  and check whether old Phase 3 ("Shopping Flow Actions", new Phase 2) is also partially
  done given the real store already exists. -->
- Functional: `phase-02-productcard-routing.md` in the nav plan's directory — mark
  superseded (either delete with a note in plan.md pointing to this plan's Phase 3, or keep
  the file with a `status: superseded` frontmatter field and a one-line pointer — prefer
  keeping+marking over deleting, so history isn't lost).
- Non-functional: `npm run lint` and `npm run build` pass with no new warnings across the
  whole plan's changes.

## Architecture

No new components — subtractive (mock cleanup) + cross-plan doc sync + verification only.

## Related Code Files

- Modify: every file touched in Phases 2-5 (mock-const removal verification pass)
- Modify: `vu-gia-client/plans/260709-2006-user-flow-navigation-linking/plan.md`,
  `phase-02-productcard-routing.md`
- Modify: this plan's own `plan.md` (`blocks` frontmatter already present — verify only)
- Read: `docs/system-architecture.md`, `docs/project-roadmap.md` — update only if either
  currently claims storefront pages are mock/static (check first, don't add changelog noise
  if they don't mention it)

## Implementation Steps

1. `grep -rn` across all Phase 2-5 touched files for leftover unused mock consts/arrays;
   delete any found.
2. Update `260709-2006`'s `plan.md`: remove old Phase 2 from the phase table, renumber,
   fix `Dependencies` section, trim Acceptance Criteria, add Validation Log entry
   documenting the split. Check whether old Phase 4 (Cart State Store) is actually already
   implemented (per Validation Session 1's finding that `cartStore.js` already exists and
   is real) and mark it `completed` if so, rather than leaving stale `pending` status.
3. Mark `260709-2006/phase-02-productcard-routing.md` as superseded (frontmatter +
   one-line body note pointing to this plan's Phase 3), or use `ck plan uncheck`/manual
   frontmatter edit consistent with however the CLI represents a dropped phase.
4. Verify both plans' `blockedBy`/`blocks` frontmatter (added at plan-creation time) is
   still accurate after the renumbering.
5. Run the full manual QA matrix: every page from Phases 2-6 loads with real data (or a
   graceful empty state), every internal link (ProductCard, NewsCard, category filters,
   pagination) navigates correctly, contact/newsletter forms submit successfully,
   `/sitemap.xml` and `/robots.txt` load, spot-check page source for one product/news
   detail confirms real metadata + JSON-LD.
6. `npm run lint` then `npm run build`; fix any fallout.
7. Check `docs/system-architecture.md`/`docs/project-roadmap.md` for stale "mock data"
   claims; update only if present.

## Success Criteria

- [ ] Zero unused mock-data consts remain in any file touched by this plan.
- [ ] `260709-2006-user-flow-navigation-linking`'s plan.md + phase files accurately reflect
      the absorbed scope (no duplicate "ProductCard Routing" phase remains active there).
- [ ] Both plans' frontmatter cross-reference each other (`blockedBy`/`blocks`).
- [ ] Full manual QA matrix passes across every page in Phases 2-6.
- [ ] `npm run lint` and `npm run build` both pass with no new warnings.
- [ ] Docs updated only if they contained stale mock-data claims (confirmed absent = no
      change needed, noted as such).

## Risk Assessment

- **Risk:** resyncing the nav plan's phase numbering breaks any already-hydrated Claude
  Tasks referencing old phase IDs. **Mitigation:** since that plan's status is still
  "pending" (no work started), no in-flight task references exist yet — safe to renumber
  now; would need more care if the nav plan were already mid-implementation.
- **Risk:** QA matrix is large (6+ pages, multiple entities) and easy to under-test.
  **Mitigation:** structure the QA pass as one row per page from Phases 2-6, mirroring the
  block-builder plan's Phase 4 QA-matrix approach that worked well there.
