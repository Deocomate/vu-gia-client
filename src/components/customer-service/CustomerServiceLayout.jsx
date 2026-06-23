"use client";

import React from "react";
import Link from "next/link";
import CustomerServiceSidebar from "./CustomerServiceSidebar";

export default function CustomerServiceLayout({ children, breadcrumbs = [] }) {
  return (
    <div className="w-full bg-[#FAF7F7] min-h-screen pt-[25px] pb-[60px] md:pb-[80px] font-montserrat">
      <div className="max-w-[1470px] mx-auto px-[20px] md:px-[60px] lg:px-[80px]">
        {/* ================= BREADCRUMBS ================= */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-[25px]" aria-label="Breadcrumb">
            <ol className="flex items-center flex-wrap text-[14px] font-[500] text-[#2E2F2A] leading-[40px] select-none">
              {breadcrumbs.map((item, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <li key={idx} className="flex items-center">
                    {idx > 0 && (
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
        )}

        {/* ================= GRID LAYOUT ================= */}
        <div className="flex flex-col md:flex-row gap-[40px] lg:gap-[85px] items-start">
          {/* Left Sidebar */}
          <CustomerServiceSidebar />

          {/* Right Main Content */}
          <main className="flex-1 w-full">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
