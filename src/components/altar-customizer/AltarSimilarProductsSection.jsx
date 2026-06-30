"use client";
import ProductCard from "@/components/shared/ProductCard";
import { SIMILAR_PRODUCTS } from "./data/altarCustomizerData";

export default function AltarSimilarProductsSection() {
  const hasTwoLineTitle = SIMILAR_PRODUCTS.some(
    (prod) => prod.name && (prod.name.includes("\n") || prod.name.length > 22)
  );

  return (
    <section className="w-full bg-white pt-[50px] lg:pt-[100px] pb-[50px] lg:pb-[100px]">
      <div className="max-w-[1438px] mx-auto px-[30px] xl:px-0">
        <h2 className="font-montserrat font-bold text-[26px] lg:text-[32px] text-[#97400C] mb-[20px] lg:mb-[40px] leading-[40px] tracking-wide">
          Sản phẩm tương tự
        </h2>

        <div className="flex lg:grid lg:grid-cols-4 gap-[14px] lg:gap-[26px] overflow-x-auto lg:overflow-x-visible no-scrollbar pb-4 lg:pb-0 scroll-smooth snap-x snap-mandatory w-[calc(100%+60px)] mx-[-30px] px-[30px] scroll-px-[30px] lg:w-auto lg:mx-0 lg:px-0">
          {SIMILAR_PRODUCTS.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-[175px] lg:w-auto snap-start">
              <ProductCard
                image={product.image}
                name={product.name}
                sku={product.sku}
                originalPrice={product.originalPrice}
                salePrice={product.salePrice}
                soldCount={product.soldCount}
                hasTwoLineTitle={hasTwoLineTitle}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
