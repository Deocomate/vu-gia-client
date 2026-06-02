// src/components/home/HomeCategoryBanners.jsx
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/utils/routes";
import banner1 from "@/assets/images/home/categories-banner-image-1.png";
import banner2 from "@/assets/images/home/categories-banner-image-2.png";
import banner3 from "@/assets/images/home/categories-banner-image-3.png";

const categories = [
  {
    title: "Ấm chén Bát Tràng",
    image: banner1,
    link: ROUTES.PRODUCTS,
  },
  {
    title: "Chum sành ngâm rượu",
    image: banner2,
    link: ROUTES.PRODUCTS,
  },
  {
    title: "Quà tặng Bát Tràng",
    image: banner3,
    link: ROUTES.PRODUCTS,
  },
];

export default function HomeCategoryBanners() {
  return (
    <section className="w-full bg-[#FFF6ED] py-[50px]">
      <div className="mx-auto w-full px-[60px]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px]">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              href={cat.link}
              className="relative block w-full rounded-[10px] overflow-hidden group aspect-[585/651]"
            >
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, 33vw"
              />

              {/* Box Tiêu đề */}
              <div className="absolute top-[33px] left-1/2 -translate-x-1/2 bg-primary rounded-[10px] px-[18px] pt-[9px] pb-[10px] flex items-center justify-center z-10 whitespace-nowrap shadow-sm">
                <h3 className="text-white font-montserrat font-[800] text-[16px] lg:text-[24px] uppercase leading-[24px]">
                  {cat.title}
                </h3>
              </div>

              {/* Text link xem chi tiết */}
              <div className="absolute bottom-[29px] right-[20px] lg:right-[47px] z-10">
                <span className="text-[#FFF6ED] font-inter font-[600] text-[14px] leading-[16px] underline decoration-1 underline-offset-4 [text-shadow:0px_4px_4px_rgba(0,0,0,0.25)] group-hover:text-white transition-colors">
                  Xem chi tiết danh mục
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
