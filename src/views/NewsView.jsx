"use client";
import React, { useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import NewsHero from "@/components/news/NewsHero";
import NewsTabs from "@/components/news/NewsTabs";
import NewsRelatedProducts from "@/components/news/NewsRelatedProducts";
import NewsCard from "@/components/shared/NewsCard";
import Pagination from "@/components/shared/Pagination";
import { formatImageUrl } from "@/lib/media";

/**
 * Real, searchParams-driven news listing. `news`/`categories`/`currentPage`/
 * `totalPages`/`activeCategoryId` are server-fetched props (see
 * `src/app/(main)/tin-tuc/page.jsx`); filter/pagination changes push new
 * `searchParams` so the Server Component re-fetches (same pattern as the
 * `/san-pham` listing).
 */
export default function NewsView({
  news = [],
  categories = [],
  currentPage = 1,
  totalPages = 1,
  activeCategoryId = "",
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tabs = useMemo(
    () => categories.map((category) => ({ id: String(category.id), name: category.name })),
    [categories],
  );

  const activeCategoryName = useMemo(() => {
    return tabs.find((t) => t.id === String(activeCategoryId))?.name || "Tin tức";
  }, [tabs, activeCategoryId]);

  const hasTwoLineTitle = news.some(
    (item) => item.title && (item.title.includes("\n") || item.title.length > 30),
  );

  function pushParams(nextParams) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(nextParams).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`${pathname}?${params.toString()}`);
  }

  const handleTabChange = (tabId) => {
    pushParams({ newsCategoryId: tabId, page: undefined });
  };

  const handlePageChange = (page) => {
    pushParams({ page });
  };

  return (
    <div className="w-full bg-white">
      {/* 1. Header Hero Banner */}
      <NewsHero activeCategoryName={activeCategoryName} />

      {/* 2. Topic Selection Tabs */}
      <NewsTabs
        tabs={tabs}
        activeTab={String(activeCategoryId)}
        onTabChange={handleTabChange}
      />

      {/* 3. News Grid Layout */}
      <div className="max-w-[1444px] mx-auto px-[30px] xl:px-0 pt-[30px] lg:pt-[50px] pb-0">
        {news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[16px] gap-y-[40px] lg:gap-y-[60px]">
            {news.map((item) => (
              <NewsCard
                key={item.id}
                image={formatImageUrl(item.thumb)}
                category={item.category?.name}
                title={item.title}
                description={item.shortContent}
                slug={item.slug}
                hasTwoLineTitle={hasTwoLineTitle}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center font-montserrat">
            <p className="text-[18px] text-[#777E90] mb-2 font-semibold">
              Hiện tại danh mục chưa có bài viết mới
            </p>
            <p className="text-[14px] text-[#838383]">
              Vui lòng quay lại sau để cập nhật tin tức từ Gốm Sứ Vũ Gia.
            </p>
          </div>
        )}

        {/* 4. Navigation Pagination */}
        <div className="mt-[40px] lg:mt-[50px] flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* 5. Recommended Products Shelf */}
      <NewsRelatedProducts />
    </div>
  );
}
