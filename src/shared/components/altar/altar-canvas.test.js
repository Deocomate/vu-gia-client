import { describe, expect, it } from "vitest";
import {
  applyItemPositionUpdate,
  resolveItemFlipped,
  resolveItemId,
  resolveItemImage,
  sortItemsByZIndex,
  stackingOrderById,
} from "./altar-canvas";

describe("resolveItemId", () => {
  it("prefers instanceId over id", () => {
    expect(resolveItemId({ instanceId: "a", id: 1 })).toBe("a");
  });

  it("falls back to id when instanceId is absent", () => {
    expect(resolveItemId({ id: 1 })).toBe(1);
  });

  it("returns null for an item with neither", () => {
    expect(resolveItemId({})).toBeNull();
    expect(resolveItemId(null)).toBeNull();
  });
});

describe("resolveItemImage", () => {
  it("prefers overlayImage, then thumb, then image", () => {
    expect(resolveItemImage({ overlayImage: "a.png", thumb: "b.png", image: "c.png" })).toBe("a.png");
    expect(resolveItemImage({ thumb: "b.png", image: "c.png" })).toBe("b.png");
    expect(resolveItemImage({ image: "c.png" })).toBe("c.png");
  });

  it("returns empty string when nothing is set", () => {
    expect(resolveItemImage({})).toBe("");
  });
});

describe("resolveItemFlipped", () => {
  it("accepts either flipped or flip", () => {
    expect(resolveItemFlipped({ flipped: true })).toBe(true);
    expect(resolveItemFlipped({ flip: true })).toBe(true);
    expect(resolveItemFlipped({})).toBe(false);
  });
});

describe("sortItemsByZIndex", () => {
  it("orders items by auto-z (higher y paints later/on top)", () => {
    const back = { id: 1, y: 0.1 };
    const front = { id: 2, y: 0.9 };
    expect(sortItemsByZIndex([front, back])).toEqual([back, front]);
  });

  it("lets an explicit zIndexOverride win over y-derived order", () => {
    const highY = { id: 1, y: 0.9 };
    const overridden = { id: 2, y: 0.1, zIndexOverride: 999 };
    expect(sortItemsByZIndex([highY, overridden])).toEqual([highY, overridden]);
  });

  it("does not mutate the input array", () => {
    const input = [{ id: 1, y: 0.9 }, { id: 2, y: 0.1 }];
    const copy = [...input];
    sortItemsByZIndex(input);
    expect(input).toEqual(copy);
  });

  it("handles an empty/undefined list", () => {
    expect(sortItemsByZIndex([])).toEqual([]);
    expect(sortItemsByZIndex(undefined)).toEqual([]);
  });
});

describe("stackingOrderById", () => {
  it("ranks items back-to-front by auto-z, keyed by id", () => {
    const ranks = stackingOrderById([
      { id: "front", y: 0.9 },
      { id: "back", y: 0.1 },
      { id: "middle", y: 0.5 },
    ]);
    expect(ranks.get("back")).toBe(1);
    expect(ranks.get("middle")).toBe(2);
    expect(ranks.get("front")).toBe(3);
  });

  // Guards the drag-stutter regression: depth must be readable per id so the canvas can keep a
  // stable DOM order, and a rank must never be negative (that would paint behind the backdrop).
  it("stays positive for items dragged above the tabletop", () => {
    const ranks = stackingOrderById([
      { id: "above", y: -1.4 },
      { id: "onTable", y: 0.5 },
    ]);
    expect(ranks.get("above")).toBe(1);
    expect(ranks.get("onTable")).toBe(2);
  });

  it("gives tied items distinct ranks in input order", () => {
    const ranks = stackingOrderById([
      { id: "first", y: 0.5 },
      { id: "second", y: 0.5 },
    ]);
    expect(ranks.get("first")).toBe(1);
    expect(ranks.get("second")).toBe(2);
  });

  it("lets an explicit zIndexOverride win, including a send-to-back negative", () => {
    const ranks = stackingOrderById([
      { id: "sentBack", y: 0.9, zIndexOverride: -1 },
      { id: "auto", y: 0.1 },
    ]);
    expect(ranks.get("sentBack")).toBe(1);
    expect(ranks.get("auto")).toBe(2);
  });

  it("handles an empty/undefined list", () => {
    expect(stackingOrderById([]).size).toBe(0);
    expect(stackingOrderById(undefined).size).toBe(0);
  });
});

describe("applyItemPositionUpdate", () => {
  const items = [
    { id: 1, x: 0.2, y: 0.3 },
    { id: 2, x: 0.5, y: 0.5 },
  ];

  it("updates only the id-matched item's x/y", () => {
    const next = applyItemPositionUpdate(items, 2, 0.7, 0.8);
    expect(next).toEqual([
      { id: 1, x: 0.2, y: 0.3 },
      { id: 2, x: 0.7, y: 0.8 },
    ]);
  });

  it("matches by instanceId when present", () => {
    const withInstance = [{ instanceId: "abc", id: 1, x: 0, y: 0 }];
    const next = applyItemPositionUpdate(withInstance, "abc", 0.9, 0.9);
    expect(next[0]).toEqual({ instanceId: "abc", id: 1, x: 0.9, y: 0.9 });
  });

  it("is a no-op when the id matches nothing", () => {
    const next = applyItemPositionUpdate(items, 999, 0.1, 0.1);
    expect(next).toEqual(items);
  });

  it("returns a new array instance (immutable update)", () => {
    const next = applyItemPositionUpdate(items, 1, 0.4, 0.4);
    expect(next).not.toBe(items);
  });
});
