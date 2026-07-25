"use client";
import React from "react";
import Image from "next/image";
import newsHeroBanner from "@/assets/images/news/news-hero-banner.png";
import { formatImageUrl } from "@/shared/api/media";

function formatVietnameseDate(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return `Ngày ${date.getDate()} tháng ${date.getMonth() + 1} năm ${date.getFullYear()}`;
}

export default function NewsDetailHeader({ category, title, publishedAt, thumb }) {
  const image = thumb ? formatImageUrl(thumb) : newsHeroBanner;
  const date = formatVietnameseDate(publishedAt);

  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. Header Information Panel */}
      <div className="max-w-[1470px] w-full text-center px-4 pt-[30px] md:pt-[60px] pb-[30px] md:pb-[60px] flex flex-col items-center justify-center font-montserrat">
        {/* Eyebrow Category */}
        {category && (
          <p className="text-[16px] font-semibold tracking-wider text-black uppercase mb-[20px] md:mb-[16px] leading-[24px]">
            {category}
          </p>
        )}

        {/* Main Heading Title */}
        <h1 className="text-[24px] md:text-[34px] lg:text-[40px] font-semibold text-[#97400C] leading-[32px] md:leading-[46px] lg:leading-[52px] max-w-[1000px] mb-[12px] md:mb-[16px] px-2 md:px-0">
          {title}
        </h1>

        {/* Meta Date */}
        {date && (
          <p className="text-[14px] italic text-black font-normal leading-[24px]">
            {date}
          </p>
        )}
      </div>

      {/* 2. Main Hero Image Banner */}
      <div className="w-full relative h-[275px] sm:h-[380px] md:h-[500px] lg:h-[600px] overflow-hidden bg-gray-100">
        <Image
          src={image}
          alt={title || ""}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>
    </div>
  );
}
