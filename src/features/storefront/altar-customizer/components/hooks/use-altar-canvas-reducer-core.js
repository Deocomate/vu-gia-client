import { autoZIndex, clampToSurface } from "@/shared/components/altar/altar-surface-geometry";

/**
 * Pure, framework-free core of the storefront altar customizer's canvas state — the single
 * action-reducer plus its supporting helpers, with no React import so it stays trivially
 * unit-testable in plain Node (see `use-altar-canvas-reducer.test.js`). The `"use client"`
 * React-hook wrapper (`useAltarCanvasReducer`, bounded undo/redo) lives in the sibling
 * `use-altar-canvas-reducer.js`, which re-exports every name from this module.
 *
 * State shape (this is the contract Phase 5's save/export feature consumes):
 * ```
 * {
 *   altarModelId, altarSizeId, altarStyleId, presetId,
 *   items: [{
 *     instanceId,                 // client-generated, unique per placed instance
 *     productId, productImageId,
 *     x, y,                       // surface-relative [0,1], bottom-center anchor
 *     scaleAdjust, flipped, zIndexOverride,
 *     // denormalized display/render fields (not in the phase spec's minimal list, but
 *     // required so the canvas/summary don't need a second product lookup per item):
 *     overlayImage, widthCm, flippable, name, price, thumb,
 *   }],
 *   accessories: [{ productId, quantity, name, price, thumb }],
 *   selectedInstanceId,
 * }
 * ```
 */

/** Surface-fraction offset applied to each successive instance of the same placed image, so a
 * second/third "+" click never perfectly overlaps the previous one (see the phase plan's "Second
 * instance offset" interaction rule). */
const INSTANCE_OFFSET = 0.06;

/** Stable per-instance id — falls back to a timestamp+random string on runtimes without
 * `crypto.randomUUID` (older browsers/test DOM), same convention as the admin preset builder. */
export function makeInstanceId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function clampX(x) {
  return clampToSurface(x, 0).x;
}

export function createInitialCanvasState({ altarModelId = null, altarSizeId = null, altarStyleId = null } = {}) {
  return {
    altarModelId,
    altarSizeId,
    altarStyleId,
    presetId: null,
    items: [],
    accessories: [],
    selectedInstanceId: null,
  };
}

/** Maps one `AltarCustomizerItemResponse`-shaped feed item (must carry a non-null `placement`)
 * into a new canvas item, offset from the last existing instance of the same product image. */
function buildPlacedInstance(state, feedItem) {
  const placement = feedItem?.placement;
  if (!placement) return null;

  const matching = state.items.filter(
    (item) => item.productId === feedItem.productId && item.productImageId === placement.productImageId,
  );
  const lastMatch = matching[matching.length - 1];
  const x = lastMatch ? clampX(lastMatch.x + INSTANCE_OFFSET) : placement.defaultX;

  return {
    instanceId: makeInstanceId(),
    productId: feedItem.productId,
    productImageId: placement.productImageId,
    x,
    y: placement.defaultY,
    scaleAdjust: placement.scaleAdjust ?? 1,
    flipped: false,
    zIndexOverride: placement.zIndexOverride ?? null,
    overlayImage: placement.overlayImage,
    widthCm: placement.widthCm,
    flippable: placement.flippable !== false,
    name: feedItem.name,
    price: feedItem.price,
    thumb: feedItem.thumb,
  };
}

/** Pure, single-action state transition. Returns the same `state` reference (no-op) whenever
 * the action target doesn't exist, so the history wrapper can skip recording a no-op entry. */
