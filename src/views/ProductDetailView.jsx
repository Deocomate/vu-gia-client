"use client";

import React from "react";
import ProductInfo from "@/components/product-detail/ProductInfo";
import ProductDescription from "@/components/product-detail/ProductDescription";
import ProductDetail from "@/components/product-detail/ProductDetail";
import ProductSpecifications from "@/components/product-detail/ProductSpecifications";
import SimilarProducts from "@/components/product-detail/SimilarProducts";

export default function ProductDetailView({ slug }) {
  return (
    <div className="w-full bg-white pb-16">
      <div className="max-w-[1470px] mx-auto px-[20px] lg:px-[60px]">
        {/* Gallery, Info and Sub-items list selection */}
        <ProductInfo />

        {/* Narrative details and main banner */}
        <ProductDescription />

        {/* Premium story layout with chessboard details */}
        <ProductDetail />
      </div>

      {/* Structured item specifications list (Slider is full-screen, table is auto-centered) */}
      <ProductSpecifications />

      <div className="max-w-[1470px] mx-auto px-[20px] lg:px-[60px]">
        {/* Related/similar items grid */}
        <SimilarProducts />
      </div>
    </div>
  );
}
