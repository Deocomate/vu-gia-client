// src/components/shared/NewsCard.jsx
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/utils/routes";

export default function NewsCard({
  image = "/images/home/home-new-1.png",
  category = "Danh mục",
  title = "Tiêu đề tin tức",
  description = "Mô tả ngắn...",
  slug = "bai-viet",
  hasTwoLineTitle = true,
}) {
  return (
    <Link
      href={`${ROUTES.NEWS}/${slug}`}
      className="flex flex-col w-full group cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="w-full aspect-[587/397] rounded-[8.03px] overflow-hidden relative">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Category Tag (Khoảng cách 20px từ ảnh) */}
      <div className="mt-[20px] flex items-center">
        <span className="h-[30px] px-[16px] inline-flex items-center justify-center border border-primary rounded-[35px] text-primary font-montserrat font-[600] text-[15px] lg:text-[16.92px] leading-[24.17px]">
          {category}
        </span>
      </div>

      {/* Title (Khoảng cách 10px từ Tag. Set min-h-[78px] để luôn giữ chỗ cho 2 dòng chữ) */}
      <h3 
        style={{ minHeight: hasTwoLineTitle ? "78px" : "auto" }}
        className="mt-[10px] text-[#101828] font-montserrat font-[600] text-[20px] lg:text-[24px] leading-[38.67px] line-clamp-2 group-hover:text-primary transition-colors"
      >
        {title}
      </h3>

      {/* Description (Đã giảm margin-top xuống 10px theo yêu cầu) */}
      <p className="mt-[10px] text-[#383838] font-montserrat font-[400] text-[16px] leading-[25px] line-clamp-3">
        {description}
      </p>
    </Link>
  );
}
