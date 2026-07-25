"use client";

import { useState } from "react";
import { parseBlockDoc } from "@/shared/components/blocks/schema";
import CategoryBlockRenderer from "@/shared/components/category-blocks/category-block-renderer";

export default function CategoryDetailContent({ detailContent }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { blocks } = parseBlockDoc(detailContent);
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="py-12 border-t border-b border-[#97400C] mt-12">
      <div className="max-w-[1438px] mx-auto text-left relative font-montserrat">
        <div
          className={`relative transition-all duration-500 overflow-hidden ${
            isExpanded ? "max-h-[2000px]" : "max-h-[380px]"
          }`}
        >
          <CategoryBlockRenderer value={detailContent} />
          {!isExpanded && (
            <div
              className="absolute bottom-0 left-0 right-0 h-[157px] lg:h-[248px] pointer-events-none"
              style={{ background: "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #ffffff 100%)" }}
            />
          )}
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-[140px] h-[35px] lg:w-[207px] lg:h-[49px] flex items-center justify-center border border-[#2E2F2A] lg:border-[#97400C] text-[#2E2F2A] lg:text-[#97400C] hover:bg-[#2E2F2A] hover:text-white lg:hover:bg-[#97400C] lg:hover:text-white transition-all duration-300 font-montserrat font-[600] lg:font-[700] text-[16px] lg:text-[24px] leading-[24px] rounded-[6px] lg:rounded-[8px] uppercase cursor-pointer"
          >
            {isExpanded ? "THU GỌN" : "XEM THÊM"}
          </button>
        </div>
      </div>
    </div>
  );
}
