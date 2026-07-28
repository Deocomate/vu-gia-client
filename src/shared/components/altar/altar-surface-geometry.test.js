import { describe, expect, it } from "vitest";
import {
  autoZIndex,
  clampToSurface,
  dragToSurfaceFraction,
  fullImageSurfaceBounds,
  isValidSurfaceRect,
  itemBottomCenterPx,
  itemWidthPx,
  pixelToSurfaceFraction,
  renderZIndex,
  surfaceToPixelRect,
} from "./altar-surface-geometry";

const RECT = { surfaceLeft: 0.1, surfaceTop: 0.2, surfaceRight: 0.9, surfaceBottom: 0.8 };

describe("isValidSurfaceRect", () => {
  it("accepts a well-formed rect", () => {
    expect(isValidSurfaceRect(RECT)).toBe(true);
  });

  it("rejects left >= right", () => {
    expect(isValidSurfaceRect({ surfaceLeft: 0.5, surfaceTop: 0, surfaceRight: 0.5, surfaceBottom: 1 })).toBe(false);
  });

  it("rejects top >= bottom", () => {
    expect(isValidSurfaceRect({ surfaceLeft: 0, surfaceTop: 0.6, surfaceRight: 1, surfaceBottom: 0.6 })).toBe(false);
  });

  it("rejects out-of-range fractions", () => {
    expect(isValidSurfaceRect({ surfaceLeft: -0.1, surfaceTop: 0, surfaceRight: 1, surfaceBottom: 1 })).toBe(false);
    expect(isValidSurfaceRect({ surfaceLeft: 0, surfaceTop: 0, surfaceRight: 1.2, surfaceBottom: 1 })).toBe(false);
  });

  it("rejects non-finite/missing values", () => {
    expect(isValidSurfaceRect(null)).toBe(false);
    expect(isValidSurfaceRect({ surfaceLeft: 0, surfaceTop: 0, surfaceRight: 1 })).toBe(false);
    expect(isValidSurfaceRect({ surfaceLeft: 0, surfaceTop: 0, surfaceRight: NaN, surfaceBottom: 1 })).toBe(false);
  });
});

describe("surfaceToPixelRect", () => {
  it("maps a known rect at known image dimensions to expected px values", () => {
    const px = surfaceToPixelRect(RECT, 1000, 500);
    // toBeCloseTo tolerates IEEE-754 float drift (e.g. 0.8 - 0.2 !== 0.6 exactly)
    // without weakening what the test actually verifies.
    expect(px.left).toBeCloseTo(100);
    expect(px.top).toBeCloseTo(100);
    expect(px.width).toBeCloseTo(800);
    expect(px.height).toBeCloseTo(300);
  });

  it("returns null for a malformed rect", () => {
    expect(surfaceToPixelRect({ surfaceLeft: 0.5, surfaceTop: 0, surfaceRight: 0.4, surfaceBottom: 1 }, 1000, 500)).toBeNull();
  });

  it("returns null for non-positive image dimensions", () => {
    expect(surfaceToPixelRect(RECT, 0, 500)).toBeNull();
    expect(surfaceToPixelRect(RECT, 1000, -10)).toBeNull();
  });
});

describe("itemBottomCenterPx", () => {
  it("resolves the bottom-center anchor point in px", () => {
    const surfaceRectPx = { left: 100, top: 100, width: 800, height: 300 };
    expect(itemBottomCenterPx({ x: 0.5, y: 1 }, surfaceRectPx)).toEqual({ x: 500, y: 400 });
    expect(itemBottomCenterPx({ x: 0, y: 0 }, surfaceRectPx)).toEqual({ x: 100, y: 100 });
  });

  it("returns null without a surface rect", () => {
    expect(itemBottomCenterPx({ x: 0.5, y: 0.5 }, null)).toBeNull();
  });
});

