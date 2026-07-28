import { describe, expect, it } from "vitest";
import {
  altarCanvasCoreReducer,
  altarCanvasHistoryReducer,
  computeBringToFrontZ,
  computeSendToBackZ,
  createInitialCanvasState,
  mapPresetToCanvasState,
} from "./use-altar-canvas-reducer";

function historyOf(present) {
  return { past: [], present, future: [], lastMoveSignature: null };
}

const FEED_ITEM = {
  productId: 1,
  name: "Bát hương 20cm",
  slug: "bat-huong-20cm",
  price: 850000,
  thumb: "bat-huong.png",
  groupId: 10,
  styleId: 20,
  renderOnAltar: true,
  placement: {
    id: 100,
    productImageId: 200,
    overlayImage: "bat-huong-overlay.png",
    defaultX: 0.5,
    defaultY: 0.6,
    widthCm: 20,
    scaleAdjust: 1,
    zIndexOverride: null,
    flippable: true,
  },
};

const ACCESSORY_FEED_ITEM = {
  productId: 2,
  name: "Tro nếp",
  price: 120000,
  thumb: "tro-nep.png",
  renderOnAltar: false,
  placement: null,
};

describe("altarCanvasCoreReducer / add", () => {
  it("places a new instance at the placement's authored default position", () => {
    const state = createInitialCanvasState();
    const next = altarCanvasCoreReducer(state, { type: "add", feedItem: FEED_ITEM });
    expect(next.items).toHaveLength(1);
    expect(next.items[0]).toMatchObject({
      productId: 1,
      productImageId: 200,
      x: 0.5,
      y: 0.6,
      flipped: false,
      overlayImage: "bat-huong-overlay.png",
    });
    expect(next.selectedInstanceId).toBe(next.items[0].instanceId);
  });

  it("offsets a second instance of the same placed image by +0.06 on x, clamped", () => {
    let state = createInitialCanvasState();
    state = altarCanvasCoreReducer(state, { type: "add", feedItem: FEED_ITEM });
    state = altarCanvasCoreReducer(state, { type: "add", feedItem: FEED_ITEM });

    expect(state.items).toHaveLength(2);
    expect(state.items[0].x).toBeCloseTo(0.5);
    expect(state.items[1].x).toBeCloseTo(0.56);
    // distinct instance ids — independently draggable/removable
    expect(state.items[1].instanceId).not.toBe(state.items[0].instanceId);
  });

  it("clamps the offset so it never exceeds the surface", () => {
    const nearEdge = { ...FEED_ITEM, placement: { ...FEED_ITEM.placement, defaultX: 0.98 } };
    let state = createInitialCanvasState();
    state = altarCanvasCoreReducer(state, { type: "add", feedItem: nearEdge });
    state = altarCanvasCoreReducer(state, { type: "add", feedItem: nearEdge });
    expect(state.items[1].x).toBe(1);
  });

  it("is a no-op when the feed item has no placement", () => {
    const state = createInitialCanvasState();
    const next = altarCanvasCoreReducer(state, { type: "add", feedItem: ACCESSORY_FEED_ITEM });
    expect(next).toBe(state);
  });
});

describe("altarCanvasCoreReducer / addAccessory", () => {
  it("adds a new accessory row with quantity 1", () => {
    const state = createInitialCanvasState();
    const next = altarCanvasCoreReducer(state, { type: "addAccessory", feedItem: ACCESSORY_FEED_ITEM });
    expect(next.accessories).toEqual([{ productId: 2, quantity: 1, name: "Tro nếp", price: 120000, thumb: "tro-nep.png" }]);
    expect(next.items).toHaveLength(0);
  });

  it("increments quantity when the same accessory is added again", () => {
    let state = createInitialCanvasState();
    state = altarCanvasCoreReducer(state, { type: "addAccessory", feedItem: ACCESSORY_FEED_ITEM });
    state = altarCanvasCoreReducer(state, { type: "addAccessory", feedItem: ACCESSORY_FEED_ITEM });
    expect(state.accessories).toHaveLength(1);
    expect(state.accessories[0].quantity).toBe(2);
  });
});

