"use client";
import React from "react";
import ProductCard from "@/components/shared/ProductCard";
import productCardImage1 from "@/assets/images/product-detail/product-card-image-1.png";
import productCardImage2 from "@/assets/images/product-detail/product-card-image-2.png";
import productCardImage3 from "@/assets/images/product-detail/product-card-image-3.png";
import productDetailThumbnail from "@/assets/images/product-detail/product-detail-thumbnail.png";

const RECOMMEND_PRODUCTS = [
  {
    id: 1,
    name: "Bình hút lộc\nMã đáo thành công",
    sku: "MSP: VG001",
    salePrice: "2.000.000đ",
    originalPrice: "2.500.000đ",
    soldCount: 12,
    image: productCardImage1,
  },
  {
    id: 2,
    name: "Bình hút lộc\nMã đáo thành công",
    sku: "MSP: VG001",
    salePrice: "2.000.000đ",
    originalPrice: "2.500.000đ",
    soldCount: 12,
    image: productCardImage2,
  },
  {
    id: 3,
    name: "Bình hút lộc\nMã đáo thành công",
    sku: "MSP: VG001",
    salePrice: "2.000.000đ",
    originalPrice: "2.500.000đ",
    soldCount: 12,
    image: productCardImage3,
  },
  {
    id: 4,
    name: "Bình hút lộc\nMã đáo thành công",
    sku: "MSP: VG001",
    salePrice: "2.000.000đ",
    originalPrice: "2.500.000đ",
    soldCount: 12,
    image: productDetailThumbnail,
  },
];

export default function NewsRelatedProducts() {
  const hasTwoLineTitle = RECOMMEND_PRODUCTS.some(
    (prod) => prod.name && (prod.name.includes("\n") || prod.name.length > 22)
  );

  return (
    <section className="w-full bg-white pt-[50px] pb-[50px] lg:pb-[100px]">
      <div className="max-w-[1438px] mx-auto px-[30px] xl:px-0">
        {/* Title */}
        <h2 className="font-montserrat font-bold text-[26px] lg:text-[32px] text-[#97400C] mb-[20px] lg:mb-[40px] leading-[40px] tracking-wide">
          Có thể bạn quan tâm
        </h2>

        {/* Product Grid / Swipe List on Mobile */}
        <div className="flex lg:grid lg:grid-cols-4 gap-[14px] lg:gap-[26px] overflow-x-auto lg:overflow-x-visible no-scrollbar pb-4 lg:pb-0 scroll-smooth snap-x snap-mandatory w-[calc(100%+60px)] mx-[-30px] px-[30px] scroll-px-[30px] lg:w-auto lg:mx-0 lg:px-0">
          {RECOMMEND_PRODUCTS.map((prod) => (
            <div key={prod.id} className="flex-shrink-0 w-[175px] lg:w-auto snap-start">
              <ProductCard
                image={prod.image}
                name={prod.name}
                sku={prod.sku}
                salePrice={prod.salePrice}
                originalPrice={prod.originalPrice}
                soldCount={prod.soldCount}
                hasTwoLineTitle={hasTwoLineTitle}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