describe("itemWidthPx — cm scaling", () => {
  const surfaceRectPx = { left: 0, top: 0, width: 800, height: 300 };

  it("scales proportionally to widthCm/surfaceWidthCm", () => {
    expect(itemWidthPx({ widthCm: 50 }, surfaceRectPx, 200)).toBe(200); // 800 * (50/200)
  });

  it("produces a proportionally different px width for a different surfaceWidthCm", () => {
    const wide = itemWidthPx({ widthCm: 50 }, surfaceRectPx, 100); // half the tabletop width
    const narrow = itemWidthPx({ widthCm: 50 }, surfaceRectPx, 200);
    expect(wide).toBe(narrow * 2);
  });

  it("applies scaleAdjust as a multiplier", () => {
    expect(itemWidthPx({ widthCm: 50, scaleAdjust: 1.5 }, surfaceRectPx, 200)).toBe(300);
  });

  it("returns null for non-positive widthCm/surfaceWidthCm/scaleAdjust", () => {
    expect(itemWidthPx({ widthCm: 0 }, surfaceRectPx, 200)).toBeNull();
    expect(itemWidthPx({ widthCm: 50 }, surfaceRectPx, 0)).toBeNull();
    expect(itemWidthPx({ widthCm: 50, scaleAdjust: 0 }, surfaceRectPx, 200)).toBeNull();
  });
});

describe("autoZIndex", () => {
  it("orders higher y above lower y when no override is set", () => {
    const back = autoZIndex({ y: 0.1 });
    const front = autoZIndex({ y: 0.9 });
    expect(front).toBeGreaterThan(back);
    expect(back).toBe(100);
    expect(front).toBe(900);
  });

  it("lets an explicit zIndexOverride win over the y-derived value", () => {
    expect(autoZIndex({ y: 0.9, zIndexOverride: 5 })).toBe(5);
    expect(autoZIndex({ y: 0.1, zIndexOverride: 999 })).toBe(999);
  });

  it("treats zIndexOverride: 0 as an explicit override, not auto", () => {
    expect(autoZIndex({ y: 0.9, zIndexOverride: 0 })).toBe(0);
  });
});

describe("renderZIndex", () => {
  // A negative CSS z-index paints an absolutely positioned item *behind* the canvas
  // container's in-flow backdrop <img>, so the item vanishes entirely instead of merely
  // sitting at the back. Every y a drag can produce must stay >= 0 once rendered.
  it("never returns a negative z-index for an item dragged above the tabletop", () => {
    const bounds = fullImageSurfaceBounds(RECT);
    expect(autoZIndex({ y: bounds.minY })).toBeLessThan(0);
    expect(renderZIndex({ y: bounds.minY })).toBe(0);
    expect(renderZIndex({ y: -0.4 })).toBe(0);
  });

  it("floors a send-to-back override at 0 instead of hiding the item", () => {
    expect(renderZIndex({ y: 0.5, zIndexOverride: -1 })).toBe(0);
  });

  it("passes non-negative auto/override values through unchanged", () => {
    expect(renderZIndex({ y: 0.9 })).toBe(900);
    expect(renderZIndex({ y: 0.1, zIndexOverride: 999 })).toBe(999);
    expect(renderZIndex({ y: -0.5, zIndexOverride: 0 })).toBe(0);
  });
});

describe("clampToSurface", () => {
  it("clamps both axes to [0,1] by default (no bounds passed)", () => {
    expect(clampToSurface(-0.2, 1.4)).toEqual({ x: 0, y: 1 });
    expect(clampToSurface(0.5, 0.5)).toEqual({ x: 0.5, y: 0.5 });
  });

  it("clamps to custom bounds when passed", () => {
    const bounds = { minX: -0.5, maxX: 1.5, minY: -1, maxY: 2 };
    expect(clampToSurface(-0.2, 1.4, bounds)).toEqual({ x: -0.2, y: 1.4 });
    expect(clampToSurface(-2, 5, bounds)).toEqual({ x: -0.5, y: 2 });
  });
});

