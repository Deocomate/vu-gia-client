"use client";

import { useCallback, useRef } from "react";
import {
  clampToSurface,
  dragToSurfaceFraction,
  itemBottomCenterPx,
} from "@/shared/components/altar/altar-surface-geometry";

const NUDGE_STEP = 0.005; // 0.5% of surface width/height
const NUDGE_STEP_SHIFT = 0.05; // 5% with Shift held

/** Pointer travel (in px, per axis) before a press is treated as a drag rather than a plain
 * select. Without it, the sub-pixel jitter of a normal click would emit a position change (and
 * an undo entry) for an item the user only meant to select. */
const DRAG_THRESHOLD_PX = 3;

const ARROW_DELTA = {
  ArrowLeft: { dx: -1, dy: 0 },
  ArrowRight: { dx: 1, dy: 0 },
  ArrowUp: { dx: 0, dy: -1 },
  ArrowDown: { dx: 0, dy: 1 },
};

/**
 * Presentation-only pointer/keyboard drag primitive for positioning an item within an
 * altar surface rect. Reused unmodified by the admin placement editor, the admin preset
 * builder and the storefront customizer canvas — it does not fetch, persist, or know about
 * placements/products, it only converts pointer/keyboard input into surface-fraction
 * `(x, y)` deltas via `altar-surface-geometry.js` and reports them through `onChange`.
 *
 * Interaction model (direct manipulation — one gesture does everything):
 *   pointerdown → selects this item (`onSelect`), takes pointer capture, focuses the element,
 *                 and records the pointer↔anchor offset so the item does *not* teleport its
 *                 base under the cursor.
 *   pointermove → past `DRAG_THRESHOLD_PX` the press becomes a drag: `onDragStart` fires once,
 *                 then every move emits a clamped `onChange`.
 *   pointerup   → releases capture, `onDragEnd` fires (only if a drag actually happened).
 *
 * Two deliberate details, both of which were previously bugs:
 * - Selection happens on **pointerdown**, never on the trailing `click`. The canvas's inner
 *   `<img>` is `pointer-events: none`, so a click-based selection handler on it never fires,
 *   and relying on the browser's default focus-on-click is unreliable (Safari does not focus
 *   non-form-control elements). Pointerdown also means press-and-drag works in a single
 *   gesture, so an item stays draggable drag after drag.
 * - `event.stopPropagation()` on pointerdown so the canvas container's
 *   "pointerdown on empty space = deselect" handler does not immediately undo the selection
 *   this gesture just made.
 *
 * `getSurfaceRectPx` is a function (not a static value) because the caller's surface
 * rect is derived from a rendered `<img>`'s current on-screen size, which can change
 * between mount and drag (e.g. the image finishes loading, the window resizes, or the
 * canvas is zoomed) — calling it lazily at drag-start time always reads the current size.
 * It must return *viewport* coordinates, since pointer events are reported in that space.
 *
 * `bounds` (optional, `{minX, maxX, minY, maxY}`) is forwarded to `clampToSurface` for both
 * pointer-drag and keyboard-nudge — omit for the original [0,1]-only (tabletop) range, or
 * pass `fullImageSurfaceBounds(rect)` to allow the full background image.
 */
export default function AltarDraggableItem({
  x,
  y,
  onChange,
  getSurfaceRectPx,
  disabled = false,
  bounds,
  style,
  className = "",
  ariaLabel = "Vị trí trên bàn thờ",
  onSelect,
  onDragStart,
  onDragEnd,
  children,
}) {
  const dragState = useRef(null);

  const emitClamped = useCallback(
    (nextX, nextY) => {
      const clamped = clampToSurface(nextX, nextY, bounds);
      onChange?.(clamped.x, clamped.y);
    },
    [bounds, onChange],
  );

  const handlePointerDown = useCallback(
    (event) => {
      if (disabled) return;
      // Keep the canvas container's deselect-on-empty-space handler out of this gesture.
      event.stopPropagation();
      // A second finger landing mid-drag must not re-grab the item with a new offset.
      if (dragState.current) return;
      onSelect?.();
      // Non-primary buttons (right/middle) select but never drag.
      if (event.button > 0) return;

      const surfaceRectPx = getSurfaceRectPx?.();
      const anchorPx = surfaceRectPx ? itemBottomCenterPx({ x, y }, surfaceRectPx) : null;
      // Selection above still stands even without valid geometry (image not laid out yet) —
      // only the drag part is skipped.
      if (!anchorPx) return;

      event.currentTarget.setPointerCapture?.(event.pointerId);
      dragState.current = {
        pointerId: event.pointerId,
        surfaceRectPx,
        // Where inside the item the user grabbed it, relative to its bottom-center anchor.
        grabOffsetPx: { dx: event.clientX - anchorPx.x, dy: event.clientY - anchorPx.y },
        startPx: { x: event.clientX, y: event.clientY },
        moved: false,
      };
      // Suppresses the browser's native image-drag/text-selection, which also suppresses the
      // default focus — so focus explicitly, otherwise arrow-key nudging never works after a click.
      // `preventScroll` because the canvas lives in a scrollable/zoomable panel and focusing an
      // item near its edge would otherwise scroll it under the cursor mid-gesture.
      event.preventDefault();
      event.currentTarget.focus?.({ preventScroll: true });
    },
    [disabled, getSurfaceRectPx, onSelect, x, y],
  );

  const handlePointerMove = useCallback(
    (event) => {
      const drag = dragState.current;
      if (!drag || drag.pointerId !== event.pointerId) return;

      if (!drag.moved) {
        const travelled =
          Math.abs(event.clientX - drag.startPx.x) >= DRAG_THRESHOLD_PX ||
          Math.abs(event.clientY - drag.startPx.y) >= DRAG_THRESHOLD_PX;
        if (!travelled) return;
        drag.moved = true;
        onDragStart?.();
      }

      const next = dragToSurfaceFraction(
        { x: event.clientX, y: event.clientY },
        drag.grabOffsetPx,
        drag.surfaceRectPx,
        bounds,
      );
      if (!next) return;
      emitClamped(next.x, next.y);
    },
    [bounds, emitClamped, onDragStart],
  );

  const endDrag = useCallback(
    (event) => {
      const drag = dragState.current;
      if (!drag || drag.pointerId !== event.pointerId) return;
      // Guarded: `releasePointerCapture` throws when the pointer is no longer captured, which is
      // exactly the case this handler also runs for (`lostpointercapture`).
      if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      dragState.current = null;
      if (drag.moved) onDragEnd?.();
    },
    [onDragEnd],
  );

  const handleKeyDown = useCallback(
    (event) => {
      if (disabled) return;
      const arrow = ARROW_DELTA[event.key];
      if (!arrow) return;

      event.preventDefault();
      const step = event.shiftKey ? NUDGE_STEP_SHIFT : NUDGE_STEP;
      emitClamped(x + arrow.dx * step, y + arrow.dy * step);
    },
    [disabled, emitClamped, x, y],
  );

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      // Safety net: any other way capture can end (element removed/re-keyed, browser gesture
      // takeover) must still clear `dragState`, otherwise the item would refuse every later press.
      onLostPointerCapture={endDrag}
      onKeyDown={handleKeyDown}
      // Keyboard users reach an item with Tab, which must select it too (pointerdown covers
      // the mouse/touch path).
      onFocus={() => !disabled && onSelect?.()}
      className={className}
      style={{ touchAction: "none", ...style }}
    >
      {children}
    </div>
  );
}
