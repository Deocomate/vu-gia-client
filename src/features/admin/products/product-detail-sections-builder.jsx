"use client";

import { Plus, Trash2 } from "lucide-react";
import { ImageField } from "@/shared/components/admin/inputs/image-uploader";
import SortableList from "@/shared/components/admin/inputs/sortable-list";

const inputClass =
  "h-11 w-full border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-950";
const textareaClass =
  "min-h-24 w-full border border-zinc-300 bg-white px-3 py-2 text-sm leading-6 text-zinc-900 outline-none transition focus:border-zinc-950";

/**
 * `value` = JSON string of [{title, description, image}] — the "Chi tiết
 * sản phẩm" sections rendered on the SINGLE product storefront layout.
 * `onChange` emits the updated JSON string. Layout (image left/right, dark
 * background) is derived from array position on the storefront, not stored
 * here (Validation Session 1, decision 1).
 */
export default function ProductDetailSectionsBuilder({ value, onChange }) {
  let sections = [];
  try {
    sections = value ? JSON.parse(value) : [];
  } catch {
    sections = [];
  }

  const emit = (next) => onChange(JSON.stringify(next));

  const addSection = () => emit([...sections, { title: "", description: "", image: "" }]);
  const removeSection = (index) => emit(sections.filter((_, i) => i !== index));
  const setField = (index, key, fieldValue) =>
    emit(sections.map((section, i) => (i === index ? { ...section, [key]: fieldValue } : section)));

  const listItems = sections.map((section, index) => ({ id: `detail-section-${index}`, section, index }));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-zinc-800">Các phần chi tiết</span>
        <button
          type="button"
          onClick={addSection}
          className="inline-flex h-8 items-center gap-1.5 border border-zinc-300 px-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Thêm phần
        </button>
      </div>

      {listItems.length === 0 ? (
        <p className="border border-dashed border-zinc-300 px-4 py-6 text-center text-sm text-zinc-400">
          Chưa có phần chi tiết nào. Trang sản phẩm sẽ hiển thị nội dung mặc định.
        </p>
      ) : (
        <SortableList
          items={listItems}
          onReorder={(reordered) => emit(reordered.map((entry) => entry.section))}
          renderItem={({ section, index }) => (
            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex flex-col gap-3">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-zinc-600">Tiêu đề</span>
                  <input
                    value={section.title ?? ""}
                    onChange={(event) => setField(index, "title", event.target.value)}
                    className={inputClass}
                    placeholder="Nghệ Thuật Chế Tác Thủ Công"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-zinc-600">Chi tiết</span>
                  <textarea
                    value={section.description ?? ""}
                    onChange={(event) => setField(index, "description", event.target.value)}
                    className={textareaClass}
                    rows={4}
                  />
                </label>
              </div>
              <div className="flex flex-col gap-2">
                <span className="block text-xs font-semibold text-zinc-600">Ảnh</span>
                <ImageField
                  value={section.image ?? ""}
                  onChange={(url) => setField(index, "image", url)}
                  folder="products"
                />
                <button
                  type="button"
                  onClick={() => removeSection(index)}
                  className="inline-flex h-9 items-center justify-center gap-1.5 self-start px-3 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Xóa phần
                </button>
              </div>
            </div>
          )}
        />
      )}
    </div>
  );
}
