import React from "react";
import Image from "next/image";
import closingThumb from "@/assets/images/home/closing-thumb.png";

export default function AboutHero() {
  return (
    <section className="relative w-full h-[350px] md:h-[500px] lg:h-[664px] bg-neutral-200 overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <Image
        src={closingThumb}
        alt="Gốm Sứ Vũ Gia Workshop"
        fill
        className="object-cover"
        sizes="100vw"
        priority
      />

      {/* Dark Overlay (39% as per Figma context) */}
      <div className="absolute inset-0 bg-black/39 pointer-events-none"></div>

      {/* Centered White Logo */}
      <div className="relative z-10 w-[200px] h-[117px] md:w-[300px] md:h-[175px] lg:w-[370px] lg:h-[217px] transition-all duration-300">
        <Image
          src="/images/footer/footer-logo.png"
          alt="Gốm Sứ Vũ Gia Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
    </section>
  );
}
