"use client";

import { Plus, Trash2 } from "lucide-react";
import SortableList from "@/shared/components/admin/inputs/sortable-list";

const cellInputClass =
  "h-9 w-full border border-zinc-300 bg-white px-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-950";

/**
 * `value` = JSON string of [{name, quantity, unit, usage}] — the "Công năng
 * sản phẩm" table rendered on the COMBO product storefront layout.
 * `quantity`/`unit` are free-text (storefront shows ranges like "1 - 2" and
 * plain units like "Bộ"), not numbers (Validation Session 1, decision 4).
 */
export default function ProductFunctionsTable({ value, onChange }) {
  let rows = [];
  try {
    rows = value ? JSON.parse(value) : [];
  } catch {
    rows = [];
  }

  const emit = (next) => onChange(JSON.stringify(next));

  const addRow = () => emit([...rows, { name: "", quantity: "", unit: "", usage: "" }]);
  const removeRow = (index) => emit(rows.filter((_, i) => i !== index));
  const setField = (index, key, fieldValue) =>
    emit(rows.map((row, i) => (i === index ? { ...row, [key]: fieldValue } : row)));

  const listItems = rows.map((row, index) => ({ id: `function-row-${index}`, row, index }));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-zinc-800">Công năng sản phẩm</span>
        <button
          type="button"
          onClick={addRow}
          className="inline-flex h-8 items-center gap-1.5 border border-zinc-300 px-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Thêm dòng
        </button>
      </div>

      {listItems.length === 0 ? (
        <p className="border border-dashed border-zinc-300 px-4 py-6 text-center text-sm text-zinc-400">
          Chưa có công năng nào. Trang sản phẩm sẽ hiển thị bảng mặc định.
        </p>
      ) : (
        <>
          <div className="mb-1 hidden grid-cols-[32px_1fr_120px_100px_1fr] gap-2 px-2 text-xs font-semibold uppercase text-zinc-500 md:grid">
            <span>STT</span>
            <span>Tên vật phẩm</span>
            <span>Số lượng</span>
            <span>ĐVT</span>
            <span>Công dụng</span>
          </div>
          <SortableList
            items={listItems}
            onReorder={(reordered) => emit(reordered.map((entry) => entry.row))}
            renderItem={({ row, index }) => (
              <div className="grid grid-cols-1 gap-2 md:grid-cols-[32px_1fr_120px_100px_1fr_auto] md:items-center">
                <span className="hidden text-center text-sm font-semibold text-zinc-500 md:block">
                  {index + 1}
                </span>
                <input
                  value={row.name ?? ""}
                  onChange={(event) => setField(index, "name", event.target.value)}
                  className={cellInputClass}
                  placeholder="Bát hương"
                />
                <input
                  value={row.quantity ?? ""}
                  onChange={(event) => setField(index, "quantity", event.target.value)}
                  className={cellInputClass}
                  placeholder="1 - 2"
                />
                <input
                  value={row.unit ?? ""}
                  onChange={(event) => setField(index, "unit", event.target.value)}
                  className={cellInputClass}
                  placeholder="Chiếc"
                />
                <input
                  value={row.usage ?? ""}
                  onChange={(event) => setField(index, "usage", event.target.value)}
                  className={cellInputClass}
                  placeholder="Dùng cắm hương, thờ Thần linh"
                />
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
        </>
      )}
    </div>
  );
}
