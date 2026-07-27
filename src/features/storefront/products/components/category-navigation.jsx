"use client";

import React from "react";
import SafeImage from "@/shared/components/safe-image";
import productCategoryThumb from "@/assets/images/products/product-category-thumb.png";

export default function CategoryNavigation({
  subCategories,
  activeCategory = "all",
  onCategoryChange,
}) {
  // Default list of sub-categories if none provided
  const defaultSubCategories = [
    {
      id: "bo-do-tho",
      name: "Bộ đồ thờ",
      image: productCategoryThumb,
    },
    {
      id: "binh-phong-thuy",
      name: "Bình phong thủy",
      image: productCategoryThumb,
    },
    {
      id: "luc-binh-gom-su",
      name: "Lục bình gốm sứ",
      image: productCategoryThumb,
    },
    {
      id: "am-chen-bat-trang",
      name: "Ấm chén Bát Tràng",
      image: productCategoryThumb,
    },
    {
      id: "qua-tang-gom-su",
      name: "Quà tặng gốm sứ",
      image: productCategoryThumb,
    },
    {
      id: "chum-sanh-ngam-ruou",
      name: "Chum sành ngâm rượu",
      image: productCategoryThumb,
    },
  ];

  const items =
    subCategories && subCategories.length > 0
      ? subCategories
      : defaultSubCategories;

  const handleItemClick = (id) => {
    if (onCategoryChange) {
      onCategoryChange(activeCategory === id ? "all" : id);
    }
  };

  return (
    <div className="w-full pt-[24px] lg:pt-8 pb-0">
      <div className="flex items-start justify-start lg:justify-between gap-[24px] sm:gap-[34px] lg:gap-4 xl:gap-6 overflow-x-auto no-scrollbar lg:overflow-visible lg:pb-4 w-[calc(100%+62px)] lg:w-full mx-[-31px] lg:mx-0 px-[31px] lg:px-0 scroll-px-[31px] lg:scroll-px-0 snap-x lg:snap-none snap-mandatory">
        {items.map((cat, idx) => {
          const isActive = activeCategory === cat.id;
          return (
            <div
              key={cat.id || idx}
              onClick={() => handleItemClick(cat.id)}
              className="flex-shrink-0 text-center group cursor-pointer select-none snap-start"
            >
              {/* Circular image container */}
              <div className="relative w-[84.53px] h-[84.53px] lg:w-[105px] lg:h-[105px] xl:w-[128px] xl:h-[128px] 2xl:w-[145px] 2xl:h-[145px] rounded-full overflow-hidden mx-auto bg-[#D9D9D9]">
                <SafeImage
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 1024px) 85px, (max-width: 1280px) 105px, (max-width: 1536px) 128px, 145px"
                />
              </div>

              {/* Label */}
              <p
                className={`mt-[11px] lg:mt-3 font-montserrat font-[600] lg:font-[700] text-[14px] lg:text-[15px] xl:text-[17px] 2xl:text-[18px] leading-[20px] lg:leading-[24px] text-center w-[84.53px] lg:w-auto mx-auto lg:whitespace-nowrap transition-colors duration-300 break-words ${
                  isActive
                    ? "text-[#97400C]"
                    : "text-[#383838] group-hover:text-[#97400C]"
                }`}
              >
                {cat.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
