"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/utils/routes";
import newsHeroBanner from "@/assets/images/news/news-hero-banner.png";

export default function NewsHero({ activeCategoryName }) {
  return (
    <section className="relative w-full h-[220px] lg:h-auto lg:pt-[132px] lg:pb-[132px] overflow-hidden flex items-center justify-center">
      {/* Background Image with Dark Overlay */}
      <Image
        src={newsHeroBanner}
        alt="Gốm sứ Vũ Gia"
        fill
        className="object-cover z-0"
        priority
      />
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Dynamic Content */}
      <div className="relative z-20 text-center px-4 flex flex-col items-center gap-3 lg:gap-[16px]">
        <h1 className="text-white font-inter font-bold text-[24px] lg:text-[32px] uppercase tracking-wide leading-tight">
          {activeCategoryName}
        </h1>
        
        {/* Breadcrumbs Trail */}
        <nav className="flex items-center text-white/90 text-[14px] lg:text-[16px] font-bold uppercase tracking-wider font-inter">
          <Link href={ROUTES.HOME} className="hover:text-[#EABA96] transition-colors">
            Trang chủ
          </Link>
          <span className="mx-2 text-white/60">/</span>
          <span className="text-white/60">Blog</span>
          <span className="mx-2 text-white/60">/</span>
          <span className="text-[#EABA96]">{activeCategoryName}</span>
        </nav>
      </div>
    </section>
  );
}
