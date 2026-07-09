---
title: "Custom Feedback Popups (Toast + Confirm)"
description: "Replace native alert/confirm with brand-styled Sonner toasts + promise-based confirm dialogs; unify admin ConfirmDialog in the same cook."
status: completed
priority: P1
branch: "main"
tags: [frontend, ux, toast, dialog, a11y, nextjs]
blockedBy: []
blocks: []
created: "2026-07-09T13:43:40.132Z"
createdBy: "ck:plan"
source: skill
---

# Custom Feedback Popups (Toast + Confirm)

## Overview

Native `alert()` / `confirm()` (~27 call sites) break brand UX. Build a public
feedback system:

1. **Sonner toasts** — success / error / info / warning, brand-themed
2. **Promise-based confirm dialog** — destructive deletes & cancel-order
3. **Facade** `@/utils/feedback` — single import for all call sites
4. **Admin unification** — shared confirm primitive + AdminShell Toaster (in cook)

Scope mode: **EXPANSION** (user chose A).

## Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Toast library | **Sonner** | A11y, stacking, swipe, `toast.promise`; Next App Router friendly |
| Confirm | **Custom + Zustand** | Brand modal; admin zinc dialog is wrong palette |
| API | Facade `toast` + `await confirm()` | Call sites stay simple; swap-friendly |
| Mount | `PublicLayout` Toaster + ConfirmHost | Covers (main)/(shop)/(user)/(policies) |
| Admin | Phase 4 **in same cook** (Validation Session 1) | Unify confirm primitive + mount admin Toaster |
| Add-to-cart UX | Toast success → navigate `/gio-hang` | Keep current flow (Validation Session 1) |
| Checkout success | Short toast title + description | No multi-line order dump (Validation Session 1) |
| Toast position | `top-center` | Brand + mobile (Validation Session 1) |

## Phases

| Phase | Name | Status |
|-------|------|--------|
| 1 | [Feedback System Core](./phase-01-feedback-system-core.md) | Done |
| 2 | [Replace Public Alerts](./phase-02-replace-public-alerts.md) | Done |
| 3 | [Confirm Dialogs + A11y](./phase-03-confirm-dialogs-a11y.md) | Done |
| 4 | [Admin Unification](./phase-04-admin-unification-stretch.md) | Done |

## Dependencies

- Phase 2 depends on Phase 1
- Phase 3 depends on Phase 1 (can parallel Phase 2 after core mounts)
- Phase 4 depends on Phase 3; **included in cook** (Validation Session 1 — was stretch, now required)
- **Cross-plan note:** navigation plan `260709-2006-user-flow-navigation-linking` Phase 3/4 acceptance still says native `alert()`. Phase 2 of this plan must amend those criteria to `toast.*` / `confirm()`. Plans may cook in either order; if navigation cooks first, feedback Phase 2 still replaces the alerts.

## Acceptance Criteria

- [x] Zero native `alert(` / `confirm(` in `src/views/**` and public `src/components/**`
- [x] Admin ConfirmDialog uses shared base (zinc theme); AdminShell mounts Toaster
- [x] `toast.success|error|info|warning` work from any client component under PublicLayout
- [x] `await confirm({...})` returns boolean; Escape / backdrop / cancel → `false`
- [x] Brand tokens used (`primary`, `success`, `sale`); no generic browser chrome
- [x] Focus trap + `role="alertdialog"` on confirm; toasts use Sonner a11y defaults
- [x] Navigation plan Phase 3 criteria updated to reference toast/confirm (not alert)
- [x] `npm run lint` and `npm run build` pass

## Constraints

- Prefer Sonner over reinventing toast queue (YAGNI on custom toast store)
- Do not add shadcn CLI / Radix unless already in repo (not present)
- Keep Vietnamese copy; do not change message meaning
- No plan IDs in code comments

## Research / Scout

- `plans/reports/research-toast-dialog-libs.md`
- `plans/reports/scout-alert-call-sites.md`

## Open Questions

None — validation Session 1 closed remaining UX/scope questions.

## Validation Log

