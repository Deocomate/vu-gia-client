"use client";

import React from "react";
import Image from "next/image";

export default function OrderItemRow({ item }) {
  if (!item) return null;

  const formatPrice = (price) => {
    if (typeof price === "number") {
      return price.toLocaleString("vi-VN") + " đ";
    }
    return price;
  };

  return (
    <div className="flex flex-row items-center justify-between py-[12px] gap-4 border-b border-dashed border-neutral-200 last:border-0 last:pb-0 first:pt-0">
      {/* Product info section */}
      <div className="flex gap-[16px] items-start">
        {/* Product Image */}
        <div className="w-[91px] h-[91px] relative border-[0.5px] border-[#909090] rounded-[5px] bg-white flex items-center justify-center shrink-0 overflow-hidden">
          {item.image && typeof item.image === "object" ? (
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
            />
          ) : (
            <img
              src={item.image || "/images/products/product-image-thumb.png"}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Text Details */}
        <div className="flex flex-col font-montserrat justify-center min-h-[91px]">
          <h4 className="text-[#2E2F2A] text-[16px] font-[600] leading-normal mb-1">
            {item.title}
          </h4>
          <div className="text-[#909090] text-[12px] font-[400] leading-[20px]">
            <div>MSP: {item.sku || item.msp || "N/A"}</div>
            <div>Phân loại: {item.classification || "Mặc định"}</div>
            <div>x{item.quantity || 1}</div>
          </div>
        </div>
      </div>

      {/* Pricing section */}
      <div className="flex flex-col items-end justify-center font-montserrat shrink-0">
        {item.originalPrice !== undefined && (
          <span className="text-[#909090] text-[12px] font-[300] line-through mb-[5px]">
            {formatPrice(item.originalPrice)}
          </span>
        )}
        <span className="text-[#2E2F2A] text-[14px] font-[500] leading-normal">
          {formatPrice(item.price)}
        </span>
      </div>
    </div>
  );
}

