"use client";

import React, { useCallback } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";

import img1 from "@/assets/images/nha-xuong/slider-image-1.png";
import img2 from "@/assets/images/nha-xuong/slider-image-2.png";
import img3 from "@/assets/images/nha-xuong/slider-image-3.png";
import img4 from "@/assets/images/nha-xuong/slider-image-4.png";

const SLIDER_IMAGES = [
  { src: img1, alt: "Chi tiết mái chùa lợp ngói Vũ Gia" },
  { src: img2, alt: "Khuôn viên và sân cỏ tại nhà xưởng" },
  { src: img3, alt: "Công trình Nesta Hội An hoàn thiện" },
  { src: img4, alt: "Lối đi lát gạch đỏ gốm truyền thống" },
];

export default function FactorySlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className="w-full flex flex-col pb-[60px]">
      {/* Navigation Controls Bar - Aligned to standard container */}
      <div className="max-w-[1470px] mx-auto px-[20px] lg:px-[30px] w-full flex justify-end gap-[16px] mb-[33px]">
        {/* Left Arrow */}
        <button
          onClick={scrollPrev}
          className="w-[44px] h-[44px] border border-[#101010]/20 rounded-full flex items-center justify-center text-[#101010] hover:bg-[#101010] hover:text-white transition-colors duration-200 cursor-pointer"
          aria-label="Slide trước"
        >
          <svg
            width="18"
            height="12"
            viewBox="0 0 18 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 11L1 6M1 6L6 1M1 6H17"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Right Arrow */}
        <button
          onClick={scrollNext}
          className="w-[44px] h-[44px] border border-[#101010]/20 rounded-full flex items-center justify-center text-[#101010] hover:bg-[#101010] hover:text-white transition-colors duration-200 cursor-pointer"
          aria-label="Slide sau"
        >
          <svg
            width="18"
            height="12"
            viewBox="0 0 18 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 1L17 6M17 6L12 11M17 6H1"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Slider Viewport - Left aligned with container, bleeding right */}
      <div
        className="embla overflow-hidden ml-[20px] lg:ml-[30px] xl:ml-[calc((100%-1470px)/2+30px)]"
        ref={emblaRef}
      >
        <div className="embla__container flex -ml-[21px]">
          {SLIDER_IMAGES.map((item, index) => (
            <div
              key={index}
              className="embla__slide pl-[21px] flex-[0_0_100%] md:flex-[0_0_50%] min-w-0"
            >
              <div className="relative w-full h-[250px] sm:h-[350px] md:h-[400px] lg:h-[480px] bg-neutral-100 overflow-hidden">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
