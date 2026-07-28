"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import AltarDraggableItem from "@/shared/components/altar/altar-draggable-item";
import { formatImageUrl } from "@/shared/api/media";
import {
  autoZIndex,
  fullImageSurfaceBounds,
  itemBottomCenterPx,
  itemWidthPx,
  surfaceToPixelRect,
} from "@/shared/components/altar/altar-surface-geometry";

/**
 * Shared, presentation-only multi-item altar canvas — the single implementation of "drag items
 * around an altar backdrop" reused by Phase 3's admin preset builder and Phase 4's storefront
 * customizer (see the Phase 3 plan's "Sequencing note": whichever phase lands first owns this
 * file). No fetch calls, no persistence — the consumer owns all data loading/saving.
 *
 * Prop contract (fixed, do not narrow for one consumer's convenience):
 *   size       — an altar-model-size-shaped object: `{ backgroundImage, surfaceLeft, surfaceTop,
 *                surfaceRight, surfaceBottom, surfaceWidthCm, ... }` (see `altar-surface-geometry.js`
 *                for the exact coordinate contract this is read against).
 *   items      — array of placed items. Duck-typed on purpose (the preset builder's canvas items
 *                and Phase 4's reducer items won't share one exported type), but every item must
 *                expose:
 *                  id-ish:  `instanceId` (preferred) or `id` — whichever is present identifies the
 *                           item across renders/updates; see `resolveItemId`.
 *                  image:   `overlayImage`, `thumb`, or `image` (checked in that order) — the PNG
 *                           rendered on the canvas; see `resolveItemImage`.
 *                  position: `x`, `y` — surface-fraction bottom-center anchor (see geometry module).
 *                  size:    `widthCm`, optional `scaleAdjust` (default 1) — real-world width driving
 *                           the on-screen px size relative to `size.surfaceWidthCm`.
 *                  stacking: optional `zIndexOverride` — `null`/absent falls back to auto-z from `y`.
 *                  orientation: optional `flipped` (or `flip`) boolean — mirrors the image horizontally.
 *   onChange   — `(nextItems) => void`, called with the *entire* updated `items` array on every
 *                drag/nudge; only the moved item's `x`/`y` differ, matched by `resolveItemId`.
 *   readOnly   — when true, items render statically (no drag affordances, no pointer handlers,
 *                no selection wiring) — used for read-only previews.
 *
 * Additive props (not in the original 6-prop contract, but backward compatible — safe defaults,
 * consumers that don't pass them get the exact original behavior):
 *   selectedId        — controlled selection: which item's `resolveItemId(item)` is selected.
 *   onSelect          — `(id | null) => void`. When `selectedId`/`onSelect` are both omitted, the
 *                       component falls back to internal state so a caller that doesn't care about
 *                       selection (e.g. a first pass at Phase 4) doesn't have to wire it up.
 *
 * Interaction model: pressing an item selects it *and* starts its drag in one gesture (see
 * `altar-draggable-item.jsx`); pressing empty canvas/backdrop deselects. Selection is never a
 * precondition for dragging — an item stays draggable press after press.
 */

/** Z-index a dragged item is forced to — comfortably above any `autoZIndex` value
 * (bounded ~1000 from `y`, or a manually bring-to-front `zIndexOverride`). */
const DRAGGING_Z_INDEX = 1_000_000;

/** An item's stable identity across renders — `instanceId` (canvas-local) wins over `id` (DB id). */
export function resolveItemId(item) {
  return item?.instanceId ?? item?.id ?? null;
}

/** The PNG actually rendered on the canvas — an altar placement's cutout, never the catalog thumb
 * unless that's all the caller has (e.g. a not-yet-placement-backed preview). */
export function resolveItemImage(item) {
  return item?.overlayImage || item?.thumb || item?.image || "";
}

/** Accepts either `flipped` or `flip` — different consumers have used both names historically. */
export function resolveItemFlipped(item) {
  return Boolean(item?.flipped ?? item?.flip);
}

/**
 * Stacking order as an array: auto-z rule from `altar-surface-geometry.js` (explicit
 * `zIndexOverride` wins, otherwise larger `y` paints on top). Returned as a new array, ordered
 * back-to-front — used by consumers that paint sequentially (the export composer). The canvas
 * itself must NOT render in this order; see `stackingOrderById`.
 */
export function sortItemsByZIndex(items) {
  return [...(items || [])].sort((a, b) => autoZIndex(a) - autoZIndex(b));
}

/**
 * The same back-to-front order, but expressed as `Map<itemId, cssZIndex>` (ranks `1..n`) so the
 * canvas can render items in a **stable DOM order** and still stack them correctly.
 *
 * Rendering in `sortItemsByZIndex` order instead is what made dragging stutter with two or more
 * items placed: an item's rank is derived from its live `y`, so every time the dragged item
 * crossed a neighbour's depth the sorted array permuted, React re-keyed the list and *moved the
 * DOM node mid-gesture* — the very node holding pointer capture and focus. One item never
 * permutes, which is why the jank only ever showed up from the second item onwards.
 *
 * Ranks also solve the negative-z problem `renderZIndex` handles elsewhere (an item above the
 * tabletop has a negative `autoZIndex`, and a negative CSS z-index paints behind the backdrop
 * `<img>`): rank `1` is the bottom-most item, never below the backdrop. Ties are impossible —
 * equal `autoZIndex` values keep their input order via the stable sort and get distinct ranks.
 */
export function stackingOrderById(items) {
  const ranks = new Map();
  sortItemsByZIndex(items).forEach((item, index) => ranks.set(resolveItemId(item), index + 1));
  return ranks;
}

