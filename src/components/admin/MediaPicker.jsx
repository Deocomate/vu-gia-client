"use client";

import { useEffect, useMemo, useState } from "react";
import { ImageIcon, Search, X } from "lucide-react";
import { adminApi, normalizeCollection } from "@/lib/adminApi";

export default function MediaPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    let active = true;
    setLoading(true);
    adminApi
      .get("/admin/media", { search })
      .then((payload) => {
        if (active) {
          setItems(normalizeCollection(payload).items);
        }
      })
      .catch(() => {
        if (active) {
          setItems([]);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [open, search]);

  const selected = useMemo(
    () => items.find((item) => item.id === value) || null,
    [items, value],
  );

  return (
    <div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-11 items-center gap-2 border border-zinc-300 px-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
        >
          <ImageIcon className="h-4 w-4" aria-hidden="true" />
          {value ? "Đổi ảnh" : "Chọn ảnh"}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="inline-flex h-11 items-center gap-2 border border-zinc-300 px-3 text-sm text-zinc-600 hover:bg-zinc-50"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            Bỏ chọn
          </button>
        )}
      </div>
      <p className="mt-2 text-xs text-zinc-500">
        {selected?.title || selected?.alt || value || "Chưa chọn media"}
      </p>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 px-4">
          <div className="flex max-h-[85vh] w-full max-w-4xl flex-col border border-zinc-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-zinc-950">Chọn media</h2>
                <p className="text-sm text-zinc-500">Dùng ảnh đã upload trong thư viện.</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center hover:bg-zinc-100"
                aria-label="Đóng"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <div className="border-b border-zinc-200 p-4">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Tìm theo tên, alt, folder"
                  className="h-11 w-full border border-zinc-300 pl-10 pr-3 text-sm outline-none focus:border-zinc-950"
                />
              </label>
            </div>
            <div className="grid flex-1 gap-3 overflow-y-auto p-4 sm:grid-cols-2 lg:grid-cols-4">
              {loading && <p className="text-sm text-zinc-500">Đang tải...</p>}
              {!loading &&
                items.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => {
                      onChange(item.id);
                      setOpen(false);
                    }}
                    className={`border p-2 text-left hover:border-zinc-950 ${
                      value === item.id ? "border-zinc-950" : "border-zinc-200"
                    }`}
                  >
                    <div className="aspect-square bg-zinc-100">
                      {item.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.url}
                          alt={item.alt || item.title || ""}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-zinc-400" aria-hidden="true" />
                        </div>
                      )}
                    </div>
                    <p className="mt-2 truncate text-xs font-semibold text-zinc-800">
                      {item.title || item.alt || item.id}
                    </p>
                    <p className="truncate text-xs text-zinc-500">{item.folder || item.mimeType}</p>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
