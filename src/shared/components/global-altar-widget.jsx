"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Paintbrush, X } from "lucide-react";
import { ROUTES } from "@/shared/utils/routes";

// Pages where the widget must stay hidden to keep purchase focus.
const HIDDEN_PATHS = [ROUTES.CHECKOUT, ROUTES.CART, ROUTES.ALTAR_CUSTOMIZER];

export default function GlobalAltarWidget() {
  const pathname = usePathname();
  const [isDismissed, setIsDismissed] = useState(false);

  if (HIDDEN_PATHS.includes(pathname)) return null;

  const isProductPage = pathname ? pathname.startsWith(ROUTES.PRODUCTS) : false;

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

      {/* Product Pages Fixed Bottom Banner (Centered Pill Box with Icon & Text) */}
      {isProductPage && !isDismissed && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-[460px] animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="relative flex items-center justify-between gap-3 bg-primary text-white py-3 px-5 rounded-full shadow-[0_10px_35px_rgba(0,0,0,0.3)] border border-white/20 group hover:brightness-105 active:scale-[0.99] transition-all duration-300">
            <Link
              href={ROUTES.ALTAR_CUSTOMIZER}
              className="flex items-center gap-3 flex-1 min-w-0"
              aria-label="Tùy chỉnh bộ đồ thờ"
            >
              <div className="bg-white/20 p-2 rounded-full flex-shrink-0 group-hover:scale-110 transition-transform">
                <Paintbrush className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[14px] md:text-[16px] font-montserrat font-bold uppercase tracking-wide text-white truncate">
                  TÙY CHỈNH BỘ ĐỒ THỜ
                </span>
                <span className="text-[11px] md:text-[12px] font-montserrat font-medium text-white/85 truncate">
                  Tự phối không gian thờ theo ý thích
                </span>
              </div>
            </Link>

            <button
              onClick={() => setIsDismissed(true)}
              className="p-1.5 hover:bg-white/20 rounded-full transition-colors flex-shrink-0 text-white/80 hover:text-white"
              aria-label="Đóng thông báo"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Fixed Widget (bottom-left corner) - Shown on non-product pages */}
      {!isProductPage && (
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
      )}
    </>
  );
}
