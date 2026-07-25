"use client";
import React from "react";
import NewsDetailHeader from "@/features/storefront/news/components/news-detail-header";
import NewsDetailContent from "@/features/storefront/news/components/news-detail-content";
import NewsDetailSidebar from "@/features/storefront/news/components/news-detail-sidebar";

export default function NewsDetailView({ news, relatedArticles = [] }) {
  return (
    <div className="w-full bg-[#F9F8F8] pb-[100px] font-montserrat">
      {/* 1. Header component (Eyebrow, Title, Date & Panoramic Banner) */}
      <NewsDetailHeader
        category={news?.category?.name}
        title={news?.title}
        publishedAt={news?.publishedAt}
        thumb={news?.thumb}
      />

      {/* 2. Main Page Container */}
      <div className="max-w-[1470px] mx-auto px-[31px] lg:px-[60px] mt-[30px] lg:mt-[60px]">
        {/* 3. Grid Columns (Main Content: 75%, Sidebar: 25%) */}
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-[40px] lg:gap-[70px] items-start">
          {/* Main article rich-text body */}
          <NewsDetailContent des={news?.des} relatedArticles={relatedArticles} />

          {/* Right sidebar navigation and contact modules - Hidden on Mobile */}
          <div className="hidden lg:block">
            <NewsDetailSidebar showWidgets={true} showForm={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
