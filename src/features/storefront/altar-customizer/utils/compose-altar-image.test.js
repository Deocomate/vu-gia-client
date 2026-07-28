import { describe, expect, it } from "vitest";
import { buildDrawPlan, computeComposedDimensions } from "./compose-altar-image";

// Only the DOM-free pure helpers are covered here — `composeAltarImage` itself touches
// `document`/`Image`/`canvas` and is browser-only (this repo's vitest config runs in a plain
// Node environment with no jsdom/canvas shim, see vitest.config.js's docblock), so it can only be
// verified manually/in a real browser (see the phase 5 report's manual verification trace).

describe("computeComposedDimensions", () => {
  it("passes through an image already within the max width", () => {
    expect(computeComposedDimensions(800, 600, 1600)).toEqual({ width: 800, height: 600 });
  });

  it("scales down a wider-than-max image, preserving aspect ratio", () => {
    expect(computeComposedDimensions(3200, 1600, 1600)).toEqual({ width: 1600, height: 800 });
  });

  it("never scales up", () => {
    expect(computeComposedDimensions(100, 50, 1600)).toEqual({ width: 100, height: 50 });
  });

  it("falls back to 1x1 for non-positive/non-finite dimensions", () => {
    expect(computeComposedDimensions(0, 100)).toEqual({ width: 1, height: 1 });
    expect(computeComposedDimensions(NaN, 100)).toEqual({ width: 1, height: 1 });
    expect(computeComposedDimensions(100, -10)).toEqual({ width: 1, height: 1 });
  });
});

const SIZE = {
  backgroundImage: "assets/images/altar-customizer/altar-preview.png",
  surfaceLeft: 0.1,
  surfaceTop: 0.2,
  surfaceRight: 0.9,
  surfaceBottom: 0.9,
  surfaceWidthCm: 100,
};

describe("buildDrawPlan", () => {
  it("resolves anchor/width in px and sorts back-to-front by the shared z rule", () => {
    const items = [
      { instanceId: "front", overlayImage: "front.png", x: 0.5, y: 0.9, widthCm: 20 },
      { instanceId: "back", overlayImage: "back.png", x: 0.5, y: 0.1, widthCm: 20 },
    ];
    const plan = buildDrawPlan(SIZE, items, 1000, 1000);
    expect(plan).toHaveLength(2);
    // "back" (smaller y => lower auto z) must be drawn first, "front" last (drawn on top).
    expect(plan[0].image).toBe("back.png");
    expect(plan[1].image).toBe("front.png");
    expect(plan[1].anchorPx.x).toBeGreaterThan(0);
    expect(plan[1].widthPx).toBeGreaterThan(0);
  });

  it("honors the flipped flag per item", () => {
    const items = [{ instanceId: "a", overlayImage: "a.png", x: 0.5, y: 0.5, widthCm: 20, flipped: true }];
    const plan = buildDrawPlan(SIZE, items, 1000, 1000);
    expect(plan[0].flipped).toBe(true);
  });

  it("drops an item with no resolvable image", () => {
    const items = [{ instanceId: "a", x: 0.5, y: 0.5, widthCm: 20 }];
    expect(buildDrawPlan(SIZE, items, 1000, 1000)).toEqual([]);
  });

  it("returns an empty plan for an invalid surface rect", () => {
    const badSize = { ...SIZE, surfaceLeft: 0.9, surfaceRight: 0.1 };
    expect(buildDrawPlan(badSize, [{ overlayImage: "a.png", x: 0.5, y: 0.5, widthCm: 20 }], 1000, 1000)).toEqual([]);
  });
});
