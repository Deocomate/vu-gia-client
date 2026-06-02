"use client";

import React, { useState, useMemo } from "react";
import Pagination from "@/components/shared/Pagination";
import ProductToolbar from "@/components/products/ProductToolbar";
import CategoryNavigation from "@/components/products/CategoryNavigation";
import CategoryDescription from "@/components/products/CategoryDescription";
import ProductGrid from "@/components/products/ProductGrid";
import CategorySEOContent from "@/components/products/CategorySEOContent";
import CategoryNews from "@/components/products/CategoryNews";
import AboutUsSection from "@/components/shared/AboutUsSection";

import productImageThumb from "@/assets/images/products/product-image-thumb.png";
import productNewThumb from "@/assets/images/products/product-new-thumb.png";
import productCategoryThumb from "@/assets/images/products/product-category-thumb.png";
import productContentImageThumb from "@/assets/images/products/product-content-image-thumb.png";

// Full list of products for client-side filtering/sorting
const ALL_MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Bát hương Men rạn\nĐắp nổi rồng chầu",
    sku: "MSP: VG-DT001",
    salePrice: "1.200.000đ",
    originalPrice: "1.500.000đ",
    soldCount: 24,
    image: productImageThumb,
    category: "men-ran",
    priceValue: 1200000,
    createdTime: 5,
  },
  {
    id: 2,
    name: "Bình hoa cúc cổ\nMen lam vẽ vàng",
    sku: "MSP: VG-DT002",
    salePrice: "850.000đ",
    originalPrice: "1.000.000đ",
    soldCount: 15,
    image: productNewThumb,
    category: "men-lam-ve-vang",
    priceValue: 850000,
    createdTime: 3,
  },
  {
    id: 3,
    name: "Kỷ 5 chén thờ\nMen lam vẽ vàng",
    sku: "MSP: VG-DT003",
    salePrice: "650.000đ",
    originalPrice: "800.000đ",
    soldCount: 42,
    image: productImageThumb,
    category: "men-lam-ve-vang",
    priceValue: 650000,
    createdTime: 4,
  },
  {
    id: 4,
    name: "Mâm bồng đựng quả\nMen rạn đắp nổi",
    sku: "MSP: VG-DT004",
    salePrice: "950.000đ",
    originalPrice: null,
    soldCount: 19,
    image: productCategoryThumb,
    category: "men-ran-dat-vang",
    priceValue: 950000,
    createdTime: 2,
  },
  {
    id: 5,
    name: "Đèn dầu thờ\nMen lam vẽ vàng kim",
    sku: "MSP: VG-DT005",
    salePrice: "450.000đ",
    originalPrice: "550.000đ",
    soldCount: 31,
    image: productNewThumb,
    category: "men-lam",
    priceValue: 450000,
    createdTime: 7,
  },
  {
    id: 6,
    name: "Ống hương thờ\nMen lam cổ điển",
    sku: "MSP: VG-DT006",
    salePrice: "380.000đ",
    originalPrice: "450.000đ",
    soldCount: 8,
    image: productImageThumb,
    category: "men-lam",
    priceValue: 380000,
    createdTime: 1,
  },
  {
    id: 7,
    name: "Nậm rượu thờ\nMen lam vẽ rồng chầu",
    sku: "MSP: VG-DT007",
    salePrice: "290.000đ",
    originalPrice: "350.000đ",
    soldCount: 54,
    image: productCategoryThumb,
    category: "men-lam",
    priceValue: 290000,
    createdTime: 6,
  },
  {
    id: 8,
    name: "Chóe thờ đựng nước\nMen lam vẽ sen cổ",
    sku: "MSP: VG-DT008",
    salePrice: "320.000đ",
    originalPrice: "400.000đ",
    soldCount: 27,
    image: productImageThumb,
    category: "men-lam",
    priceValue: 320000,
    createdTime: 8,
  },
];

export default function ProductsView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  // Constants
  const itemsPerPage = 8;

  // Filter and sort products
  const processedProducts = useMemo(() => {
    let result = [...ALL_MOCK_PRODUCTS];

    // Search query filter
    if (searchTerm.trim() !== "") {
      const query = searchTerm.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.sku.toLowerCase().includes(query),
      );
    }

    // Category select filter
    if (selectedCategory !== "all") {
      result = result.filter(
        (product) => product.category === selectedCategory,
      );
    }

    // Sorting options
    if (sortBy === "newest") {
      result.sort((a, b) => b.createdTime - a.createdTime);
    } else if (sortBy === "best-seller") {
      result.sort((a, b) => b.soldCount - a.soldCount);
    } else if (sortBy === "price-asc") {
      result.sort((a, b) => a.priceValue - b.priceValue);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.priceValue - a.priceValue);
    }

    return result;
  }, [searchTerm, selectedCategory, sortBy]);

  // Paginated chunk
  const paginatedProducts = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return processedProducts.slice(startIdx, startIdx + itemsPerPage);
  }, [processedProducts, currentPage]);

  const totalPages = Math.max(
    1,
    Math.ceil(processedProducts.length / itemsPerPage),
  );

  // Reset page when filters change
  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const startShowingIndex =
    processedProducts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endShowingIndex = Math.min(
    currentPage * itemsPerPage,
    processedProducts.length,
  );

  return (
    <div className="w-full bg-white pb-16">
      <div className="max-w-[1470px] mx-auto px-[20px] lg:px-[60px]">
        {/* Toolbar with live filters */}
        <ProductToolbar
          totalResults={processedProducts.length}
          showingStart={startShowingIndex}
          showingEnd={endShowingIndex}
          onSearch={handleSearch}
          onCategoryChange={handleCategoryChange}
          onSortChange={handleSortChange}
          selectedCategory={selectedCategory}
        />

        {/* Sub-category selection */}
        <CategoryNavigation
          activeCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        {/* Category overview text */}
        <CategoryDescription />

        {/* Grid display of matched product cards */}
        {paginatedProducts.length > 0 ? (
          <ProductGrid products={paginatedProducts} />
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

        {/* Pagination controls */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
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
