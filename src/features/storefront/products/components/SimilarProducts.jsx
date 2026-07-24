"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductCard from "@/shared/components/ProductCard";
import { publicGet, PublicApiError } from "@/shared/api/publicApi";
import { mapProductToCardProps } from "@/shared/utils/productCard";

const RELATED_LIMIT = 4;

export default function SimilarProducts({ hideBorder }) {
  const params = useParams();
  const slug = params?.slug;
  const [similarList, setSimilarList] = useState([]);

  useEffect(() => {
    if (!slug) return undefined;
    let cancelled = false;

    async function loadSimilar() {
      try {
        const current = await publicGet(`/products/slug/${slug}`);
        const categoryId = current?.category?.id;
        const data = await publicGet("/products", {
          status: "PUBLISHED",
          productCategoryId: categoryId,
          size: RELATED_LIMIT + 1,
        });
        if (cancelled) return;
        const items = (data?.content || [])
          .filter((item) => item.id !== current?.id)
          .slice(0, RELATED_LIMIT)
          .map(mapProductToCardProps);
        setSimilarList(items);
      } catch (error) {
        if (cancelled) return;
        if (!(error instanceof PublicApiError)) {
          // Non-API failure (network/parse) on a secondary widget — log, don't crash the page.
          console.error("Failed to load similar products", error);
        }
        setSimilarList([]);
      }
    }

    loadSimilar();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (similarList.length === 0) return null;

  const hasTwoLineTitle = similarList.some(
    (product) => product.name && (product.name.includes("\n") || product.name.length > 22)
  );

  return (
    <div className={`w-full lg:pt-[50px] lg:pb-[40px] mt-8 ${hideBorder ? "" : "lg:border-t border-[#E6E8EC]"}`}>
      {/* Title */}
      <h2 className="font-montserrat text-[#97400C] text-[20px] lg:text-[32px] font-[700] leading-[40px] mb-4 lg:mb-8 tracking-wide">
        Sản phẩm tương tự
      </h2>

      {/* Mobile swipe / Desktop grid */}
      <div className="flex lg:grid lg:grid-cols-4 gap-[14px] lg:gap-[26px] overflow-x-auto lg:overflow-x-visible no-scrollbar pb-4 lg:pb-0 scroll-smooth snap-x snap-mandatory w-[calc(100%+60px)] mx-[-30px] px-[30px] scroll-px-[30px] lg:w-auto lg:mx-0 lg:px-0">
        {similarList.map((product) => (
          <div key={product.id} className="flex-shrink-0 w-[175px] lg:w-auto snap-start">
            <ProductCard {...product} hasTwoLineTitle={hasTwoLineTitle} />
          </div>
        ))}
      </div>
    </div>
  );
}
