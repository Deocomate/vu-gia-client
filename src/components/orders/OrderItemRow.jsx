"use client";

import React from "react";
import Image from "next/image";
import { PLACEHOLDER_IMAGE } from "@/lib/media";
import { PRODUCT_TYPE_LABEL } from "@/lib/apiEnums";

/**
 * Renders one `OrderItemResponse` snapshot line (ORDER_API.md §4):
 * `{id, productId, productName, productType, unitPrice, quantity, subtotal, comboItems}`.
 * The order API never returns a product image per line item, so every row
 * falls back to the shared placeholder — there is no per-item image to lose.
 */
export default function OrderItemRow({ item }) {
  if (!item) return null;

  const formatPrice = (price) => `${(Number(price) || 0).toLocaleString("vi-VN")} đ`;

  return (
    <div className="flex flex-row items-center justify-between py-[12px] gap-4 border-b border-dashed border-neutral-200 last:border-0 last:pb-0 first:pt-0">
      {/* Left Section: Image and Details */}
      <div className="flex gap-[16px] items-start w-full">
        {/* Product Image (always the placeholder — order snapshots carry no image) */}
        <div className="w-[80px] h-[80px] md:w-[91px] md:h-[91px] relative border border-[#D1D5DB] md:border-[0.5px] border-[#909090] rounded-[6px] md:rounded-[5px] bg-white flex items-center justify-center shrink-0 overflow-hidden p-[9px] md:p-0">
          <Image
            src={PLACEHOLDER_IMAGE}
            alt={item.productName || "Sản phẩm"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 80px, 91px"
          />
        </div>

        {/* Text Details */}
        <div className="flex-1 flex flex-col font-montserrat justify-between min-h-[80px] md:min-h-[91px]">
          <h4 className="text-[#2E2F2A] text-[14px] md:text-[16px] font-[700] md:font-[600] leading-[20px] md:leading-normal mb-1">
            {item.productName}
          </h4>
          <div className="text-[#2E2F2A]/40 text-[12px] font-[400] leading-[15px] md:leading-[20px]">
            <div className="uppercase mb-0.5 truncate">
              {PRODUCT_TYPE_LABEL[item.productType] || item.productType}
              {item.comboItems ? ` · ${item.comboItems}` : ""}
            </div>

            {/* Unit price / quantity row */}
            <div className="flex justify-between items-end w-full">
              <div>
                Đơn giá: {formatPrice(item.unitPrice)} x{item.quantity || 1}
              </div>
              {/* Mobile-only line total */}
              <span className="md:hidden text-[#2E2F2A] text-[15px] font-[400] leading-[16px]">
                {formatPrice(item.subtotal)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop-only line-total column */}
      <div className="hidden md:flex flex-col items-end justify-end font-montserrat shrink-0 min-h-[91px]">
        <span className="text-[#2E2F2A] text-[14px] font-[600] leading-normal">
          {formatPrice(item.subtotal)}
        </span>
      </div>
    </div>
  );
}
