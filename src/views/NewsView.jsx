"use client";
import React, { useState, useMemo } from "react";
import NewsHero from "@/components/news/NewsHero";
import NewsTabs from "@/components/news/NewsTabs";
import NewsRelatedProducts from "@/components/news/NewsRelatedProducts";
import NewsCard from "@/components/shared/NewsCard";
import Pagination from "@/components/shared/Pagination";

// Local image imports for reliability
import newsImg1 from "@/assets/images/home/home-new-1.png";
import newsImg2 from "@/assets/images/home/home-new-2.png";
import newsImg3 from "@/assets/images/home/home-new-3.png";

const TABS = [
  { id: "phong-thuy", name: "Kiến thức phong thuỷ" },
  { id: "san-pham", name: "Kiến thức sản phẩm" },
  { id: "lang-nghe", name: "Cẩm nang làng nghề" },
];

const MOCK_ALL_NEWS = [
  // --- Category: phong-thuy ---
  {
    id: 1,
    image: newsImg1,
    category: "Kiến thức phong thuỷ",
    categoryId: "phong-thuy",
    title: "Ý nghĩa chữ Thọ tròn trong không gian tâm linh Việt",
    description: "Khám phá chiều sâu văn hóa truyền thống và ý nghĩa biểu tượng của họa tiết chữ Thọ tròn tinh xảo trên các tác phẩm thờ cúng.",
    slug: "y-nghia-chu-tho-tron-trong-tam-linh-viet",
  },
  {
    id: 2,
    image: newsImg2,
    category: "Kiến thức phong thuỷ",
    categoryId: "phong-thuy",
    title: "Cách bài trí bàn thờ gia tiên chuẩn phong thủy rước tài lộc",
    description: "Hướng dẫn chi tiết từ nghệ nhân làng nghề cách sắp xếp vị trí bát hương, kỷ nước và mâm bồng mang lại bình an.",
    slug: "cach-bai-tri-ban-tho-gia-tien-chuan-phong-thuy",
  },
  {
    id: 3,
    image: newsImg3,
    category: "Kiến thức phong thuỷ",
    categoryId: "phong-thuy",
    title: "Chọn bình hút tài lộc theo bản mệnh gia chủ cát tường",
    description: "Bí quyết chọn lựa màu men, kiểu dáng bình hút lộc Bát Tràng tương sinh theo Ngũ hành của gia chủ.",
    slug: "chon-binh-hut-tai-loc-theo-ban-menh",
  },
  {
    id: 10,
    image: newsImg1,
    category: "Kiến thức phong thuỷ",
    categoryId: "phong-thuy",
    title: "Vị trí đặt lộc bình phòng khách mang lại tài lộc dồi dào",
    description: "Cách bố trí đôi lộc bình trong phòng khách vừa tăng tính thẩm mỹ sang trọng vừa hợp phong thủy.",
    slug: "vi-tri-dat-loc-binh-phong-khach",
  },
  {
    id: 11,
    image: newsImg2,
    category: "Kiến thức phong thuỷ",
    categoryId: "phong-thuy",
    title: "Nguyên tắc tam hợp trong lựa chọn họa tiết gốm tâm linh",
    description: "Tìm hiểu về nguyên tắc kết hợp họa tiết phong thủy giúp gia đạo êm ấm, công danh thăng tiến.",
    slug: "nguyen-tac-tam-hop-hoa-tiet-gom",
  },
  {
    id: 12,
    image: newsImg3,
    category: "Kiến thức phong thuỷ",
    categoryId: "phong-thuy",
    title: "Ý nghĩa của đôi hạc chầu trên bàn thờ gia tiên Việt",
    description: "Hạc thờ bằng gốm sứ Bát Tràng biểu tượng cho sự trường thọ, thanh cao và kết nối tâm linh bền chặt.",
    slug: "y-nghia-doi-hac-chau-tren-ban-tho",
  },
  {
    id: 13,
    image: newsImg1,
    category: "Kiến thức phong thuỷ",
    categoryId: "phong-thuy",
    title: "Cách bao sái bàn thờ cuối năm không lo động bát hương",
    description: "Quy trình lau dọn bàn thờ thành kính, đúng cách để giữ gìn phước đức và may mắn cho năm mới.",
    slug: "cach-bao-sai-ban-tho-cuoi-nam",
  },

  // --- Category: san-pham ---
  {
    id: 4,
    image: newsImg2,
    category: "Kiến thức sản phẩm",
    categoryId: "san-pham",
    title: "Ý nghĩa lịch sử hào hùng ngày giải phóng miền Nam 30/4/1975",
    description: "Nhìn lại dòng chảy lịch sử vẻ vang và những cảm hứng nghệ thuật gốm sứ truyền tải thông điệp yêu nước.",
    slug: "giai-phong-mien-nam-30-4-1975-lich-su",
  },
  {
    id: 5,
    image: newsImg3,
    category: "Kiến thức sản phẩm",
    categoryId: "san-pham",
    title: "Phân biệt men rạn cổ và men lam truyền thống Bát Tràng",
    description: "Giúp người sưu tầm gốm nhận diện rõ nét đặc trưng độc bản của hai dòng men trứ danh ngàn năm tuổi.",
    slug: "phan-biet-men-ran-co-va-men-lam",
  },
  {
    id: 6,
    image: newsImg1,
    category: "Kiến thức sản phẩm",
    categoryId: "san-pham",
    title: "Quy trình chế tác đôi lục bình đắp nổi thủ công cầu kỳ",
    description: "Hành trình từ đất sét thô sơ qua đôi tay nghệ nhân tạo tác hoa văn rồng chầu, hoa sen tinh xảo.",
    slug: "quy-trinh-che-tac-luc-binh-dap-noi",
  },
  {
    id: 14,
    image: newsImg2,
    category: "Kiến thức sản phẩm",
    categoryId: "san-pham",
    title: "Đặc điểm nhận biết gốm vuốt tay thủ công cao cấp",
    description: "Cách cảm nhận xương đất, độ dày và đường nét độc bản của các tác phẩm được chế tác hoàn toàn thủ công.",
    slug: "dac-diem-nhan-biet-gom-vuot-tay",
  },
  {
    id: 15,
    image: newsImg3,
    category: "Kiến thức sản phẩm",
    categoryId: "san-pham",
    title: "Cách bảo quan và làm sạch bộ đồ thờ men rạn đắp nổi",
    description: "Mẹo nhỏ giúp giữ gìn độ sáng bóng, tránh bụi bẩn mà không ảnh hưởng đến lớp men rạn quý hiếm.",
    slug: "cach-bao-quan-do-tho-men-ran",
  },
  {
    id: 16,
    image: newsImg1,
    category: "Kiến thức sản phẩm",
    categoryId: "san-pham",
    title: "Nghệ thuật vẽ vàng 24k trên nền gốm sứ tâm linh Vũ Gia",
    description: "Tìm hiểu quy trình vẽ nhũ vàng và nung hấp nhiệt độ cao giúp vàng bám chặt bền bỉ cùng thời gian.",
    slug: "nghe-thuat-ve-vang-24k-tren-gom",
  },
  {
    id: 17,
    image: newsImg2,
    category: "Kiến thức sản phẩm",
    categoryId: "san-pham",
    title: "Tại sao ấm trà tử sa Bát Tràng lại được người trà hữu tin dùng?",
    description: "Sự kết hợp hoàn hảo giữa chất đất khoáng tự nhiên và kỹ thuật nung chuẩn xác giữ trọn hương vị trà.",
    slug: "tai-sao-am-tra-tu-sa-duoc-tin-dung",
  },

  // --- Category: lang-nghe ---
  {
    id: 7,
    image: newsImg3,
    category: "Cẩm nang làng nghề",
    categoryId: "lang-nghe",
    title: "Lịch sử ngàn năm gìn giữ và thổi bùng ngọn lửa Bát Tràng",
    description: "Làng cổ Bát Tràng vượt qua thăng trầm thời gian để giữ vững thương hiệu gốm sứ tinh hoa số một Việt Nam.",
    slug: "lich-su-ngan-nam-ngon-lua-bat-trang",
  },
  {
    id: 8,
    image: newsImg1,
    category: "Cẩm nang làng nghề",
    categoryId: "lang-nghe",
    title: "Nghệ nhân ưu tú Giang Cao và khát vọng đánh thức đất sét",
    description: "Lắng nghe những chia sẻ tâm huyết từ thế hệ giữ lửa Bát Tràng truyền thụ tình yêu nghề gốm cho người trẻ.",
    slug: "nghe-nhan-uu-tu-giang-cao-va-khay-vong-dat",
  },
  {
    id: 9,
    image: newsImg2,
    category: "Cẩm nang làng nghề",
    categoryId: "lang-nghe",
    title: "Bí quyết dưỡng ấm trà tử sa chuẩn nghệ thuật thưởng trà",
    description: "Làm thế nào để chiếc ấm đất của bạn có độ bóng đẹp tự nhiên và giữ trọn hương vị trà thượng hạng.",
    slug: "bi-quyet-duong-am-tra-tu-sa-chuan",
  },
  {
    id: 18,
    image: newsImg3,
    category: "Cẩm nang làng nghề",
    categoryId: "lang-nghe",
    title: "Kỹ thuật chế tác men ngọc độc bản truyền thừa dòng họ Vũ",
    description: "Học hỏi phương pháp phối trộn tro trấu và đất sét trắng tạo nên sắc men trong vắt như ngọc bích.",
    slug: "ky-thuat-che-tac-men-ngoc-truyen-thua",
  },
  {
    id: 19,
    image: newsImg1,
    category: "Cẩm nang làng nghề",
    categoryId: "lang-nghe",
    title: "Hành trình đưa gốm sứ Việt vươn tầm thế giới",
    description: "Những bước chuyển mình xuất khẩu gốm mỹ nghệ sang thị trường Nhật Bản và châu Âu của nghệ nhân Bát Tràng.",
    slug: "hanh-trinh-dua-gom-viet-vuon-tam-the-gioi",
  },
  {
    id: 20,
    image: newsImg2,
    category: "Cẩm nang làng nghề",
    categoryId: "lang-nghe",
    title: "Lễ hội đình làng Bát Tràng - nét đẹp văn hóa tâm linh",
    description: "Tìm hiểu các hoạt động rước nước, dâng hương tôn vinh các vị tổ nghề gốm truyền thống hàng năm.",
    slug: "le-hoi-dinh-lang-bat-trang",
  },
  {
    id: 21,
    image: newsImg3,
    category: "Cẩm nang làng nghề",
    categoryId: "lang-nghe",
    title: "Đất sét trắng - bầu sữa mẹ nuôi dưỡng làng nghề gốm sứ",
    description: "Cách tuyển chọn và xử lý nguồn đất sét dẻo mịn tạo nên cốt gốm đanh chắc đặc trưng Bát Tràng.",
    slug: "dat-set-trang-bau-sua-me-nuoi-duong",
  },
];

