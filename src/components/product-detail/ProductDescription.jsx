import React from "react";
import BlockRenderer from "@/components/blocks/BlockRenderer";

export default function ProductDescription({ description }) {
  return (
    <div className="w-full pt-4 lg:pt-8 border-t border-[#E6E8EC] mt-8">
      {/* Title */}
      <h2 className="font-montserrat text-[#97400C] text-[20px] lg:text-[28px] font-[700] leading-[40px] tracking-wide">
        Mô tả sản phẩm
      </h2>

      <BlockRenderer
        value={description}
        className="max-w-[1200px] mx-auto font-montserrat text-[16px] lg:text-[18px] text-[#383838] leading-[30px] flex flex-col gap-6 text-justify mt-4"
      />
    </div>
  );
}
