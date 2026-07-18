"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/utils/routes";
import newsHeroBanner from "@/assets/images/news/news-hero-banner.png";

export default function NewsHero({ activeCategoryName }) {
  return (
    <section className="relative w-full h-[132px] lg:h-[320px] overflow-hidden flex items-center justify-center">
      {/* Background Image with Dark Overlay */}
      <Image
        src={newsHeroBanner}
        alt="Gốm sứ Vũ Gia"
        fill
        className="object-cover z-0"
        sizes="100vw"
        priority
      />
      <div className="absolute inset-0 bg-black/49 z-10" />

      {/* Dynamic Content */}
      <div className="relative z-20 text-center px-4 flex flex-col items-center gap-[12px] lg:gap-[16px]">
        {/* Hidden on mobile, shown on desktop */}
        <h1 className="hidden lg:block text-white font-inter font-[700] text-[24px] uppercase tracking-wide leading-[16px]">
          {activeCategoryName}
        </h1>
        
        {/* Breadcrumbs Trail */}
        <nav className="flex items-center text-white text-[16px] font-[700] uppercase tracking-wider font-inter leading-normal lg:leading-[24px]">
          {/* Mobile view */}
          <span className="lg:hidden select-none">Trang chủ / tin tức</span>
          
          {/* Desktop view */}
          <span className="hidden lg:inline-flex items-center">
            <Link href={ROUTES.HOME} className="hover:text-white/80 transition-colors">
              Trang chủ
            </Link>
            <span className="mx-2 text-white">/</span>
            <span>Blog</span>
            <span className="mx-2 text-white">/</span>
            <span className="text-white">{activeCategoryName}</span>
          </span>
        </nav>
      </div>
    </section>
  );
}