describe("fullImageSurfaceBounds", () => {
  it("computes the surface-fraction bounds equivalent to the full background image", () => {
    // RECT = { surfaceLeft: 0.1, surfaceTop: 0.2, surfaceRight: 0.9, surfaceBottom: 0.8 }
    const bounds = fullImageSurfaceBounds(RECT);
    expect(bounds.minX).toBeCloseTo(-0.125); // -0.1 / 0.8
    expect(bounds.maxX).toBeCloseTo(1.125); // 0.9 / 0.8
    expect(bounds.minY).toBeCloseTo(-1 / 3); // -0.2 / 0.6
    expect(bounds.maxY).toBeCloseTo(4 / 3); // 0.8 / 0.6
  });

  it("returns [0,1] bounds for a rect that already spans the full image", () => {
    const bounds = fullImageSurfaceBounds({ surfaceLeft: 0, surfaceTop: 0, surfaceRight: 1, surfaceBottom: 1 });
    expect(bounds).toEqual({ minX: 0, maxX: 1, minY: 0, maxY: 1 });
  });

  it("returns null for a malformed rect", () => {
    expect(fullImageSurfaceBounds({ surfaceLeft: 0.5, surfaceTop: 0, surfaceRight: 0.4, surfaceBottom: 1 })).toBeNull();
  });
});

describe("pixelToSurfaceFraction", () => {
  it("is the inverse of itemBottomCenterPx within a surface rect", () => {
    const surfaceRectPx = { left: 100, top: 100, width: 800, height: 300 };
    const result = pixelToSurfaceFraction({ x: 500, y: 400 }, surfaceRectPx);
    expect(result).toEqual({ x: 0.5, y: 1 });
  });

  it("clamps points outside the surface rect to [0,1] by default", () => {
    const surfaceRectPx = { left: 100, top: 100, width: 800, height: 300 };
    expect(pixelToSurfaceFraction({ x: -500, y: 5000 }, surfaceRectPx)).toEqual({ x: 0, y: 1 });
  });

  it("allows a point outside [0,1] when full-image bounds are passed", () => {
    const surfaceRectPx = { left: 100, top: 100, width: 800, height: 300 };
    const bounds = fullImageSurfaceBounds(RECT);
    // clientX=50 is left of the surface rect's own left edge (100px) but still within the
    // full image — should land at a negative surface-fraction x, not clamp to 0.
    const result = pixelToSurfaceFraction({ x: 50, y: 400 }, surfaceRectPx, bounds);
    expect(result.x).toBeLessThan(0);
    expect(result.x).toBeCloseTo(-50 / 800);
  });

  it("returns null without a surface rect", () => {
    expect(pixelToSurfaceFraction({ x: 1, y: 1 }, null)).toBeNull();
  });
});

describe("dragToSurfaceFraction", () => {
  const surfaceRectPx = { left: 100, top: 100, width: 800, height: 300 };
  const bounds = fullImageSurfaceBounds(RECT);

  // The regression this guards: grabbing an item anywhere other than its bottom-center anchor
  // used to teleport that anchor onto the cursor on the first pointermove.
  it("keeps the item still while the pointer has not moved since the grab", () => {
    const item = { x: 0.5, y: 0.5 };
    const anchorPx = itemBottomCenterPx(item, surfaceRectPx);
    // Grabbed 60px above the anchor (i.e. somewhere up the item's body).
    const pointerPx = { x: anchorPx.x, y: anchorPx.y - 60 };
    const grabOffsetPx = { dx: pointerPx.x - anchorPx.x, dy: pointerPx.y - anchorPx.y };

    const result = dragToSurfaceFraction(pointerPx, grabOffsetPx, surfaceRectPx, bounds);
    expect(result.x).toBeCloseTo(item.x);
    expect(result.y).toBeCloseTo(item.y);
  });

  it("translates the anchor by exactly the pointer's travel", () => {
    const grabOffsetPx = { dx: 0, dy: -60 };
    const result = dragToSurfaceFraction({ x: 500, y: 340 }, grabOffsetPx, surfaceRectPx, bounds);
    // anchor = pointer - offset = (500, 400) → same point pixelToSurfaceFraction maps to (0.5, 1)
    expect(result).toEqual({ x: 0.5, y: 1 });
  });

  it("treats a missing/zero grab offset as a plain pointer-to-fraction conversion", () => {
    expect(dragToSurfaceFraction({ x: 500, y: 400 }, null, surfaceRectPx)).toEqual({ x: 0.5, y: 1 });
  });

  it("returns null without a surface rect", () => {
    expect(dragToSurfaceFraction({ x: 1, y: 1 }, { dx: 0, dy: 0 }, null)).toBeNull();
  });
});
