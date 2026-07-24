// src/components/shared/NewsCard.jsx
import SafeImage from "@/shared/components/SafeImage";
import Link from "next/link";
import { ROUTES } from "@/shared/utils/routes";

export default function NewsCard({
  image = "/images/home/home-new-1.png",
  category = "Danh mục",
  title = "Tiêu đề tin tức",
  description = "Mô tả ngắn...",
  slug = "bai-viet",
  hasTwoLineTitle = true,
  className = "w-full",
}) {
  return (
    <Link
      href={`${ROUTES.NEWS}/${slug}`}
      className={`flex flex-col group cursor-pointer ${className}`}
    >
      {/* Thumbnail */}
      <div className="w-full aspect-[587/397] rounded-[8.03px] overflow-hidden relative">
        <SafeImage
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Category Tag (Khoảng cách 12px từ ảnh trên mobile, 20px trên desktop) */}
      <div className="mt-[12px] lg:mt-[20px] flex items-center">
        <span className="h-[20px] lg:h-[30px] px-[10px] lg:px-[16px] inline-flex items-center justify-center border border-primary rounded-[35px] text-primary font-montserrat font-[500] lg:font-[600] text-[12px] lg:text-[15px] xl:text-[16.92px] leading-normal lg:leading-[24.17px]">
          {category}
        </span>
      </div>

      {/* Title (Khoảng cách 10px từ Tag. Set min-h-[48px] trên mobile, min-h-[78px] trên desktop để luôn giữ chỗ cho 2 dòng chữ) */}
      <h3 
        className={`mt-[10px] text-[#101828] font-montserrat font-[600] text-[16px] lg:text-[20px] xl:text-[24px] leading-[24px] lg:leading-[32px] xl:leading-[38.67px] line-clamp-2 group-hover:text-primary transition-colors ${
          hasTwoLineTitle ? "min-h-[48px] lg:min-h-[78px]" : "min-h-0"
        }`}
      >
        {title}
      </h3>

      {/* Description (Đã giảm margin-top xuống 10px theo yêu cầu) */}
      <p className="mt-[10px] text-[#383838] font-montserrat font-[400] text-[14px] lg:text-[16px] leading-[24px] lg:leading-[25px] line-clamp-3">
        {description}
      </p>
    </Link>
  );
}