describe("altarCanvasCoreReducer / removeAccessory", () => {
  it("decrements quantity when more than one is present", () => {
    let state = createInitialCanvasState();
    state = altarCanvasCoreReducer(state, { type: "addAccessory", feedItem: ACCESSORY_FEED_ITEM });
    state = altarCanvasCoreReducer(state, { type: "addAccessory", feedItem: ACCESSORY_FEED_ITEM });
    state = altarCanvasCoreReducer(state, { type: "removeAccessory", productId: ACCESSORY_FEED_ITEM.productId });
    expect(state.accessories).toEqual([{ productId: 2, quantity: 1, name: "Tro nếp", price: 120000, thumb: "tro-nep.png" }]);
  });

  it("removes the row entirely when quantity reaches 0", () => {
    let state = createInitialCanvasState();
    state = altarCanvasCoreReducer(state, { type: "addAccessory", feedItem: ACCESSORY_FEED_ITEM });
    state = altarCanvasCoreReducer(state, { type: "removeAccessory", productId: ACCESSORY_FEED_ITEM.productId });
    expect(state.accessories).toEqual([]);
  });

  it("is a no-op for an unknown productId", () => {
    const state = createInitialCanvasState();
    const next = altarCanvasCoreReducer(state, { type: "removeAccessory", productId: 999 });
    expect(next).toBe(state);
  });
});

describe("altarCanvasCoreReducer / move", () => {
  it("updates the target item's x/y as given — clamping is the UI layer's job, not the reducer's", () => {
    // The reducer has no access to the altar size's surface rect (state only carries
    // altarSizeId, not its geometry), so it can't correctly clamp to the per-size bounds
    // AltarDraggableItem already applied before dispatching — see use-altar-canvas-reducer-core.js.
    let state = createInitialCanvasState();
    state = altarCanvasCoreReducer(state, { type: "add", feedItem: FEED_ITEM });
    const id = state.items[0].instanceId;
    state = altarCanvasCoreReducer(state, { type: "move", instanceId: id, x: 1.4, y: -0.2 });
    expect(state.items[0].x).toBe(1.4);
    expect(state.items[0].y).toBe(-0.2);
  });

  it("is a no-op for an unknown instanceId", () => {
    const state = createInitialCanvasState();
    const next = altarCanvasCoreReducer(state, { type: "move", instanceId: "missing", x: 0.1, y: 0.1 });
    expect(next).toBe(state);
  });
});

describe("altarCanvasCoreReducer / select, remove", () => {
  it("select sets selectedInstanceId and clears it back to null", () => {
    const state = createInitialCanvasState();
    const selected = altarCanvasCoreReducer(state, { type: "select", instanceId: "a" });
    expect(selected.selectedInstanceId).toBe("a");
    const cleared = altarCanvasCoreReducer(selected, { type: "select", instanceId: null });
    expect(cleared.selectedInstanceId).toBeNull();
  });

  it("remove drops the item and clears selection if it was selected", () => {
    let state = createInitialCanvasState();
    state = altarCanvasCoreReducer(state, { type: "add", feedItem: FEED_ITEM });
    const id = state.items[0].instanceId;
    state = altarCanvasCoreReducer(state, { type: "select", instanceId: id });
    state = altarCanvasCoreReducer(state, { type: "remove", instanceId: id });
    expect(state.items).toHaveLength(0);
    expect(state.selectedInstanceId).toBeNull();
  });
});

describe("altarCanvasCoreReducer / flip", () => {
  it("toggles flipped on a flippable item", () => {
    let state = createInitialCanvasState();
    state = altarCanvasCoreReducer(state, { type: "add", feedItem: FEED_ITEM });
    const id = state.items[0].instanceId;
    state = altarCanvasCoreReducer(state, { type: "flip", instanceId: id });
    expect(state.items[0].flipped).toBe(true);
  });

  it("does not flip an item with flippable=false", () => {
    const unflippable = { ...FEED_ITEM, placement: { ...FEED_ITEM.placement, flippable: false } };
    let state = createInitialCanvasState();
    state = altarCanvasCoreReducer(state, { type: "add", feedItem: unflippable });
    const id = state.items[0].instanceId;
    const next = altarCanvasCoreReducer(state, { type: "flip", instanceId: id });
    expect(next).toBe(state);
  });
});

