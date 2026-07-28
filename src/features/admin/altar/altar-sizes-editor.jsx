"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { ImageField } from "@/shared/components/admin/inputs/image-uploader";
import { adminApi } from "@/shared/api/admin-api";
import { toast, confirm } from "@/shared/utils/feedback";

const inputClass =
  "h-10 w-full border border-zinc-300 bg-white px-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-950";
const labelClass = "mb-1 block text-xs font-semibold text-zinc-600";

const EMPTY_SIZE_FORM = {
  label: "",
  widthCm: "",
  depthCm: "",
  backgroundImage: "",
  surfaceLeft: 0,
  surfaceTop: 0,
  surfaceRight: 1,
  surfaceBottom: 1,
  surfaceWidthCm: "",
  priority: 0,
  isActive: true,
};

/**
 * Nested-collection field for an altar model's sizes (`type: "altar-sizes"` in
 * `adminResources.js`, dispatched from `FormField`). Unlike other custom field
 * components (e.g. `ComboBuilder`), sizes are NOT part of the parent altar-model's
 * create/update payload — the API exposes them as their own nested CRUD endpoints
 * (`POST/PUT/DELETE /altar-models/{modelId}/sizes[/{sizeId}]`), so every add/edit/
 * delete here fires immediately against that endpoint instead of being deferred to
 * the model's own Save button (see `AdminResourceManager.toPayload`, which skips
 * this field type entirely).
 *
 * `modelId` is undefined while creating a brand-new model (it has no id yet), so
 * editing is disabled with an explanatory placeholder until the model has been
 * saved once and the admin reopens it for editing.
 */
