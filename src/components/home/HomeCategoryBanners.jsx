// src/components/home/HomeCategoryBanners.jsx
import SafeImage from "@/components/shared/SafeImage";
import Link from "next/link";
import { ROUTES } from "@/shared/utils/routes";
import { formatImageUrl } from "@/shared/api/media";
import placeholderBanner from "@/assets/images/home/categories-banner-image-1.png";

export default function HomeCategoryBanners({ banners = [] }) {
  // Real `Banner` entities (position=HOME_CATEGORY), ordered by sortOrder server-side.
  if (banners.length === 0) return null;

  return (
    <section className="w-full bg-[#FFF6ED] pt-[30px] pb-[35px] lg:py-[50px]">
      {/* Desktop Layout */}
      <div className="hidden lg:block mx-auto w-full px-[60px]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px]">
          {banners.map((banner) => (
            <Link
              key={banner.id}
              href={banner.linkUrl || ROUTES.PRODUCTS}
              className="relative block w-full rounded-[10px] overflow-hidden group aspect-[585/651]"
            >
              <SafeImage
                src={formatImageUrl(banner.imageUrl) || placeholderBanner}
                alt={banner.title || "Danh mục sản phẩm"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, 33vw"
              />

              {/* Box Tiêu đề */}
              {banner.title && (
                <div className="absolute top-[33px] left-1/2 -translate-x-1/2 bg-primary rounded-[10px] px-[18px] pt-[9px] pb-[10px] flex items-center justify-center z-10 whitespace-nowrap shadow-sm">
                  <h3 className="text-white font-montserrat font-[800] text-[16px] lg:text-[24px] uppercase leading-[24px]">
                    {banner.title}
                  </h3>
                </div>
              )}

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

      {/* Mobile Layout */}
      <div className="lg:hidden w-full overflow-x-auto no-scrollbar flex gap-[20px] px-[31px] scroll-px-[31px] snap-x snap-mandatory">
        {banners.map((banner) => (
          <Link
            key={banner.id}
            href={banner.linkUrl || ROUTES.PRODUCTS}
            className="relative block w-[283px] h-[315px] shrink-0 rounded-[10px] overflow-hidden snap-start"
          >
            <SafeImage
              src={formatImageUrl(banner.imageUrl) || placeholderBanner}
              alt={banner.title || "Danh mục sản phẩm"}
              fill
              className="object-cover"
              sizes="283px"
            />

            {/* Box Tiêu đề - Mobile */}
            {banner.title && (
              <div className="absolute top-[20px] left-1/2 -translate-x-1/2 bg-primary rounded-[8px] w-[185px] h-[26px] flex items-center justify-center z-10 shadow-sm">
                <h3 className="text-white font-montserrat font-[800] text-[14px] uppercase leading-normal text-center whitespace-nowrap">
                  {banner.title}
                </h3>
              </div>
            )}

            {/* Text link xem chi tiết - Mobile */}
            <div className="absolute bottom-[13px] right-[20px] z-10">
              <span className="text-[#FFF6ED] font-montserrat font-semibold text-[12px] leading-[16px] underline decoration-solid decoration-from-font [text-decoration-skip-ink:none] [text-underline-position:from-font] [text-shadow:0px_4px_4px_rgba(0,0,0,0.25)]">
                Xem chi tiết danh mục
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
