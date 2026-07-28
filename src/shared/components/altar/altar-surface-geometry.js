/**
 * Single source of truth for every altar-canvas render calculation: surface-rect → px,
 * cm → px scaling, and z-ordering. Imported (never re-derived) by the Phase 2 admin
 * placement editor, the Phase 3 preset builder, the Phase 4 storefront canvas, and the
 * Phase 5 export pipeline — see the phase plan's "Geometry drift" risk. Pure functions
 * only, no React/DOM dependency, so this module is safely unit-testable in plain Node.
 *
 * Coordinate contract (matches the backend's `AltarModelSizeEntity`/`AltarPlacementEntity`):
 * - `surfaceLeft/Top/Right/Bottom` are fractions [0,1] of the *background image's own*
 *   width/height, with `left < right` and `top < bottom`. They describe the rectangle on
 *   the backdrop image where placed items *default to sitting* ("the tabletop").
 * - `(x, y)` is an item's position as a fraction *within that surface rect*, using a
 *   bottom-center anchor (the item's visual base sits at `(x, y)`). Historically clamped to
 *   [0,1] (strictly inside the tabletop); by user decision this is now allowed to range
 *   outside [0,1] up to whatever `fullImageSurfaceBounds` computes for the given rect, so an
 *   item can be dragged anywhere on the *full background image*, not just the tabletop —
 *   see `fullImageSurfaceBounds`'s own docblock. The backend mirrors this with a generous
 *   static bound (not a per-size-exact one — Bean Validation can't look up a size's rect),
 *   see `AltarPlacementRequest`/`AltarPresetItemRequest`/`AltarDesignServiceImpl`.
 * - `widthCm` is the placed item's real-world width; `surfaceWidthCm` is the altar size's
 *   real tabletop width. Their ratio is what makes one authored position/size render
 *   correctly across every altar size (small photo, life-size tabletop, same math).
 *
 * Malformed-input policy: every function that accepts a surface rect or a pixel/cm size
 * returns `null` (not a thrown error) when given a rect that fails `isValidSurfaceRect`,
 * or non-finite/non-positive image or cm dimensions. This lets callers (React components
 * mid-render, before an image has finished loading) treat "no valid geometry yet" as a
 * normal transient state without a try/catch on every render.
 */

