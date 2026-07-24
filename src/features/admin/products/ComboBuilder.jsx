"use client";

import { Plus, Trash2 } from "lucide-react";
import SearchableSelect from "@/shared/components/admin/inputs/searchable-select";
import SortableList from "@/shared/components/admin/inputs/sortable-list";
import { makeAsyncOptions } from "@/features/admin/adminResources";

const loadProductOptions = makeAsyncOptions("/products", { searchParam: "name" });

/**
 * `value` = JSON string of [{productId, sortOrder}]; `onChange` emits the
 * updated JSON string (RT-F1: comboProducts is a string field).
 */
export default function ComboBuilder({ value, onChange }) {
  let items = [];
  try {
    items = value ? JSON.parse(value) : [];
  } catch {
    items = [];
  }

  const emit = (next) => {
    onChange(JSON.stringify(next.map((item, index) => ({ ...item, sortOrder: index }))));
  };

  const addRow = () => emit([...items, { productId: "", sortOrder: items.length }]);
  const removeRow = (index) => emit(items.filter((_, i) => i !== index));
  const setProduct = (index, productId) =>
    emit(items.map((item, i) => (i === index ? { ...item, productId } : item)));

  const listItems = items.map((item, index) => ({ id: `combo-${index}`, item, index }));

  return (
    <div className="md:col-span-2">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-zinc-800">Sản phẩm trong combo</span>
        <button
          type="button"
          onClick={addRow}
          className="inline-flex h-8 items-center gap-1.5 border border-zinc-300 px-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Thêm sản phẩm
        </button>
      </div>

      {listItems.length === 0 ? (
        <p className="border border-dashed border-zinc-300 px-4 py-6 text-center text-sm text-zinc-400">
          Chưa có sản phẩm nào trong combo.
        </p>
      ) : (
        <SortableList
          items={listItems}
          onReorder={(reordered) => emit(reordered.map((entry) => entry.item))}
          renderItem={({ item, index }) => (
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <SearchableSelect
                  value={item.productId}
                  onChange={(productId) => setProduct(index, productId)}
                  loadOptions={loadProductOptions}
                  placeholder="Chọn sản phẩm"
                />
              </div>
              <button
                type="button"
                onClick={() => removeRow(index)}
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
