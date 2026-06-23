import React from "react";
import FactoryBanner from "@/components/factory/FactoryBanner";
import FactoryIntro from "@/components/factory/FactoryIntro";
import FactoryQuote from "@/components/factory/FactoryQuote";
import FactorySlider from "@/components/factory/FactorySlider";
import FactoryProcess from "@/components/factory/FactoryProcess";
import FactoryDetailImage from "@/components/factory/FactoryDetailImage";
import FactoryShowcase from "@/components/factory/FactoryShowcase";

export default function FactoryView() {
  return (
    <div className="w-full bg-white overflow-hidden">
      {/* Top Banner */}
      <FactoryBanner />

      {/* Intro & Quote - Container Constrained */}
      <div className="max-w-[1470px] mx-auto px-[20px] lg:px-[30px] w-full">
        <FactoryIntro />
        <FactoryQuote />
      </div>

      {/* Middle Slider - Left-aligned container margin, overflowing right */}
      <FactorySlider />

      {/* Process - Container Constrained */}
      <div className="max-w-[1470px] mx-auto px-[20px] lg:px-[30px] w-full">
        <FactoryProcess />
      </div>

      {/* Detail Image - Container Constrained on both sides */}
      <div className="max-w-[1470px] mx-auto px-[20px] lg:px-[30px] w-full">
        <FactoryDetailImage />
      </div>

      {/* Bottom Projects Showcase - Left-aligned container margin, overflowing right */}
      <FactoryShowcase />
    </div>
  );
}

