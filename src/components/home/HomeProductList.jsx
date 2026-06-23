"use client";

import { useState } from "react";
import SectionTitle from "@/components/shared/SectionTitle";
import ProductCard from "@/components/shared/ProductCard";
import Image from "next/image";

export default function HomeProductList({ title, tabs = [], products = [] }) {
  const [activeTab, setActiveTab] = useState(0);

  // Dynamic mocked products based on active tab and section title to make the tabs interactive and realistic
  const getMockProducts = (activeTabIdx) => {
    // Default mock data template
    return Array.from({ length: 8 }).map((_, i) => {
      let name = "Bình hút lộc\nMã đáo thành công";
      let salePrice = "2.000.000đ";
      let originalPrice = "2.500.000đ";
      let sku = `MSP: VG00${i + 1}`;
      let soldCount = 12 + i * 3;

      if (title.includes("ĐỒ THỜ")) {
        // Section: Bộ Đồ Thờ
        if (activeTabIdx === 0) {
          name = `Bộ đồ thờ men lam\nDáng cổ số ${i + 1}`;
          salePrice = `${(2000000 + i * 200000).toLocaleString("vi-VN")}đ`;
          originalPrice = `${(2500000 + i * 250000).toLocaleString("vi-VN")}đ`;
        } else if (activeTabIdx === 1) {
          name = `Bộ đồ thờ vẽ vàng\n24k cao cấp VG${i + 1}`;
          salePrice = `${(12000000 + i * 500000).toLocaleString("vi-VN")}đ`;
          originalPrice = `${(15000000 + i * 600000).toLocaleString("vi-VN")}đ`;
        } else {
          name = `Bộ đồ thờ men rạn\nĐắp nổi rồng chầu VG${i + 1}`;
          salePrice = `${(4500000 + i * 300000).toLocaleString("vi-VN")}đ`;
          originalPrice = `${(5500000 + i * 400000).toLocaleString("vi-VN")}đ`;
        }
      } else if (title.includes("PHONG THỦY")) {
        // Section: Bình Phong Thủy
        if (activeTabIdx === 0) {
          name = `Bình phong thủy men màu\nTài lộc phú quý VG${i + 1}`;
          salePrice = `${(1500000 + i * 150000).toLocaleString("vi-VN")}đ`;
          originalPrice = `${(1800000 + i * 200000).toLocaleString("vi-VN")}đ`;
        } else if (activeTabIdx === 1) {
          name = `Bình hút lộc men lam\nVẽ vàng Thuận buồm VG${i + 1}`;
          salePrice = `${(3500000 + i * 250000).toLocaleString("vi-VN")}đ`;
          originalPrice = `${(4200000 + i * 300000).toLocaleString("vi-VN")}đ`;
        } else {
          name = `Bình tỳ bà đắp nổi\nCông danh phú quý VG${i + 1}`;
          salePrice = `${(2800000 + i * 200000).toLocaleString("vi-VN")}đ`;
          originalPrice = `${(3500000 + i * 250000).toLocaleString("vi-VN")}đ`;
        }
      } else if (title.includes("LỤC BÌNH")) {
        // Section: Lục Bình
        if (activeTabIdx === 0) {
          name = `Lục bình men màu\nTứ cảnh hữu tình VG${i + 1}`;
          salePrice = `${(8000000 + i * 500000).toLocaleString("vi-VN")}đ`;
          originalPrice = `${(10000000 + i * 600000).toLocaleString("vi-VN")}đ`;
        } else if (activeTabIdx === 1) {
          name = `Lục bình men lam\nCổ đồ phú quý VG${i + 1}`;
          salePrice = `${(9500000 + i * 600000).toLocaleString("vi-VN")}đ`;
          originalPrice = `${(12000000 + i * 800000).toLocaleString("vi-VN")}đ`;
        } else {
          name = `Lục bình đắp nổi\nTùng hạc diên niên VG${i + 1}`;
          salePrice = `${(15000000 + i * 1000000).toLocaleString("vi-VN")}đ`;
          originalPrice = `${(18000000 + i * 1200000).toLocaleString("vi-VN")}đ`;
        }
      }

      return {
        id: i,
        name,
        sku,
        salePrice,
        originalPrice,
        soldCount,
      };
    });
  };

  const displayProducts =
    products.length > 0 ? products : getMockProducts(activeTab);

  // Check if any product in the current list has a name with 2 lines (contains '\n' or length > 22)
  const hasTwoLineTitle = displayProducts.some(
    (product) =>
      product.name && (product.name.includes("\n") || product.name.length > 22),
  );

  const handlePrevTab = () => {
    setActiveTab((prev) => (prev - 1 + tabs.length) % tabs.length);
  };

  const handleNextTab = () => {
    setActiveTab((prev) => (prev + 1) % tabs.length);
  };

  return (
    <section className="max-w-[1470px] mx-auto w-full px-[16px] md:px-[30px] my-[50px] lg:my-[100px]">
      <SectionTitle title={title} />

      {/* Desktop Tab Selector */}
      {tabs.length > 0 && (
        <div className="hidden lg:flex flex-wrap items-center justify-center gap-[20px] mb-[30px]">
          {tabs.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`px-[32px] py-[8px] rounded-[8px] font-montserrat font-[700] text-[18px] leading-[24px] transition-all duration-300 ${
                idx === activeTab
                  ? "bg-primary text-white shadow-md scale-102"
                  : "bg-[#EABA96] text-primary hover:bg-[#DFA67A]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {/* Mobile Tab Selector (with Left & Right arrows matching the Figma design) */}
      {tabs.length > 0 && (
        <div className="flex lg:hidden items-center justify-center gap-[15px] mb-[25px]">
          {/* Left Arrow Button */}
          <button
            onClick={handlePrevTab}
            className="flex items-center justify-center p-2 text-primary hover:opacity-80 active:scale-95 transition-all"
            aria-label="Previous category"
          >
            <svg
              width="10"
              height="18"
              viewBox="0 0 10 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 17L1 9L9 1"
                stroke="#97400C"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Active Tab Badge (Figma Style) */}
          <div className="bg-primary text-white font-montserrat font-[700] text-[14px] leading-tight uppercase px-[20px] py-[10px] rounded-[6px] min-w-[210px] text-center shadow-md select-none">
            {tabs[activeTab]}
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={handleNextTab}
            className="flex items-center justify-center p-2 text-primary hover:opacity-80 active:scale-95 transition-all"
            aria-label="Next category"
          >
            <svg
              width="10"
              height="18"
              viewBox="0 0 10 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 17L9 9L1 1"
                stroke="#97400C"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Grid sản phẩm */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[15px] lg:gap-x-[30px] lg:gap-y-[26px]">
        {displayProducts.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            sku={product.sku}
            salePrice={product.salePrice}
            originalPrice={product.originalPrice}
            soldCount={product.soldCount}
            hasTwoLineTitle={hasTwoLineTitle}
          />
        ))}
      </div>

      {/* Nút Xem thêm */}
      <div className="flex justify-center mt-[30px] lg:mt-[50px]">
        <button className="flex items-center justify-center gap-1.5 lg:gap-2 px-[16px] py-[8px] lg:px-[24px] lg:py-[10px] bg-[#DDAB70]/20 rounded-[8px] group hover:bg-[#DDAB70]/30 transition-colors">
          <span className="font-montserrat font-[700] text-primary text-[13px] lg:text-[18px] leading-[16px]">
            Xem thêm
          </span>
          <Image
            src="/images/home/button-right-arrow.png"
            alt="Xem thêm"
            width={24}
            height={24}
            className="object-contain w-[18px] h-[18px] lg:w-[24px] lg:h-[24px] group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>
    </section>
  );
}
