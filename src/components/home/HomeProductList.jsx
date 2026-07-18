"use client";

import { useState } from "react";
import Link from "next/link";
import SectionTitle from "@/components/shared/SectionTitle";
import ProductCard from "@/components/shared/ProductCard";
import Image from "next/image";
import { ROUTES } from "@/utils/routes";
import { mapProductToCardProps } from "@/lib/productCard";

export default function HomeProductList({ title, tabs = [], products = [] }) {
  const [activeTab, setActiveTab] = useState(0);

  // Map real `Product` entities (fetched server-side) to `ProductCard` props.
  const displayProducts = products.map(mapProductToCardProps);

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
    <section className="max-w-[1470px] mx-auto w-full px-[31px] md:px-[30px] my-[50px] lg:my-[100px]">
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
      {displayProducts.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[15px] lg:gap-x-[30px] lg:gap-y-[26px]">
          {displayProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              slug={product.slug}
              image={product.image}
              name={product.name}
              sku={product.sku}
              salePrice={product.salePrice}
              originalPrice={product.originalPrice}
              soldCount={product.soldCount}
              hasTwoLineTitle={hasTwoLineTitle}
            />
          ))}
        </div>
      ) : (
        <p className="text-center font-montserrat text-[15px] text-[#777777]">
          Hiện chưa có sản phẩm nổi bật.
        </p>
      )}

      {/* Nút Xem thêm */}
      <div className="flex justify-center mt-[30px] lg:mt-[50px]">
        <Link
          href={ROUTES.PRODUCTS}
          className="flex items-center justify-center gap-1.5 lg:gap-2 px-[16px] py-[8px] lg:px-[24px] lg:py-[10px] bg-[#DDAB70]/20 rounded-[8px] group hover:bg-[#DDAB70]/30 transition-colors"
        >
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
        </Link>
      </div>
    </section>
  );
}
