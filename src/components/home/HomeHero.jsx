// src/components/home/HomeHero.jsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { Menu, ChevronRight } from "lucide-react";
import heroBg from "@/assets/images/home/hero-image-1-top.png";
import heroImageLeft from "@/assets/images/home/hero-image-2-left.png";
import heroImageRight from "@/assets/images/home/hero-image-3-right.png";
import { ROUTES } from "@/utils/routes";

const categories = [
  {
    name: "Bộ đồ thờ",
    icon: "/images/home/bo-do-tho-icon.png",
    active: false,
    href: ROUTES.PRODUCTS,
  },
  {
    name: "Bình phong thủy",
    icon: "/images/home/binh-phong-thuy-icon.png",
    active: true,
    href: ROUTES.PRODUCTS,
    subItems: [
      { name: "Bình hút lộc", href: ROUTES.PRODUCTS },
      { name: "Mai bình hút lộc", href: ROUTES.PRODUCTS },
    ],
  },
  {
    name: "Lục bình gốm sứ",
    icon: "/images/home/luc-binh-gom-su-icon.png",
    active: false,
    href: ROUTES.PRODUCTS,
  },
  {
    name: "Ấm chén Bát Tràng",
    icon: "/images/home/am-chen-bat-trang.png",
    active: false,
    href: ROUTES.PRODUCTS,
  },
  {
    name: "Quà tặng gốm sứ",
    icon: "/images/home/qua-tang-gom-su-icon.png",
    active: false,
    href: ROUTES.PRODUCTS,
  },
  {
    name: "Chum sành ngâm rượu",
    icon: "/images/home/chum-sanh-ruou-ngam-icon.png",
    active: false,
    href: ROUTES.PRODUCTS,
  },
];

export default function HomeHero() {
  return (
    <section className="max-w-[1470px] mx-auto w-full px-[30px] my-[70px] grid grid-cols-1 gap-[26px]">
      {/* 1. Hàng trên: Sidebar Menu & Main Banner */}
      <div className="flex flex-col lg:flex-row gap-[26px]">
        {/* Sidebar Menu (Ẩn trên Mobile) */}
        <div className="hidden lg:flex flex-col w-[25%] flex-shrink-0 border border-gray-200 rounded-[10px] bg-white shadow-sm h-fit">
          <div className="bg-sale text-white px-5 py-[14px] flex items-center justify-between cursor-pointer rounded-t-[10px]">
            <span className="font-montserrat font-bold text-[16px] leading-[24px] uppercase tracking-wide">
              Tất cả danh mục
            </span>
            <Menu className="w-5 h-5" />
          </div>
          <div className="flex flex-col rounded-b-[10px] relative">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className="relative group/menu border-b border-gray-100 last:border-b-0"
              >
                <Link
                  href={cat.href}
                  className="group flex items-center justify-between px-5 py-5 hover:bg-orange-50/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-[24px] h-[24px] relative flex-shrink-0">
                      <Image
                        src={cat.icon}
                        alt={cat.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span
                      className={`font-montserrat font-medium text-[18px] transition-colors ${
                        cat.active
                          ? "text-primary"
                          : "text-[#606060] group-hover:text-primary"
                      }`}
                    >
                      {cat.name}
                    </span>
                  </div>
                  <ChevronRight
                    className={`w-[18px] h-[18px] transition-colors ${
                      cat.active
                        ? "text-primary"
                        : "text-gray-300 group-hover:text-primary"
                    }`}
                  />
                </Link>

                {/* Submenu Dropdown */}
                {cat.subItems && (
                  <div className="absolute left-full top-0 w-[240px] bg-white border border-gray-200 shadow-lg opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-300 z-20 flex flex-col">
                    {cat.subItems.map((sub, sIdx) => (
                      <Link
                        key={sIdx}
                        href={sub.href}
                        className="px-5 py-5 border-b border-gray-100 last:border-b-0 text-[#606060] font-montserrat font-medium text-[18px] leading-[24px] hover:text-primary hover:bg-orange-50 transition-colors"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Banner */}
        <div className="relative w-full lg:flex-1 rounded-[10px] overflow-hidden group bg-[#F3EFEA] min-h-[400px] lg:min-h-auto">
          <Image
            src={heroBg}
            alt="Ưu đãi tháng 3 - Sản phẩm gốm Bát Tràng"
            fill
            className="object-cover object-right lg:object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            priority
          />
          <div className="absolute inset-0 flex flex-col justify-center px-6 lg:px-10 lg:pl-[53px] lg:justify-start lg:pt-[46px]">
            <p className="text-primary font-montserrat font-bold text-[18px] lg:text-[22.52px] uppercase mb-1 lg:mb-0">
              Ưu đãi tháng 3
            </p>
            <p className="text-sale font-montserrat font-bold text-[48px] lg:text-[84.48px] leading-[1] lg:leading-[84.48px] mt-1 mb-1 lg:mb-2">
              299.000đ
            </p>
            <p className="text-[#676767] font-montserrat font-bold text-[19.54px] lg:text-[28px] uppercase max-w-[200px] lg:max-w-none">
              Sản phẩm gốm Bát Tràng
            </p>
            <div className="mt-6 lg:mt-[30px]">
              <Link
                href={ROUTES.PRODUCTS}
                className="inline-block bg-sale hover:bg-primary transition-colors text-white font-montserrat font-bold text-[16px] lg:text-[18px] leading-[16px] uppercase px-6 py-3 lg:px-[32px] lg:py-[16px] rounded shadow-sm hover:shadow-md"
              >
                Mua ngay
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Hàng dưới: 2 Banners phụ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[26px]">
        {/* Sub Banner 1 */}
        <Link
          href={ROUTES.PRODUCTS}
          className="relative w-full rounded-[10px] overflow-hidden group aspect-[720/320] block"
        >
          <Image
            src={heroImageLeft}
            alt="Các sản phẩm nổi bật"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 px-[40px] pt-[36px] flex flex-col justify-start">
            <h3 className="text-white font-montserrat font-bold text-[28px] lg:text-[36px] uppercase leading-[1.2] lg:leading-[43px] mb-[13px]">
              Các sản phẩm
              <br />
              nổi bật
            </h3>
            <span className="text-white font-montserrat font-semibold text-[14px] leading-[16px] underline underline-offset-4 decoration-1">
              Xem chi tiết
            </span>
          </div>
        </Link>

        {/* Sub Banner 2 */}
        <Link
          href={ROUTES.PRODUCTS}
          className="relative w-full rounded-[10px] overflow-hidden group aspect-[720/320] block"
        >
          <Image
            src={heroImageRight}
            alt="Phong thuỷ, Trang trí"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 px-[40px] pt-[36px] flex flex-col justify-start">
            <h3 className="text-white font-montserrat font-bold text-[28px] lg:text-[36px] uppercase leading-[1.2] lg:leading-[43px] mb-[13px]">
              Phong thuỷ,
              <br />
              Trang trí
            </h3>
            <span className="text-white font-montserrat font-semibold text-[14px] leading-[16px]">
              Xem chi tiết
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
