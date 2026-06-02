import SectionTitle from "@/components/shared/SectionTitle";
import ProductCard from "@/components/shared/ProductCard";
import Image from "next/image";

export default function HomeProductList({ title, tabs = [], products = [] }) {
  const displayProducts =
    products.length > 0
      ? products
      : Array.from({ length: 8 }).map((_, i) => ({
          id: i,
          name: "Bình hút lộc\nMã đáo thành công",
          sku: "MSP: VG001",
          salePrice: "2.000.000đ",
          originalPrice: "2.500.000đ",
          soldCount: 12,
        }));

  // Check if any product in the current list has a name with 2 lines (contains '\n' or length > 22)
  const hasTwoLineTitle = displayProducts.some(
    (product) => product.name && (product.name.includes("\n") || product.name.length > 22)
  );

  return (
    <section className="max-w-[1470px] mx-auto w-full px-[30px] my-[100px]">
      <SectionTitle title={title} />

      {tabs.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-[20px] mb-[30px]">
          {tabs.map((tab, idx) => (
            <button
              key={idx}
              className={`px-[32px] py-[8px] rounded-[8px] font-montserrat font-[700] text-[16px] lg:text-[18px] leading-[24px] transition-colors ${
                idx === 0
                  ? "bg-primary text-white"
                  : "bg-[#EABA96] text-primary hover:bg-[#DFA67A]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {/* Grid sản phẩm */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-[15px] gap-y-[20px] lg:gap-x-[30px] lg:gap-y-[26px]">
        {displayProducts.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            sku={product.sku}
            salePrice={product.salePrice}
            originalPrice={product.originalPrice}
            soldCount={product.soldCount}
            hasTwoLineTitle={hasTwoLineTitle}
          />
        ))}
      </div>

      {/* Nút Xem thêm */}
      <div className="flex justify-center mt-[50px]">
        <button className="flex items-center justify-center gap-2 px-[24px] py-[10px] bg-[#DDAB70]/20 rounded-[8px] group hover:bg-[#DDAB70]/30 transition-colors">
          <span className="font-montserrat font-[700] text-primary text-[18px] leading-[16px]">
            Xem thêm
          </span>
          <Image
            src="/images/home/button-right-arrow.png"
            alt="Xem thêm"
            width={24}
            height={24}
            className="object-contain group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>
    </section>
  );
}
