"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/utils/routes";

export default function CustomerServiceSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Trạng thái đơn hàng", href: ROUTES.ORDERS },
    { name: "Tài khoản của tôi", href: ROUTES.ACCOUNT },
    { name: "Chính sách vận chuyển", href: ROUTES.SHIPPING_POLICY },
    { name: "Chính sách đổi trả", href: ROUTES.RETURN_POLICY },
    { name: "Bảo mật thông tin", href: ROUTES.PRIVACY_POLICY },
    { name: "FAQ", href: ROUTES.FAQ },
  ];

  const activeItem = menuItems.find((item) => pathname === item.href) || menuItems[0];

  return (
    <>
      {/* Desktop Sidebar Layout */}
      <aside className="hidden md:block w-full md:w-[280px] shrink-0 font-montserrat">
        {/* Sidebar Header */}
        <div className="border-b border-neutral-200 pb-[30px]">
          <h2 className="text-[#2E2F2A] text-[20px] font-[500] leading-[40px]">
            Dịch vụ khách hàng
          </h2>
        </div>

        {/* Menu List */}
        <ul className="flex flex-col">
          {menuItems.map((item, idx) => {
            const isActive = pathname === item.href;
            return (
              <li key={idx} className="border-b border-neutral-200 py-[7px]">
                <Link
                  href={item.href}
                  className={`block text-[15px] leading-[40px] transition-all duration-300 ${
                    isActive
                      ? "text-[#2E2F2A] font-[700] select-none"
                      : "text-[#2E2F2A] font-[500] hover:text-primary"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Mobile Sidebar Collapsible Card Layout */}
      <div className="md:hidden w-full bg-white shadow-[0_4px_4px_rgba(0,0,0,0.15)] overflow-hidden mb-2">
        {/* Card Header Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full h-[57px] flex items-center px-[20px] xs:px-[42px] focus:outline-none"
        >
          <div className="flex items-center gap-[10px]">
            <svg
              className={`w-[12px] h-[12px] text-[#2E2F2A] transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
            <span className="text-[#2E2F2A] text-[16px] font-montserrat font-normal leading-[28px]">
              Dịch vụ khách hàng
            </span>
          </div>
        </button>

        {/* Card Body - Collapsible List */}
        {isOpen && (
          <ul className="flex flex-col pb-2">
            {menuItems.map((item, idx) => {
              const isActive = pathname === item.href;
              const isLast = idx === menuItems.length - 1;
              return (
                <li
                  key={idx}
                  className="h-[53px] flex items-center px-[42px]"
                >
                  <div
                    className={`w-full h-full flex items-center gap-[10px] ${
                      isLast ? "" : "border-b border-[#D1D5DB]"
                    }`}
                  >
                    {/* Placeholder to align text with header text */}
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`block text-[14px] leading-[20px] font-montserrat transition-all duration-300 ${
                        isActive
                          ? "text-[#2E2F2A] font-[700]"
                          : "text-[#2E2F2A] font-[400] hover:text-primary"
                      }`}
                    >
                      {item.name}
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
