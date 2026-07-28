---
name: project-altar-ux-admin-nav-cleanup
description: Status snapshot of the 260728-1358 altar-ux-admin-nav-cleanup 5-phase plan review (2026-07-28); also notes where plan files actually live in this repo
metadata:
  type: project
---

Plan `plans/260728-1358-altar-ux-admin-nav-cleanup` lives at the **parent repo root**
(`vu-gia-fullstack/plans/...`), not inside `vu-gia-client/plans/` — this repo is a submodule setup
where planning docs for client-scoped work are still authored one level up. When asked to review a
plan and `Glob`/`ls` on `vu-gia-client/plans/<slug>` comes up empty, check
`vu-gia-fullstack/plans/<slug>` before assuming the plan doesn't exist.

This repo also frequently has **multiple plans stacked uncommitted in the working tree at once**
(e.g. `260728-1016-altar-customizer-full-build`, status done-but-uncommitted, underneath this
plan's edits) per explicit user choice (one combined commit at the end). `git diff` against HEAD
mixes both plans' changes — can't isolate this-plan-only diff mechanically; must read final file
state against the specific plan's acceptance criteria instead of diffing.

**Review outcome (2026-07-28):** all 5 phases' acceptance criteria verified against actual code
(not just the implementer's summary) — grid/snap fully removed (zero hits across
`showGrid|snapToGrid|snapEnabled|gridStep|snapFractionToGrid|altHeld|AltarAlignmentGuides|softSnapToAlignment`),
`AltarCanvas` docblock correctly updated, 4 `ROUTES.ADMIN_*` constants + 4 route folders cleanly
removed (zero stale refs), `resourceKey` strings match `adminResources.js` exactly, `npm run
lint`/`build`/`vitest` all independently re-run clean (96 tests, route count -4). Two minor,
non-blocking findings: (1) `Modal`'s `full` size variant still carries the unconditional `border
border-zinc-200 shadow-xl` base classes the plan's own architecture note said were "not needed" at
edge-to-edge — cosmetic only, not a functional regression; (2) `docs/admin-ui-architecture.md` now
has two different headings both numbered "5.1" (pre-existing `## 5.1 Site Settings` plus the new
`### 5.1 Sidebar grouping`) — should renumber, not a content-accuracy issue. Also: Phase 2's own
plan text names `vu-gia-backend-api/docs/RUN_AND_SEED.md` as a file to check/fix — that file does
not exist in the repo (confirmed via `find`), so the plan's own file-path claim was stale; the
`.env.example` CORS-comment fix was still applied correctly independent of that.
