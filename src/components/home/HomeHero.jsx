import Image from "next/image";
import SafeImage from "@/components/shared/SafeImage";
import Link from "next/link";
import { Menu, ChevronRight, Search } from "lucide-react";
import heroBg from "@/assets/images/home/hero-image-1-top.png";
import heroImageLeft from "@/assets/images/home/hero-image-2-left.png";
import heroImageRight from "@/assets/images/home/hero-image-3-right.png";
import { ROUTES } from "@/utils/routes";
import { formatImageUrl } from "@/lib/media";

export default function HomeHero({ banners = [], categories = [] }) {
  // `banners` are real `Banner` entities (position=HOME_HERO), ordered by
  // sortOrder server-side. First entry is the main banner, next two fill the
  // sub-banner slots; local static images act as a visual fallback only when
  // no banner has been seeded yet for a slot.
  const [mainBanner, subBannerLeft, subBannerRight] = banners;
  const sidebarCategories = categories.slice(0, 8);

  return (
    <section className="relative w-full overflow-hidden">
      <div className="hidden lg:block absolute top-10 scale-175 right-[-210px] w-[200px] h-[281px] sm:w-[280px] sm:h-[393px] lg:w-[400px] lg:h-[562px] pointer-events-none z-0">
        <Image
          src="/images/home/home-hero-pattern-right.png"
          alt=""
          fill
          className="object-contain object-top-right"
          sizes="400px"
          aria-hidden
        />
      </div>
      <div className="hidden lg:block absolute bottom-24 scale-175 left-[-190px] w-[200px] h-[281px] sm:w-[280px] sm:h-[393px] lg:w-[400px] lg:h-[562px] pointer-events-none z-0">
        <Image
          src="/images/home/home-hero-pattern-left.png"
          alt=""
          fill
          className="object-contain object-bottom-left"
          sizes="400px"
          aria-hidden
        />
      </div>

      <div className="relative z-10 max-w-[1470px] mx-auto w-full px-[31px] mt-0 mb-0 lg:px-[30px] lg:my-[70px] grid grid-cols-1 gap-[20px] lg:gap-[26px]">
        <div className="lg:hidden h-[35px] mt-5 rounded-[8px] border border-[#E1DEDE] bg-white flex items-center gap-[8px] px-[9px]">
          <Search className="w-[14px] h-[14px] text-[#777777]" aria-hidden />
          <span className="font-montserrat text-[14px] leading-[26px] text-[#777777]">
            Tìm kiếm
          </span>
        </div>

        {/* 1. Hàng trên: Sidebar Menu & Main Banner */}
        <div className="flex flex-col lg:flex-row gap-[20px] lg:gap-[26px]">
          {/* Sidebar Menu (Ẩn trên Mobile) - danh mục sản phẩm thật */}
          <div className="hidden lg:flex flex-col w-[25%] flex-shrink-0 border border-gray-200 rounded-[10px] bg-white shadow-sm h-fit">
            <div className="bg-sale text-white px-5 py-[14px] flex items-center justify-between cursor-pointer rounded-t-[10px]">
              <span className="font-montserrat font-bold text-[16px] leading-[24px] uppercase tracking-wide">
                Tất cả danh mục
              </span>
              <Menu className="w-5 h-5" />
            </div>
            <div className="flex flex-col rounded-b-[10px] relative">
              {sidebarCategories.length === 0 && (
                <p className="px-5 py-5 font-montserrat text-[15px] text-[#777777]">
                  Đang cập nhật danh mục sản phẩm.
                </p>
              )}
              {sidebarCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="relative group/menu border-b border-gray-100 last:border-b-0"
                >
                  <Link
                    href={`${ROUTES.PRODUCTS}?category=${cat.slug}`}
                    className="group flex items-center justify-between px-5 py-5 hover:bg-orange-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-[24px] h-[24px] relative flex-shrink-0">
                        <SafeImage
                          src={
                            formatImageUrl(cat.thumb) ||
                            "/images/home/bo-do-tho-icon.png"
                          }
                          alt={cat.name}
                          fill
                          className="object-contain"
                          sizes="24px"
                        />
                      </div>
                      <span className="font-montserrat font-medium text-[18px] text-[#606060] group-hover:text-primary transition-colors">
                        {cat.name}
                      </span>
                    </div>
                    <ChevronRight className="w-[18px] h-[18px] text-gray-300 group-hover:text-primary transition-colors" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Main Banner */}
          <Link
            href={mainBanner?.linkUrl || ROUTES.PRODUCTS}
            className="relative w-full lg:flex-1 rounded-[8px] lg:rounded-[10px] overflow-hidden group bg-[#F3EFEA] h-[401px] lg:h-auto lg:min-h-auto block"
          >
            <SafeImage
              src={formatImageUrl(mainBanner?.imageUrl) || heroBg}
              alt={mainBanner?.title || "Ưu đãi - Sản phẩm gốm Bát Tràng"}
              fill
              className="object-cover object-center lg:object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width: 1024px) 100vw, 1030px"
              priority
            />
            {mainBanner?.title && (
              <div className="absolute inset-0 flex flex-col justify-start pt-[17px] pl-[22px] pr-[20px] lg:px-10 lg:pl-[53px] lg:pt-[46px]">
                <p className="text-[#676767] font-montserrat font-bold text-[19.54px] lg:text-[28px] leading-normal uppercase max-w-[80%]">
                  {mainBanner.title}
                </p>
                <div className="mt-[13px] lg:mt-[30px]">
                  <span className="inline-flex items-center justify-center bg-sale group-hover:bg-primary transition-colors text-white font-montserrat font-extrabold lg:font-bold text-[13px] lg:text-[18px] leading-[16px] uppercase h-[31px] px-[20px] lg:h-auto lg:px-[32px] lg:py-[16px] rounded-[8px] lg:rounded shadow-sm">
                    Mua ngay
                  </span>
                </div>
              </div>
            )}
          </Link>
        </div>

        {/* 2. Hàng dưới: 2 Banners phụ */}
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-x-[19px] gap-y-0 lg:gap-[26px]">
          {/* Sub Banner 1 */}
          <Link
            href={subBannerLeft?.linkUrl || ROUTES.PRODUCTS}
            className="relative w-full rounded-[8px] lg:rounded-[10px] overflow-hidden group aspect-[175/190] lg:aspect-[720/320] block"
          >
            <SafeImage
              src={formatImageUrl(subBannerLeft?.imageUrl) || heroImageLeft}
              alt={subBannerLeft?.title || "Các sản phẩm nổi bật"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width: 1024px) 50vw, 660px"
            />
            <div className="absolute inset-0 px-[14px] pt-[10px] lg:px-[40px] lg:pt-[36px] flex flex-col justify-start">
              <h3 className="text-white font-montserrat font-bold text-[16px] lg:text-[36px] uppercase leading-[20px] lg:leading-[43px] tracking-[-0.16px] lg:tracking-normal mb-0 lg:mb-[13px]">
                {subBannerLeft?.title || "Các sản phẩm nổi bật"}
              </h3>
              <span className="text-white font-montserrat font-medium lg:font-semibold text-[10px] lg:text-[14px] leading-[16px] underline underline-offset-4 decoration-1">
                Xem chi tiết
              </span>
            </div>
          </Link>

          {/* Sub Banner 2 */}
          <Link
            href={subBannerRight?.linkUrl || ROUTES.PRODUCTS}
            className="relative w-full rounded-[8px] lg:rounded-[10px] overflow-hidden group aspect-[175/190] lg:aspect-[720/320] block"
          >
            <SafeImage
              src={formatImageUrl(subBannerRight?.imageUrl) || heroImageRight}
              alt={subBannerRight?.title || "Phong thuỷ, Trang trí"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width: 1024px) 50vw, 660px"
            />
            <div className="absolute inset-0 px-[14px] pt-[10px] lg:px-[40px] lg:pt-[36px] flex flex-col justify-start">
              <h3 className="text-white font-montserrat font-bold text-[16px] lg:text-[36px] uppercase leading-[20px] lg:leading-[43px] tracking-[-0.16px] lg:tracking-normal mb-0 lg:mb-[13px]">
                {subBannerRight?.title || "Phong thuỷ, Trang trí"}
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