export default function AltarSizesEditor({ modelId, value, onChange }) {
  const [sizes, setSizes] = useState(() =>
    [...(Array.isArray(value) ? value : [])].sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0)),
  );
  // null = closed, {} = adding a new size, {...size} = editing an existing one
  const [editingSize, setEditingSize] = useState(null);
  const [form, setForm] = useState(EMPTY_SIZE_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const emit = (next) => {
    setSizes(next);
    onChange?.(next);
  };

  const openAdd = () => {
    setForm(EMPTY_SIZE_FORM);
    setFormError("");
    setEditingSize({});
  };

  const openEdit = (size) => {
    setForm({ ...EMPTY_SIZE_FORM, ...size });
    setFormError("");
    setEditingSize(size);
  };

  const closeForm = () => setEditingSize(null);

  const setField = (name, next) => setForm((current) => ({ ...current, [name]: next }));

  const submitSize = async () => {
    const surfaceLeft = Number(form.surfaceLeft);
    const surfaceTop = Number(form.surfaceTop);
    const surfaceRight = Number(form.surfaceRight);
    const surfaceBottom = Number(form.surfaceBottom);
    const surfaceWidthCm = Number(form.surfaceWidthCm);

    if (!form.label?.trim() || !form.backgroundImage) {
      setFormError("Nhãn và ảnh nền bàn thờ là bắt buộc.");
      return;
    }
    if (surfaceLeft >= surfaceRight || surfaceTop >= surfaceBottom) {
      setFormError("Vùng đặt đồ không hợp lệ: Left phải nhỏ hơn Right, Top phải nhỏ hơn Bottom.");
      return;
    }
    if (!(surfaceWidthCm > 0)) {
      setFormError("Chiều rộng mặt bàn thực tế (cm) phải lớn hơn 0.");
      return;
    }

    const payload = {
      label: form.label,
      widthCm: Number(form.widthCm) || 0,
      depthCm: Number(form.depthCm) || 0,
      backgroundImage: form.backgroundImage,
      surfaceLeft,
      surfaceTop,
      surfaceRight,
      surfaceBottom,
      surfaceWidthCm,
      priority: Number(form.priority) || 0,
      isActive: Boolean(form.isActive),
    };

    setSaving(true);
    setFormError("");
    try {
      if (editingSize?.id) {
        const saved = await adminApi.put(`/altar-models/${modelId}/sizes/${editingSize.id}`, payload);
        emit(sizes.map((size) => (size.id === saved.id ? saved : size)));
      } else {
        const saved = await adminApi.post(`/altar-models/${modelId}/sizes`, payload);
        emit([...sizes, saved]);
      }
      toast.success("Đã lưu kích thước.");
      setEditingSize(null);
    } catch (requestError) {
      setFormError(requestError.message || "Không thể lưu kích thước.");
    } finally {
      setSaving(false);
    }
  };

  const removeSize = async (size) => {
    const ok = await confirm({
      title: "Xóa kích thước",
      description: `Xóa kích thước "${size.label}"? Thao tác này không thể hoàn tác.`,
      destructive: true,
    });
    if (!ok) return;

    try {
      await adminApi.delete(`/altar-models/${modelId}/sizes/${size.id}`);
      emit(sizes.filter((item) => item.id !== size.id));
      toast.success("Đã xóa kích thước.");
    } catch (requestError) {
      toast.error(requestError.message || "Không thể xóa kích thước.");
    }
  };

  if (!modelId) {
    return (
      <p className="border border-dashed border-zinc-300 px-4 py-6 text-center text-sm text-zinc-400">
        Lưu loại bàn thờ trước, sau đó mở lại để thêm kích thước.
      </p>
    );
  }

  return (
    // Enter inside a text input would otherwise bubble up and submit the outer
    // resource-editor <form> (this component only ever renders inside one) — swallow it here
    // so a size sub-form doesn't accidentally trigger the parent model's Save.
    <div onKeyDown={(event) => { if (event.key === "Enter" && event.target.tagName !== "TEXTAREA") event.preventDefault(); }}>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-zinc-800">Kích thước ({sizes.length})</span>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex h-8 items-center gap-1.5 border border-zinc-300 px-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Thêm kích thước
        </button>
      </div>

      {sizes.length === 0 ? (
        <p className="border border-dashed border-zinc-300 px-4 py-6 text-center text-sm text-zinc-400">
          Chưa có kích thước nào.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {sizes.map((size) => (
            <div key={size.id} className="flex items-center justify-between gap-3 border border-zinc-200 bg-white px-3 py-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-zinc-900">{size.label}</p>
                <p className="truncate text-xs text-zinc-500">
                  {size.widthCm}×{size.depthCm}cm · mặt bàn {size.surfaceWidthCm}cm · {size.isActive ? "Hoạt động" : "Ẩn"}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => openEdit(size)}
                  className="inline-flex h-8 w-8 items-center justify-center text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950"
                  aria-label="Sửa kích thước"
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => removeSize(size)}
                  className="inline-flex h-8 w-8 items-center justify-center text-rose-500 hover:bg-rose-50"
                  aria-label="Xóa kích thước"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingSize !== null && (
        <div className="mt-3 border border-zinc-200 bg-zinc-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-zinc-800">
              {editingSize?.id ? "Sửa kích thước" : "Thêm kích thước"}
            </span>
            <button type="button" onClick={closeForm} className="text-zinc-400 hover:text-zinc-950" aria-label="Đóng">
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {formError && (
            <div className="mb-3 border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
              {formError}
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className={labelClass}>Nhãn (vd: 127 x 61 cm)</span>
              <input value={form.label} onChange={(e) => setField("label", e.target.value)} className={inputClass} />
            </label>
            <label className="block">
              <span className={labelClass}>Rộng (cm)</span>
              <input type="number" min={0} value={form.widthCm} onChange={(e) => setField("widthCm", e.target.value)} className={inputClass} />
            </label>
            <label className="block">
              <span className={labelClass}>Sâu (cm)</span>
              <input type="number" min={0} value={form.depthCm} onChange={(e) => setField("depthCm", e.target.value)} className={inputClass} />
            </label>
            <label className="block sm:col-span-2">
              <span className={labelClass}>Ảnh nền bàn thờ (kích thước này)</span>
              <ImageField value={form.backgroundImage} onChange={(url) => setField("backgroundImage", url)} folder="altar" />
            </label>
            <label className="block">
              <span className={labelClass}>Mặt bàn thực tế (cm)</span>
              <input type="number" min={0} value={form.surfaceWidthCm} onChange={(e) => setField("surfaceWidthCm", e.target.value)} className={inputClass} />
            </label>
            <label className="block">
              <span className={labelClass}>Thứ tự</span>
              <input type="number" value={form.priority} onChange={(e) => setField("priority", e.target.value)} className={inputClass} />
            </label>
            <label className="block">
              <span className={labelClass}>Vùng đặt đồ — Left (0-1)</span>
              <input type="number" min={0} max={1} step={0.01} value={form.surfaceLeft} onChange={(e) => setField("surfaceLeft", e.target.value)} className={inputClass} />
            </label>
            <label className="block">
              <span className={labelClass}>Vùng đặt đồ — Top (0-1)</span>
              <input type="number" min={0} max={1} step={0.01} value={form.surfaceTop} onChange={(e) => setField("surfaceTop", e.target.value)} className={inputClass} />
            </label>
            <label className="block">
              <span className={labelClass}>Vùng đặt đồ — Right (0-1)</span>
              <input type="number" min={0} max={1} step={0.01} value={form.surfaceRight} onChange={(e) => setField("surfaceRight", e.target.value)} className={inputClass} />
            </label>
            <label className="block">
              <span className={labelClass}>Vùng đặt đồ — Bottom (0-1)</span>
              <input type="number" min={0} max={1} step={0.01} value={form.surfaceBottom} onChange={(e) => setField("surfaceBottom", e.target.value)} className={inputClass} />
            </label>
            <label className="flex h-10 items-center gap-2 sm:col-span-2">
              <input type="checkbox" checked={Boolean(form.isActive)} onChange={(e) => setField("isActive", e.target.checked)} className="h-4 w-4 accent-zinc-950" />
              <span className="text-sm text-zinc-700">Đang hoạt động</span>
            </label>
          </div>

          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={closeForm}
              disabled={saving}
              className="h-9 border border-zinc-300 px-3 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={submitSize}
              disabled={saving}
              className="h-9 bg-zinc-950 px-3 text-xs font-semibold text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Đang lưu..." : "Lưu kích thước"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
