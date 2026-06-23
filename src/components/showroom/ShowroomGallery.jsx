"use client";

import React from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

import img1 from "@/assets/images/showroom/showroom-gallery-1.png";
import img2 from "@/assets/images/showroom/showroom-gallery-2.png";
import img3 from "@/assets/images/showroom/showroom-gallery-3.png";
import img4 from "@/assets/images/showroom/showroom-gallery-4.png";

const GALLERY_IMAGES = [
  { src: img1, alt: "Thiết kế sofa da cao cấp góc trưng bày" },
  { src: img2, alt: "Khu vực trưng bày bàn ăn đá và ghế tối giản" },
  { src: img3, alt: "Kệ trưng bày gốm sứ bát đĩa Vũ Gia" },
  { src: img4, alt: "Góc đọc sách với ghế bành da và cây cảnh trong showroom" },
];

export default function ShowroomGallery() {
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
    <section className="w-full pt-[60px] lg:pt-[150px] pb-[60px] lg:pb-[150px]">
      {/* Slider Viewport - Full Width */}
      <div
        className="embla overflow-hidden w-full"
        ref={emblaRef}
      >
        <div className="embla__container flex -ml-[50px]">
          {GALLERY_IMAGES.map((item, index) => (
            <div
              key={index}
              className="embla__slide pl-[50px] w-[525px] shrink-0"
            >
              <div className="relative w-full h-[600px] bg-neutral-100 overflow-hidden shadow-sm">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover hover:scale-[1.03] transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 525px"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
