"use client";

import React from "react";
import ProductCard from "@/shared/components/ProductCard";
import { useFeaturedProductCards } from "@/shared/hooks/useFeaturedProductCards";

const RELATED_LIMIT = 4;

export default function NewsRelatedProducts() {
  const products = useFeaturedProductCards(RELATED_LIMIT);

  if (products.length === 0) return null;

  const hasTwoLineTitle = products.some(
    (product) => product.name && (product.name.includes("\n") || product.name.length > 22)
  );

  return (
    <section className="w-full bg-white pt-[50px] pb-[50px] lg:pb-[100px]">
      <div className="max-w-[1438px] mx-auto px-[30px] xl:px-0">
        {/* Title */}
        <h2 className="font-montserrat font-bold text-[26px] lg:text-[32px] text-[#97400C] mb-[20px] lg:mb-[40px] leading-[40px] tracking-wide">
          Có thể bạn quan tâm
        </h2>

        {/* Product Grid / Swipe List on Mobile */}
        <div className="flex lg:grid lg:grid-cols-4 gap-[14px] lg:gap-[26px] overflow-x-auto lg:overflow-x-visible no-scrollbar pb-4 lg:pb-0 scroll-smooth snap-x snap-mandatory w-[calc(100%+60px)] mx-[-30px] px-[30px] scroll-px-[30px] lg:w-auto lg:mx-0 lg:px-0">
          {products.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-[175px] lg:w-auto snap-start">
              <ProductCard {...product} hasTwoLineTitle={hasTwoLineTitle} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
