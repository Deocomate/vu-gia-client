---
name: feedback-altar-canvas-trace-dom-event-flow
description: When reviewing altar-canvas.jsx / altar-draggable-item.jsx interaction claims, trace actual DOM event flow (pointer-events CSS, click bubbling/focus) instead of trusting docblock/plan prose
metadata:
  type: feedback
---

For `src/shared/components/altar/altar-canvas.jsx` and `altar-draggable-item.jsx`, a plan/PR
description claimed "the item's own click handler still fires normally for selection" for the
inner per-item `<img onClick>`. Tracing actual DOM behavior showed this was false: that `<img>`
has `className="pointer-events-none ..."`, so the browser's hit-test skips it entirely and the
`onClick` (with its `event.stopPropagation()`) never fires. The click instead lands on the
`AltarDraggableItem` wrapper `<div>` (no `onClick` of its own) and bubbles to the canvas
container's `onClick={() => selectItem(null)}` (see [[project-altar-ux-admin-nav-cleanup]] repo),
i.e. clicking an item deselects instead of selects. Selection only sometimes happens via the
`onFocus` handler racing against the click's default focus-shift, and is unreliable/absent on
Safari (which doesn't focus non-form-control elements on click by default).

**Why:** this codebase's altar canvas has several layered pointer/focus/click handlers across
`AltarCanvas` (deselect-on-background-click), `AltarDraggableItem` (pointer capture drag), and
per-item child `<img>` (intended click-to-select) — the interaction between them is not obvious
from reading any single file's docblock, and `pointer-events: none` silently defeats handlers
attached to the element carrying it. This is not caught by the existing vitest suite because there
is no component-level test for `AltarCanvas`/`AltarDraggableItem` (only pure geometry/reducer unit
tests), and jsdom's `fireEvent.click(node)` (if such a test were written naively) would dispatch
directly on the target node without emulating real hit-testing, so it would NOT catch this bug either.

**How to apply:** when a plan/PR claims a specific DOM element "still receives" a click/pointer
event because of sibling/parent wiring, check every ancestor and the element itself for
`pointer-events: none` and for any handler higher in the tree that could intercept the bubbled
event (e.g. a background "click empty space to deselect" handler). Don't accept "it's wired
elsewhere, not gated by the new prop" as proof it fires — verify the event actually reaches that
handler given the full DOM/CSS picture.
