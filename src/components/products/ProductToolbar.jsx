"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, ChevronDown } from "lucide-react";
import Breadcrumb from "@/components/shared/Breadcrumb";

export default function ProductToolbar({
  totalResults = 34,
  showingStart = 1,
  showingEnd = 12,
  onSearch = () => {},
  onCategoryChange = () => {},
  onSortChange = () => {},
  breadcrumbItems,
  selectedCategory: propSelectedCategory = "all",
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(propSelectedCategory);
  const [sortBy, setSortBy] = useState("newest");

  // Sync external category changes to local state
  useEffect(() => {
    setSelectedCategory(propSelectedCategory);
  }, [propSelectedCategory]);

  // Custom dropdown states
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const categoryRef = useRef(null);
  const sortRef = useRef(null);

  // Categories list
  const categories = [
    { value: "all", label: "Tất cả danh mục" },
    { value: "men-lam", label: "Men lam" },
    { value: "men-ran", label: "Men rạn" },
    { value: "men-lam-ve-vang", label: "Men lam vẽ vàng" },
    { value: "men-ran-dat-vang", label: "Men rạn dát vàng" },
    { value: "men-mau-theo-menh", label: "Men màu theo mệnh" },
  ];

  // Sorting options list
  const sortOptions = [
    { value: "newest", label: "Mới nhất" },
    { value: "best-seller", label: "Bán chạy nhất" },
    { value: "price-asc", label: "Giá: Thấp đến Cao" },
    { value: "price-desc", label: "Giá: Cao đến Thấp" },
  ];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const handleCategorySelect = (value) => {
    setSelectedCategory(value);
    onCategoryChange(value);
  };

  const handleSortSelect = (value) => {
    setSortBy(value);
    onSortChange(value);
  };

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setCategoryOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const activeCategory = categories.find((c) => c.value === selectedCategory);
  const categoryLabel = activeCategory
    ? activeCategory.value === "all"
      ? "Danh mục"
      : activeCategory.label
    : "Danh mục";

  const activeSort = sortOptions.find((s) => s.value === sortBy);
  const sortLabel = activeSort ? activeSort.label : "Mới nhất";

  return (
    <div className="w-full flex flex-col gap-5 pt-5 lg:pt-10 pb-5">
      {/* Row 1: Combined search and category selector */}
      <div className="w-full h-10 lg:h-12 border border-[#E1DEDE] rounded-[8px] bg-white flex items-center justify-between pl-[13px] md:pl-[11px] pr-0 relative select-none">
        {/* Left side: Search input field */}
        <div className="flex-1 flex items-center gap-[10px] h-full">
          <Search className="w-4 h-4 lg:w-6 lg:h-6 text-[#777777] flex-shrink-0 order-2 lg:order-1 lg:ml-0 ml-auto mr-[13px] lg:mr-0" />
          <input
            type="text"
            placeholder="Tìm kiếm"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full h-full bg-transparent border-none outline-none font-montserrat font-[400] text-[14px] lg:text-[16px] text-[#2E2F2A] placeholder-[#777777] focus:ring-0 focus:outline-none order-1 lg:order-2"
          />
        </div>

        {/* Right side: Category Dropdown */}
        <div className="relative h-full flex-shrink-0 hidden lg:block" ref={categoryRef}>
          <button
            type="button"
            onClick={() => setCategoryOpen(!categoryOpen)}
            className="flex items-center justify-between gap-[10px] h-full w-40 sm:w-[266px] px-4 font-montserrat font-[400] text-[16px] text-[#777777] hover:text-[#2E2F2A] transition-colors whitespace-nowrap cursor-pointer"
          >
            <span>{categoryLabel}</span>
            <ChevronDown
              className={`w-6 h-6 text-[#777777] transition-transform duration-200 ${
                categoryOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {categoryOpen && (
            <div className="absolute top-[54px] right-0 w-full sm:w-[266px] bg-white border border-[#E1DEDE] rounded-[8px] shadow-xl z-50 overflow-hidden py-1">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => {
                    handleCategorySelect(cat.value);
                    setCategoryOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 font-montserrat text-[15px] transition-colors ${
                    selectedCategory === cat.value
                      ? "bg-[#F4F5F6] text-[#97400C] font-[600]"
                      : "text-[#2E2F2A] hover:bg-[#F4F5F6] hover:text-[#97400C]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Row 2: Breadcrumbs & Results Count + Sorting dropdown */}
      <div className="w-full flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mt-[-5px]">
        {/* Left side: Breadcrumb trail (hidden on mobile) */}
        <div className="hidden lg:block">
          <Breadcrumb
            items={breadcrumbItems}
          />
        </div>

        {/* Layout container: On mobile we use a flex row to distribute Title/Results on left, Sort on right */}
        <div className="flex flex-row items-center justify-between lg:justify-end gap-4 lg:gap-6 w-full lg:w-auto">
          {/* Left part: Title & Results Count */}
          <div className="flex flex-col items-start">
            {/* Mobile Category Title */}
            <h1 className="lg:hidden text-[#97400C] font-montserrat font-[700] text-[16px] uppercase leading-normal">
              {selectedCategory === "all" ? "BỘ ĐỒ THỜ" : categoryLabel}
            </h1>
            {/* Results count text */}
            <span className="font-montserrat font-[400] lg:font-[600] text-[12px] lg:text-[16px] text-[#383838] leading-6">
              Hiển thị {showingStart}–{showingEnd} của {totalResults} kết quả
            </span>
          </div>

          {/* Sort dropdown container */}
          <div className="relative w-[148px] lg:w-[266px] h-10 lg:h-12 flex-shrink-0" ref={sortRef}>
            <button
              type="button"
              onClick={() => setSortOpen(!sortOpen)}
              className="w-full h-full flex items-center justify-between px-3 lg:px-4 border border-[#E1DEDE] rounded-[8px] bg-white font-montserrat font-[600] lg:font-[500] text-[14px] lg:text-[16px] text-[#2E2F2A] hover:border-primary transition-all duration-300 cursor-pointer"
            >
              <span>{sortLabel}</span>
              <ChevronDown
                className="w-4 h-4 lg:w-6 lg:h-6 text-[#777777] transition-transform duration-200"
              />
            </button>

            {sortOpen && (
              <div className="absolute top-[42px] lg:top-[54px] right-0 w-full bg-white border border-[#E1DEDE] rounded-[8px] shadow-xl z-50 overflow-hidden py-1">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      handleSortSelect(opt.value);
                      setSortOpen(false);
                    }}
                    className={`w-full text-left px-3 lg:px-4 py-2 lg:py-3 font-montserrat text-[13px] lg:text-[15px] transition-colors ${
                      sortBy === opt.value
                        ? "bg-[#F4F5F6] text-[#97400C] font-[600]"
                        : "text-[#2E2F2A] hover:bg-[#F4F5F6] hover:text-[#97400C]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
