import React from "react";
import ProductCard from "@/components/shared/ProductCard";
import productCardImage1 from "@/assets/images/product-detail/product-card-image-1.png";
import productCardImage2 from "@/assets/images/product-detail/product-card-image-2.png";
import productCardImage3 from "@/assets/images/product-detail/product-card-image-3.png";
import productDetailThumbnail from "@/assets/images/product-detail/product-detail-thumbnail.png";

export default function SimilarProducts() {
  const similarList = [
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

  const hasTwoLineTitle = similarList.some(
    (product) => product.name && (product.name.includes("\n") || product.name.length > 22)
  );

  return (
    <div className="w-full lg:pt-[50px] lg:pb-[40px] lg:border-t border-[#E6E8EC] mt-8">
      {/* Title */}
      <h2 className="font-montserrat text-[#97400C] text-[20px] lg:text-[32px] font-[700] leading-[40px] mb-4 lg:mb-8 tracking-wide">
        Sản phẩm tương tự
      </h2>

      {/* Mobile swipe / Desktop grid */}
      <div className="flex lg:grid lg:grid-cols-4 gap-[14px] lg:gap-[26px] overflow-x-auto lg:overflow-x-visible no-scrollbar pb-4 lg:pb-0 scroll-smooth snap-x snap-mandatory w-[calc(100%+60px)] mx-[-30px] px-[30px] scroll-px-[30px] lg:w-auto lg:mx-0 lg:px-0">
        {similarList.map((product) => (
          <div key={product.id} className="flex-shrink-0 w-[175px] lg:w-auto snap-start">
            <ProductCard
              image={product.image}
              name={product.name}
              sku={product.sku}
              salePrice={product.salePrice}
              originalPrice={product.originalPrice}
              soldCount={product.soldCount}
              hasTwoLineTitle={hasTwoLineTitle}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
