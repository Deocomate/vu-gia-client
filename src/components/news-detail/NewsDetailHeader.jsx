"use client";
import React from "react";
import Image from "next/image";
import newsHeroBanner from "@/assets/images/news/news-hero-banner.png";

export default function NewsDetailHeader({
  category = "KIẾN THỨC SẢN PHẨM",
  title = "Giải đáp ý nghĩa bát hương rồng 4 móng và rồng 5 móng?",
  date = "Ngày 18 tháng 5 năm 2026",
  image = newsHeroBanner,
}) {
  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. Header Information Panel */}
      <div className="max-w-[1470px] w-full text-center px-4 pt-[40px] md:pt-[60px] pb-[30px] md:pb-[40px] flex flex-col items-center justify-center font-montserrat">
        {/* Eyebrow Category */}
        <p className="text-[16px] font-semibold tracking-wider text-black uppercase mb-[10px] md:mb-[16px] leading-[24px]">
          {category}
        </p>

        {/* Main Heading Title */}
        <h1 className="text-[28px] md:text-[34px] lg:text-[40px] font-semibold text-[#97400C] leading-[36px] md:leading-[46px] lg:leading-[52px] max-w-[1000px] mb-[12px] md:mb-[16px] px-2 md:px-0">
          {title}
        </h1>

        {/* Meta Date */}
        <p className="text-[14px] italic text-black font-normal leading-[24px]">
          {date}
        </p>
      </div>

      {/* 2. Main Hero Image Banner */}
      <div className="w-full relative h-[250px] sm:h-[380px] md:h-[500px] lg:h-[600px] overflow-hidden bg-gray-100">
        <Image
          src={image}
          alt={title}
          fill
          priority
          className="object-cover"
        />
      </div>
    </div>
  );
}
