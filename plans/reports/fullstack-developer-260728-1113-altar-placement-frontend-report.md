# Phase 2 Frontend Report — Placement geometry, drag primitive, admin editor

Plan: `plans/260728-1016-altar-customizer-full-build/phase-02-placement-model-and-admin-drag-drop-editor.md`
Scope: frontend only (admin). Backend (`vu-gia-backend-api/`) not touched — parallel agent's scope.

## Files created

- `src/shared/components/altar/altar-surface-geometry.js` — pure geometry module (single source
  of truth). Exports: `isValidSurfaceRect`, `clampToSurface`, `surfaceToPixelRect`,
  `itemBottomCenterPx`, `itemWidthPx`, `autoZIndex`, `pixelToSurfaceFraction` (the px→fraction
  inverse the drag primitive needs). Malformed-rect / non-positive-dimension inputs return `null`
  (documented policy in the file header), never throw — chosen so mid-render "image not loaded
  yet" states don't need a try/catch at every call site.
- `src/shared/components/altar/altar-surface-geometry.test.js` — 21 unit tests (vitest): px
  mapping at known values, cm-scaling proportionality across two `surfaceWidthCm`s, `scaleAdjust`
  multiplier, `autoZIndex` ordering + explicit-override-wins + `zIndexOverride: 0` edge case,
  rejection of malformed rects (left>=right, top>=bottom, out-of-range, non-finite), clamp, and
  the px↔fraction round trip.
- `src/shared/components/altar/altar-draggable-item.jsx` — presentation-only pointer/keyboard drag
  primitive. Native Pointer Events (`onPointerDown/Move/Up/Cancel` + `setPointerCapture`),
  `touch-action:none`, arrow-key nudge (0.5% / Shift = 5%), `tabIndex`/`role="button"`/
  `aria-label`. Takes `getSurfaceRectPx` as a *function* (not a static rect) so it always reads
  the backdrop image's current on-screen size at drag time. No fetch/product knowledge — reusable
  as-is by Phase 3/4 per the plan's instruction.
- `src/features/admin/products/altar-placement-editor.jsx` — modal orchestration: fetches
  `/altar-models` (`size:100`) + the existing placement (404→null), owns save/remove/validation,
  composes the two components below. Backdrop model/size selection is local UI state only, never
  included in the PUT payload (re-verified against the plan's "authoring-only" non-functional
  requirement).
- `src/features/admin/products/altar-placement-canvas.jsx` — presentational backdrop + surface-rect
  outline + optional grid + draggable overlay item, driven entirely by props (no network calls).
- `src/features/admin/products/altar-placement-controls.jsx` — right-column form: backdrop
  selects, grid/snap toggles, overlay upload (`ImageField` w/ `folder="altar-overlays"`),
  `widthCm` input with live "≈ N%" readout, `scaleAdjust` range slider (0.1–5), flip toggle,
  nullable `zIndexOverride` (numeric input + explicit "clear to auto" button).
- `vitest.config.js` — scoped to `src/**/*.test.js`, `environment: "node"` (no jsdom needed; the
  only tested module is DOM-free pure math). Needed because the repo root has an unrelated
  `e2e-verification.spec.js` (Playwright) that vitest would otherwise try to collect and fail on
  (`Cannot find module '@playwright/test'`).

## Files modified

- `package.json` — added `devDependencies.vitest ^4.1.10` and `"test": "vitest run"` script.
  `package-lock.json` updated by `npm install` accordingly.
- `src/shared/components/admin/inputs/sortable-image-gallery.jsx` — `SortableImage` gained an
  optional centered-top "Vị trí trên bàn thờ" `MapPin` button (green/filled when a placement
  exists, gray/outline otherwise, `title` communicates state incl. the create-mode disabled hint).
  New props on `SortableImageGallery`: `onEditPlacement`, `placementDisabled`, `placementMap`
  (all optional — omitting `onEditPlacement` keeps the component's exact prior behavior, so no
  other caller of this shared component is affected).
- `src/features/admin/products/ProductGalleryManager.jsx` — in `mode="edit"`, fetches placement
  existence for every image on mount/image-set-change (keyed by a stable joined-ids string to
  avoid refetch loops from array-reference churn), renders `AltarPlacementEditor` when an image is
  selected, updates `placementMap` optimistically from `onSaved`/`onRemoved` instead of
  refetching. In `mode="create"` passes `onEditPlacement={() => {}}` + `placementDisabled` so the
  button renders disabled with the "Lưu sản phẩm trước" title, per the phase file.

## Test setup decision

