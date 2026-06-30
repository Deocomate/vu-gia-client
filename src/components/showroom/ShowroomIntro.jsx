"use client";

import React, { useCallback } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";

import heroImg from "@/assets/images/showroom/showroom-hero.png";
import img1 from "@/assets/images/showroom/showroom-gallery-1.png";
import img2 from "@/assets/images/showroom/showroom-gallery-2.png";
import img3 from "@/assets/images/showroom/showroom-gallery-3.png";
import img4 from "@/assets/images/showroom/showroom-gallery-4.png";

const INTRO_IMAGES = [
  { src: heroImg, alt: "Không gian trưng bày Showroom Gốm Sứ Vũ Gia" },
  { src: img1, alt: "Thiết kế sofa da cao cấp góc trưng bày" },
  { src: img2, alt: "Khu vực trưng bày bàn ăn đá và ghế tối giản" },
  { src: img3, alt: "Kệ trưng bày gốm sứ bát đĩa Vũ Gia" },
  { src: img4, alt: "Góc đọc sách với ghế bành da và cây cảnh trong showroom" },
];

export default function ShowroomIntro() {
  const [emblaRef] = useEmblaCarousel({
    loop: true,
    align: "start",
  });

  return (
    <section className="w-full pt-[42px] lg:pt-[130px] pb-0 font-archivo flex flex-col lg:flex-row items-stretch lg:items-start">
      {/* Left Column: Info & Actions (Standard Container Left margin + 50px extra padding, 58px top offset to align with image, width 503px) */}
      <div className="w-full lg:w-[503px] flex-shrink-0 px-[20px] lg:ml-[80px] xl:ml-[calc((100%-1470px)/2+80px)] lg:mr-0 lg:px-0 flex flex-col justify-start pt-0 lg:pt-[58px] pb-4 lg:pb-0">
        {/* Title */}
        <h2 className="font-arima text-[#2E2F2A] text-[30px] lg:text-[48px] font-[500] leading-tight mb-[18.5px] tracking-wide">
          Showroom Bát Tràng
        </h2>

        {/* Separator Line */}
        <div className="w-full lg:ml-[95px] lg:w-[calc(100%+42px)] h-[1px] bg-[#2E2F2A]/10 mb-[45px] lg:mb-[85.5px]"></div>

        {/* Details Table */}
        <div className="grid grid-rows-2 gap-[18px] lg:gap-[24px] text-[#2E2F2A] mb-[40px] lg:mb-[57px] px-[20px] lg:px-0">
          {/* Address */}
          <div className="flex flex-row items-start">
            <span className="text-[15px] lg:text-[16px] font-[500] uppercase tracking-wider leading-[30px] lg:leading-[40px] w-[130px] flex-shrink-0">
              Địa chỉ
            </span>
            <span className="text-[15px] lg:text-[16px] font-bold leading-[26px] lg:leading-[40px] min-w-0 break-words">
              18 Giang Cao, Bát Tràng,<br className="block md:hidden" /> Gia Lâm, Hà Nội
            </span>
          </div>

          {/* Phone */}
          <div className="flex flex-row items-start">
            <span className="text-[15px] lg:text-[16px] font-[500] uppercase tracking-wider leading-[30px] lg:leading-[40px] w-[130px] flex-shrink-0">
              Điện thoại
            </span>
            <span className="text-[15px] lg:text-[16px] font-bold leading-[26px] lg:leading-[40px]">
              0966 55 8808
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-[18px] w-full mb-10 lg:mb-0">
          {/* Button 1: Contact */}
          <a
            href="tel:0966558808"
            className="w-full md:max-w-[362px] h-[76px] bg-gradient-to-r from-[#E79735] to-[#C76E00] hover:from-[#C76E00] hover:to-[#A65C00] text-white flex flex-col items-center justify-center gap-[10px] shadow-sm transition-all duration-300 active:scale-[0.98] select-none rounded-[2px]"
          >
            {/* Mail Icon */}
            <img
              src="/icons/showroom-mail-icon.png"
              alt="Mail Icon"
              width={16}
              height={12}
              className="w-[16px] h-[12px] object-contain"
            />
            <span className="text-[13px] font-[800] uppercase tracking-widest leading-none">
              Liên hệ ngay
            </span>
          </a>

          {/* Button 2: Map direction */}
          <a
            href="https://maps.google.com/?q=18+Giang+Cao,+Bát+Tràng,+Gia+Lâm,+Hà+Nội"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:max-w-[362px] h-[76px] border-[3px] border-[#C76E00] bg-transparent hover:bg-[#C76E00]/5 text-[#97400C] flex flex-col items-center justify-center gap-[10px] transition-all duration-300 active:scale-[0.98] select-none rounded-[2px]"
          >
            {/* Direction Icon */}
            <img
              src="/icons/showroom-way-icon.png"
              alt="Way Icon"
              width={16}
              height={16}
              className="w-[16px] h-[16px] object-contain"
            />
            <span className="text-[13px] font-[800] uppercase tracking-widest leading-none">
              Đường đi
            </span>
          </a>
        </div>
      </div>

      {/* Right Column: Carousel (137px desktop gap from Left text, overflowing right edge of screen) */}
      <div className="flex-grow w-full lg:w-auto ml-[20px] lg:ml-[137px] overflow-hidden flex flex-col">
        {/* Carousel Viewport */}
        <div className="embla overflow-hidden w-full" ref={emblaRef}>
          <div className="embla__container flex -ml-[20px] lg:-ml-[50px]">
            {INTRO_IMAGES.map((item, index) => (
              <div
                key={index}
                className="embla__slide pl-[20px] lg:pl-[50px] w-[325px] lg:w-[525px] shrink-0"
              >
                <div className="relative w-full h-[400px] lg:h-[600px] bg-neutral-100 overflow-hidden shadow-sm">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover hover:scale-[1.02] transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 525px"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
