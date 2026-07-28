"use client";

import { Trash2 } from "lucide-react";
import AltarCanvas, { resolveItemId } from "@/shared/components/altar/altar-canvas";

const labelClass = "mb-1 block text-xs font-semibold text-zinc-600";

/**
 * Wraps the shared `altar-canvas.jsx` with the selected-item inspector (scale/flip/z-order/
 * quantity/remove) — everything `altar-canvas.jsx` deliberately stays presentation-only about
 * (position dragging + selection only).
 */
export default function AltarPresetCanvasPanel({
  activeSize,
  canvasItems,
  onChangeCanvasItems,
  selectedId,
  onSelect,
  onUpdateSelected,
  onRemoveSelected,
}) {
  const selectedItem = canvasItems.find((item) => resolveItemId(item) === selectedId) || null;

  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <div>
        {activeSize ? (
          <AltarCanvas
            size={activeSize}
            items={canvasItems}
            onChange={onChangeCanvasItems}
            selectedId={selectedId}
            onSelect={onSelect}
          />
        ) : (
          <div className="flex aspect-video items-center justify-center border border-dashed border-zinc-300 text-sm text-zinc-400">
            Chọn loại bàn thờ và kích thước để bắt đầu sắp xếp.
          </div>
        )}
        <p className="mt-1.5 text-xs text-zinc-500">
          Kéo vật phẩm để đổi vị trí, hoặc dùng phím mũi tên (Shift = bước lớn) khi đã chọn. Nhấp vào vật phẩm để chọn và chỉnh sửa bên phải.
        </p>
      </div>

      <div>
        <span className={labelClass}>Vật phẩm đang chọn</span>
        {!selectedItem ? (
          <p className="border border-dashed border-zinc-300 px-3 py-6 text-center text-xs text-zinc-400">
            Nhấp một vật phẩm trên bàn thờ để chỉnh sửa tỉ lệ, lật ngang, thứ tự lớp hoặc số lượng.
          </p>
        ) : (
          <div className="flex flex-col gap-3 border border-zinc-200 bg-zinc-50 p-3">
            <p className="truncate text-sm font-semibold text-zinc-900">{selectedItem.name}</p>

            <label className="block">
              <span className={labelClass}>Điều chỉnh tỉ lệ (scaleAdjust: {Number(selectedItem.scaleAdjust ?? 1).toFixed(2)})</span>
              <input
                type="range"
                min={0.1}
                max={5}
                step={0.05}
                value={selectedItem.scaleAdjust ?? 1}
                onChange={(e) => onUpdateSelected({ scaleAdjust: Number(e.target.value) })}
                className="w-full accent-zinc-950"
              />
            </label>

            <label className="flex h-9 items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(selectedItem.flipped)}
                disabled={selectedItem.flippable === false}
                onChange={(e) => onUpdateSelected({ flipped: e.target.checked })}
                className="h-4 w-4 accent-zinc-950"
              />
              <span className="text-sm text-zinc-700">
                Lật ngang{selectedItem.flippable === false ? " (không cho phép với vật phẩm này)" : ""}
              </span>
            </label>

            <label className="block">
              <span className={labelClass}>Ghi đè thứ tự lớp — để trống = tự động theo vị trí Y</span>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={selectedItem.zIndexOverride ?? ""}
                  onChange={(e) => onUpdateSelected({ zIndexOverride: e.target.value === "" ? null : Number(e.target.value) })}
                  placeholder="Tự động"
                  className="h-9 w-full border border-zinc-300 px-2 text-sm outline-none focus:border-zinc-950"
                />
                {selectedItem.zIndexOverride !== null && selectedItem.zIndexOverride !== undefined && (
                  <button
                    type="button"
                    onClick={() => onUpdateSelected({ zIndexOverride: null })}
                    className="h-9 shrink-0 border border-zinc-300 px-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                  >
                    Tự động
                  </button>
                )}
              </div>
            </label>

            <label className="block">
              <span className={labelClass}>Số lượng</span>
              <input
                type="number"
                min={1}
                value={selectedItem.quantity ?? 1}
                onChange={(e) => onUpdateSelected({ quantity: Math.max(1, Number(e.target.value) || 1) })}
                className="h-9 w-full border border-zinc-300 px-2 text-sm outline-none focus:border-zinc-950"
              />
            </label>

            <button
              type="button"
              onClick={onRemoveSelected}
              className="inline-flex h-9 items-center justify-center gap-1.5 border border-rose-300 text-xs font-semibold text-rose-600 hover:bg-rose-50"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              Gỡ khỏi bàn thờ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
