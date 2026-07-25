"use client";

import { Plus, Trash2 } from "lucide-react";
import { ImageField } from "@/shared/components/admin/inputs/image-uploader";
import SortableList from "@/shared/components/admin/inputs/sortable-list";

/**
 * `value` = JSON string of [{url}] — the full-width slider gallery rendered
 * above the "Công năng sản phẩm" table on the COMBO storefront layout.
 * Separate from the main product gallery (`ProductGalleryManager` /
 * `product_images`) by design (Validation Session 1, decision 2).
 */
export default function ComboGalleryManager({ value, onChange }) {
  let items = [];
  try {
    items = value ? JSON.parse(value) : [];
  } catch {
    items = [];
  }

  const emit = (next) => onChange(JSON.stringify(next));

  const addImage = () => emit([...items, { url: "" }]);
  const removeImage = (index) => emit(items.filter((_, i) => i !== index));
  const setUrl = (index, url) => emit(items.map((item, i) => (i === index ? { ...item, url } : item)));

  const listItems = items.map((item, index) => ({ id: `combo-gallery-${index}`, item, index }));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-zinc-800">Ảnh slider combo</span>
        <button
          type="button"
          onClick={addImage}
          className="inline-flex h-8 items-center gap-1.5 border border-zinc-300 px-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Thêm ảnh
        </button>
      </div>

      {listItems.length === 0 ? (
        <p className="border border-dashed border-zinc-300 px-4 py-6 text-center text-sm text-zinc-400">
          Chưa có ảnh slider. Trang sản phẩm sẽ hiển thị ảnh mặc định.
        </p>
      ) : (
        <SortableList
          items={listItems}
          onReorder={(reordered) => emit(reordered.map((entry) => entry.item))}
          renderItem={({ item, index }) => (
            <div className="flex items-start gap-2">
              <div className="w-48">
                <ImageField value={item.url ?? ""} onChange={(url) => setUrl(index, url)} folder="products" />
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="inline-flex h-9 w-9 items-center justify-center text-rose-500 hover:bg-rose-50"
                aria-label="Xóa"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}
        />
      )}
    </div>
  );
}
