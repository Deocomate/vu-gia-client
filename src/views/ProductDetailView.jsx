"use client";

import React from "react";
import ProductInfo from "@/components/product-detail/ProductInfo";
import ProductInfoSingle from "@/components/product-detail/ProductInfoSingle";
import ProductDescription from "@/components/product-detail/ProductDescription";
import ProductDetail from "@/components/product-detail/ProductDetail";
import ProductSpecifications from "@/components/product-detail/ProductSpecifications";
import SimilarProducts from "@/components/product-detail/SimilarProducts";

export default function ProductDetailView({ slug, type, product }) {
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
          <ProductDetail />

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
      <ProductSpecifications />

      <div className="max-w-[1470px] mx-auto px-[30px] lg:px-[60px]">
        {/* Related/similar items grid */}
        <SimilarProducts />
      </div>
    </div>
  );
}