export default function NewsView() {
  const [activeTab, setActiveTab] = useState("phong-thuy");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Display exactly 6 cards per page

  // Determine active tab display name
  const activeCategoryName = useMemo(() => {
    return TABS.find((t) => t.id === activeTab)?.name || "Tin tức";
  }, [activeTab]);

  // Filter articles based on active category
  const filteredNews = useMemo(() => {
    return MOCK_ALL_NEWS.filter((item) => item.categoryId === activeTab);
  }, [activeTab]);

  // Paginated selection
  const paginatedNews = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredNews.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredNews, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredNews.length / itemsPerPage));

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1); // Reset page on filter switch
  };

  const hasTwoLineTitle = paginatedNews.some(
    (item) => item.title && (item.title.includes("\n") || item.title.length > 30)
  );

  return (
    <div className="w-full bg-white">
      {/* 1. Header Hero Banner */}
      <NewsHero activeCategoryName={activeCategoryName} />

      {/* 2. Topic Selection Tabs */}
      <NewsTabs
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* 3. News Grid Layout */}
      <div className="max-w-[1470px] mx-auto px-[20px] lg:px-[60px] pt-[50px] pb-0">
        {paginatedNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[15px] gap-y-[60px]">
            {paginatedNews.map((news) => (
              <NewsCard
                key={news.id}
                image={news.image}
                category={news.category}
                title={news.title}
                description={news.description}
                slug={news.slug}
                hasTwoLineTitle={hasTwoLineTitle}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center font-montserrat">
            <p className="text-[18px] text-[#777E90] mb-2 font-semibold">
              Hiện tại danh mục chưa có bài viết mới
            </p>
            <p className="text-[14px] text-[#838383]">
              Vui lòng quay lại sau để cập nhật tin tức từ Gốm Sứ Vũ Gia.
            </p>
          </div>
        )}

        {/* 4. Navigation Pagination */}
        <div className="mt-[20px] mb-[-40px] flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* 5. Recommended Products Shelf */}
      <NewsRelatedProducts />
    </div>
  );
}
