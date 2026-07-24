"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { BLOCK_TYPE_LIST, BLOCK_TYPE_LABELS } from "@/shared/components/blocks/schema";

export default function AddBlockMenu({ onAdd }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-1.5 border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Thêm khối
      </button>
      {open && (
        <div className="absolute left-0 top-full z-10 mt-1 flex w-56 flex-col border border-zinc-200 bg-white py-1 shadow-md">
          {BLOCK_TYPE_LIST.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                onAdd(type);
                setOpen(false);
              }}
              className="px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50"
            >
              {BLOCK_TYPE_LABELS[type]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
