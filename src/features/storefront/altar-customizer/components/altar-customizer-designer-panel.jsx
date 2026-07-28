"use client";

import { useEffect, useRef, useState } from "react";
import { CirclePlus } from "lucide-react";
import { confirm, toast } from "@/shared/utils/feedback";
import { publicGet, PublicApiError } from "@/shared/api/public-api";
import AltarCanvas, { resolveItemId } from "@/shared/components/altar/altar-canvas";
import { mapPresetToCanvasState } from "./hooks/use-altar-canvas-reducer";
import AltarCustomizerToolbar from "./altar-customizer-toolbar";
import AltarCustomizerCanvasControls from "./altar-customizer-canvas-controls";
import AltarCustomizerItemPalette from "./altar-customizer-item-palette";

function clampZoom(value) {
  return Math.max(50, Math.min(150, Number(value) || 100));
}

/**
 * The interactive canvas + toolbar + palette panel. Wraps the shared, presentation-only
 * `altar-canvas.jsx` (Phase 3) — never a second canvas implementation — adding zoom (local UI
 * state, not canvas content, so it isn't part of the reducer). Dragging is fully free-form: no
 * grid/snap, no alignment-guide nudging.
 */
export default function AltarCustomizerDesignerPanel({
  activeSize,
  canvasState,
  canUndo,
  canRedo,
  actions,
  feedItems,
  groups,
  styles,
}) {
  const [zoom, setZoom] = useState(100);
  const [restoring, setRestoring] = useState(false);
  const canvasWrapperRef = useRef(null);

  const { items, accessories, selectedInstanceId, presetId } = canvasState;

  // "Khôi phục mẫu" re-fetches the currently-loaded preset by id and reloads it wholesale,
  // discarding any manual edits made since — the reducer only remembers the preset's id, not its
  // original items, so restoring re-reads the source of truth instead of caching a duplicate copy.
  const handleRestorePreset = async () => {
    if (!presetId || restoring) return;
    setRestoring(true);
    try {
      const preset = await publicGet(`/altar-presets/${presetId}`);
      const mapped = mapPresetToCanvasState(preset);
      actions.loadPreset({ presetId: preset.id, ...mapped });
    } catch (requestError) {
      toast.error(
        requestError instanceof PublicApiError ? requestError.message : "Không thể khôi phục bộ gợi ý.",
      );
    } finally {
      setRestoring(false);
    }
  };

  // Delete/Backspace removes the selected item — ignored while focus is in a text/number input
  // (e.g. the zoom field) so it doesn't fight normal text editing.
  useEffect(() => {
    if (!selectedInstanceId) return undefined;
    const handleKeyDown = (event) => {
      if (event.key !== "Delete" && event.key !== "Backspace") return;
      const tag = event.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      actions.remove(selectedInstanceId);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedInstanceId, actions]);

  const handleCanvasChange = (nextItems) => {
    const changed = nextItems.find((item, index) => {
      const prev = items[index];
      return prev && resolveItemId(prev) === resolveItemId(item) && (prev.x !== item.x || prev.y !== item.y);
    });
    if (!changed) return;

    actions.move({ instanceId: resolveItemId(changed), x: changed.x, y: changed.y });
  };

  const selectedItem = items.find((item) => resolveItemId(item) === selectedInstanceId) || null;

  const handleClear = async () => {
    const ok = await confirm({
      title: "Xóa tất cả vật phẩm",
      description: "Toàn bộ vật phẩm và phụ kiện đã thêm sẽ bị xóa khỏi bố cục hiện tại. Bạn có chắc chắn?",
      confirmLabel: "Xóa tất cả",
      cancelLabel: "Hủy",
      destructive: true,
    });
    if (ok) actions.clear();
  };

  return (
    <section className="designer-panel" aria-label="Khu vực tùy chỉnh bố cục đồ thờ">
      <AltarCustomizerToolbar
        canUndo={canUndo}
        canRedo={canRedo}
        hasSelection={Boolean(selectedItem)}
        hasItems={items.length > 0 || accessories.length > 0}
        hasPreset={Boolean(presetId) && !restoring}
        onUndo={actions.undo}
        onRedo={actions.redo}
        onCenter={() => selectedInstanceId && actions.center(selectedInstanceId)}
        onMirror={() => selectedInstanceId && actions.mirror(selectedInstanceId)}
        onClear={handleClear}
        onRestorePreset={handleRestorePreset}
        zoom={zoom}
        onZoomIn={() => setZoom((v) => clampZoom(v + 10))}
        onZoomOut={() => setZoom((v) => clampZoom(v - 10))}
        onZoomChange={(value) => setZoom(clampZoom(value))}
      />

      <div className="altar-preview">
        <div
          ref={canvasWrapperRef}
          className="altar-canvas-wrapper"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: "center top" }}
        >
          <AltarCanvas
            size={activeSize}
            items={items}
            onChange={handleCanvasChange}
            selectedId={selectedInstanceId}
            onSelect={actions.select}
          />
        </div>

        <AltarCustomizerCanvasControls
          selectedItem={selectedItem}
          items={items}
          onFlip={() => actions.flip(selectedInstanceId)}
          onBringToFront={(z) => actions.setZ(selectedInstanceId, z)}
          onSendToBack={(z) => actions.setZ(selectedInstanceId, z)}
          onRemove={() => actions.remove(selectedInstanceId)}
        />

        {!activeSize && (
          <div className="drag-hint">
            <CirclePlus className="drag-hint-icon" aria-hidden="true" />
            <span>Chọn loại bàn thờ và kích thước để bắt đầu</span>
          </div>
        )}
      </div>

      <AltarCustomizerItemPalette
        items={feedItems}
        groups={groups}
        styles={styles}
        altarStyleId={canvasState.altarStyleId}
        onChangeStyle={(styleId) => actions.changeSize({ altarStyleId: styleId })}
        onAddPlaceable={actions.add}
        onAddAccessory={actions.addAccessory}
      />
    </section>
  );
}
