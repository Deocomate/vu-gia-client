"use client";

import React from "react";
import NewsCard from "@/components/shared/NewsCard";
import productNewThumb from "@/assets/images/products/product-new-thumb.png";
import productImageThumb from "@/assets/images/products/product-image-thumb.png";
import productCategoryThumb from "@/assets/images/products/product-category-thumb.png";

export default function CategoryNews({ news }) {
  // Realistic fallback news items regarding pottery & ancestral worship culture
  const defaultNews = [
    {
      id: 1,
      title: "Ý nghĩa chữ Thọ tròn mà bạn cần nên biết",
      category: "Cẩm nang làng nghề",
      description:
        "How do you create compelling presentations that wow your colleagues and impress your managers?",
      slug: "y-nghia-chu-tho-tron",
      image: productNewThumb,
    },
    {
      id: 2,
      title: "Giải phóng miền Nam 30/4/1975 – Lịch sử, ý",
      category: "Kiến thức sản phẩm",
      description:
        "How do you create compelling presentations that wow your colleagues and impress your managers?",
      slug: "giai-phong-mien-nam",
      image: productNewThumb,
    },
    {
      id: 3,
      title: "Giải phóng miền Nam 30/4/1975 – Lịch sử, ý",
      category: "Kiến thức sản phẩm",
      description:
        "How do you create compelling presentations that wow your colleagues and impress your managers?",
      slug: "giai-phong-mien-nam-2",
      image: productNewThumb,
    },
  ];

  const list = news && news.length > 0 ? news : defaultNews;

  // Check if any title in the list is 2 lines (contains \n or length > 30)
  const hasTwoLineTitle = list.some(
    (item) => item.title && (item.title.includes("\n") || item.title.length > 30)
  );

  return (
    <div className="w-full px-[20px] md:px-[60px] py-16 bg-white">
      <h2 className="text-center text-[30px] lg:text-[40px] font-montserrat font-[800] text-[#97400C] uppercase mb-[70px] leading-[40px]">
        Tin tức & sự kiện
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
        {list.map((item) => (
          <NewsCard
            key={item.id}
            image={item.image}
            category={item.category}
            title={item.title}
            description={item.description}
            slug={item.slug}
            hasTwoLineTitle={hasTwoLineTitle}
          />
        ))}
      </div>
    </div>
  );
}