describe("altarCanvasCoreReducer / mirror", () => {
  it("creates a new instance reflected across the centerline with flipped toggled", () => {
    let state = createInitialCanvasState();
    state = altarCanvasCoreReducer(state, { type: "add", feedItem: { ...FEED_ITEM, placement: { ...FEED_ITEM.placement, defaultX: 0.3 } } });
    const sourceId = state.items[0].instanceId;

    const next = altarCanvasCoreReducer(state, { type: "mirror", instanceId: sourceId });

    expect(next.items).toHaveLength(2);
    const mirrored = next.items[1];
    expect(mirrored.instanceId).not.toBe(sourceId);
    expect(mirrored.x).toBeCloseTo(0.7);
    expect(mirrored.y).toBe(next.items[0].y);
    expect(mirrored.flipped).toBe(true);
    expect(next.selectedInstanceId).toBe(mirrored.instanceId);
    // original untouched
    expect(next.items[0].x).toBeCloseTo(0.3);
    expect(next.items[0].flipped).toBe(false);
  });

  it("is a no-op for an unknown instanceId", () => {
    const state = createInitialCanvasState();
    const next = altarCanvasCoreReducer(state, { type: "mirror", instanceId: "missing" });
    expect(next).toBe(state);
  });
});

describe("altarCanvasCoreReducer / center, setZ, clear", () => {
  it("center sets x to 0.5", () => {
    let state = createInitialCanvasState();
    state = altarCanvasCoreReducer(state, { type: "add", feedItem: { ...FEED_ITEM, placement: { ...FEED_ITEM.placement, defaultX: 0.1 } } });
    const id = state.items[0].instanceId;
    state = altarCanvasCoreReducer(state, { type: "center", instanceId: id });
    expect(state.items[0].x).toBe(0.5);
  });

  it("setZ overrides zIndexOverride, null resets to auto", () => {
    let state = createInitialCanvasState();
    state = altarCanvasCoreReducer(state, { type: "add", feedItem: FEED_ITEM });
    const id = state.items[0].instanceId;
    state = altarCanvasCoreReducer(state, { type: "setZ", instanceId: id, zIndexOverride: 42 });
    expect(state.items[0].zIndexOverride).toBe(42);
    state = altarCanvasCoreReducer(state, { type: "setZ", instanceId: id, zIndexOverride: null });
    expect(state.items[0].zIndexOverride).toBeNull();
  });

  it("clear empties items/accessories/selection/presetId", () => {
    let state = createInitialCanvasState();
    state = altarCanvasCoreReducer(state, { type: "add", feedItem: FEED_ITEM });
    state = altarCanvasCoreReducer(state, { type: "addAccessory", feedItem: ACCESSORY_FEED_ITEM });
    state = altarCanvasCoreReducer(state, { type: "loadPreset", presetId: 5, items: state.items, accessories: state.accessories });
    state = altarCanvasCoreReducer(state, { type: "clear" });
    expect(state.items).toEqual([]);
    expect(state.accessories).toEqual([]);
    expect(state.selectedInstanceId).toBeNull();
    expect(state.presetId).toBeNull();
  });
});

