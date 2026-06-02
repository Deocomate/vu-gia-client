import SearchBar from "@/components/shared/SearchBar";
import HomeHero from "@/components/home/HomeHero";
import HomeHighlights from "@/components/home/HomeHighlights";
import HomeFeatures from "@/components/home/HomeFeatures";
import HomeProductList from "@/components/home/HomeProductList";
import HomeCategoryBanners from "@/components/home/HomeCategoryBanners";
import HomeCraftsmanship from "@/components/home/HomeCraftsmanship";
import HomeAboutStats from "@/components/home/HomeAboutStats";
import HomeVideoProcess from "@/components/home/HomeVideoProcess";
import HomeNews from "@/components/home/HomeNews";
import AboutUsSection from "@/components/shared/AboutUsSection";

export default function HomeView() {
  return (
    <div className="w-full">
      <HomeHero />

      <HomeFeatures />

      {/* Khối 1: Bộ Đồ Thờ */}
      <HomeProductList
        title="BỘ ĐỒ THỜ TRUYỀN THỐNG"
        tabs={[
          "BỘ ĐỒ THỜ MEN LAM",
          "BỘ ĐỒ THỜ LAM VẼ VÀNG 24K",
          "BỘ ĐỒ THỜ MEN RẠN",
        ]}
      />

      {/* Khối 2: Bình Phong Thủy */}
      <HomeProductList
        title="BÌNH PHONG THỦY"
        tabs={["BÌNH MEN MÀU", "BÌNH MEN LAM", "BÌNH ĐẮP NỔI"]}
      />

      <HomeCategoryBanners />

      {/* Khối 3: Lục Bình Gốm Sứ */}
      <HomeProductList
        title="LỤC BÌNH GỐM SỨ"
        tabs={["LỤC BÌNH MEN MÀU", "LỤC BÌNH MEN LAM", "LỤC BÌNH ĐẮP NỔI"]}
      />

      <HomeCraftsmanship />
      <HomeVideoProcess />
      <HomeNews />
      <AboutUsSection />
    </div>
  );
}
