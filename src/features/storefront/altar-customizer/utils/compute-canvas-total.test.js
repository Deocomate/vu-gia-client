import { describe, expect, it } from "vitest";
import { computeCanvasTotal } from "./compute-canvas-total";

describe("computeCanvasTotal", () => {
  it("sums item prices and accessory price*quantity", () => {
    const total = computeCanvasTotal({
      items: [{ price: 100000 }, { price: 50000 }],
      accessories: [{ price: 20000, quantity: 3 }],
    });
    expect(total).toBe(100000 + 50000 + 20000 * 3);
  });

  it("treats missing/malformed numeric fields as 0", () => {
    expect(computeCanvasTotal({ items: [{ price: "abc" }], accessories: [{ quantity: 2 }] })).toBe(0);
  });

  it("returns 0 for empty/omitted input", () => {
    expect(computeCanvasTotal({})).toBe(0);
    expect(computeCanvasTotal()).toBe(0);
  });
});
