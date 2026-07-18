// src/components/home/HomeNews.jsx
import React from "react";
import NewsCard from "@/components/shared/NewsCard";
import { formatImageUrl } from "@/lib/media";

export default function HomeNews({ news = [] }) {
  // Real `News` entities (status=PUBLISHED, sorted by publishedAt desc).
  const items = news.map((item) => ({
    id: item.id,
    image: formatImageUrl(item.thumb),
    category: item.category?.name || "Tin tức",
    title: item.title,
    description: item.shortContent,
    slug: item.slug,
  }));

  const hasTwoLineTitle = items.some(
    (item) => item.title && (item.title.includes("\n") || item.title.length > 30),
  );

  if (items.length === 0) return null;

  return (
    <section className="w-full py-[35px] lg:py-[70px] bg-white overflow-hidden">
      {/* Căn lề padding-x 20px trên mobile, 60px trên Desktop */}
      <div className="max-w-[1920px] mx-auto px-[31px] lg:px-[60px]">
        {/* Tiêu đề (Khoảng cách dưới 22px trên mobile, 70px trên desktop) */}
        <h2 className="text-center text-primary font-montserrat font-[800] text-[20px] lg:text-[40px] leading-[32px] lg:leading-[40px] uppercase mb-[22px] lg:mb-[70px]">
          Tin tức & sự kiện
        </h2>

        {/* Desktop Layout (Danh sách bài viết 3 cột) */}
        <div className="hidden lg:grid grid-cols-3 gap-[20px]">
          {items.map((news) => (
            <NewsCard
              key={news.id}
              image={news.image}
              category={news.category}
              title={news.title}
              description={news.description}
              slug={news.slug}
              hasTwoLineTitle={hasTwoLineTitle}
            />
          ))}
        </div>

        {/* Mobile Layout (Vuốt ngang) */}
        <div className="lg:hidden w-[calc(100%+62px)] mx-[-31px] px-[31px] overflow-x-auto no-scrollbar flex flex-row gap-[22px] scroll-px-[31px] snap-x snap-mandatory pb-[10px]">
          {items.map((news) => (
            <NewsCard
              key={news.id}
              image={news.image}
              category={news.category}
              title={news.title}
              description={news.description}
              slug={news.slug}
              hasTwoLineTitle={hasTwoLineTitle}
              className="w-[252px] shrink-0 snap-start"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
