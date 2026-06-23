"use client";
import Image from "next/image";
import Link from "next/link";
import { Menu, ChevronRight, Search } from "lucide-react";
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
    <section className="relative w-full overflow-hidden">
      <div className="hidden lg:block absolute top-10 scale-175 right-[-210px] w-[200px] h-[281px] sm:w-[280px] sm:h-[393px] lg:w-[400px] lg:h-[562px] pointer-events-none z-0">
        <Image
          src="/images/home/home-hero-pattern-right.png"
          alt=""
          fill
          className="object-contain object-top-right"
          aria-hidden
        />
      </div>
      <div className="hidden lg:block absolute bottom-10 scale-175 left-[-190px] w-[200px] h-[281px] sm:w-[280px] sm:h-[393px] lg:w-[400px] lg:h-[562px] pointer-events-none z-0">
        <Image
          src="/images/home/home-hero-pattern-left.png"
          alt=""
          fill
          className="object-contain object-bottom-left"
          aria-hidden
        />
      </div>

      <div className="relative z-10 max-w-[1470px] mx-auto w-full px-[31px] mt-0 mb-0 lg:px-[30px] lg:my-[70px] grid grid-cols-1 gap-[20px] lg:gap-[26px]">
        <div className="lg:hidden h-[35px] rounded-[8px] border border-[#E1DEDE] bg-white flex items-center gap-[8px] px-[9px]">
          <Search className="w-[14px] h-[14px] text-[#777777]" aria-hidden />
          <span className="font-montserrat text-[14px] leading-[26px] text-[#777777]">
            Tìm kiếm
          </span>
        </div>

        {/* 1. Hàng trên: Sidebar Menu & Main Banner */}
        <div className="flex flex-col lg:flex-row gap-[20px] lg:gap-[26px]">
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
          <div className="relative w-full lg:flex-1 rounded-[8px] lg:rounded-[10px] overflow-hidden group bg-[#F3EFEA] h-[401px] lg:h-auto lg:min-h-auto">
            <Image
              src={heroBg}
              alt="Ưu đãi tháng 6 - Sản phẩm gốm Bát Tràng"
              fill
              className="object-cover object-center lg:object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              priority
            />
            <div className="absolute inset-0 flex flex-col justify-start pt-[17px] pl-[22px] pr-[20px] lg:px-10 lg:pl-[53px] lg:pt-[46px]">
              <p className="text-primary font-montserrat font-bold text-[15.72px] lg:text-[22.52px] leading-normal uppercase mb-0">
                Ưu đãi tháng 6
              </p>
              <p className="text-sale font-montserrat font-bold text-[48px] lg:text-[84.48px] leading-none lg:leading-[84.48px] tracking-[-0.96px] lg:tracking-normal mt-[2px] mb-[2px] lg:mb-2">
                299.000đ
              </p>
              <p className="text-[#676767] font-montserrat font-bold text-[19.54px] lg:text-[28px] leading-normal uppercase max-w-none">
                Sản phẩm gốm Bát Tràng
              </p>
              <div className="mt-[13px] lg:mt-[30px]">
                <Link
                  href={ROUTES.PRODUCTS}
                  className="inline-flex items-center justify-center bg-sale hover:bg-primary transition-colors text-white font-montserrat font-extrabold lg:font-bold text-[13px] lg:text-[18px] leading-[16px] uppercase h-[31px] px-[20px] lg:h-auto lg:px-[32px] lg:py-[16px] rounded-[8px] lg:rounded shadow-sm hover:shadow-md"
                >
                  Mua ngay
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Hàng dưới: 2 Banners phụ */}
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-x-[19px] gap-y-0 lg:gap-[26px]">
          {/* Sub Banner 1 */}
          <Link
            href={ROUTES.PRODUCTS}
            className="relative w-full rounded-[8px] lg:rounded-[10px] overflow-hidden group aspect-[175/190] lg:aspect-[720/320] block"
          >
            <Image
              src={heroImageLeft}
              alt="Các sản phẩm nổi bật"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 px-[14px] pt-[10px] lg:px-[40px] lg:pt-[36px] flex flex-col justify-start">
              <h3 className="text-white font-montserrat font-bold text-[16px] lg:text-[36px] uppercase leading-[20px] lg:leading-[43px] tracking-[-0.16px] lg:tracking-normal mb-0 lg:mb-[13px]">
                Các sản phẩm
                <br />
                nổi bật
              </h3>
              <span className="text-white font-montserrat font-medium lg:font-semibold text-[10px] lg:text-[14px] leading-[16px] underline underline-offset-4 decoration-1">
                Xem chi tiết
              </span>
            </div>
          </Link>

          {/* Sub Banner 2 */}
          <Link
            href={ROUTES.PRODUCTS}
            className="relative w-full rounded-[8px] lg:rounded-[10px] overflow-hidden group aspect-[175/190] lg:aspect-[720/320] block"
          >
            <Image
              src={heroImageRight}
              alt="Phong thuỷ, Trang trí"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 px-[14px] pt-[10px] lg:px-[40px] lg:pt-[36px] flex flex-col justify-start">
              <h3 className="text-white font-montserrat font-bold text-[16px] lg:text-[36px] uppercase leading-[20px] lg:leading-[43px] tracking-[-0.16px] lg:tracking-normal mb-0 lg:mb-[13px]">
                Phong thuỷ,
                <br />
                Trang trí
              </h3>
              <span className="text-white font-montserrat font-medium lg:font-semibold text-[10px] lg:text-[14px] leading-[16px]">
                Xem chi tiết
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
