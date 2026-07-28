"use client";

import { useEffect, useState } from "react";
import { formatImageUrl } from "@/shared/api/media";
import { adminApi } from "@/shared/api/admin-api";

/**
 * Product picker for the preset builder — fetches Phase 2's customizer feed
 * (`GET /altar-customizer/items`, filtered by the currently selected style and an optional
 * group tab) and lets the admin click a card to add it to the canvas. The invariant this
 * enforces at the source: a card with a non-null `placement` is placeable (added to the
 * canvas), everything else (no placement, or `renderOnAltar = false`) is an accessory
 * (quantity-only, no coordinates, never rendered on the canvas) — see `onAddPlaceable`/
 * `onAddAccessory` callbacks, wired by the parent builder to the actual state mutation.
 */
export default function AltarPresetItemPalette({ altarStyleId, onAddPlaceable, onAddAccessory }) {
  const [groups, setGroups] = useState([]);
  const [activeGroupId, setActiveGroupId] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    adminApi
      .get("/altar-item-groups", { size: 100 })
      .then((data) => {
        if (!cancelled) setGroups((data?.content || []).filter((g) => g.isActive !== false));
      })
      .catch(() => {
        // Non-fatal: tabs stay empty, the "Tất cả" tab still fetches every group's items.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    adminApi
      .get("/altar-customizer/items", {
        altarItemGroupId: activeGroupId || undefined,
        altarStyleId: altarStyleId || undefined,
      })
      .then((data) => {
        if (!cancelled) setItems(Array.isArray(data) ? data : []);
      })
      .catch((requestError) => {
        if (!cancelled) setError(requestError.message || "Không thể tải danh sách vật phẩm.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [activeGroupId, altarStyleId]);

  const handleClick = (item) => {
    if (item.placement) onAddPlaceable(item);
    else onAddAccessory(item);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setActiveGroupId(null)}
          className={`h-8 border px-3 text-xs font-semibold ${
            activeGroupId === null ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-300 text-zinc-700 hover:bg-zinc-50"
          }`}
        >
          Tất cả
        </button>
        {groups.map((group) => (
          <button
            key={group.id}
            type="button"
            onClick={() => setActiveGroupId(group.id)}
            className={`h-8 border px-3 text-xs font-semibold ${
              activeGroupId === group.id ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-300 text-zinc-700 hover:bg-zinc-50"
            }`}
          >
            {group.name}
          </button>
        ))}
      </div>

      {error && (
        <p className="border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">{error}</p>
      )}

      {loading ? (
        <p className="py-6 text-center text-sm text-zinc-400">Đang tải...</p>
      ) : items.length === 0 ? (
        <p className="border border-dashed border-zinc-300 px-4 py-6 text-center text-sm text-zinc-400">
          Không có sản phẩm phù hợp bộ lọc hiện tại.
        </p>
      ) : (
        <div className="grid max-h-[420px] grid-cols-3 gap-2 overflow-y-auto pr-1">
          {items.map((item) => (
            <button
              key={item.productId}
              type="button"
              onClick={() => handleClick(item)}
              title={item.name}
              className="group relative flex flex-col items-center gap-1 border border-zinc-200 bg-white p-2 text-left hover:border-zinc-950"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={formatImageUrl(item.thumb)} alt={item.name} className="h-16 w-full object-contain" draggable={false} />
              <span className="line-clamp-2 w-full text-center text-[11px] font-semibold text-zinc-700">{item.name}</span>
              <span
                className={`absolute right-1 top-1 px-1 text-[9px] font-bold uppercase text-white ${
                  item.placement ? "bg-emerald-600" : "bg-zinc-500"
                }`}
              >
                {item.placement ? "Đặt lên bàn" : "Phụ kiện"}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
