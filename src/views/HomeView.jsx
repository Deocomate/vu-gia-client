import HomeHero from "@/components/home/HomeHero";
import HomeFeatures from "@/components/home/HomeFeatures";
import HomeProductList from "@/components/home/HomeProductList";
import HomeCategoryBanners from "@/components/home/HomeCategoryBanners";
import HomeCraftsmanship from "@/components/home/HomeCraftsmanship";
import HomeVideoProcess from "@/components/home/HomeVideoProcess";
import HomeNews from "@/components/home/HomeNews";
import AboutUsSection from "@/components/shared/AboutUsSection";

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
