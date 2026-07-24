"use client";

import React from "react";
import NewsCard from "@/shared/components/news-card";
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
    <section className="w-full py-[35px] lg:py-[70px] bg-white overflow-hidden">
      <div className="max-w-[1920px] mx-auto px-[31px] lg:px-[60px]">
        <h2 className="text-center text-primary font-montserrat font-[800] text-[20px] lg:text-[40px] leading-[32px] lg:leading-[40px] uppercase mb-[22px] lg:mb-[70px]">
          Tin tức & sự kiện
        </h2>

        {/* Desktop Layout (Danh sách bài viết 3 cột) */}
        <div className="hidden lg:grid grid-cols-3 gap-[20px]">
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

        {/* Mobile Layout (Vuốt ngang) */}
        <div className="lg:hidden w-[calc(100%+62px)] mx-[-31px] px-[31px] overflow-x-auto no-scrollbar flex flex-row gap-[22px] scroll-px-[31px] snap-x snap-mandatory pb-[10px]">
          {list.map((item) => (
            <NewsCard
              key={item.id}
              image={item.image}
              category={item.category}
              title={item.title}
              description={item.description}
              slug={item.slug}
              hasTwoLineTitle={hasTwoLineTitle}
              className="w-[252px] shrink-0 snap-start"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
