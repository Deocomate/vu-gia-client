import HomeHero from "@/features/storefront/home/components/home-hero";
import HomeFeatures from "@/features/storefront/home/components/home-features";
import HomeProductList from "@/features/storefront/home/components/home-product-list";
import HomeCategoryBanners from "@/features/storefront/home/components/home-category-banners";
import HomeCraftsmanship from "@/features/storefront/home/components/home-craftsmanship";
import HomeVideoProcess from "@/features/storefront/home/components/home-video-process";
import HomeNews from "@/features/storefront/home/components/home-news";
import AboutUsSection from "@/shared/components/about-us-section";

export default function HomeView({
  heroBanners = [],
  categoryBanners = [],
  boDoThoProducts = [],
  binhPhongThuyProducts = [],
  lucBinhProducts = [],
  news = [],
}) {
  return (
    <div className="w-full">
      <HomeHero banners={heroBanners} />

      <HomeFeatures />

      {/* Khối 1: Bộ Đồ Thờ */}
      <HomeProductList
        title="BỘ ĐỒ THỜ TRUYỀN THỐNG"
        tabs={[
          "BỘ ĐỒ THỜ MEN LAM",
          "BỘ ĐỒ THỜ LAM VẼ VÀNG 24K",
          "BỘ ĐỒ THỜ MEN RẠN",
        ]}
        products={boDoThoProducts}
      />

      {/* Khối 2: Bình Phong Thủy */}
      <HomeProductList
        title="BÌNH PHONG THỦY"
        tabs={["BÌNH MEN MÀU", "BÌNH MEN LAM", "BÌNH ĐẮP NỔI"]}
        products={binhPhongThuyProducts}
      />

      <HomeCategoryBanners banners={categoryBanners} />

      {/* Khối 3: Lục Bình Gốm Sứ */}
      <HomeProductList
        title="LỤC BÌNH GỐM SỨ"
        tabs={["LỤC BÌNH MEN MÀU", "LỤC BÌNH MEN LAM", "LỤC BÌNH ĐẮP NỔI"]}
        products={lucBinhProducts}
      />

      <HomeCraftsmanship />
      <HomeVideoProcess />
      <HomeNews news={news} />
      <AboutUsSection />
    </div>
  );
}
