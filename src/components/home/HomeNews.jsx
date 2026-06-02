// src/components/home/HomeNews.jsx
import React from "react";
import NewsCard from "@/components/shared/NewsCard";
import newsImg1 from "@/assets/images/home/home-new-1.png";
import newsImg2 from "@/assets/images/home/home-new-2.png";
import newsImg3 from "@/assets/images/home/home-new-3.png";

const newsData = [
  {
    id: 1,
    image: newsImg1,
    category: "Cẩm nang làng nghề",
    title: "Ý nghĩa chữ Thọ tròn mà bạn cần nên biết",
    description:
      "How do you create compelling presentations that wow your colleagues and impress your managers?",
    slug: "y-nghia-chu-tho-tron-ma-ban-can-nen-biet",
  },
  {
    id: 2,
    image: newsImg2,
    category: "Kiến thức sản phẩm",
    title: "Giải phóng miền Nam 30/4/1975 – Lịch sử, ý nghĩa",
    description:
      "How do you create compelling presentations that wow your colleagues and impress your managers?",
    slug: "giai-phong-mien-nam-30-4-1975",
  },
  {
    id: 3,
    image: newsImg3,
    category: "Kiến thức sản phẩm",
    title: "Giải phóng miền Nam 30/4/1975 – Lịch sử, ý nghĩa",
    description:
      "How do you create compelling presentations that wow your colleagues and impress your managers?",
    slug: "giai-phong-mien-nam-30-4-1975-2",
  },
];

const HomeNews = () => {
  // Check if any title in the news data is 2 lines (contains \n or length > 30)
  const hasTwoLineTitle = newsData.some(
    (news) => news.title && (news.title.includes("\n") || news.title.length > 30)
  );

  return (
    <section className="w-full py-[70px] bg-white">
      {/* Căn lề padding-x 60px trên Desktop (từ cạnh viền tới ảnh) */}
      <div className="max-w-[1920px] mx-auto px-[20px] lg:px-[60px]">
        {/* Tiêu đề (Khoảng cách dưới 70px) */}
        <h2 className="text-center text-primary font-montserrat font-[800] text-[32px] lg:text-[40px] leading-[40px] uppercase mb-[70px]">
          Tin tức & sự kiện
        </h2>

        {/* Danh sách bài viết (Khoảng cách giữa các cột: 20px) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[20px]">
          {newsData.map((news) => (
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
      </div>
    </section>
  );
};

export default HomeNews;