### Session 1 — 2026-07-09
**Trigger:** `/ck:plan validate` after red-team  
**Questions asked:** 4

#### Questions & Answers

1. **[Scope]** Phase 4 (Admin Unification Stretch) — include in cook?
   - Options: A Skip 1–3 only | B Include Phase 4 in same cook | C Keep pending after 1–3
   - **Answer:** B — Include Phase 4 in the same cook
   - **Rationale:** Expansion scope; admin confirm reuse ships with public system

2. **[UX]** Add-to-cart feedback after toast?
   - Options: A Toast → navigate cart | B Stay + "Xem giỏ" action | C Both toast action + navigate
   - **Answer:** A — Keep toast success → navigate to cart
   - **Rationale:** Matches current ProductInfo behavior; no stay-on-page change

3. **[UX]** Checkout success toast content?
   - Options: A Short title+description | B Short + name/total | C Modal then redirect
   - **Answer:** A — Short: “Đặt hàng thành công!” + “Vui lòng đợi phản hồi…”
   - **Rationale:** Avoid multi-line toast; details live on orders page

4. **[UI]** Toast position?
   - Options: A top-center | B top-right | C bottom-center
   - **Answer:** A — `top-center`
   - **Rationale:** Brand-friendly, readable on mobile

#### Confirmed Decisions
- Phase 4: **in cook** (no longer skippable stretch)
- Add-to-cart: toast → `ROUTES.CART` (no "Xem giỏ" action required)
- Checkout success: short toast only
- Toaster position: `top-center`

#### Action Items
- [x] Propagate Phase 4 priority/requirements to in-scope
- [x] Phase 2: drop mandatory "Xem giỏ" action; keep navigate
- [x] Phase 1: lock `top-center` as validated decision
- [x] Phase 1 Double-Toaster risk: Phase 4 mounts admin Toaster in AdminShell only (not root)

#### Impact on Phases
- Phase 1: position locked; note admin Toaster comes in Phase 4
- Phase 2: add-to-cart = toast + push; no action button
- Phase 3: unchanged
- Phase 4: P2, required in cook; remove "skippable" language

### Verification Results
- Claims checked: 5
- Verified: 5 | Failed: 0 | Unverified: 0
- Tier: Standard (light — red-team already present)
- Failures: none

### Whole-Plan Consistency Sweep
- Re-read plan.md + phases 1–4 after Session 1 propagation.
- Phase 4 no longer described as optional/skippable anywhere.
- Add-to-cart "Xem giỏ" action removed as requirement; navigate kept.
- Checkout short toast + `top-center` consistent across plan + Phase 1/2.
- Unresolved contradictions: **NONE**.

## Red Team Review

### Session — 2026-07-09
**Findings:** 6 (4 accepted, 2 rejected)  
**Severity breakdown:** 0 Critical, 3 High, 3 Medium  
**Note:** Subagent reviewers unavailable (API limit); controller ran evidence-backed adversarial pass (Security / Failure / Assumption lenses).

| # | Finding | Severity | Disposition | Applied To |
|---|---------|----------|-------------|------------|
| 1 | Checkout multi-line `\n` alert unfit for toast title | High | Accept | Phase 2 |
| 2 | Missing Sonner CSS import step | High | Accept | Phase 1 |
| 3 | Toast + immediate `router.push` flash risk | Medium | Accept (mitigated) | Phase 2 |
| 4 | Async `confirm` + non-awaited child `onClick` | Medium | Reject | — (fire-and-forget OK; documented) |
| 5 | PublicLayout server→client mount assumed broken | Medium | Reject | — (Next.js pattern; 4 route groups already do this) |
| 6 | Double-open confirm race on rapid clicks | High | Accept | Phase 3 (already + clarified) |

### Whole-Plan Consistency Sweep
- Re-read `plan.md` + phases 1–4 after edits.
- Checkout success copy strategy unified (title + short description).
- Sonner CSS import added to Phase 1 steps.
- Cross-plan note remains soft (no hard `blockedBy`).
- Phase 4 later promoted to in-cook via Validation Session 1 (see Validation Log).
- Unresolved contradictions: **NONE**.
