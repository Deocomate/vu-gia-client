"use client";

import { Trash2 } from "lucide-react";
import { formatImageUrl } from "@/shared/api/media";

/**
 * Accessory items (non-canvas, `renderOnAltar = false` or placement-less products) — quantity
 * only, never rendered on `altar-canvas.jsx`. Separate list from the canvas by design (see the
 * phase plan's invariant: `productImage != null ⟺ x/y != null`, accessories are the null side).
 */
export default function AltarPresetAccessoriesList({ items, onChangeQuantity, onRemove }) {
  if (items.length === 0) {
    return (
      <p className="border border-dashed border-zinc-300 px-3 py-4 text-center text-xs text-zinc-400">
        Chưa có phụ kiện — nhấp một sản phẩm "Phụ kiện" ở bảng bên trái để thêm.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      {items.map((item) => (
        <div key={item.instanceId} className="flex items-center gap-2 border border-zinc-200 bg-white px-2 py-1.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={formatImageUrl(item.thumb) || null} alt="" className="h-8 w-8 shrink-0 object-contain" draggable={false} />
          <span className="min-w-0 flex-1 truncate text-xs font-semibold text-zinc-800">{item.name}</span>
          <input
            type="number"
            min={1}
            value={item.quantity}
            onChange={(e) => onChangeQuantity(item.instanceId, Math.max(1, Number(e.target.value) || 1))}
            className="h-7 w-14 border border-zinc-300 px-1.5 text-center text-xs outline-none focus:border-zinc-950"
          />
          <button
            type="button"
            onClick={() => onRemove(item.instanceId)}
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center text-rose-500 hover:bg-rose-50"
            aria-label="Xóa phụ kiện"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  );
}
