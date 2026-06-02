"use client";

import React from "react";
import Image from "next/image";
import productCategoryThumb from "@/assets/images/products/product-category-thumb.png";

export default function CategoryNavigation({
  subCategories,
  activeCategory = "all",
  onCategoryChange,
}) {
  // Default list of sub-categories if none provided
  const defaultSubCategories = [
    {
      id: "men-lam",
      name: "Men lam",
      image: productCategoryThumb, // fallback to existing homepage images
    },
    {
      id: "men-ran",
      name: "Men rạn",
      image: productCategoryThumb,
    },
    {
      id: "men-lam-ve-vang",
      name: "Men lam vẽ vàng",
      image: productCategoryThumb,
    },
    {
      id: "men-ran-dat-vang",
      name: "Men rạn dát vàng",
      image: productCategoryThumb,
    },
    {
      id: "men-mau-theo-menh",
      name: "Men màu theo mệnh",
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
    <div className="w-full pt-8 pb-0">
      <div className="flex items-center justify-start lg:justify-center gap-[30px] lg:gap-[110px] overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {items.map((cat, idx) => {
          const isActive = activeCategory === cat.id;
          return (
            <div
              key={cat.id || idx}
              onClick={() => handleItemClick(cat.id)}
              className="flex-shrink-0 text-center group cursor-pointer select-none"
            >
              {/* Circular image container */}
              <div className="relative w-[150px] h-[150px] rounded-full overflow-hidden mx-auto">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Label */}
              <p
                className={`mt-4 font-montserrat font-[700] text-[18px] leading-[24px] whitespace-nowrap transition-colors duration-300 text-center ${
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
