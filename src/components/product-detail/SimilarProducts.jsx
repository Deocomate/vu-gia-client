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
    <div className="w-full py-8 lg:pt-[50px] lg:pb-[40px] border-t border-[#E6E8EC] mt-8">
      {/* Title */}
      <h2 className="font-montserrat text-[#97400C] text-[32px] font-[700] leading-[40px] mb-8 tracking-wide">
        Sản phẩm tương tự
      </h2>

      {/* Grid of similar products */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {similarList.map((product) => (
          <ProductCard
            key={product.id}
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
    </div>
  );
}