describe("altarCanvasCoreReducer / loadPreset, changeSize", () => {
  it("loadPreset replaces items/accessories wholesale and sets presetId", () => {
    let state = createInitialCanvasState();
    state = altarCanvasCoreReducer(state, { type: "add", feedItem: FEED_ITEM });

    const nextItems = [{ instanceId: "x", productId: 9, productImageId: 9, x: 0.2, y: 0.2 }];
    const nextAccessories = [{ productId: 8, quantity: 3 }];
    const next = altarCanvasCoreReducer(state, {
      type: "loadPreset",
      presetId: 77,
      items: nextItems,
      accessories: nextAccessories,
    });

    expect(next.items).toEqual(nextItems);
    expect(next.accessories).toEqual(nextAccessories);
    expect(next.presetId).toBe(77);
    expect(next.selectedInstanceId).toBeNull();
  });

  it("changeSize preserves item coordinates — only the selection ids change", () => {
    let state = createInitialCanvasState({ altarModelId: 1, altarSizeId: 10 });
    state = altarCanvasCoreReducer(state, { type: "add", feedItem: FEED_ITEM });
    const itemsBefore = state.items;

    const next = altarCanvasCoreReducer(state, { type: "changeSize", altarSizeId: 11 });

    expect(next.altarSizeId).toBe(11);
    expect(next.altarModelId).toBe(1);
    expect(next.items).toBe(itemsBefore); // same reference: no coordinate mutation
  });

  it("changeSize accepts a partial payload covering model/style together", () => {
    const state = createInitialCanvasState({ altarModelId: 1, altarSizeId: 10, altarStyleId: 20 });
    const next = altarCanvasCoreReducer(state, { type: "changeSize", altarModelId: 2, altarStyleId: 21 });
    expect(next).toMatchObject({ altarModelId: 2, altarSizeId: 10, altarStyleId: 21 });
  });

  it("is a no-op when nothing actually changes", () => {
    const state = createInitialCanvasState({ altarModelId: 1 });
    const next = altarCanvasCoreReducer(state, { type: "changeSize", altarModelId: 1 });
    expect(next).toBe(state);
  });
});

describe("mapPresetToCanvasState", () => {
  it("splits preset items into canvas items (placement + coords) vs accessories", () => {
    const preset = {
      items: [
        {
          productId: 1,
          productName: "Bát hương",
          productPrice: 100,
          productThumb: "a.png",
          productImageId: 5,
          x: 0.4,
          y: 0.5,
          scaleAdjust: 1.2,
          flipped: true,
          zIndexOverride: 3,
          quantity: 1,
          placement: { overlayImage: "a-overlay.png", widthCm: 18, flippable: true },
        },
        {
          productId: 2,
          productName: "Tro nếp",
          productPrice: 50,
          productThumb: "b.png",
          productImageId: null,
          x: null,
          y: null,
          quantity: 2,
        },
      ],
    };

    const { items, accessories } = mapPresetToCanvasState(preset);

    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ productId: 1, x: 0.4, y: 0.5, flipped: true, zIndexOverride: 3, overlayImage: "a-overlay.png" });
    expect(typeof items[0].instanceId).toBe("string");

    expect(accessories).toEqual([{ productId: 2, quantity: 2, name: "Tro nếp", price: 50, thumb: "b.png" }]);
  });

  it("handles an empty/undefined preset", () => {
    expect(mapPresetToCanvasState(undefined)).toEqual({ items: [], accessories: [] });
    expect(mapPresetToCanvasState({ items: [] })).toEqual({ items: [], accessories: [] });
  });
});

describe("computeBringToFrontZ / computeSendToBackZ", () => {
  it("returns a z strictly above/below the current max/min auto-z", () => {
    const items = [{ y: 0.2 }, { y: 0.8 }];
    expect(computeBringToFrontZ(items)).toBeGreaterThan(800);
    expect(computeSendToBackZ(items)).toBeLessThan(200);
  });

  it("handles an empty item list", () => {
    expect(computeBringToFrontZ([])).toBe(1);
    expect(computeSendToBackZ([])).toBe(-1);
  });
});

