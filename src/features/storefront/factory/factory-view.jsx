import React from "react";
import SafeImage from "@/shared/components/safe-image";
import FactoryBanner from "@/features/storefront/factory/components/factory-banner";
import FactoryIntro from "@/features/storefront/factory/components/factory-intro";
import FactoryQuote from "@/features/storefront/factory/components/factory-quote";
import FactorySlider from "@/features/storefront/factory/components/factory-slider";
import FactoryProcess from "@/features/storefront/factory/components/factory-process";
import FactoryDetailImage from "@/features/storefront/factory/components/factory-detail-image";
import FactoryShowcase from "@/features/storefront/factory/components/factory-showcase";
import { formatImageUrl } from "@/shared/api/media";

export default function FactoryView({ page }) {
  const hasHeroText = page?.heroTitle || page?.heroSubtitle || page?.heroDes;

  return (
    <div className="w-full bg-white overflow-hidden">
      {/* Top Banner (static asset) */}
      <FactoryBanner />

      {/* Hero text driven by the `Page` entity's hero fields (key: "factory").
          Legal/marketing body copy below (Intro/Quote/Slider/Process/...)
          stays static JSX — only hero copy is admin-editable. */}
      {(hasHeroText || page?.heroImage) && (
        <div className="max-w-[1470px] mx-auto px-[30px] w-full pt-[30px] lg:pt-[50px]">
          {page?.heroImage && (
            <div className="relative w-full h-[200px] lg:h-[320px] mb-6 overflow-hidden rounded-[2px]">
              <SafeImage
                src={formatImageUrl(page.heroImage)}
                alt={page.heroTitle || "Nhà xưởng Gốm Sứ Vũ Gia"}
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
          )}
          {page?.heroTitle && (
            <h1 className="font-arima text-[#2E2F2A] text-[28px] lg:text-[40px] font-[500] leading-tight mb-3">
              {page.heroTitle}
            </h1>
          )}
          {page?.heroSubtitle && (
            <p className="font-montserrat text-[#97400C] text-[18px] font-[600] mb-3">
              {page.heroSubtitle}
            </p>
          )}
          {page?.heroDes && (
            <p className="font-montserrat text-[#2E2F2A] text-[16px] leading-[26px] mb-4">
              {page.heroDes}
            </p>
          )}
        </div>
      )}

      {/* Intro & Quote - Container Constrained */}
      <div className="max-w-[1470px] mx-auto px-[30px] w-full">
        <FactoryIntro />
        <FactoryQuote />
      </div>

      {/* Middle Slider - Left-aligned container margin, overflowing right */}
      <FactorySlider />

      {/* Process - Container Constrained */}
      <div className="max-w-[1470px] mx-auto px-[30px] w-full">
        <FactoryProcess />
      </div>

      {/* Detail Image - Container Constrained on both sides */}
      <div className="max-w-[1470px] mx-auto px-[30px] w-full">
        <FactoryDetailImage />
      </div>

      {/* Bottom Projects Showcase - Left-aligned container margin, overflowing right */}
      <FactoryShowcase />
    </div>
  );
}

