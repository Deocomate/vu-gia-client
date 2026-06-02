"use client";

import React from "react";
import Image from "next/image";

export default function Pagination({
  currentPage = 1,
  totalPages = 5,
  onPageChange = () => {},
}) {
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 2) {
        pages.push(1, 2, "...", totalPages - 1, totalPages);
      } else if (currentPage >= totalPages - 1) {
        pages.push(1, 2, "...", totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage, "...", totalPages);
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav
      className="flex items-center justify-center gap-[10px] py-10"
      aria-label="Pagination Navigation"
    >
      {/* Previous Button */}
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`w-8 h-8 flex items-center justify-center transition-all duration-300 ${
          currentPage === 1
            ? "opacity-20 cursor-not-allowed"
            : "hover:opacity-70 cursor-pointer"
        }`}
        aria-label="Previous Page"
      >
        <Image
          src="/icons/pagination-left-arrow.png"
          alt="Previous"
          width={20}
          height={13}
          className="object-contain"
        />
      </button>

      {/* Page Numbers */}
      {pages.map((page, idx) => {
        if (page === "...") {
          return (
            <div
              key={`ellipsis-${idx}`}
              className="w-8 h-8 flex items-center justify-center rounded-[3px] border border-[#383838] bg-white font-inter font-[400] text-[14px] text-[#383838] select-none"
            >
              ...
            </div>
          );
        }

        const isActive = currentPage === page;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 flex items-center justify-center rounded-[3px] font-inter font-[600] text-[14px] leading-[24px] transition-all duration-300 cursor-pointer ${
              isActive
                ? "bg-[#97400C] text-white border border-[#97400C]"
                : "bg-white border border-[#383838] text-[#383838] hover:border-[#97400C] hover:text-[#97400C]"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            {page}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
        disabled={currentPage === totalPages}
        className={`w-8 h-8 flex items-center justify-center transition-all duration-300 ${
          currentPage === totalPages
            ? "opacity-20 cursor-not-allowed"
            : "hover:opacity-70 cursor-pointer"
        }`}
        aria-label="Next Page"
      >
        <Image
          src="/icons/pagination-right-arrow.png"
          alt="Next"
          width={20}
          height={13}
          className="object-contain"
        />
      </button>
    </nav>
  );
}
