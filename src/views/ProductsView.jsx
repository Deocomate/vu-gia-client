"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Pagination from "@/components/shared/Pagination";
import ProductToolbar from "@/components/products/ProductToolbar";
import CategoryNavigation from "@/components/products/CategoryNavigation";
import CategoryDescription from "@/components/products/CategoryDescription";
import ProductGrid from "@/components/products/ProductGrid";
import CategorySEOContent from "@/components/products/CategorySEOContent";
import CategoryNews from "@/components/products/CategoryNews";
import AboutUsSection from "@/components/shared/AboutUsSection";
import { formatImageUrl } from "@/lib/media";

const PAGE_SIZE = 8;
const SEARCH_DEBOUNCE_MS = 400;

export default function ProductsView({
  categories = [],
  products = [],
  totalElements = 0,
  totalPages = 1,
  currentPage = 1,
  selectedCategory = "all",
  selectedSort = "newest",
  searchTerm = "",
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchDebounceRef = useRef(null);

  // Updates the URL's query string (adding/removing keys); the Server Component
  // at `page.jsx` reads `searchParams` and re-fetches, so no client-side data
  // duplication is needed here.
  const pushParams = useCallback(
    (updates) => {
      const next = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "" || value === "all") {
          next.delete(key);
        } else {
          next.set(key, value);
        }
      });
      const query = next.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, []);

  const handleSearch = (term) => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      pushParams({ q: term, page: undefined });
    }, SEARCH_DEBOUNCE_MS);
  };

  const handleCategoryChange = (category) => {
    pushParams({ category, page: undefined });
  };

  const handleSortChange = (sort) => {
    pushParams({ sort, page: undefined });
  };

  const handlePageChange = (page) => {
    pushParams({ page });
  };

  const subCategories = categories.map((category) => ({
    id: category.slug,
    name: category.name,
    image: formatImageUrl(category.thumb),
  }));

  const startShowingIndex =
    products.length > 0 ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
  const endShowingIndex = Math.min(currentPage * PAGE_SIZE, totalElements);

  return (
    <div className="w-full bg-white">
      <div className="max-w-[1470px] mx-auto px-[31px] lg:px-[60px]">
        {/* Toolbar with live filters */}
        <ProductToolbar
          totalResults={totalElements}
          showingStart={startShowingIndex}
          showingEnd={endShowingIndex}
          onSearch={handleSearch}
          onCategoryChange={handleCategoryChange}
          onSortChange={handleSortChange}
          selectedCategory={selectedCategory}
          selectedSort={selectedSort}
          searchTerm={searchTerm}
          categories={categories}
        />

        {/* Sub-category selection (real ProductCategory rows) */}
        <CategoryNavigation
          subCategories={subCategories}
          activeCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        {/* Category overview text */}
        <CategoryDescription />

        {/* Grid display of matched product cards */}
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="py-20 text-center font-montserrat">
            <p className="text-[18px] text-[#777E90] mb-2 font-[600]">
              Không tìm thấy sản phẩm phù hợp
            </p>
            <p className="text-[14px] text-[#838383]">
              Vui lòng thử tìm kiếm với từ khóa hoặc danh mục khác.
            </p>
          </div>
        )}

        {/* Pagination controls (real page/totalPages from the backend) */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        {/* Expanded SEO rich text and history */}
        <CategorySEOContent />
      </div>

      {/* Bottom Related news section */}
      <CategoryNews />

      {/* About Us section */}
      <AboutUsSection />
    </div>
  );
}