describe("altarCanvasHistoryReducer / undo, redo", () => {
  it("undo reverts the last discrete action, redo reapplies it", () => {
    let history = historyOf(createInitialCanvasState());
    history = altarCanvasHistoryReducer(history, { type: "add", feedItem: FEED_ITEM });
    expect(history.present.items).toHaveLength(1);

    history = altarCanvasHistoryReducer(history, { type: "undo" });
    expect(history.present.items).toHaveLength(0);
    expect(history.future).toHaveLength(1); // canUndo/canRedo are derived by the hook from past/future length

    history = altarCanvasHistoryReducer(history, { type: "redo" });
    expect(history.present.items).toHaveLength(1);
  });

  it("undo/redo are no-ops at the bounds", () => {
    const initial = historyOf(createInitialCanvasState());
    expect(altarCanvasHistoryReducer(initial, { type: "undo" })).toBe(initial);
    expect(altarCanvasHistoryReducer(initial, { type: "redo" })).toBe(initial);
  });

  it("coalesces consecutive move actions on the same instance into a single undo step", () => {
    let history = historyOf(createInitialCanvasState());
    history = altarCanvasHistoryReducer(history, { type: "add", feedItem: FEED_ITEM });
    const id = history.present.items[0].instanceId;

    history = altarCanvasHistoryReducer(history, { type: "move", instanceId: id, x: 0.1, y: 0.1 });
    history = altarCanvasHistoryReducer(history, { type: "move", instanceId: id, x: 0.2, y: 0.2 });
    history = altarCanvasHistoryReducer(history, { type: "move", instanceId: id, x: 0.3, y: 0.3 });

    expect(history.present.items[0].x).toBeCloseTo(0.3);
    // one undo should go straight back to the pre-drag (post-add) position, not one move-step back
    history = altarCanvasHistoryReducer(history, { type: "undo" });
    expect(history.present.items[0].x).toBeCloseTo(0.5); // FEED_ITEM's defaultX
  });

  it("does not coalesce moves on two different instances", () => {
    let history = historyOf(createInitialCanvasState());
    history = altarCanvasHistoryReducer(history, { type: "add", feedItem: FEED_ITEM });
    history = altarCanvasHistoryReducer(history, { type: "add", feedItem: FEED_ITEM });
    const [firstId, secondId] = history.present.items.map((item) => item.instanceId);

    history = altarCanvasHistoryReducer(history, { type: "move", instanceId: firstId, x: 0.05, y: 0.05 });
    history = altarCanvasHistoryReducer(history, { type: "move", instanceId: secondId, x: 0.9, y: 0.9 });

    // two distinct history entries were pushed for the two different-instance moves
    history = altarCanvasHistoryReducer(history, { type: "undo" });
    expect(history.present.items.find((i) => i.instanceId === secondId).x).not.toBeCloseTo(0.9);
    expect(history.present.items.find((i) => i.instanceId === firstId).x).toBeCloseTo(0.05);
  });

  it("select does not create an undo step", () => {
    let history = historyOf(createInitialCanvasState());
    history = altarCanvasHistoryReducer(history, { type: "add", feedItem: FEED_ITEM });
    const pastLengthAfterAdd = history.past.length;
    history = altarCanvasHistoryReducer(history, { type: "select", instanceId: history.present.items[0].instanceId });
    expect(history.past.length).toBe(pastLengthAfterAdd);
  });

  it("dispatching a new action after undo clears the redo stack", () => {
    let history = historyOf(createInitialCanvasState());
    history = altarCanvasHistoryReducer(history, { type: "add", feedItem: FEED_ITEM });
    history = altarCanvasHistoryReducer(history, { type: "undo" });
    expect(history.future).toHaveLength(1);
    history = altarCanvasHistoryReducer(history, { type: "add", feedItem: FEED_ITEM });
    expect(history.future).toHaveLength(0);
  });

  it("caps history at 50 entries", () => {
    let history = historyOf(createInitialCanvasState());
    for (let i = 0; i < 60; i += 1) {
      history = altarCanvasHistoryReducer(history, { type: "addAccessory", feedItem: { ...ACCESSORY_FEED_ITEM, productId: i } });
    }
    expect(history.past.length).toBeLessThanOrEqual(50);
    expect(history.present.accessories).toHaveLength(60);
  });
});
