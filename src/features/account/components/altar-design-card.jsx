"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { ROUTES } from "@/shared/utils/routes";
import { formatImageUrl } from "@/shared/api/media";
import SafeImage from "@/shared/components/safe-image";

const NAME_MAX_LENGTH = 150;

function formatMoney(value) {
  return `${new Intl.NumberFormat("vi-VN").format(Number(value) || 0)}đ`;
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("vi-VN");
}

/** Best-effort altar label from whatever shape the summary DTO exposes — the exact field names
 * are owned by the concurrently-developed backend (see the phase 5 report's DTO cross-check), so
 * this reads a couple of plausible shapes rather than assuming one and rendering blank/"undefined". */
function describeAltar(design) {
  return (
    design.altarModelSizeLabel ||
    [design.altarModelName, design.altarStyleName].filter(Boolean).join(" · ") ||
    ""
  );
}

/** One card in the "Thư viện thiết kế" grid — thumbnail links to reopen the design in the
 * customizer (`?designId=`), inline rename (no separate modal — this app's `confirm()` helper
 * only supports title/description, not a free-text prompt), and delete. */
export default function AltarDesignCard({ design, onRename, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(design.name || "");

  const startEdit = () => {
    setDraftName(design.name || "");
    setEditing(true);
  };

  const submitEdit = () => {
    setEditing(false);
    if (draftName.trim() && draftName.trim() !== design.name) {
      onRename(draftName);
    }
  };

  const openHref = `${ROUTES.ALTAR_CUSTOMIZER}?designId=${design.id}`;
  const altarLabel = describeAltar(design);

  return (
    <div className="flex flex-col rounded-[6px] border border-[#E5E5E5] bg-white p-4 font-montserrat shadow-[0px_4px_4px_rgba(0,0,0,0.05)]">
      <Link href={openHref} className="relative block aspect-[4/3] w-full overflow-hidden rounded-[6px] bg-[#FAF7F7]">
        <SafeImage
          src={formatImageUrl(design.thumb)}
          alt={design.name || "Thiết kế bàn thờ"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      </Link>

      <div className="mt-3 flex-1">
        {editing ? (
          <div className="flex items-center gap-2">
            <input
              autoFocus
              value={draftName}
              maxLength={NAME_MAX_LENGTH}
              onChange={(event) => setDraftName(event.target.value)}
              className="h-[34px] flex-1 rounded-[6px] border border-[#D1D5DB] px-2 text-[14px] focus:border-[#C76E00] focus:outline-none"
            />
            <button type="button" aria-label="Lưu tên" onClick={submitEdit} className="text-emerald-600 hover:text-emerald-700">
              <Check className="h-4 w-4" />
            </button>
            <button type="button" aria-label="Hủy đổi tên" onClick={() => setEditing(false)} className="text-[#8C8C8C] hover:text-[#2E2F2A]">
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-2">
            <Link href={openHref} className="text-[15px] font-[700] text-[#2E2F2A] hover:text-[#C76E00]">
              {design.name}
            </Link>
            <button type="button" aria-label="Đổi tên" onClick={startEdit} className="shrink-0 text-[#8C8C8C] hover:text-[#2E2F2A]">
              <Pencil className="h-4 w-4" />
            </button>
          </div>
        )}

        {altarLabel && <p className="mt-1 text-[13px] text-[#8C8C8C]">{altarLabel}</p>}
        <p className="mt-1 text-[13px] text-[#8C8C8C]">{formatDate(design.createdAt)}</p>
        <p className="mt-2 text-[15px] font-[700] text-[#C76E00]">{formatMoney(design.totalPrice)}</p>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Link
          href={openHref}
          className="flex h-[36px] flex-1 items-center justify-center rounded-[6px] bg-[#C76E00] text-[13px] font-[700] text-white transition duration-200 hover:bg-[#a65c00]"
        >
          Mở
        </Link>
        <button
          type="button"
          aria-label={`Xóa ${design.name}`}
          onClick={onDelete}
          className="flex h-[36px] w-[36px] items-center justify-center rounded-[6px] border border-[#D1D5DB] text-[#D92D20] transition duration-200 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
