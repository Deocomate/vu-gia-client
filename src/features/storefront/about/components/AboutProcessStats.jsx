import React from "react";
import Image from "next/image";
import aboutImg3 from "@/assets/images/about/about-image-3.jpg";

export default function AboutProcessStats() {
  return (
    <section className="w-full px-[31px] lg:px-0 mb-[60px] lg:mb-[100px]">
      <div className="relative w-full h-[592px] lg:h-[996px] bg-neutral-200 overflow-hidden">
        {/* Background Image */}
        <Image
          src={aboutImg3}
          alt="Quy trình sản xuất Gốm Vũ Gia"
          fill
          className="object-cover"
          sizes="100vw"
        />

        {/* Dark Overlay (40% as per Figma context) */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>
      </div>
    </section>
  );
}