export function altarCanvasCoreReducer(state, action) {
  switch (action.type) {
    case "add": {
      const nextItem = buildPlacedInstance(state, action.feedItem);
      if (!nextItem) return state;
      return { ...state, items: [...state.items, nextItem], selectedInstanceId: nextItem.instanceId };
    }

    case "addAccessory": {
      const { feedItem } = action;
      if (feedItem?.productId == null) return state;
      const existing = state.accessories.find((row) => row.productId === feedItem.productId);
      const accessories = existing
        ? state.accessories.map((row) =>
            row.productId === feedItem.productId ? { ...row, quantity: row.quantity + 1 } : row,
          )
        : [
            ...state.accessories,
            { productId: feedItem.productId, quantity: 1, name: feedItem.name, price: feedItem.price, thumb: feedItem.thumb },
          ];
      return { ...state, accessories };
    }

    // Not in the phase spec's literal action list, but required for the summary panel to be
    // able to remove/decrement an accessory line at all (accessories live outside `items`, so
    // the item-only `remove` action can't reach them).
    case "removeAccessory": {
      const existing = state.accessories.find((row) => row.productId === action.productId);
      if (!existing) return state;
      const accessories =
        existing.quantity > 1
          ? state.accessories.map((row) =>
              row.productId === action.productId ? { ...row, quantity: row.quantity - 1 } : row,
            )
          : state.accessories.filter((row) => row.productId !== action.productId);
      return { ...state, accessories };
    }

    // Not re-clamped here: `x`/`y` arrive already clamped by the UI layer
    // (`AltarDraggableItem`'s `bounds` prop, see `altar-surface-geometry.js`'s
    // `fullImageSurfaceBounds`), which knows the actual per-altar-size surface rect this
    // reducer has no access to (`state` only carries `altarSizeId`, not its geometry) — a
    // hardcoded [0,1] re-clamp here would silently undo full-image dragging for any size
    // whose tabletop is smaller than the full image.
    case "move": {
      if (!state.items.some((item) => item.instanceId === action.instanceId)) return state;
      const items = state.items.map((item) =>
        item.instanceId === action.instanceId ? { ...item, x: action.x, y: action.y } : item,
      );
      return { ...state, items };
    }

    case "select": {
      const instanceId = action.instanceId ?? null;
      if (state.selectedInstanceId === instanceId) return state;
      return { ...state, selectedInstanceId: instanceId };
    }

    case "remove": {
      if (!state.items.some((item) => item.instanceId === action.instanceId)) return state;
      return {
        ...state,
        items: state.items.filter((item) => item.instanceId !== action.instanceId),
        selectedInstanceId: state.selectedInstanceId === action.instanceId ? null : state.selectedInstanceId,
      };
    }

    case "flip": {
      let changed = false;
      const items = state.items.map((item) => {
        if (item.instanceId !== action.instanceId || item.flippable === false) return item;
        changed = true;
        return { ...item, flipped: !item.flipped };
      });
      return changed ? { ...state, items } : state;
    }

    case "mirror": {
      const source = state.items.find((item) => item.instanceId === action.instanceId);
      if (!source) return state;
      const mirrored = {
        ...source,
        instanceId: makeInstanceId(),
        x: clampX(1 - source.x),
        flipped: !source.flipped,
        zIndexOverride: null,
      };
      return { ...state, items: [...state.items, mirrored], selectedInstanceId: mirrored.instanceId };
    }

    case "center": {
      let changed = false;
      const items = state.items.map((item) => {
        if (item.instanceId !== action.instanceId) return item;
        changed = true;
        return { ...item, x: 0.5 };
      });
      return changed ? { ...state, items } : state;
    }

    case "setZ": {
      let changed = false;
      const items = state.items.map((item) => {
        if (item.instanceId !== action.instanceId) return item;
        changed = true;
        return { ...item, zIndexOverride: action.zIndexOverride ?? null };
      });
      return changed ? { ...state, items } : state;
    }

    case "clear": {
      if (state.items.length === 0 && state.accessories.length === 0 && !state.presetId) return state;
      return { ...state, items: [], accessories: [], selectedInstanceId: null, presetId: null };
    }

    case "loadPreset": {
      return {
        ...state,
        presetId: action.presetId ?? null,
        items: action.items || [],
        accessories: action.accessories || [],
        selectedInstanceId: null,
      };
    }

    // Generic "change top-level selection" action — covers model/size/style together (not just
    // size) because switching any of them must never mutate placed items' surface-relative
    // coordinates (decision D3: silently re-map, no coordinate mutation, only re-render scale
    // changes). Any field omitted from the payload is left unchanged.
    case "changeSize": {
      const next = { ...state };
      let changed = false;
      if ("altarModelId" in action && action.altarModelId !== state.altarModelId) {
        next.altarModelId = action.altarModelId;
        changed = true;
      }
      if ("altarSizeId" in action && action.altarSizeId !== state.altarSizeId) {
        next.altarSizeId = action.altarSizeId;
        changed = true;
      }
      if ("altarStyleId" in action && action.altarStyleId !== state.altarStyleId) {
        next.altarStyleId = action.altarStyleId;
        changed = true;
      }
      return changed ? next : state;
    }

    default:
      return state;
  }
}

/** Maps a loaded `AltarPresetResponse` (or a row from `GET /altar-presets` search results — same
 * DTO shape, `items[]` embedded either way) into `{ items, accessories }` ready for `loadPreset`.
 * Every row gets a fresh client-local `instanceId` — preset item ids are server ids, not usable
 * as canvas instance identity (a preset can be loaded more than once in a session). */
export function mapPresetToCanvasState(preset) {
  const items = [];
  const accessories = [];
  (preset?.items || []).forEach((item) => {
    const hasCoords = item.x !== null && item.x !== undefined && item.y !== null && item.y !== undefined;
    if (item.productImageId != null && hasCoords) {
      items.push({
        instanceId: makeInstanceId(),
        productId: item.productId,
        productImageId: item.productImageId,
        x: item.x,
        y: item.y,
        scaleAdjust: item.scaleAdjust ?? 1,
        flipped: Boolean(item.flipped),
        zIndexOverride: item.zIndexOverride ?? null,
        overlayImage: item.placement?.overlayImage ?? "",
        widthCm: item.placement?.widthCm ?? 20,
        flippable: item.placement?.flippable !== false,
        name: item.productName,
        price: item.productPrice,
        thumb: item.productThumb,
      });
    } else {
      accessories.push({
        productId: item.productId,
        quantity: item.quantity ?? 1,
        name: item.productName,
        price: item.productPrice,
        thumb: item.productThumb,
      });
    }
  });
  return { items, accessories };
}

/** Next `zIndexOverride` that paints the given item strictly above every other current item. */
export function computeBringToFrontZ(items) {
  if (!items || items.length === 0) return 1;
  return Math.max(...items.map((item) => autoZIndex(item))) + 1;
}

/** Next `zIndexOverride` that paints the given item strictly below every other current item. */
export function computeSendToBackZ(items) {
  if (!items || items.length === 0) return -1;
  return Math.min(...items.map((item) => autoZIndex(item))) - 1;
}
