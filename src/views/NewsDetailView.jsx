"use client";
import React, { useMemo } from "react";
import NewsDetailHeader from "@/components/news-detail/NewsDetailHeader";
import NewsDetailContent from "@/components/news-detail/NewsDetailContent";
import NewsDetailSidebar from "@/components/news-detail/NewsDetailSidebar";

export default function NewsDetailView({ slug }) {
  // Mock metadata based on slug for dynamic title display
  const article = useMemo(() => {
    return {
      slug: slug || "giai-dap-y-nghia-bat-huong-rong-4-mong-va-5-mong",
      category: "KIẾN THỨC SẢN PHẨM",
      title: "Giải đáp ý nghĩa bát hương rồng 4 móng và rồng 5 móng?",
      date: "Ngày 18 tháng 5 năm 2026",
    };
  }, [slug]);

  return (
    <div className="w-full bg-[#F9F8F8] pb-[100px] font-montserrat">
      {/* 1. Header component (Eyebrow, Title, Date & Panoramic Banner) */}
      <NewsDetailHeader
        category={article.category}
        title={article.title}
        date={article.date}
      />

      {/* 2. Main Page Container */}
      <div className="max-w-[1470px] mx-auto px-[31px] lg:px-[60px] mt-[30px] lg:mt-[60px]">
        {/* 3. Grid Columns (Main Content: 75%, Sidebar: 25%) */}
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-[40px] lg:gap-[70px] items-start">
          {/* Main article rich-text body */}
          <NewsDetailContent article={article} showTop={true} showBottom={true} />

          {/* Right sidebar navigation and contact modules - Hidden on Mobile */}
          <div className="hidden lg:block">
            <NewsDetailSidebar showWidgets={true} showForm={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
