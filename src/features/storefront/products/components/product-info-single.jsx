"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import SafeImage from "@/shared/components/SafeImage";
import { formatImageUrl } from "@/shared/api/media";
import { ROUTES } from "@/shared/utils/routes";
import { useCartStore } from "@/shared/stores/cartStore";
import { toast } from "@/shared/utils/feedback";

/** Builds the ordered gallery image URL list from a real `ProductResponse` (PRODUCT_API.md §8). */
function buildGalleryImages(product) {
  const images = Array.isArray(product?.images) ? product.images : [];
  if (images.length > 0) {
    return images.map((img) => formatImageUrl(img.url));
  }
  return product?.thumb ? [formatImageUrl(product.thumb)] : [];
}

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

  if (galleryImages.length === 0) return null;

  return (
    <div className="w-full">
      {/* Mobile swipe gallery: aspect ratio 1:1 matching figma exactly, full-bleed to screen edges */}
      <div className="md:hidden w-[calc(100%+60px)] mx-[-30px] overflow-x-auto snap-x snap-mandatory flex scrollbar-none gap-0">
        {galleryImages.map((img, idx) => (
          <div
            key={img + idx}
            className="w-full shrink-0 snap-center relative aspect-square cursor-zoom-in"
            onClick={() => {
              setActiveIndex(idx);
              setIsLightboxOpen(true);
            }}
          >
            <SafeImage
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
      <div className="hidden md:flex flex-col-reverse md:flex-row gap-[20px]">
        {/* Thumbnails wrapper */}
        <div className="flex flex-col items-center flex-shrink-0">
          {/* Thumbnails list - completely overflow hidden to disable scrollbars */}
          <div className="flex md:flex-col gap-[15px] overflow-hidden max-h-[801px]">
            {galleryImages.map((img, idx) => (
              <button
                key={img + idx}
                onClick={() => setMainImage(img)}
                className={`relative w-[87px] h-[87px] overflow-hidden flex-shrink-0 transition-all duration-300 cursor-pointer ${
                  mainImage === img
                    ? "opacity-100 scale-105"
                    : "opacity-50 hover:opacity-100 scale-100"
                }`}
              >
                <SafeImage
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="87px"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Main Display Image - height 801px, no rounded, no border */}
        <div
          className="relative w-full h-[801px] aspect-[799/801] lg:aspect-auto overflow-hidden bg-gray-100 flex-1 cursor-zoom-in"
          onClick={() => {
            const idx = galleryImages.indexOf(mainImage);
            setActiveIndex(idx >= 0 ? idx : 0);
            setIsLightboxOpen(true);
          }}
        >
          <SafeImage
            src={mainImage}
            alt="Sản phẩm lẻ"
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
            <SafeImage
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
  product,
  mainQuantity,
  setMainQuantity,
  onBuyNow,
  onAddToCart,
}) {
  const [isInfoExpanded, setIsInfoExpanded] = useState(true);

  const price = Number(product?.price) || 0;
  const compareAtPrice = Number(product?.compareAtPrice) || 0;
  const hasDiscount = compareAtPrice > price;
  const discountPercent = hasDiscount ? Math.round((1 - price / compareAtPrice) * 100) : 0;

  return (
    <div className="flex flex-col font-montserrat">
      {/* Title */}
      <h1 className="text-[#141416] text-[24px] lg:text-[32px] font-[600] leading-[32px] lg:leading-[45px] mb-[10px] lg:mb-[20px] font-montserrat">
        {product?.name || "Sản phẩm"}
      </h1>

      {/* SKU & Sold Status - Desktop */}
      <div className="hidden lg:flex items-center justify-between mb-[20px]">
        <span className="text-[#A0A0A0] text-[18px] font-[600] leading-[24px]">
          MSP: {product?.sku || "—"}
        </span>
        <div className="flex items-center gap-[6px]">
          <div className="w-[16px] h-[16px] relative">
            <Image
              src="/images/home/green-round-check.png"
              alt="Check"
              fill
              className="object-contain"
              sizes="16px"
            />
          </div>
          <span className="text-[#67A865] text-[18px] font-[700] leading-[12px]">
            Đã bán: {product?.soldCount ?? 0}
          </span>
        </div>
      </div>

      {/* SKU, Stock Status & Sold Status - Mobile */}
      <div className="flex lg:hidden flex-col gap-[10px] mb-[18px]">
        {/* SKU & Stock Status */}
        <div className="flex items-center justify-between">
          <span className="text-[#A0A0A0] text-[16px] font-[600] leading-[24px]">
            MSP: {product?.sku || "—"}
          </span>
          <div className="flex items-center gap-[4px] text-[16px] font-[600] leading-[24px]">
            <span className="text-[#A0A0A0]">Tình trạng:</span>
            <span className="text-[#97400C]">
              {product?.status === "PUBLISHED" ? "Còn hàng" : "Liên hệ"}
            </span>
          </div>
        </div>
        {/* Sold Status */}
        <div className="flex items-center gap-[8px]">
          <div className="w-[16px] h-[16px] relative flex-shrink-0">
            <Image
              src="/images/home/green-round-check.png"
              alt="Check"
              fill
              className="object-contain"
              sizes="16px"
            />
          </div>
          <span className="text-[#67A865] text-[14px] font-[700] leading-[12px]">
            Đã bán: {product?.soldCount ?? 0}
          </span>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-t border-[#E6E8EC] mb-[10px] lg:mb-[21px]" />

      {/* Price Block: Stacks vertically on mobile (prices in a column on the left, badge on the right) */}
      <div className="flex items-center justify-between gap-4 mb-[8px] lg:mb-[15px] w-full">
        <div className="flex flex-col lg:flex-row lg:items-baseline gap-1 lg:gap-4">
          <span className="text-[#97400C] text-[24px] lg:text-[32px] font-[700] leading-[32px] lg:leading-[40px]">
            {price.toLocaleString("vi-VN")}đ
          </span>
          {hasDiscount && (
            <span className="text-[#838383] text-[16px] lg:text-[18px] font-[400] line-through leading-[24px]">
              {compareAtPrice.toLocaleString("vi-VN")}đ
            </span>
          )}
        </div>
        {hasDiscount && (
          <span className="bg-[#97400C] text-white text-[12px] font-[700] uppercase leading-[12px] px-3 py-2.5 lg:py-3 rounded-[4px] shrink-0">
            Tiết kiệm {discountPercent}%
          </span>
        )}
      </div>

      {/* Divider */}
      <hr className="border-t border-[#E6E8EC] mb-[21px]" />

      {/* Specifications & Purchase Controls */}

      {/* 1. Mobile-only Specs + Quantity + Social stacked layout */}
      <div className="flex lg:hidden items-stretch justify-between gap-4 mb-[20px] w-full">
        {/* Left column: Quantity selector */}
        <div className="flex-1 flex flex-col gap-[10px]">
          <div className="flex flex-col gap-[10px]">
            <span className="text-[#383838] text-[16px] font-[600] leading-[24px]">Chọn số lượng</span>
            {/* Quantity Selector box: h-[48px], outline: 1px #B1B5C3 solid, bg-white */}
            <div className="flex items-center border border-[#B1B5C3] rounded-[4px] overflow-hidden bg-white h-[48px] w-[115px]">
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
          </div>
        </div>

        {/* Right column: Vertical stacked Call/Zalo buttons aligned to the top */}
        <div className="flex flex-col gap-[7px] shrink-0 self-start mt-[4px]">
          {/* Zalo Button (top) */}
          <a
            href="https://zalo.me/0934213874"
            target="_blank"
            rel="noopener noreferrer"
            className="w-[45px] h-[45px] rounded-full border border-[#97400C] bg-white flex items-center justify-center transition-all hover:bg-[#97400C]/5"
          >
            <Image src="/icons/zalo-1.svg" alt="Zalo" width={20} height={20} className="object-contain" />
          </a>

          {/* Call Button (bottom) */}
          <a
            href="tel:0934213874"
            className="w-[45px] h-[45px] rounded-full border border-[#97400C] bg-white flex items-center justify-center transition-all hover:bg-[#97400C]/5"
          >
            <Image src="/icons/phone.svg" alt="Call" width={22} height={20} className="object-contain" />
          </a>
        </div>
      </div>

      {/* 2. Desktop-only Specs & Purchase layout */}
      <div className="hidden lg:flex flex-col gap-[15px] w-full">
        {/* Row 1: Quantity selector (115px) + Mua ngay (375px / flex-1) */}
        <div className="flex items-center gap-[14px] w-full">
          {/* Quantity Selector box: h-[48px], outline: 1px #B1B5C3 solid, bg-white */}
          <div className="flex items-center border border-[#B1B5C3] rounded-[4px] overflow-hidden bg-white h-[48px] w-[115px] shrink-0">
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
              className="w-[35px] h-full flex items-center justify-center font-inter font-[700] text-[16px] text-[#353945] hover:bg-gray-50 border-l border-[#B1B5C3] transition-colors cursor-pointer"
            >
              +
            </button>
          </div>

          <button
            onClick={onBuyNow}
            disabled={!product}
            className="flex-1 bg-[#97400C] text-white border border-[#97400C] rounded-[4px] font-montserrat font-[700] text-[15px] text-center uppercase tracking-wider h-[48px] hover:bg-opacity-95 transition-all duration-300 cursor-pointer min-w-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Mua ngay
          </button>
        </div>

        {/* Row 2: Thêm vào giỏ hàng (Full width 504px) */}
        <button
          onClick={onAddToCart}
          disabled={!product}
          className="w-full border border-[#97400C] text-[#97400C] bg-white rounded-[4px] font-montserrat font-[700] text-[15px] text-center uppercase tracking-wider h-[48px] hover:bg-[#97400C]/5 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Thêm vào giỏ hàng
        </button>
      </div>

      {/* 3. Mobile-only full-bleed Bottom Checkout Bar */}
      <div className="flex lg:hidden items-center justify-between w-[calc(100%+60px)] mx-[-30px] h-[89px] bg-[#97400C] text-white shrink-0">
        {/* Thêm vào giỏ hàng button */}
        <button
          onClick={onAddToCart}
          disabled={!product}
          className="flex-1 flex flex-col items-center justify-center gap-1.5 h-full transition-all hover:bg-black/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-[24px] h-[24px] relative brightness-0 invert">
            <Image src="/icons/cart-2.svg" alt="Cart" fill className="object-contain" sizes="24px" />
          </div>
          <span className="text-[16px] font-[700] leading-[16px] text-white">Thêm vào giỏ hàng</span>
        </button>

        {/* Separator line */}
        <div className="h-[66px] w-[1px] bg-white/40" />

        {/* Mua ngay button */}
        <button
          onClick={onBuyNow}
          disabled={!product}
          className="flex-1 flex flex-col items-center justify-center gap-1.5 h-full transition-all hover:bg-black/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-[24px] h-[24px] relative brightness-0 invert">
            <Image src="/icons/wallet.svg" alt="Wallet" fill className="object-contain" sizes="24px" />
          </div>
          <span className="text-[16px] font-[700] leading-[16px] text-white">Mua ngay</span>
        </button>
      </div>

      {/* Information Accordion - Desktop */}
      <div className="hidden lg:block w-full mt-[30px] border-t border-b border-[#E6E8EC]">
        <button
          onClick={() => setIsInfoExpanded(!isInfoExpanded)}
          className="w-full flex items-center justify-between text-left font-montserrat text-[20px] font-[600] text-black leading-[24px] hover:text-[#97400C] transition-colors cursor-pointer py-[20px]"
        >
          <span>Thông tin sản phẩm</span>
          {isInfoExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>
        {isInfoExpanded && (
          <div className="pb-[20px] font-montserrat text-[15px] text-[#353945] leading-[26px]">
            {product?.category?.name
              ? `Thuộc danh mục ${product.category.name}, chế tác thủ công tinh xảo, thích hợp cho không gian thờ cúng gia đình.`
              : "Đang cập nhật thông tin chi tiết cho sản phẩm này."}
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// MAIN PRODUCT INFO COMPONENT FOR SINGLE PRODUCT
// ==========================================
export default function ProductInfoSingle({ product }) {
  const router = useRouter();
  const addToCart = useCartStore((s) => s.addToCart);
  const [mainQuantity, setMainQuantity] = useState(1);

  const galleryImages = useMemo(() => buildGalleryImages(product), [product]);
  const [mainImage, setMainImage] = useState(galleryImages[0] || "");

  React.useEffect(() => {
    setMainImage(galleryImages[0] || "");
  }, [galleryImages]);

  const categoryName = product?.category?.name || "Sản phẩm";

  const handleBuyNow = async () => {
    if (!product) return;
    const ok = await addToCart(product, mainQuantity);
    if (ok) router.push(ROUTES.CHECKOUT);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    const ok = await addToCart(product, mainQuantity);
    if (ok) {
      toast.success("Đã thêm sản phẩm vào giỏ hàng!");
      setTimeout(() => router.push(ROUTES.CART), 150);
    }
  };

  return (
    <div className="w-full pt-[20px] lg:pt-[50px] lg:pb-[64px]">
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
        <span className="hidden lg:inline">Trang chủ / </span>
        {categoryName} /{" "}
        <span className="text-[#97400C]">{product?.name || "Sản phẩm"}</span>
      </div>

      {!product ? (
        <p className="font-montserrat text-[15px] text-[#909090] py-16 text-center">
          Sản phẩm không khả dụng.
        </p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[62%_1fr] gap-5 lg:gap-[28px] items-start">
          {/* Left Column - Gallery */}
          <ProductGallery
            galleryImages={galleryImages}
            mainImage={mainImage}
            setMainImage={setMainImage}
          />

          {/* Right Column - Purchase Info Section */}
          <div className="flex flex-col font-montserrat">
            <ProductPurchasePanel
              product={product}
              mainQuantity={mainQuantity}
              setMainQuantity={setMainQuantity}
              onBuyNow={handleBuyNow}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>
      )}
    </div>
  );
}
