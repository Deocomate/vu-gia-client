"use client";

import { AlignCenter, FlipHorizontal2, Redo2, RotateCcw, Trash2, Undo2 } from "lucide-react";

/**
 * Functional replacement for the old always-`disabled` toolbar — every button now dispatches
 * into the canvas reducer (`use-altar-canvas-reducer.js`) via the callbacks passed down from
 * `altar-customizer-view.jsx`. Zoom stays a sibling within the same `.tool-bar` flex row (kept
 * here, not split out, to preserve the original `margin-left: auto` layout in
 * `altar-customizer.css`).
 */
export default function AltarCustomizerToolbar({
  canUndo,
  canRedo,
  hasSelection,
  hasItems,
  hasPreset,
  onUndo,
  onRedo,
  onCenter,
  onMirror,
  onClear,
  onRestorePreset,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomChange,
}) {
  return (
    <div className="tool-bar" aria-label="Thanh công cụ">
      <button
        type="button"
        className="tool-button undo-button"
        disabled={!canUndo}
        aria-disabled={!canUndo}
        onClick={onUndo}
      >
        <Undo2 className="tool-icon" aria-hidden="true" />
        <span>Hoàn tác</span>
      </button>
      <button
        type="button"
        className="tool-button redo-button"
        disabled={!canRedo}
        aria-disabled={!canRedo}
        onClick={onRedo}
      >
        <Redo2 className="tool-icon" aria-hidden="true" />
        <span>Làm lại</span>
      </button>
      <button
        type="button"
        className="tool-button center-button"
        disabled={!hasSelection}
        aria-disabled={!hasSelection}
        onClick={onCenter}
      >
        <AlignCenter className="tool-icon" aria-hidden="true" />
        <span>Căn giữa</span>
      </button>
      <button
        type="button"
        className="tool-button mirror-button"
        disabled={!hasSelection}
        aria-disabled={!hasSelection}
        onClick={onMirror}
      >
        <FlipHorizontal2 className="tool-icon" aria-hidden="true" />
        <span>Tạo đối xứng</span>
      </button>
      <button
        type="button"
        className="tool-button clear-button"
        disabled={!hasItems}
        aria-disabled={!hasItems}
        onClick={onClear}
      >
        <Trash2 className="tool-icon" aria-hidden="true" />
        <span>Xóa tất cả</span>
      </button>
      <button
        type="button"
        className="tool-button restore-button"
        disabled={!hasPreset}
        aria-disabled={!hasPreset}
        onClick={onRestorePreset}
      >
        <RotateCcw className="tool-icon" aria-hidden="true" />
        <span>Khôi phục mẫu</span>
      </button>
      <div className="zoom-control" aria-label="Điều khiển thu phóng">
        <button type="button" aria-label="Thu nhỏ" onClick={onZoomOut} className="zoom-btn zoom-btn-minus">
          −
        </button>
        <div className="zoom-input-wrap">
          <input
            type="number"
            value={zoom}
            onChange={(e) => onZoomChange(e.target.value)}
            className="zoom-input"
            min={50}
            max={150}
            aria-label="Phần trăm thu phóng"
          />
          <span className="zoom-input-suffix">%</span>
        </div>
        <button type="button" aria-label="Phóng to" onClick={onZoomIn} className="zoom-btn zoom-btn-plus">
          +
        </button>
      </div>
    </div>
  );
}
