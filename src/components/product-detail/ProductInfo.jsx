"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, ChevronRight, Search } from "lucide-react";
import productDetailThumbnail from "@/assets/images/product-detail/product-detail-thumbnail.png";
import productCardImage1 from "@/assets/images/product-detail/product-card-image-1.png";
import productCardImage2 from "@/assets/images/product-detail/product-card-image-2.png";
import productCardImage3 from "@/assets/images/product-detail/product-card-image-3.png";
import { ROUTES } from "@/utils/routes";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "@/utils/feedback";

const DEMO_PRODUCT = {
  id: "dt026",
  title: "Bộ đồ thờ Phật vẽ hoa sen men rạn cổ đơn giản DT026",
  sku: "MSP: VG001",
  price: 2000000,
  classification: "Men rạn",
  packSize: 1,
  image: productDetailThumbnail,
};

// ==========================================
// 1. PRODUCT GALLERY COMPONENT
// ==========================================
function ProductGallery({ galleryImages, mainImage, setMainImage }) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  React.useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") setIsLightboxOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, activeIndex]);

  return (
    <div className="w-full">
      {/* Mobile swipe gallery: aspect ratio 430/323 matching figma exactly, full-bleed to screen edges */}
      <div className="md:hidden w-[calc(100%+60px)] mx-[-30px] overflow-x-auto snap-x snap-mandatory flex scrollbar-none gap-0">
        {galleryImages.map((img, idx) => (
          <div 
            key={idx} 
            className="w-full shrink-0 snap-center relative aspect-[430/323] cursor-zoom-in"
            onClick={() => {
              setActiveIndex(idx);
              setIsLightboxOpen(true);
            }}
          >
            <Image
              src={img}
              alt={`Product Image ${idx + 1}`}
              fill
              priority={idx === 0}
              className="object-cover"
              sizes="100vw"
            />
          </div>
        ))}
      </div>

      {/* Desktop gallery layout */}
      <div className="hidden md:flex flex-col-reverse md:flex-row gap-[15px]">
        {/* Thumbnails wrapper */}
        <div className="flex flex-col items-center flex-shrink-0">
          {/* Thumbnails list - completely overflow hidden to disable scrollbars */}
          <div className="flex md:flex-col gap-[15px] overflow-hidden max-h-[500px]">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setMainImage(img)}
                className={`relative w-[60px] h-[55px] md:w-[87px] md:h-[79px] overflow-hidden flex-shrink-0 transition-all duration-300 cursor-pointer ${
                  mainImage === img
                    ? "opacity-100 scale-105"
                    : "opacity-50 hover:opacity-100 scale-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 60px, 87px"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Main Display Image - height 601px, no rounded, no border */}
        <div 
          className="relative w-full aspect-[831/601] lg:h-[601px] lg:aspect-auto overflow-hidden bg-gray-100 flex-1 cursor-zoom-in"
          onClick={() => {
            const idx = galleryImages.indexOf(mainImage);
            setActiveIndex(idx >= 0 ? idx : 0);
            setIsLightboxOpen(true);
          }}
        >
          <Image
            src={mainImage}
            alt="Bộ đồ thờ"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black/95 z-[9999] flex flex-col items-center justify-center select-none animate-fade-in">
          {/* Close Backdrop Click Area */}
          <div
            className="absolute inset-0 cursor-zoom-out"
            onClick={() => setIsLightboxOpen(false)}
          />

          {/* Close Button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-3 text-3xl z-20 bg-black/20 hover:bg-black/40 rounded-full cursor-pointer"
            aria-label="Close Lightbox"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Modal Left Navigation Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-4 md:left-10 text-white/70 hover:text-white transition-colors p-4 z-20 bg-black/20 hover:bg-black/40 rounded-full cursor-pointer"
            aria-label="Previous Image"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>

          {/* Active Image container */}
          <div className="relative max-w-[90%] max-h-[80vh] aspect-square w-full md:w-[60vw] z-10 flex items-center justify-center">
            <Image
              src={galleryImages[activeIndex]}
              alt={`Slide ${activeIndex + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>

          {/* Modal Right Navigation Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 md:right-10 text-white/70 hover:text-white transition-colors p-4 z-20 bg-black/20 hover:bg-black/40 rounded-full cursor-pointer"
            aria-label="Next Image"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>

          {/* Info Details Footer in Modal */}
          <div className="absolute bottom-6 left-0 right-0 text-center text-white/90 z-20 px-6 max-w-[800px] mx-auto select-none pointer-events-none">
            <p className="text-[14px] font-semibold text-white/60 uppercase tracking-widest mb-1 font-montserrat">
              Ảnh {activeIndex + 1} / {galleryImages.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 2. PRODUCT PURCHASE PANEL COMPONENT
// ==========================================
function ProductPurchasePanel({
  mainQuantity,
  setMainQuantity,
  onBuyNow,
  onAddToCart,
}) {
  return (
    <div className="flex flex-col font-montserrat">
      {/* Title */}
      <h1 className="text-[#141416] text-[24px] lg:text-[32px] font-[600] leading-[32px] lg:leading-[45px] mb-[10px] lg:mb-[20px] font-montserrat">
        Bộ đồ thờ Phật vẽ hoa sen men rạn cổ đơn giản DT026
      </h1>

      {/* SKU & Sold Status */}
      <div className="flex items-center justify-between mb-[20px]">
        <span className="text-[#A0A0A0] text-[16px] lg:text-[18px] font-[600] leading-[24px]">
          MSP: VG001
        </span>
        <div className="flex items-center gap-[6px]">
          <div className="w-[18px] h-[18px] lg:w-[16px] lg:h-[16px] relative">
            <Image
              src="/images/home/green-round-check.png"
              alt="Check"
              fill
              className="object-contain"
              sizes="18px"
            />
          </div>
          <span className="text-[#67A865] text-[14px] lg:text-[18px] font-[700] leading-[12px]">
            Đã bán: 12
          </span>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-t border-[#E6E8EC] mb-[10px] lg:mb-[21px]" />

      {/* Price Block: Stacks vertically on mobile (prices in a column on the left, badge on the right) */}
      <div className="flex items-center justify-between gap-4 mb-[8px] lg:mb-[15px] w-full">
        <div className="flex flex-col lg:flex-row lg:items-baseline gap-1 lg:gap-4">
          <span className="text-[#97400C] text-[24px] lg:text-[32px] font-[700] leading-[32px] lg:leading-[40px]">
            2.000.000đ
          </span>
          <span className="text-[#838383] text-[16px] lg:text-[18px] font-[400] line-through leading-[24px]">
            2.500.000đ
          </span>
        </div>
        <span className="bg-[#97400C] text-white text-[12px] font-[700] uppercase leading-[12px] px-3 py-2.5 lg:py-3 rounded-[4px] shrink-0">
          Tiết kiệm 30%
        </span>
      </div>

      {/* Divider */}
      <hr className="border-t border-[#E6E8EC] mb-[21px]" />

      {/* Quantity & Actions Layout (Responsive) */}
      
      {/* 1. Mobile-only Quantity selector & Contact social actions */}
      <div className="flex lg:hidden items-center justify-between gap-[15px] mb-[20px] w-full">
        {/* Mobile Quantity selector: outline: 1px #B1B5C3 solid, h-[39px], w-[115px] */}
        <div className="flex items-center border border-[#B1B5C3] rounded-[4px] overflow-hidden bg-white h-[39px]">
          <button
            onClick={() => setMainQuantity((q) => Math.max(1, q - 1))}
            className="px-[14px] h-full flex items-center justify-center font-inter font-[700] text-[16px] text-[#353945] bg-[#F9F8F8] border-r border-[#B1B5C3] transition-colors cursor-pointer"
          >
            -
          </button>
          <span className="w-[45px] h-full flex items-center justify-center font-montserrat font-[700] text-[16px] text-[#353945] select-none">
            {mainQuantity}
          </span>
          <button
            onClick={() => setMainQuantity((q) => q + 1)}
            className="px-[11px] h-full flex items-center justify-center font-inter font-[700] text-[16px] text-[#353945] bg-[#F9F8F8] border-l border-[#B1B5C3] transition-colors cursor-pointer"
          >
            +
          </button>
        </div>

        {/* Zalo and Call buttons: w-[45px] h-[45px], border 0.5px #97400C solid */}
        <div className="flex items-center gap-[12px]">
          {/* Call Button */}
          <a
            href="tel:0934213874"
            className="w-[45px] h-[45px] rounded-full border-[0.5px] border-[#97400C] bg-white flex items-center justify-center transition-all hover:bg-[#97400C]/5"
          >
            <Image
              src="/icons/phone.svg"
              alt="Call"
              width={20}
              height={20}
              className="object-contain"
            />
          </a>

          {/* Zalo Button */}
          <a
            href="https://zalo.me/0934213874"
            target="_blank"
            rel="noopener noreferrer"
            className="w-[45px] h-[45px] rounded-full border-[0.5px] border-[#97400C] bg-white flex items-center justify-center transition-all hover:bg-[#97400C]/5"
          >
            <Image
              src="/icons/zalo-1.svg"
              alt="Zalo"
              width={20}
              height={20}
              className="object-contain"
            />
          </a>
        </div>
      </div>

      {/* 2. Mobile-only Primary Mua ngay / Thêm vào giỏ row (height 43px, border-radius 4px) */}
      <div className="flex lg:hidden items-center gap-[12px] mb-[25px] w-full">
        <button
          onClick={onBuyNow}
          className="flex-1 bg-[#97400C] text-white h-[43px] rounded-[4px] font-montserrat font-[700] text-[15px] text-center uppercase tracking-wider hover:bg-opacity-95 transition-all duration-300 shadow-md cursor-pointer"
        >
          Mua ngay
        </button>
        <button
          onClick={onAddToCart}
          className="flex-1 border border-[#97400C] text-[#97400C] bg-white h-[43px] rounded-[4px] font-montserrat font-[700] text-[15px] text-center uppercase tracking-wider hover:bg-[#97400C]/5 transition-all duration-300 cursor-pointer"
        >
          Thêm vào giỏ
        </button>
      </div>

      {/* 3. Desktop-only Quantity Selector & Purchase buttons */}
      <div className="hidden lg:flex items-center gap-[15px] mb-[30px] w-full">
        <div className="flex items-center border border-[#E6E8EC] rounded-[8px] overflow-hidden bg-white h-[50px] flex-shrink-0">
          <button
            onClick={() => setMainQuantity((q) => Math.max(1, q - 1))}
            className="w-[35px] h-full flex items-center justify-center font-inter font-[700] text-[16px] text-[#353945] hover:bg-gray-50 border-r border-[#E6E8EC] transition-colors cursor-pointer"
          >
            -
          </button>
          <span className="w-[40px] h-full flex items-center justify-center font-montserrat font-[700] text-[16px] text-[#141416] select-none">
            {mainQuantity}
          </span>
          <button
            onClick={() => setMainQuantity((q) => q + 1)}
            className="w-[35px] h-full flex items-center justify-center font-inter font-[700] text-[16px] text-[#353945] hover:bg-gray-50 border-l border-[#E6E8EC] transition-colors cursor-pointer"
          >
            +
          </button>
        </div>

        <button
          onClick={onBuyNow}
          className="flex-1 bg-[#97400C] text-white border border-[#97400C] rounded-[8px] font-montserrat font-[700] text-[15px] text-center uppercase tracking-wider py-[15px] hover:bg-opacity-95 transition-all duration-300 shadow-md cursor-pointer min-w-0"
        >
          Mua ngay
        </button>
        <button
          onClick={onAddToCart}
          className="flex-1 border border-[#97400C] text-[#97400C] bg-white rounded-[8px] font-montserrat font-[700] text-[15px] text-center uppercase tracking-wider py-[15px] hover:bg-[#97400C]/5 transition-all duration-300 cursor-pointer min-w-0"
        >
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
}

// ==========================================
// 3. PRODUCT SUB-ITEMS ACCORDION COMPONENT
// ==========================================
function ProductSubItemsAccordion({
  isInfoExpanded,
  setIsInfoExpanded,
  subItems,
  updateSubItemQuantity,
  onBuyNow,
  onAddToCart,
}) {
  return (
    <div>
      {/* Accordion Header - 20px padding top/bottom between text and upper/lower borders */}
      <div className="border-t border-b border-[#E6E8EC]">
        <button
          onClick={() => setIsInfoExpanded(!isInfoExpanded)}
          className="w-full flex items-center justify-between text-left font-montserrat text-[16px] lg:text-[20px] font-[600] text-black leading-[24px] hover:text-[#97400C] transition-colors cursor-pointer py-[20px]"
        >
          <span>Thông tin sản phẩm</span>
          {isInfoExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>
      </div>

      {isInfoExpanded && (
        <div className="flex flex-col">
          {subItems.map((item) => (
            <div
              key={item.id}
              className="flex gap-[15px] border-b border-[#E6E8EC] py-[25px] last:border-b-0"
            >
              {/* Item Image - Width 140px, Height 130px, no rounding, no border */}
              <div className="relative w-[140px] h-[130px] overflow-hidden bg-gray-50 flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="140px"
                />
              </div>

              {/* Item details */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-[#141416] text-[16px] lg:text-[18px] font-[600] leading-snug font-montserrat">
                    {item.name}
                  </h4>
                  <div className="text-[#A0A0A0] text-[14px] font-[500] mt-[2px] font-montserrat">
                    {item.sku}
                  </div>
                </div>

                {/* Price Row: space of 5px below the Title/SKU */}
                <div className="mt-[5px]">
                  <div className="flex items-center gap-[30px] lg:gap-[40px]">
                    <span className="text-[#97400C] text-[16px] lg:text-[18px] font-[600] lg:font-[700] font-montserrat">
                      {item.salePrice}
                    </span>
                    <span className="text-[#838383] text-[14px] lg:text-[18px] font-[400] line-through font-montserrat">
                      {item.originalPrice}
                    </span>
                  </div>

                  {/* Sub item quantity selector: 24px gap from Price Row */}
                  <div className="mt-[20px] lg:mt-[24px] flex items-center border border-[#B1B5C3] lg:border-[#E6E8EC] rounded-[4px] lg:rounded-[8px] overflow-hidden bg-white h-[27px] lg:h-[36px] w-[83px] lg:w-[100px]">
                    <button
                      onClick={() => updateSubItemQuantity(item.id, -1)}
                      className="w-[26px] lg:w-[30px] h-full flex items-center justify-center font-inter font-[700] text-[14px] text-[#353945] bg-[#F9F8F8] border-r border-[#B1B5C3] lg:border-[#E6E8EC] transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-montserrat font-[600] text-[14px] text-[#353945] select-none">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateSubItemQuantity(item.id, 1)}
                      className="w-[26px] lg:w-[30px] h-full flex items-center justify-center font-inter font-[700] text-[14px] text-[#353945] bg-[#F9F8F8] border-l border-[#B1B5C3] lg:border-[#E6E8EC] transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Desktop Checkout buttons: 25px space above, 50px space below */}
          <div className="hidden lg:flex items-center gap-4 mt-[25px] mb-[50px]">
            <button
              onClick={onBuyNow}
              className="flex-1 bg-[#97400C] text-white rounded-[8px] font-montserrat font-[700] text-[15px] text-center uppercase tracking-wider py-[15px] hover:bg-opacity-95 transition-all duration-300 cursor-pointer"
            >
              Mua ngay
            </button>
            <button
              onClick={onAddToCart}
              className="flex-1 border border-[#97400C] text-[#97400C] rounded-[8px] font-montserrat font-[700] text-[15px] text-center uppercase tracking-wider py-[15px] hover:bg-[#97400C]/5 transition-all duration-300 cursor-pointer"
            >
              Thêm vào giỏ
            </button>
          </div>

          {/* Mobile: Xem thêm button */}
          <div className="flex lg:hidden justify-center mt-5 w-full">
            <button className="py-[10px] pl-[10px] pr-[2px] w-[154px] h-[34px] bg-[#DDAA70]/20 hover:bg-[#DDAA70]/30 active:bg-[#DDAA70]/40 rounded-[8px] flex items-center justify-center gap-[1px] transition-all duration-300 cursor-pointer">
              <span className="text-[#97400C] font-montserrat text-[16px] font-[700] leading-[16px]">
                Xem thêm
              </span>
              <ChevronRight className="w-6 h-6 text-[#97400C]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// MAIN PRODUCT INFO COMPONENT
// ==========================================
export default function ProductInfo() {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const [mainImage, setMainImage] = useState(productDetailThumbnail);
  const [isInfoExpanded, setIsInfoExpanded] = useState(true);
  const [mainQuantity, setMainQuantity] = useState(1);

  // Gallery images list
  const galleryImages = [
    productDetailThumbnail,
    productCardImage1,
    productCardImage2,
    productCardImage3,
  ];

  // Sub-items list inside the set
  const [subItems, setSubItems] = useState([
    {
      id: 1,
      name: "Bát hương rồng phượng men lam",
      sku: "MSP: VG001",
      salePrice: "2.000.000đ",
      originalPrice: "2.500.000đ",
      quantity: 1,
      image: productCardImage1,
    },
    {
      id: 2,
      name: "Bát hương Phúc lộc liên hoa vẽ vàng đẹp",
      sku: "MSP: VG001",
      salePrice: "2.000.000đ",
      originalPrice: "2.500.000đ",
      quantity: 1,
      image: productCardImage2,
    },
    {
      id: 3,
      name: "Bát hương Phúc lộc liên hoa vẽ vàng đẹp",
      sku: "MSP: VG001",
      salePrice: "2.000.000đ",
      originalPrice: "2.500.000đ",
      quantity: 1,
      image: productCardImage3,
    },
  ]);

  const updateSubItemQuantity = (id, delta) => {
    setSubItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    );
  };

  const handleBuyNow = () => {
    addItem({ ...DEMO_PRODUCT, image: mainImage }, mainQuantity);
    router.push(ROUTES.CHECKOUT);
  };

  const handleAddToCart = () => {
    addItem({ ...DEMO_PRODUCT, image: mainImage }, mainQuantity);
    toast.success("Đã thêm sản phẩm vào giỏ hàng!");
    setTimeout(() => router.push(ROUTES.CART), 150);
  };

  return (
    <div className="w-full pt-[20px] lg:pt-[50px]">
      {/* Mobile-only Search input field */}
      <div className="lg:hidden w-full h-[38px] border border-[#E1DEDE] rounded-[8px] bg-white flex items-center pl-[13px] pr-0 mb-[18px] relative select-none">
        <div className="flex-1 flex items-center gap-[10px] h-full">
          <Search className="w-4 h-4 text-[#777777] flex-shrink-0 order-2 ml-auto mr-[13px]" />
          <input
            type="text"
            placeholder="Tìm kiếm"
            className="w-full h-full bg-transparent border-none outline-none font-inter font-[400] text-[14px] text-[#2E2F2A] placeholder-[#777777] focus:ring-0 focus:outline-none order-1"
          />
        </div>
      </div>

      {/* Breadcrumb path */}
      <div className="mb-6 font-montserrat text-[16px] font-[700] text-[#2E2F2A] lg:text-[#383838] uppercase leading-[24px] tracking-wide">
        <span className="hidden lg:inline">Trang chủ / </span>Bộ đồ thờ /{" "}
        <span className="text-[#97400C]">Bộ hút lộc mạ vàng</span>
      </div>

      {/* Main product wrapper - 62% for left gallery and remainder for right column with 28px gap */}
      <div className="grid grid-cols-1 lg:grid-cols-[62%_1fr] gap-5 lg:gap-[28px] items-start">
        {/* Left Column - Gallery */}
        <ProductGallery
          galleryImages={galleryImages}
          mainImage={mainImage}
          setMainImage={setMainImage}
        />

        {/* Right Column - Purchase Info Section & Sub-items Accordion */}
        <div className="flex flex-col font-montserrat">
          <ProductPurchasePanel
            mainQuantity={mainQuantity}
            setMainQuantity={setMainQuantity}
            onBuyNow={handleBuyNow}
            onAddToCart={handleAddToCart}
          />
          <ProductSubItemsAccordion
            isInfoExpanded={isInfoExpanded}
            setIsInfoExpanded={setIsInfoExpanded}
            subItems={subItems}
            updateSubItemQuantity={updateSubItemQuantity}
            onBuyNow={handleBuyNow}
            onAddToCart={handleAddToCart}
          />
        </div>
      </div>
    </div>
  );
}
