import HomeHero from "@/features/storefront/home/components/HomeHero";
import HomeFeatures from "@/features/storefront/home/components/HomeFeatures";
import HomeProductList from "@/features/storefront/home/components/HomeProductList";
import HomeCategoryBanners from "@/features/storefront/home/components/HomeCategoryBanners";
import HomeCraftsmanship from "@/features/storefront/home/components/HomeCraftsmanship";
import HomeVideoProcess from "@/features/storefront/home/components/HomeVideoProcess";
import HomeNews from "@/features/storefront/home/components/HomeNews";
import AboutUsSection from "@/shared/components/AboutUsSection";

export default function HomeView({
  heroBanners = [],
  categoryBanners = [],
  featuredProducts = [],
  news = [],
  categories = [],
}) {
  return (
    <div className="w-full">
      <HomeHero banners={heroBanners} categories={categories} />

      <HomeFeatures />

      {/* Sản phẩm nổi bật (isFeatured=true) */}
      <HomeProductList title="SẢN PHẨM NỔI BẬT" products={featuredProducts} />

      <HomeCategoryBanners banners={categoryBanners} />

      <HomeCraftsmanship />
      <HomeVideoProcess />
      <HomeNews news={news} />
      <AboutUsSection />
    </div>
  );
}
