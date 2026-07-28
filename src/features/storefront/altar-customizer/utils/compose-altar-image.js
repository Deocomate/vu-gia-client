import {
  itemBottomCenterPx,
  itemWidthPx,
  surfaceToPixelRect,
} from "@/shared/components/altar/altar-surface-geometry";
import { resolveItemFlipped, resolveItemImage, sortItemsByZIndex } from "@/shared/components/altar/altar-canvas";
import { formatImageUrl } from "@/shared/api/media";

/**
 * Canvas composition for the altar customizer's "Lưu"/"Tải về" outputs (phase 5). Draws the
 * altar background + every placed overlay item into one flattened image via an offscreen
 * <canvas>, honoring the exact same z-order and geometry as the on-screen canvas
 * (`shared/components/altar/altar-canvas.jsx`) — reused here, never re-derived, per that file's
 * "single source of truth" contract.
 *
 * Depends on decision D2 (`next.config.js`'s `/files/:path*` rewrite + `formatImageUrl()`'s
 * same-origin rewrite, `shared/api/media.js`): every image drawn onto the canvas below must
 * resolve same-origin, or `canvas.toDataURL()` throws `SecurityError` the moment a real
 * (non-seed) admin-uploaded overlay is composed. See that module for the full explanation.
 *
 * Split into pure helpers (`computeComposedDimensions`, `buildDrawPlan` — safely unit-testable
 * in plain Node, no DOM) and the actual DOM-touching `composeAltarImage`/`loadImage`/
 * `dataUrlToFile` (browser-only, never called during SSR or tests).
 */

const MAX_COMPOSED_WIDTH = 1600;

/**
 * Pure: scales `(naturalWidth, naturalHeight)` down to fit within `maxWidth`, preserving aspect
 * ratio. Never scales up (a background smaller than `maxWidth` is composed at its own size).
 * Guards against non-finite/non-positive input by falling back to a 1x1 image rather than
 * producing `NaN`/`Infinity` canvas dimensions.
 */
export function computeComposedDimensions(naturalWidth, naturalHeight, maxWidth = MAX_COMPOSED_WIDTH) {
  const width = Math.round(naturalWidth);
  const height = Math.round(naturalHeight);
  if (!(width > 0) || !(height > 0)) return { width: 1, height: 1 };
  if (width <= maxWidth) return { width, height };
  const scale = maxWidth / width;
  return { width: maxWidth, height: Math.max(1, Math.round(height * scale)) };
}

/**
 * Pure: given the altar size's surface-rect config and the canvas items, resolves an ordered
 * draw plan against the background image's *natural* pixel dimensions (`imgW`/`imgH`) — each
 * entry the overlay's raw (unformatted) image reference, its bottom-center anchor point in px,
 * its rendered width in px, and whether it's flipped. Sorted back-to-front by the shared z-order
 * rule (`sortItemsByZIndex`/`autoZIndex`) so callers never re-derive stacking order. Entries
 * missing an image, a resolvable anchor, or a positive width are dropped (mirrors
 * `altar-canvas.jsx`'s own render-time skip of incomplete items) rather than producing a broken
 * draw call.
 */
export function buildDrawPlan(size, items, imgW, imgH) {
  const surfaceRectPx = surfaceToPixelRect(size, imgW, imgH);
  if (!surfaceRectPx) return [];

  return sortItemsByZIndex(items)
    .map((item) => {
      const image = resolveItemImage(item);
      const anchorPx = itemBottomCenterPx(item, surfaceRectPx);
      const widthPx = itemWidthPx(item, surfaceRectPx, size.surfaceWidthCm);
      if (!image || !anchorPx || !(widthPx > 0)) return null;
      return { image, anchorPx, widthPx, flipped: resolveItemFlipped(item) };
    })
    .filter(Boolean);
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Không thể tải ảnh để xuất: ${src}`));
    img.src = src;
  });
}

/**
 * Composes the altar background + every placed overlay item into a single flattened image.
 * Browser-only (`document`, `Image`) — never called during SSR/tests. Used both by the save
 * dialog (thumbnail) and the toolbar's download action (export image) — one implementation, two
 * callers, per the phase plan.
 *
 * @param {object} size - the active altar-model-size object (`backgroundImage`, surface rect
 *   fractions, `surfaceWidthCm` — see `altar-surface-geometry.js`'s coordinate contract).
 * @param {Array} items - canvas items (reducer state shape).
 * @param {{maxWidth?: number}} [options]
 * @returns {Promise<string>} a `data:image/png;base64,...` (or, if PNG encoding fails/produces
 *   an unusable result, `data:image/jpeg;base64,...` at 0.9 quality — the phase plan's documented
 *   fallback for an oversized composite).
 */
export async function composeAltarImage(size, items, { maxWidth = MAX_COMPOSED_WIDTH } = {}) {
  if (!size?.backgroundImage) throw new Error("Thiếu ảnh nền bàn thờ để xuất ảnh.");

  const backgroundImg = await loadImage(formatImageUrl(size.backgroundImage));
  const { width, height } = computeComposedDimensions(
    backgroundImg.naturalWidth,
    backgroundImg.naturalHeight,
    maxWidth,
  );
  const scale = width / backgroundImg.naturalWidth;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Trình duyệt không hỗ trợ Canvas.");

  ctx.drawImage(backgroundImg, 0, 0, width, height);

  const plan = buildDrawPlan(size, items, backgroundImg.naturalWidth, backgroundImg.naturalHeight);
  const overlayImages = await Promise.all(plan.map((entry) => loadImage(formatImageUrl(entry.image))));

  plan.forEach((entry, index) => {
    const overlayImg = overlayImages[index];
    const drawWidth = entry.widthPx * scale;
    const aspect = overlayImg.naturalWidth > 0 ? overlayImg.naturalHeight / overlayImg.naturalWidth : 1;
    const drawHeight = drawWidth * aspect;
    const anchorX = entry.anchorPx.x * scale;
    const anchorY = entry.anchorPx.y * scale;

    ctx.save();
    if (entry.flipped) {
      // Mirror the overlay about its own center (anchorX), matching the on-screen
      // `transform: scaleX(-1)` — not a mirror of the whole canvas.
      ctx.translate(anchorX, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(overlayImg, -drawWidth / 2, anchorY - drawHeight, drawWidth, drawHeight);
    } else {
      ctx.drawImage(overlayImg, anchorX - drawWidth / 2, anchorY - drawHeight, drawWidth, drawHeight);
    }
    ctx.restore();
  });

  try {
    return canvas.toDataURL("image/png");
  } catch (error) {
    // PNG can fail to encode for a very large composite; JPEG at high quality is the phase
    // plan's documented fallback ("Export file size" risk). If that also fails, surface the
    // original error — a same-origin tainting bug should not be silently swallowed.
    try {
      return canvas.toDataURL("image/jpeg", 0.9);
    } catch {
      throw error;
    }
  }
}

/**
 * Converts a `data:image/...;base64,...` URI (this module's own output) into an uploadable
 * `File`, for the save-dialog's thumbnail upload path — `uploadOne()`
 * (`shared/api/media-upload.js`) expects a `File`/`Blob`, not a data URI string.
 */
export function dataUrlToFile(dataUrl, filename) {
  const [header, base64] = dataUrl.split(",");
  const mimeMatch = /data:([^;]+);base64/.exec(header || "");
  const mime = mimeMatch?.[1] || "image/png";
  const binary = atob(base64 || "");
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new File([bytes], filename, { type: mime });
}
