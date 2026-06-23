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
    <section className="w-full bg-white pt-[50px] pb-16">
      <div className="max-w-[1470px] mx-auto px-[20px] lg:px-[60px]">
        {/* Title */}
        <h2 className="font-montserrat font-bold text-[28px] lg:text-[32px] text-[#97400C] mb-8 uppercase tracking-wide">
          Có thể bạn quan tâm
        </h2>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {RECOMMEND_PRODUCTS.map((prod) => (
            <ProductCard
              key={prod.id}
              image={prod.image}
              name={prod.name}
              sku={prod.sku}
              salePrice={prod.salePrice}
              originalPrice={prod.originalPrice}
              soldCount={prod.soldCount}
              hasTwoLineTitle={hasTwoLineTitle}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