**vitest**, not the Node `assert` fallback. `npm install -D vitest` succeeded cleanly (16s, no
peer-dep conflicts, no other test runner present under a different name) and the module under
test has zero DOM dependency, so no jsdom/React plugin was needed — kept the config to the
minimum (`include`, `environment: "node"`). Not wired into `next build`/CI, exactly as scoped.

## Test / build / lint results

- `npm run test` → 21/21 passed.
- `npm run lint` → clean, no errors/warnings.
- `npm run build` → succeeds (`next build --turbopack`), all 47 routes generated, no type or
  build errors. `/admin/products/[id]` (where the gallery + new editor live) builds fine.

## Exact request/response fields sent/expected (cross-check against backend DTOs)

- `GET /altar-models?size=100` → expects `{ content: [{ id, name, isActive, sizes: [{ id, label,
  backgroundImage, surfaceLeft, surfaceTop, surfaceRight, surfaceBottom, surfaceWidthCm,
  isActive }] }] }` (matches `AltarModelResponse`/`AltarModelSizeResponse` — read the backend DTO
  source directly to confirm field names before backend agent's work is cross-checked).
- `GET /products/{productId}/images/{imageId}/placement` → expects `{ overlayImage, defaultX,
  defaultY, widthCm, scaleAdjust, zIndexOverride, flippable }` (plus `id`/`productImageId`/
  `createdAt`/`updatedAt`, unused by the editor) on 200; treats any 404 as "no placement yet"
  (`AdminApiError.status === 404`).
- `PUT /products/{productId}/images/{imageId}/placement` body sent: `{ overlayImage: string,
  defaultX: number[0,1], defaultY: number[0,1], widthCm: number>0, scaleAdjust: number[0.1,5],
  zIndexOverride: number|null, flippable: boolean }` — exact match to the plan's documented
  request contract.
- `DELETE /products/{productId}/images/{imageId}/placement` — no body.
- Overlay upload: `uploadOne(file, "altar-overlays")` → `POST /media/upload` with
  `folder=altar-overlays` (existing shared pipeline, unmodified).

`src/shared/api/admin-api.js` needed **no changes** — `adminApi.get/put/delete` are generic
path-based wrappers and already cover the nested placement path with no special-casing required
(verified by reading the file; confirms the phase file's "nothing structural" expectation).

## Deviations from the phase file's literal file list

- The phase file's "Modify" list names only `ProductGalleryManager.jsx`, but the task's own Step 1
  instructions explicitly point at `sortable-image-gallery.jsx` as where per-image action buttons
  actually render, and say to add alongside them rather than fork the component. I modified
  `sortable-image-gallery.jsx` accordingly (additively — new props are all optional, existing
  callers/behavior unchanged) since that's structurally where the button/badge had to live.
- Split the editor into three files (`altar-placement-editor.jsx` orchestration +
  `altar-placement-canvas.jsx` + `altar-placement-controls.jsx`) instead of one large modal, per
  this project's 200-line-file modularization guidance. Only `altar-placement-editor.jsx` is
  listed in the phase file; the other two are private implementation detail of that feature, not
  imported by anything outside `features/admin/products/`.

## Risks / notes for the backend cross-check

- Assumed `GET /altar-models` is the existing paginated search endpoint (`AltarModelSearchRequest`
  default `size=10`) — passed `size: 100` to get effectively "all" models for the backdrop picker.
  If the real catalog ever exceeds 100 active models this silently truncates the dropdown; not a
  realistic near-term risk for this admin tool, flagging per YAGNI rather than adding pagination
  UI now.
- The editor's "existing placement" fetch and `ProductGalleryManager`'s per-image badge fetch both
  hit the *same* public GET endpoint independently (one for the modal being opened, one for every
  gallery thumbnail) — acceptable N+1 for an admin-only, low-image-count gallery; flagged as a
  known non-issue rather than a TODO.
- Could not integration-test against a live backend (parallel phase, DTOs not necessarily built
  yet) — verification here is static (unit tests for the geometry module + lint + build) only, per
  the task's own constraint.

`widthCm` is typed `Integer` on the backend entity; the numeric input had no `step` restriction,
so a pasted decimal was possible — fixed by rounding (`Math.round`) in `save()` before building
the PUT payload.

Status: DONE
Summary: Built the shared geometry module (with real vitest unit tests), the pointer/keyboard drag primitive, the three-file admin placement editor, and wired a per-image "Vị trí trên bàn thờ" button+badge into the gallery (disabled in create mode). Lint, build, and the new test suite all pass.
Concerns/Blockers: None blocking. Backend DTO field names should be spot-checked against the "Exact request/response fields" section above once the backend agent's work lands, since this was built from the plan's contract without a live API to verify against.
