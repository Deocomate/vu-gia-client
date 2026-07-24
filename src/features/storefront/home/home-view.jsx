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
