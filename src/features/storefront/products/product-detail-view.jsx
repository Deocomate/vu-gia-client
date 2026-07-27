"use client";

import React, { useEffect } from "react";
import ProductInfo from "@/features/storefront/products/components/product-info";
import ProductInfoSingle from "@/features/storefront/products/components/product-info-single";
import ProductDescription from "@/features/storefront/products/components/product-description";
import ProductDetail from "@/features/storefront/products/components/product-detail";
import ProductSpecifications from "@/features/storefront/products/components/product-specifications";
import SimilarProducts from "@/features/storefront/products/components/similar-products";
import { useProductCategoryStore } from "@/shared/stores/product-category-store";

export default function ProductDetailView({ slug, type, product }) {
  const setActiveCategory = useProductCategoryStore((s) => s.setActiveCategory);
  const clearActiveCategory = useProductCategoryStore((s) => s.clearActiveCategory);

  useEffect(() => {
    const categorySlug = product?.category?.slug;
    const categoryName = product?.category?.name;
    if (categorySlug) {
      setActiveCategory(categorySlug, categoryName);
    } else {
      clearActiveCategory();
    }
    return () => {
      clearActiveCategory();
    };
  }, [product, setActiveCategory, clearActiveCategory]);

  // Real backend type (`SINGLE`/`COMBO`, ProductResponse) decides the layout
  // by default; an explicit `?type=single` query override still wins so
  // existing links aren't broken (RT-A: this used to always default to the
  // worship-set/COMBO layout with zero regard for the real product).
  const isSingleProduct = type === "single" || (!type && product?.type === "SINGLE");

  if (isSingleProduct) {
    return (
      <div className="w-full bg-white pb-16">
        <div className="max-w-[1470px] mx-auto px-[30px] lg:px-[60px]">
          {/* Gallery and Purchase panel for single product */}
          <ProductInfoSingle product={product} />

          {/* Premium story layout with chessboard details */}
          <ProductDetail product={product} />

          {/* Related/similar items grid */}
          <SimilarProducts hideBorder={true} />
        </div>
      </div>
    );
  }

  // Worship set view (default)
  return (
    <div className="w-full bg-white pb-16">
      <div className="max-w-[1470px] mx-auto px-[30px] lg:px-[60px]">
        {/* Gallery, Info and Sub-items list selection */}
        <ProductInfo product={product} />

        {/* Narrative details and main banner */}
        <ProductDescription description={product?.description} />
      </div>

      {/* Structured item specifications list (Slider is full-screen, table is auto-centered) */}
      <ProductSpecifications product={product} />

      <div className="max-w-[1470px] mx-auto px-[30px] lg:px-[60px]">
        {/* Related/similar items grid */}
        <SimilarProducts />
      </div>
    </div>
  );
}
