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
      <ol className="flex items-center flex-wrap text-[16px] font-montserrat font-bold uppercase tracking-normal">
        {trail.map((item, index) => {
          const isLast = index === trail.length - 1;

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <span className="text-[#383838] mx-2 flex-shrink-0 select-none font-bold">
                  {separator}
                </span>
              )}
              {isLast || !item.href ? (
                <span className="text-[#97400C] font-bold">{item.name}</span>
              ) : (
                <Link
                  href={item.href}
                  className="text-[#383838] hover:text-[#97400C] transition-colors duration-300"
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

