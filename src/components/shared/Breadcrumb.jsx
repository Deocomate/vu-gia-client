import React from "react";
import Link from "next/link";
import { ROUTES } from "@/utils/routes";

export default function Breadcrumb({ items, className = "" }) {
  // Fallback to default breadcrumb trail if no items are passed
  const defaultItems = [
    { name: "Trang chủ", href: ROUTES.HOME },
    { name: "Bộ đồ thờ", href: null },
  ];

  const trail = items && items.length > 0 ? items : defaultItems;

  return (
    <nav className={`select-none ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap text-[14px] font-montserrat font-[500] text-[#2E2F2A] leading-[40px]">
        {trail.map((item, index) => {
          const isLast = index === trail.length - 1;

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <span className="mx-3 flex items-center justify-center text-[#2E2F2A]">
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </span>
              )}
              {isLast || !item.href ? (
                <span className="text-[#2E2F2A] font-[500]">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-[#2E2F2A] font-[500] hover:text-primary transition-all duration-300"
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

