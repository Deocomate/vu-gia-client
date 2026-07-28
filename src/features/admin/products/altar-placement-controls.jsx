"use client";

import { ImageField } from "@/shared/components/admin/inputs/image-uploader";

const inputClass =
  "h-10 w-full border border-zinc-300 bg-white px-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-950";
const labelClass = "mb-1 block text-xs font-semibold text-zinc-600";

/**
 * Right-column form controls for the placement editor: backdrop selector (authoring-only,
 * never persisted — see `altar-placement-editor.jsx`), overlay upload, and size/scale/flip/
 * z-order fields. Purely controlled — all state lives in the parent editor.
 */
export default function AltarPlacementControls({
  models,
  activeModelId,
  activeSizeId,
  onSelectModel,
  onSelectSize,
  activeSize,
  placement,
  onFieldChange,
}) {
  const activeModel = models.find((model) => model.id === activeModelId);
  const sizes = activeModel?.sizes || [];
  const percentOfTabletop =
    activeSize?.surfaceWidthCm && placement.widthCm
      ? ((placement.widthCm / activeSize.surfaceWidthCm) * 100).toFixed(1)
      : null;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <span className={labelClass}>Bối cảnh xem trước (chỉ để canh chỉnh, không lưu)</span>
        <div className="grid grid-cols-2 gap-2">
          <select value={activeModelId ?? ""} onChange={(e) => onSelectModel(Number(e.target.value))} className={inputClass}>
            {models.map((model) => (
              <option key={model.id} value={model.id}>{model.name}</option>
            ))}
          </select>
          <select value={activeSizeId ?? ""} onChange={(e) => onSelectSize(Number(e.target.value))} className={inputClass}>
            {sizes.map((size) => (
              <option key={size.id} value={size.id}>{size.label}</option>
            ))}
          </select>
        </div>
      </div>

      <label className="block">
        <span className={labelClass}>Ảnh vật phẩm (PNG nền trong suốt, crop sát vật thể)</span>
        <ImageField value={placement.overlayImage} onChange={(url) => onFieldChange("overlayImage", url)} folder="altar-overlays" />
      </label>

      <label className="block">
        <span className={labelClass}>Chiều rộng thực tế (cm)</span>
        <input
          type="number"
          min={1}
          value={placement.widthCm}
          onChange={(e) => onFieldChange("widthCm", e.target.value === "" ? "" : Number(e.target.value))}
          className={inputClass}
        />
        {percentOfTabletop && (
          <span className="mt-1 block text-xs text-zinc-500">≈ {percentOfTabletop}% chiều rộng mặt bàn đang xem</span>
        )}
      </label>

      <label className="block">
        <span className={labelClass}>Điều chỉnh tỉ lệ (scaleAdjust: {placement.scaleAdjust.toFixed(2)})</span>
        <input
          type="range"
          min={0.1}
          max={5}
          step={0.05}
          value={placement.scaleAdjust}
          onChange={(e) => onFieldChange("scaleAdjust", Number(e.target.value))}
          className="w-full accent-zinc-950"
        />
      </label>

      <label className="flex h-10 items-center gap-2">
        <input
          type="checkbox"
          checked={Boolean(placement.flippable)}
          onChange={(e) => onFieldChange("flippable", e.target.checked)}
          className="h-4 w-4 accent-zinc-950"
        />
        <span className="text-sm text-zinc-700">Cho phép khách lật ngang vật phẩm</span>
      </label>

      <label className="block">
        <span className={labelClass}>Ghi đè thứ tự lớp (zIndexOverride) — để trống = tự động theo vị trí Y</span>
        <div className="flex gap-2">
          <input
            type="number"
            value={placement.zIndexOverride ?? ""}
            onChange={(e) => onFieldChange("zIndexOverride", e.target.value === "" ? null : Number(e.target.value))}
            placeholder="Tự động"
            className={inputClass}
          />
          {placement.zIndexOverride !== null && (
            <button type="button" onClick={() => onFieldChange("zIndexOverride", null)} className="h-10 shrink-0 border border-zinc-300 px-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50">
              Xóa, dùng tự động
            </button>
          )}
        </div>
      </label>

      <div className="border-t border-zinc-200 pt-3 text-xs text-zinc-500">
        Vị trí (x, y): {(placement.x * 100).toFixed(1)}%, {(placement.y * 100).toFixed(1)}% trong vùng đặt đồ —
        kéo vật phẩm trên bối cảnh hoặc dùng phím mũi tên (Shift = bước lớn) khi đã chọn.
      </div>
    </div>
  );
}
