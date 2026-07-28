"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { formatImageUrl } from "@/shared/api/media";
import AltarDraggableItem from "@/shared/components/altar/altar-draggable-item";
import {
  fullImageSurfaceBounds,
  itemBottomCenterPx,
  itemWidthPx,
  renderZIndex,
  surfaceToPixelRect,
} from "@/shared/components/altar/altar-surface-geometry";

/**
 * Pure presentation: renders the chosen altar-size backdrop and the overlay image as a
 * draggable item. No network calls — `activeSize` (an
 * `AltarModelSizeResponse`-shaped object) and `placement` (the in-progress form state) are
 * supplied by `altar-placement-editor.jsx`. Position changes are reported in surface-fraction
 * `(x, y)` space via `onPositionChange`, unrounded (free-form drag).
 */
export default function AltarPlacementCanvas({
  activeSize,
  placement,
  onPositionChange,
}) {
  const imgRef = useRef(null);
  const [renderedSize, setRenderedSize] = useState(null);
  const [overlayFailed, setOverlayFailed] = useState(false);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return undefined;
    const update = () => setRenderedSize({ w: el.clientWidth, h: el.clientHeight });
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [activeSize?.backgroundImage]);

  useEffect(() => {
    setOverlayFailed(false);
  }, [placement.overlayImage]);

  const getSurfaceRectPxViewport = useCallback(() => {
    if (!imgRef.current || !activeSize) return null;
    const rect = imgRef.current.getBoundingClientRect();
    const local = surfaceToPixelRect(activeSize, rect.width, rect.height);
    if (!local) return null;
    return { left: rect.left + local.left, top: rect.top + local.top, width: local.width, height: local.height };
  }, [activeSize]);

  const handlePositionChange = useCallback(
    (nextX, nextY) => {
      onPositionChange(nextX, nextY);
    },
    [onPositionChange],
  );

  if (!activeSize) {
    return (
      <div className="flex aspect-video items-center justify-center border border-dashed border-zinc-300 text-sm text-zinc-400">
        Chọn loại bàn thờ và kích thước để xem trước.
      </div>
    );
  }

  const localSurfaceRectPx = renderedSize ? surfaceToPixelRect(activeSize, renderedSize.w, renderedSize.h) : null;
  const fullImageBounds = fullImageSurfaceBounds(activeSize);
  const anchorPx = localSurfaceRectPx ? itemBottomCenterPx(placement, localSurfaceRectPx) : null;
  const itemWidthPxValue =
    localSurfaceRectPx && placement.widthCm
      ? itemWidthPx(placement, localSurfaceRectPx, activeSize.surfaceWidthCm)
      : null;

  return (
    <div className="relative select-none border border-zinc-200 bg-zinc-100">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={formatImageUrl(activeSize.backgroundImage)}
        alt="Ảnh nền bàn thờ"
        className="block w-full"
        draggable={false}
      />

      {localSurfaceRectPx && anchorPx && placement.overlayImage && (
        <AltarDraggableItem
          x={placement.x}
          y={placement.y}
          onChange={handlePositionChange}
          getSurfaceRectPx={getSurfaceRectPxViewport}
          bounds={fullImageBounds}
          className="absolute cursor-grab touch-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-sky-500 active:cursor-grabbing"
          style={{
            left: anchorPx.x,
            top: anchorPx.y,
            width: itemWidthPxValue || undefined,
            transform: "translate(-50%, -100%)",
            // Floored at 0 (see `renderZIndex`): dragging the overlay above the tabletop makes
            // `y` negative, and a negative z-index paints it behind the backdrop `<img>`.
            zIndex: renderZIndex({ y: placement.y, zIndexOverride: placement.zIndexOverride }),
          }}
        >
          {overlayFailed ? (
            <div className="pointer-events-none flex min-h-16 min-w-16 items-center justify-center border border-dashed border-rose-400 bg-rose-50 px-2 py-1 text-center text-[11px] font-semibold text-rose-600">
              Ảnh vật phẩm không tải được
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={formatImageUrl(placement.overlayImage)}
              alt="Vật phẩm"
              className="pointer-events-none block w-full"
              draggable={false}
              onError={() => setOverlayFailed(true)}
            />
          )}
        </AltarDraggableItem>
      )}
    </div>
  );
}
