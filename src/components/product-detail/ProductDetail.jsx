"use client";

import React from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

import thumb1 from "@/assets/images/product-detail/chi-tiet-sp-thumb-1.png";
import thumb2 from "@/assets/images/product-detail/chi-tiet-sp-thumb-2.png";
import thumb3 from "@/assets/images/product-detail/chi-tiet-sp-thumb-3.png";

export default function ProductDetail() {
  const detailSections = [
    {
      id: 1,
      title: "A Decorative Statement",
      description:
        'With its "infinity" board design and sturdy corner bases, the Regal Chess Set becomes a standout decorative masterpiece in any living space. Breaking away from traditional chessman designs, each piece in the Regal Chess Set embodies a minimalist and classic elegance, featuring sharp line details that leave an impression of refined artistry, infusing your display with a sense of luxury and sophistication.',
      image: thumb1,
      isImageRight: true,
    },
    {
      id: 2,
      title: "A Decorative Statement",
      description:
        'With its "infinity" board design and sturdy corner bases, the Regal Chess Set becomes a standout decorative masterpiece in any living space. Breaking away from traditional chessman designs, each piece in the Regal Chess Set embodies a minimalist and classic elegance, featuring sharp line details that leave an impression of refined artistry, infusing your display with a sense of luxury and sophistication.',
      image: thumb2,
      isImageRight: false,
    },
    {
      id: 3,
      title: "A Decorative Statement",
      description:
        'With its "infinity" board design and sturdy corner bases, the Regal Chess Set becomes a standout decorative masterpiece in any living space. Breaking away from traditional chessman designs, each piece in the Regal Chess Set embodies a minimalist and classic elegance, featuring sharp line details that leave an impression of refined artistry, infusing your display with a sense of luxury and sophistication.',
      image: thumb3,
      isImageRight: true,
    },
  ];

  return (
    <div className="w-full py-12 border-t border-[#E6E8EC]">
      {/* Title */}
      <h2 className="font-montserrat text-[#97400C] text-[28px] md:text-[32px] font-[700] leading-[40px] mb-[40px] uppercase tracking-wide">
        Chi tiết sản phẩm
      </h2>

      {/* Grid Sections */}
      <div className="flex flex-col gap-[25px]">
        {detailSections.map((section) => (
          <div
            key={section.id}
            className="grid grid-cols-1 md:grid-cols-2 gap-[25px] w-full"
          >
            {/* Text Card */}
            <div
              className={`flex flex-col justify-center items-center bg-[#ECDAD1] p-8 md:p-12 aspect-square md:aspect-[708/712] w-full h-full ${
                section.isImageRight
                  ? "order-1 md:order-1"
                  : "order-1 md:order-2"
              }`}
            >
              <h3 className="font-montserrat text-[#97400C] text-[24px] md:text-[34px] font-[700] leading-tight md:leading-[40px] text-center mb-5 md:mb-[30px] max-w-[90%]">
                {section.title}
              </h3>
              <p className="font-montserrat text-black text-[15px] md:text-[18px] font-[300] leading-[26px] md:leading-[30px] text-center max-w-[479px] opacity-90">
                {section.description}
              </p>
            </div>

            {/* Image Card */}
            <div
              className={`relative aspect-square md:aspect-[708/712] w-full h-full overflow-hidden group ${
                section.isImageRight
                  ? "order-2 md:order-2"
                  : "order-2 md:order-1"
              }`}
            >
              <Image
                src={section.image}
                alt={section.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
              />
            </div>
          </div>
        ))}
      </div>

      {/* View More Button */}
      <div className="w-full flex justify-center mt-12">
        <button className="py-2.5 px-5 bg-[#DDAA70]/20 hover:bg-[#DDAA70]/30 active:bg-[#DDAA70]/40 rounded-[5px] flex items-center justify-center gap-2.5 transition-all duration-300 group cursor-pointer border border-transparent hover:border-[#DDAA70]/30 shadow-sm">
          <span className="text-[#97400C] font-montserrat text-[16px] md:text-[18px] font-[700] leading-[16px]">
            Xem thêm
          </span>
          <ChevronRight className="w-5 h-5 text-[#97400C] transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
