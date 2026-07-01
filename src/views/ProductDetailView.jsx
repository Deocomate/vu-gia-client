"use client";

import React from "react";
import ProductInfo from "@/components/product-detail/ProductInfo";
import ProductInfoSingle from "@/components/product-detail/ProductInfoSingle";
import ProductDescription from "@/components/product-detail/ProductDescription";
import ProductDetail from "@/components/product-detail/ProductDetail";
import ProductSpecifications from "@/components/product-detail/ProductSpecifications";
import SimilarProducts from "@/components/product-detail/SimilarProducts";
import FixedActionWidget from "@/components/product-detail/FixedActionWidget";

export default function ProductDetailView({ slug, type }) {
  const isSingleProduct = type === "single";

  if (isSingleProduct) {
    return (
      <div className="w-full bg-white pb-16">
        <div className="max-w-[1470px] mx-auto px-[30px] lg:px-[60px]">
          {/* Gallery and Purchase panel for single product */}
          <ProductInfoSingle />

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
        <ProductInfo />

        {/* Narrative details and main banner */}
        <ProductDescription />
      </div>

      {/* Fixed action widget - right side of screen */}
      <FixedActionWidget />

      {/* Structured item specifications list (Slider is full-screen, table is auto-centered) */}
      <ProductSpecifications />

      <div className="max-w-[1470px] mx-auto px-[30px] lg:px-[60px]">
        {/* Related/similar items grid */}
        <SimilarProducts />
      </div>
    </div>
  );
}
