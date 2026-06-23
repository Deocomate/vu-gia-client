import ProductCard from "@/components/shared/ProductCard";
import { SIMILAR_PRODUCTS } from "./data/altarCustomizerData";

export default function AltarSimilarProductsSection() {
  return (
    <section className="w-full max-w-[1440px] mx-auto mt-[97px] mb-[100px] px-4 md:px-0">
      <h2 className="m-0 mb-10 text-primary text-[32px] leading-10 font-bold text-center md:text-left">
        Sản phẩm tương tự
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[26px]">
        {SIMILAR_PRODUCTS.map((product) => (
          <ProductCard
            key={product.id}
            image={product.image}
            name={product.name}
            sku={product.sku}
            originalPrice={product.originalPrice}
            salePrice={product.salePrice}
            soldCount={product.soldCount}
            hasTwoLineTitle
          />
        ))}
      </div>
    </section>
  );
}