/** Fraction values must be finite numbers within [0,1] with left<right, top<bottom. */
export function isValidSurfaceRect(rect) {
  if (!rect || typeof rect !== "object") return false;
  const { surfaceLeft, surfaceTop, surfaceRight, surfaceBottom } = rect;
  const values = [surfaceLeft, surfaceTop, surfaceRight, surfaceBottom];
  if (!values.every((value) => typeof value === "number" && Number.isFinite(value))) return false;
  if (values.some((value) => value < 0 || value > 1)) return false;
  return surfaceLeft < surfaceRight && surfaceTop < surfaceBottom;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Clamp a candidate (x, y) surface-fraction position. `bounds` (`{minX, maxX, minY, maxY}`)
 * defaults to the original [0,1]×[0,1] tabletop-only range when omitted; pass
 * `fullImageSurfaceBounds(rect)` to allow the full background image instead.
 */
export function clampToSurface(x, y, bounds) {
  const { minX = 0, maxX = 1, minY = 0, maxY = 1 } = bounds || {};
  return { x: clamp(x, minX, maxX), y: clamp(y, minY, maxY) };
}

/**
 * The surface-fraction bounds equivalent to the *entire background image* (not just the
 * tabletop rect) — e.g. `minX` is negative whenever `surfaceLeft > 0`, since the image's
 * left edge sits outside (to the left of) the tabletop's own left edge in surface-fraction
 * terms. Pass this as `clampToSurface`'s `bounds` to let an item be dragged anywhere on the
 * full image while `(x, y)` stay expressed in the same surface-relative coordinate system
 * everything else (storage, cross-size re-mapping) already uses. Returns `null` for an
 * invalid rect, matching this module's malformed-input policy.
 */
export function fullImageSurfaceBounds(rect) {
  if (!isValidSurfaceRect(rect)) return null;
  const { surfaceLeft, surfaceTop, surfaceRight, surfaceBottom } = rect;
  const width = surfaceRight - surfaceLeft;
  const height = surfaceBottom - surfaceTop;
  return {
    // `|| 0` normalizes a `-0` result (e.g. surfaceLeft === 0) to `0` — numerically identical,
    // but avoids a surprising `-0` showing up in state/deep-equality checks.
    minX: (-surfaceLeft / width) || 0,
    maxX: (1 - surfaceLeft) / width,
    minY: (-surfaceTop / height) || 0,
    maxY: (1 - surfaceTop) / height,
  };
}

/**
 * Convert a surface rect (fractions of the backdrop image) into a pixel rect against a
 * rendered image of size `imgW`×`imgH`. Returns `null` for an invalid rect or non-positive
 * image dimensions.
 */
export function surfaceToPixelRect(rect, imgW, imgH) {
  if (!isValidSurfaceRect(rect)) return null;
  if (!(imgW > 0) || !(imgH > 0)) return null;

  const { surfaceLeft, surfaceTop, surfaceRight, surfaceBottom } = rect;
  return {
    left: imgW * surfaceLeft,
    top: imgH * surfaceTop,
    width: imgW * (surfaceRight - surfaceLeft),
    height: imgH * (surfaceBottom - surfaceTop),
  };
}

/**
 * Resolve an item's bottom-center anchor point, in px, given its surface-fraction
 * position `(x, y)` and the surface's pixel rect (from `surfaceToPixelRect`).
 */
export function itemBottomCenterPx({ x, y }, surfaceRectPx) {
  if (!surfaceRectPx) return null;
  return {
    x: surfaceRectPx.left + x * surfaceRectPx.width,
    y: surfaceRectPx.top + y * surfaceRectPx.height,
  };
}

/**
 * Resolve an item's rendered width in px from its real-world `widthCm`, the surface's
 * pixel width, and the altar size's real tabletop width (`surfaceWidthCm`). The same
 * `widthCm` yields a smaller px width on a physically wider tabletop and vice versa —
 * this is what keeps one authored placement correct across every altar size.
 */
export function itemWidthPx({ widthCm, scaleAdjust = 1 }, surfaceRectPx, surfaceWidthCm) {
  if (!surfaceRectPx) return null;
  if (!(widthCm > 0) || !(surfaceWidthCm > 0) || !(scaleAdjust > 0)) return null;
  return surfaceRectPx.width * (widthCm / surfaceWidthCm) * scaleAdjust;
}

/**
 * Auto z-index rule shared by admin editor, client canvas and export: an explicit
 * `zIndexOverride` always wins; otherwise larger `y` (nearer the viewer / front of the
 * table) paints on top.
 */
export function autoZIndex(item) {
  if (!item) return 0;
  return item.zIndexOverride ?? Math.round((item.y ?? 0) * 1000);
}

/**
 * The CSS `z-index` an item is actually rendered with — `autoZIndex` floored at 0.
 *
 * `autoZIndex` is a *relative depth score* and is legitimately negative: `y` may go negative
 * whenever an item sits above the tabletop's top edge (allowed by `fullImageSurfaceBounds`), and
 * "send to back" deliberately picks `min(z) - 1`. But a negative CSS `z-index` on an absolutely
 * positioned item means the browser paints it *before* (i.e. underneath) the canvas container's
 * in-flow backdrop `<img>`, so the item silently vanishes behind an opaque background instead of
 * merely being the bottom-most item. Flooring at 0 keeps every item above the backdrop.
 *
 * For a *single-item* canvas (the admin placement editor) this is the whole story. A multi-item
 * canvas needs distinct values per item and must not let depth drive DOM order at all — it uses
 * `stackingOrderById` from `altar-canvas.jsx` instead.
 */
export function renderZIndex(item) {
  return Math.max(0, autoZIndex(item));
}

/**
 * Inverse of `itemBottomCenterPx`: convert a pointer/pixel position back into
 * surface-fraction `(x, y)` space, clamped via `clampToSurface` (see its `bounds` param —
 * defaults to [0,1], pass `fullImageSurfaceBounds(rect)` to allow the full image). Used by
 * the draggable primitive to translate `pointermove` events into storable coordinates.
 */
export function pixelToSurfaceFraction(pxPoint, surfaceRectPx, bounds) {
  if (!surfaceRectPx || !(surfaceRectPx.width > 0) || !(surfaceRectPx.height > 0)) return null;
  const x = (pxPoint.x - surfaceRectPx.left) / surfaceRectPx.width;
  const y = (pxPoint.y - surfaceRectPx.top) / surfaceRectPx.height;
  return clampToSurface(x, y, bounds);
}

/**
 * Where a dragged item's anchor belongs for a pointer currently at `pointerPx`, given the
 * `{dx, dy}` offset between pointer and anchor recorded when the item was grabbed.
 *
 * Feeding the raw pointer position to `pixelToSurfaceFraction` instead would move the item's
 * *base* onto the cursor, so grabbing an item anywhere other than its base teleports it by the
 * grab offset the moment the drag starts — and since the tabletop band is a small fraction of
 * the backdrop's height, that jump is worth a large chunk of a `y` unit. Subtracting the offset
 * keeps the item exactly where it was picked up, so a drag that returns to its starting pointer
 * position is a no-op.
 */
export function dragToSurfaceFraction(pointerPx, grabOffsetPx, surfaceRectPx, bounds) {
  const { dx = 0, dy = 0 } = grabOffsetPx || {};
  return pixelToSurfaceFraction({ x: pointerPx.x - dx, y: pointerPx.y - dy }, surfaceRectPx, bounds);
}
