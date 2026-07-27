"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Paintbrush } from "lucide-react";
import { ROUTES } from "@/shared/utils/routes";

// Pages where the widget must stay hidden to keep purchase focus.
const HIDDEN_PATHS = [ROUTES.CHECKOUT, ROUTES.CART, ROUTES.ALTAR_CUSTOMIZER];

export default function GlobalAltarWidget() {
  const pathname = usePathname();
  if (HIDDEN_PATHS.includes(pathname)) return null;

  return (
    <>
      {/* Desktop Widget (right-side flyout) */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[100] hidden md:flex flex-col items-end">
        <Link
          href={ROUTES.ALTAR_CUSTOMIZER}
          aria-label="Tự tạo bộ đồ thờ"
          className="group flex items-center bg-primary text-white py-3 pl-3.5 pr-3.5 rounded-l-xl shadow-[-4px_4px_15px_rgba(0,0,0,0.15)] transition-all duration-300 ease-in-out overflow-hidden max-w-[52px] hover:max-w-[280px] focus-visible:max-w-[280px]"
        >
          <Paintbrush className="w-6 h-6 flex-shrink-0" />
          <div className="flex flex-col whitespace-nowrap pl-3 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200">
            <span className="text-[12px] font-montserrat font-medium text-white/80 leading-tight">
              Chưa tìm thấy mẫu ưng ý?
            </span>
            <span className="text-[14px] font-montserrat font-bold leading-tight">
              Tự tạo bộ đồ thờ
            </span>
          </div>
        </Link>
      </div>

      {/* Mobile Fixed Widget (bottom-left corner) */}
      <div className="fixed left-4 bottom-6 z-[100] md:hidden">
        <Link
          href={ROUTES.ALTAR_CUSTOMIZER}
          aria-label="Tự tạo bộ đồ thờ"
          className="flex items-center gap-2.5 bg-primary text-white py-2.5 px-3.5 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.25)] border border-white/20 active:scale-95 transition-all duration-300 group"
        >
          <Paintbrush className="w-5 h-5 flex-shrink-0 transition-transform group-active:rotate-12" />
          <span className="text-[13px] font-montserrat font-bold leading-none tracking-tight whitespace-nowrap">
            Tự tạo bộ đồ thờ
          </span>
        </Link>
      </div>
    </>
  );
}
