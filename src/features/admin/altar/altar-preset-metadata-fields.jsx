"use client";

import { ImageField } from "@/shared/components/admin/inputs/image-uploader";

const inputClass =
  "h-10 w-full border border-zinc-300 bg-white px-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-950";
const textareaClass =
  "min-h-[100px] w-full border border-zinc-300 bg-white px-2.5 py-2 text-sm leading-6 text-zinc-900 outline-none transition focus:border-zinc-950";
const labelClass = "mb-1 block text-xs font-semibold text-zinc-600";

/**
 * Metadata form for the preset builder: name/slug/thumb/description, the persisted altar
 * model→size target (unlike `AltarPlacementEditor`'s backdrop picker, `altarModelSizeId` here
 * IS sent to the backend — it's the size this preset was authored for, per D3 in the phase plan:
 * a preset stays tied to exactly one altar size), an optional style, priority and isActive.
 *
 * `activeModelId` is UI-only convenience state (owned by the parent builder) used to filter the
 * size dropdown to one model's sizes — it is never itself part of the save payload.
 */
export default function AltarPresetMetadataFields({
  form,
  onFieldChange,
  models,
  styles,
  activeModelId,
  onSelectModel,
}) {
  const activeModel = models.find((model) => model.id === activeModelId);
  const sizes = activeModel?.sizes || [];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <label className="block">
        <span className={labelClass}>Tên bộ gợi ý *</span>
        <input value={form.name} onChange={(e) => onFieldChange("name", e.target.value)} className={inputClass} required />
      </label>

      <label className="block">
        <span className={labelClass}>Slug</span>
        <input value={form.slug} onChange={(e) => onFieldChange("slug", e.target.value)} className={inputClass} placeholder="Để trống sẽ tự sinh từ tên" />
      </label>

      <label className="block">
        <span className={labelClass}>Loại bàn thờ *</span>
        <select
          value={activeModelId ?? ""}
          onChange={(e) => onSelectModel(Number(e.target.value))}
          className={inputClass}
        >
          <option value="" disabled>Chọn loại bàn thờ</option>
          {models.map((model) => (
            <option key={model.id} value={model.id}>{model.name}</option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className={labelClass}>Kích thước *</span>
        <select
          value={form.altarModelSizeId ?? ""}
          onChange={(e) => onFieldChange("altarModelSizeId", Number(e.target.value))}
          className={inputClass}
          disabled={sizes.length === 0}
        >
          <option value="" disabled>Chọn kích thước</option>
          {sizes.map((size) => (
            <option key={size.id} value={size.id}>{size.label}</option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className={labelClass}>Kiểu men (tùy chọn)</span>
        <select
          value={form.altarStyleId ?? ""}
          onChange={(e) => onFieldChange("altarStyleId", e.target.value === "" ? null : Number(e.target.value))}
          className={inputClass}
        >
          <option value="">Áp dụng mọi kiểu men</option>
          {styles.map((style) => (
            <option key={style.id} value={style.id}>{style.name}</option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className={labelClass}>Thứ tự ưu tiên</span>
        <input
          type="number"
          value={form.priority}
          onChange={(e) => onFieldChange("priority", e.target.value === "" ? 0 : Number(e.target.value))}
          className={inputClass}
        />
      </label>

      <label className="flex h-10 items-center gap-2 self-end">
        <input
          type="checkbox"
          checked={Boolean(form.isActive)}
          onChange={(e) => onFieldChange("isActive", e.target.checked)}
          className="h-4 w-4 accent-zinc-950"
        />
        <span className="text-sm text-zinc-700">Đang hoạt động</span>
      </label>

      <label className="block md:col-span-2">
        <span className={labelClass}>Ảnh đại diện *</span>
        <ImageField value={form.thumb} onChange={(url) => onFieldChange("thumb", url)} folder="altar-presets" />
      </label>

      <label className="block md:col-span-2">
        <span className={labelClass}>Mô tả *</span>
        <textarea
          value={form.description}
          onChange={(e) => onFieldChange("description", e.target.value)}
          className={textareaClass}
          rows={4}
        />
      </label>
    </div>
  );
}
