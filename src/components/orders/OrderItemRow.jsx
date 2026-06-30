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
      {/* Left Section: Image and Details */}
      <div className="flex gap-[16px] items-start w-full">
        {/* Product Image */}
        <div className="w-[80px] h-[80px] md:w-[91px] md:h-[91px] relative border border-[#D1D5DB] md:border-[0.5px] border-[#909090] rounded-[6px] md:rounded-[5px] bg-white flex items-center justify-center shrink-0 overflow-hidden p-[9px] md:p-0">
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
              className="w-[62px] h-[62px] md:w-full md:h-full object-cover"
            />
          )}
        </div>

        {/* Text Details */}
        <div className="flex-1 flex flex-col font-montserrat justify-between min-h-[80px] md:min-h-[91px]">
          <h4 className="text-[#2E2F2A] text-[14px] md:text-[16px] font-[700] md:font-[600] leading-[20px] md:leading-normal mb-1">
            {item.title}
          </h4>
          <div className="text-[#2E2F2A]/40 text-[12px] font-[400] leading-[15px] md:leading-[20px]">
            <div className="uppercase mb-0.5">MSP: {item.sku || item.msp || "N/A"}</div>
            
            {/* Classification row */}
            <div className="flex justify-between items-center w-full">
              <div>Phân loại: {item.classification || "Mặc định"}</div>
              {/* Mobile-only line-through price */}
              {item.originalPrice !== undefined && (
                <span className="md:hidden text-[#2E2F2A]/40 text-[11px] font-[400] line-through leading-[15px]">
                  {formatPrice(item.originalPrice)}
                </span>
              )}
            </div>

            {/* Quantity and Price row */}
            <div className="flex justify-between items-end w-full">
              <div>x{item.quantity || 1}</div>
              {/* Mobile-only actual price */}
              <span className="md:hidden text-[#2E2F2A] text-[15px] font-[400] leading-[16px]">
                {formatPrice(item.price)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop-only Pricing section */}
      <div className="hidden md:flex flex-col items-end justify-end font-montserrat shrink-0 min-h-[91px]">
        {item.originalPrice !== undefined && (
          <span className="text-[#2E2F2A]/40 text-[12px] font-[300] line-through mb-[5px]">
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
