"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ArrowRight, Loader2, CheckCircle } from "lucide-react";

// Image imports for Featured Products
import productCardImage1 from "@/assets/images/product-detail/product-card-image-1.png";
import productCardImage2 from "@/assets/images/product-detail/product-card-image-2.png";
import productCardImage3 from "@/assets/images/product-detail/product-card-image-3.png";
import productNewThumb from "@/assets/images/products/product-new-thumb.png";

// Image imports for Featured Articles
import newsImg1 from "@/assets/images/home/home-new-1.png";
import newsImg2 from "@/assets/images/home/home-new-2.png";
import newsImg3 from "@/assets/images/home/home-new-3.png";

export default function NewsDetailSidebar({ showWidgets = true, showForm = true }) {
  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [formStatus, setFormStatus] = useState("idle"); // 'idle' | 'submitting' | 'success'

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`Đang tìm kiếm bài viết: "${searchQuery}"`);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      alert("Vui lòng điền đầy đủ họ tên và email.");
      return;
    }
    setFormStatus("submitting");
    setTimeout(() => {
      setFormStatus("success");
      setFullName("");
      setEmail("");
      setContent("");
      setTimeout(() => setFormStatus("idle"), 4000);
    }, 1500);
  };

  // Mock data for featured products (2x2 grid)
  const featuredProducts = [
    {
      id: 1,
      image: productCardImage1,
      name: "Bình hút lộc mạ vàng",
      sku: "MSP: VG001",
      link: "/san-pham/binh-hut-loc-ma-vang",
    },
    {
      id: 2,
      image: productCardImage2,
      name: "Bát hương men rạn rồng chầu",
      sku: "MSP: VG002",
      link: "/san-pham/bat-huong-men-ran-rong-chau",
    },
    {
      id: 3,
      image: productCardImage3,
      name: "Đôi lộc bình vẽ vàng 24k",
      sku: "MSP: VG003",
      link: "/san-pham/doi-loc-binh-ve-vang-24k",
    },
    {
      id: 4,
      image: productNewThumb,
      name: "Bộ ấm chén tử sa Bát Tràng",
      sku: "MSP: VG004",
      link: "/san-pham/bo-am-chen-tu-sa-bat-trang",
    },
  ];

  // Mock data for featured articles (4 posts)
  const featuredPosts = [
    {
      id: 1,
      image: newsImg1,
      category: "Kiến thức phong thuỷ",
      date: "20 Jan 2026",
      title: "Cách bài trí bàn thờ gia tiên chuẩn phong thủy rước tài lộc",
      slug: "cach-bai-tri-ban-tho-gia-tien-chuan-phong-thuy",
    },
    {
      id: 2,
      image: newsImg2,
      category: "Kiến thức sản phẩm",
      date: "15 Jan 2026",
      title: "Phân biệt men rạn cổ và men lam truyền thống Bát Tràng",
      slug: "phan-biet-men-ran-co-va-men-lam",
    },
    {
      id: 3,
      image: newsImg3,
      category: "Cẩm nang làng nghề",
      date: "10 Jan 2026",
      title: "Lịch sử ngàn năm gìn giữ và thổi bùng ngọn lửa Bát Tràng",
      slug: "lich-su-ngan-nam-ngon-lua-bat-trang",
    },
    {
      id: 4,
      image: newsImg1,
      category: "Kiến thức phong thuỷ",
      date: "05 Jan 2026",
      title: "Vị trí đặt lộc bình phòng khách mang lại tài lộc dồi dào",
      slug: "vi-tri-dat-loc-binh-phong-khach",
    },
  ];

  return (
    <aside className="w-full flex flex-col gap-10 font-inter">
      {/* 1. Top Widgets (Search, Featured Products, Featured Posts) */}
      {showWidgets && (
        <>
          {/* 1. Search Widget */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm..."
              className="w-full px-4 py-3 pl-11 rounded-[8px] border border-[#E1DEDE] bg-white focus:outline-none focus:border-[#97400C] focus:ring-1 focus:ring-[#97400C] transition-all text-[16px] font-normal leading-[26px] placeholder-[#777777] text-[#777777]"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#777E90] w-5 h-5 cursor-pointer" />
          </form>

          {/* 2. Featured Products Widget */}
          <div className="w-full flex flex-col">
            <h3 className="text-[24px] font-semibold text-[#101828] leading-[32px] mb-4">
              Sản phẩm nổi bật
            </h3>
            
            {/* 2x2 Grid Layout */}
            <div className="grid grid-cols-2 gap-4">
              {featuredProducts.map((prod) => (
                <Link
                  key={prod.id}
                  href={prod.link}
                  className="flex flex-col group cursor-pointer"
                >
                  {/* Product Thumbnail Container */}
                  <div className="relative w-full aspect-[162/115] bg-[#F4F5F6] rounded-[6px] overflow-hidden mb-2">
                    <Image
                      src={prod.image}
                      alt={prod.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Product Info (Inter, Semibold, 14px, 20px leading, color #141416) */}
                  <h4 className="text-[14px] font-semibold text-[#141416] leading-[20px] group-hover:text-[#97400C] transition-colors line-clamp-1 mb-1 font-inter">
                    {prod.name}
                  </h4>
                  <p className="text-[12px] font-medium text-[#777E90] leading-[14px] font-inter">
                    {prod.sku}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* 3. Featured Posts Widget */}
          <div className="w-full flex flex-col">
            <h3 className="text-[24px] font-semibold text-[#101828] leading-[32px] mb-4">
              Bài viết nổi bật
            </h3>

            {/* Vertical List of Articles */}
            <div className="flex flex-col gap-5">
              {featuredPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/tin-tuc/${post.slug}`}
                  className="flex gap-3 group items-start"
                >
                  {/* Image Thumbnail */}
                  <div className="relative w-[124px] h-[88px] flex-shrink-0 bg-gray-100 rounded-[6px] overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Title & Metadata */}
                  <div className="flex flex-col justify-between h-full py-0.5">
                    {/* Meta Category & Date (Inter, Semibold, 12px, leading-16, color #97400C) */}
                    <span className="text-[12px] font-semibold text-[#97400C] leading-[16px] uppercase tracking-wider font-inter">
                      {post.category.split(" ")[2] || "Tin tức"} • {post.date}
                    </span>
                    
                    {/* Title (Inter, Semibold, 16px, leading-23, color #101828) */}
                    <h4 className="text-[16px] font-semibold text-[#101828] leading-[23px] group-hover:text-[#97400C] transition-colors line-clamp-2 mt-1 font-inter">
                      {post.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}

      {/* 4. Consulting Form */}
      {showForm && (
        <div className="w-full bg-[#FAF6F0] rounded-[12px] px-[23px] pt-[20px] pb-[37px] flex flex-col shadow-xs">
          {/* Title (Inter, Semibold, 24px, leading-32, color #101828) */}
          <h3 className="text-[24px] font-semibold text-[#101828] leading-[32px] mb-[18px] font-inter">
            Tư vấn
          </h3>

          {formStatus === "success" ? (
            <div className="flex flex-col items-center justify-center py-6 text-center text-green-700 animate-fadeIn">
              <CheckCircle className="w-12 h-12 mb-3 text-green-600" />
              <p className="font-semibold text-[16px] mb-1">Gửi thông tin thành công!</p>
              <p className="text-[13px] text-[#777E90]">
                Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.
              </p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-[10px]">
              {/* Full Name */}
              <div className="flex flex-col">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Họ tên"
                  required
                  disabled={formStatus === "submitting"}
                  className="w-full px-[20px] py-[12px] rounded-[8px] border-none bg-white focus:outline-none focus:ring-0 transition-all text-[14px] font-normal leading-[24px] placeholder-[#A7A7A7] text-[#101828] font-inter"
                />
              </div>

              {/* Email / Phone */}
              <div className="flex flex-col">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  disabled={formStatus === "submitting"}
                  className="w-full px-[20px] py-[12px] rounded-[8px] border-none bg-white focus:outline-none focus:ring-0 transition-all text-[14px] font-normal leading-[24px] placeholder-[#A7A7A7] text-[#101828] font-inter"
                />
              </div>

              {/* Message Body */}
              <div className="flex flex-col">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Nội dung"
                  rows={4}
                  disabled={formStatus === "submitting"}
                  className="w-full px-[20px] py-[12px] rounded-[8px] border-none bg-white focus:outline-none focus:ring-0 transition-all text-[14px] font-normal leading-[24px] placeholder-[#A7A7A7] text-[#101828] resize-none font-inter"
                />
              </div>

              {/* Register Submit Button */}
              <button
                type="submit"
                disabled={formStatus === "submitting"}
                className="group w-full flex items-center justify-center gap-2 bg-[#97400C] hover:bg-[#AD5036] active:bg-[#97400C] text-[#FCFCFD] font-semibold py-[14px] px-4 rounded-[8px] text-[14px] leading-[16px] transition-all duration-300 mt-[10px] cursor-pointer hover:shadow-xs disabled:bg-gray-400 font-inter"
              >
                {formStatus === "submitting" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#FCFCFD]" />
                    <span>Đang đăng ký...</span>
                  </>
                ) : (
                  <>
                    <span>Đăng kí tư vấn</span>
                    <ArrowRight className="w-4 h-4 text-[#FCFCFD] transform transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      )}
    </aside>
  );
}
