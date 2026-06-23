"use client";

import React from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

import img1 from "@/assets/images/nha-xuong/slider-image-1.png";
import img2 from "@/assets/images/nha-xuong/slider-image-2.png";
import img3 from "@/assets/images/nha-xuong/slider-image-3.png";
import img4 from "@/assets/images/nha-xuong/slider-image-4.png";

const SHOWCASE_IMAGES = [
  { src: img3, alt: "Dự án Nesta Hội An sử dụng Gốm Sứ Vũ Gia" },
  { src: img4, alt: "Lối đi gạch đỏ truyền thống ngoài trời" },
  { src: img1, alt: "Chi tiết mái chùa lợp ngói Vũ Gia" },
  { src: img2, alt: "Khuôn viên và sân cỏ tại nhà xưởng" },
];

export default function FactoryShowcase() {
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
    },
    [
      Autoplay({
        delay: 5000,
        stopOnInteraction: false,
      }),
    ]
  );

  return (
    <section className="w-full pt-[60px] lg:pt-[104px] pb-[60px] lg:pb-[99px] font-montserrat">
      {/* Slider Viewport - Left aligned with container, bleeding right, no buttons */}
      <div
        className="embla overflow-hidden ml-[20px] lg:ml-[30px] xl:ml-[calc((100%-1470px)/2+30px)]"
        ref={emblaRef}
      >
        <div className="embla__container flex -ml-[21px]">
          {SHOWCASE_IMAGES.map((item, index) => (
            <div
              key={index}
              className="embla__slide pl-[21px] flex-[0_0_100%] md:flex-[0_0_66%] min-w-0"
            >
              <div className="relative w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[587px] bg-neutral-100 overflow-hidden">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover hover:scale-[1.02] transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 66vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