/** Pure update: returns `items` with the id-matched item's `x`/`y` replaced. No-op (same
 * reference semantics aside) if `id` matches nothing, so a stale drag callback can't corrupt state. */
export function applyItemPositionUpdate(items, id, x, y) {
  return (items || []).map((item) => (resolveItemId(item) === id ? { ...item, x, y } : item));
}

export default function AltarCanvas({
  size,
  items,
  onChange,
  readOnly = false,
  selectedId: selectedIdProp,
  onSelect,
}) {
  const imgRef = useRef(null);
  const [renderedSize, setRenderedSize] = useState(null);
  const [internalSelectedId, setInternalSelectedId] = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const selectedId = selectedIdProp !== undefined ? selectedIdProp : internalSelectedId;

  const selectItem = useCallback(
    (id) => {
      if (onSelect) onSelect(id);
      else setInternalSelectedId(id);
    },
    [onSelect],
  );

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return undefined;
    const update = () => setRenderedSize({ w: el.clientWidth, h: el.clientHeight });
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [size?.backgroundImage]);

  const getSurfaceRectPxViewport = useCallback(() => {
    if (!imgRef.current || !size) return null;
    const rect = imgRef.current.getBoundingClientRect();
    const local = surfaceToPixelRect(size, rect.width, rect.height);
    if (!local) return null;
    return { left: rect.left + local.left, top: rect.top + local.top, width: local.width, height: local.height };
  }, [size]);

  const handleItemPositionChange = useCallback(
    (id, nextX, nextY) => {
      onChange?.(applyItemPositionUpdate(items, id, nextX, nextY));
    },
    [items, onChange],
  );

  if (!size) {
    return (
      <div className="flex aspect-video items-center justify-center border border-dashed border-zinc-300 text-sm text-zinc-400">
        Chọn kích thước bàn thờ để xem trước.
      </div>
    );
  }

  const localSurfaceRectPx = renderedSize ? surfaceToPixelRect(size, renderedSize.w, renderedSize.h) : null;
  const fullImageBounds = fullImageSurfaceBounds(size);
  // Depth lives in this map, never in the DOM order below — see `stackingOrderById`.
  const stackRanks = stackingOrderById(items);

  return (
    // Deselect fires on pointerdown, not click: a click's target is the common ancestor of its
    // press and release, so releasing a drag over the backdrop produced a click on this container
    // and silently deselected the item that was just moved. Pointerdown has no such ambiguity —
    // `AltarDraggableItem` stops propagation for presses that land on an item.
    <div
      className="relative select-none border border-zinc-200 bg-zinc-100"
      onPointerDown={() => !readOnly && selectItem(null)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={formatImageUrl(size.backgroundImage)}
        alt="Ảnh nền bàn thờ"
        className="block w-full"
        draggable={false}
      />

      {/* Rendered in `items` order — the caller's stable insertion order — on purpose. Anything
          derived from a *changing* item field (like depth) must never drive DOM order, or React
          reorders live nodes while the user is dragging one of them. */}
      {localSurfaceRectPx &&
        (items || []).map((item) => {
          const id = resolveItemId(item);
          const image = resolveItemImage(item);
          const anchorPx = itemBottomCenterPx(item, localSurfaceRectPx);
          if (!anchorPx || !image) return null;

          const widthPxValue = itemWidthPx(item, localSurfaceRectPx, size.surfaceWidthCm);
          const flipped = resolveItemFlipped(item);
          const isSelected = !readOnly && selectedId === id;
          const isDragging = !readOnly && draggingId === id;

          // While actively being dragged, an item always paints above every other item,
          // overriding the normal y-derived depth order — otherwise dragging it across the
          // surface makes it repeatedly swap in front of/behind sibling items as its own z-index
          // recalculates live from its changing y, which reads as chaotic with many items placed.
          // Scoped to the drag gesture only (not the whole selected lifetime) so bring-to-front/
          // send-to-back stay immediately visible once the user lets go.
          const style = {
            left: anchorPx.x,
            top: anchorPx.y,
            width: widthPxValue || undefined,
            transform: `translate(-50%, -100%)${flipped ? " scaleX(-1)" : ""}`,
            zIndex: isDragging ? DRAGGING_Z_INDEX : (stackRanks.get(id) ?? 1),
          };

          if (readOnly) {
            return (
              <div key={id ?? image} className="absolute" style={style}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={formatImageUrl(image)} alt="" className="pointer-events-none block w-full" draggable={false} />
              </div>
            );
          }

          return (
            <AltarDraggableItem
              key={id}
              x={item.x}
              y={item.y}
              onChange={(nextX, nextY) => handleItemPositionChange(id, nextX, nextY)}
              getSurfaceRectPx={getSurfaceRectPxViewport}
              bounds={fullImageBounds}
              onSelect={() => selectItem(id)}
              onDragStart={() => setDraggingId(id)}
              onDragEnd={() => setDraggingId((current) => (current === id ? null : current))}
              ariaLabel={resolveItemImage(item) ? "Vị trí vật phẩm trên bàn thờ" : undefined}
              className={`absolute cursor-grab touch-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-sky-500 active:cursor-grabbing ${
                isSelected ? "outline outline-2 outline-offset-2 outline-sky-500" : ""
              }`}
              style={style}
            >
              {/* `pointer-events-none` on purpose: every pointer interaction (select + drag) is
                  owned by the `AltarDraggableItem` wrapper, so the image must never be a hit
                  target of its own. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={formatImageUrl(image)} alt="" className="pointer-events-none block w-full" draggable={false} />
            </AltarDraggableItem>
          );
        })}
    </div>
  );
}
