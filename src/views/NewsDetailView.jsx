"use client";
import React, { useMemo } from "react";
import Image from "next/image";
import NewsDetailHeader from "@/components/news-detail/NewsDetailHeader";
import NewsDetailContent from "@/components/news-detail/NewsDetailContent";
import NewsDetailSidebar from "@/components/news-detail/NewsDetailSidebar";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { ROUTES } from "@/utils/routes";
import closingThumb from "@/assets/images/home/closing-thumb.png";

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

  // Breadcrumbs path setup
  const breadcrumbItems = [
    { name: "Trang chủ", href: ROUTES.HOME },
    { name: "Tin tức", href: ROUTES.NEWS },
    { name: article.category, href: null },
  ];

  return (
    <div className="w-full bg-[#F9F8F8] pb-[100px] font-montserrat">
      {/* 1. Header component (Eyebrow, Title, Date & Panoramic Banner) */}
      <NewsDetailHeader
        category={article.category}
        title={article.title}
        date={article.date}
      />

      {/* 2. Main Page Container */}
      <div className="max-w-[1470px] mx-auto px-[20px] lg:px-[60px] mt-[40px] md:mt-[60px]">
        {/* Breadcrumb Navigation bar */}
        <div className="mb-6">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* 3. Grid Columns (Main Content: 75%, Sidebar: 25%) */}
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-[40px] lg:gap-[70px] items-start">
          {/* Main article rich-text body */}
          <NewsDetailContent article={article} showTop={true} showBottom={true} />

          {/* Right sidebar navigation and contact modules */}
          <NewsDetailSidebar showWidgets={true} showForm={true} />
        </div>
      </div>
    </div>
  );
}
