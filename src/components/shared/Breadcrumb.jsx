import React from "react";
import Link from "next/link";
import { ROUTES } from "@/utils/routes";

export default function Breadcrumb({ items, separator = "/", className = "" }) {
  // Fallback to default breadcrumb trail if no items are passed
  const defaultItems = [
    { name: "Trang chủ", href: ROUTES.HOME },
    { name: "Bộ đồ thờ", href: null },
  ];

  const trail = items && items.length > 0 ? items : defaultItems;

  return (
    <nav className={`flex items-center select-none ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap text-[14px] font-montserrat font-[400] text-[#2E2F2A] tracking-normal">
        {trail.map((item, index) => {
          const isLast = index === trail.length - 1;

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <span className="text-[#2E2F2A] mx-2 flex-shrink-0 select-none font-[400]">
                  {separator}
                </span>
              )}
              {isLast || !item.href ? (
                <span className="text-[#2E2F2A] font-[400]">{item.name}</span>
              ) : (
                <Link
                  href={item.href}
                  className="text-[#2E2F2A] hover:underline transition-colors duration-300"
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

