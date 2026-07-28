"use client";

import { FlipHorizontal2, MoveDown, MoveUp, Trash2 } from "lucide-react";
import { computeBringToFrontZ, computeSendToBackZ } from "./hooks/use-altar-canvas-reducer";

/**
 * Small overlay pinned to the top-right corner of the altar canvas (`.canvas-controls` in
 * `altar-customizer.css`) — once an item is selected, quick actions for flip / bring-to-front /
 * send-to-back / delete. Split out of `altar-customizer-designer-panel.jsx` to keep that file
 * under the project's ~200-line-per-file guideline.
 */
export default function AltarCustomizerCanvasControls({
  selectedItem,
  items,
  onFlip,
  onBringToFront,
  onSendToBack,
  onRemove,
}) {
  return (
    <div className="canvas-controls">
      {selectedItem && (
        <>
          <button
            type="button"
            className="canvas-quick-action"
            disabled={selectedItem.flippable === false}
            title={selectedItem.flippable === false ? "Vật phẩm này không thể lật ngang" : "Lật ngang"}
            onClick={onFlip}
          >
            <FlipHorizontal2 aria-hidden="true" />
          </button>
          <button
            type="button"
            className="canvas-quick-action"
            title="Đưa lên trước"
            onClick={() => onBringToFront(computeBringToFrontZ(items))}
          >
            <MoveUp aria-hidden="true" />
          </button>
          <button
            type="button"
            className="canvas-quick-action"
            title="Đưa ra sau"
            onClick={() => onSendToBack(computeSendToBackZ(items))}
          >
            <MoveDown aria-hidden="true" />
          </button>
          <button type="button" className="canvas-quick-action" title="Xóa vật phẩm" onClick={onRemove}>
            <Trash2 aria-hidden="true" />
          </button>
        </>
      )}
    </div>
  );
}
