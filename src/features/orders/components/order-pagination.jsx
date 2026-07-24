"use client";

import React from "react";

export default function OrderPagination({
  currentPage = 1,
  totalPages = 3,
  onPageChange = () => {},
}) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <nav
      className="flex items-center justify-center gap-6 py-6 mt-4 font-montserrat"
      aria-label="Order Pagination"
    >
      {/* Previous Arrow Button */}
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`w-10 h-10 flex items-center justify-center transition-all duration-300 focus:outline-none ${
          currentPage === 1
            ? "text-[#C0C0C0] cursor-not-allowed"
            : "text-[#2E2F2A] hover:text-[#97400C] cursor-pointer"
        }`}
        aria-label="Previous Page"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 19L8 12L15 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Pages list */}
      <div className="flex items-center gap-4">
        {pages.map((page) => {
          const isActive = currentPage === page;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`text-[16px] px-2 py-1 transition-all duration-300 focus:outline-none cursor-pointer ${
                isActive
                  ? "text-[#97400C] font-[700] border-b-2 border-[#97400C]"
                  : "text-[#2E2F2A] font-[500] hover:text-[#97400C]"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Arrow Button */}
      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`w-10 h-10 flex items-center justify-center transition-all duration-300 focus:outline-none ${
          currentPage === totalPages
            ? "text-[#C0C0C0] cursor-not-allowed"
            : "text-[#2E2F2A] hover:text-[#97400C] cursor-pointer"
        }`}
        aria-label="Next Page"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 5L16 12L9 19"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </nav>
  );
}
