"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import productDetailThumbnail from "@/assets/images/product-detail/product-detail-thumbnail.png";
import productCardImage1 from "@/assets/images/product-detail/product-card-image-1.png";
import productCardImage2 from "@/assets/images/product-detail/product-card-image-2.png";
import productCardImage3 from "@/assets/images/product-detail/product-card-image-3.png";

// ==========================================
// 1. PRODUCT GALLERY COMPONENT
// ==========================================
function ProductGallery({ galleryImages, mainImage, setMainImage }) {
  return (
    <div className="flex flex-col-reverse md:flex-row gap-[15px]">
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
              />
            </button>
          ))}
        </div>
      </div>

      {/* Main Display Image - height 601px, no rounded, no border */}
      <div className="relative w-full aspect-[831/601] lg:h-[601px] lg:aspect-auto overflow-hidden bg-gray-100 flex-1">
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
  );
}

// ==========================================
// 2. PRODUCT PURCHASE PANEL COMPONENT
// ==========================================
function ProductPurchasePanel({ mainQuantity, setMainQuantity, onBuyNow, onAddToCart }) {
  return (
    <div className="flex flex-col font-montserrat">
      {/* Title */}
      <h1 className="text-[#141416] text-[26px] lg:text-[32px] font-[600] leading-[45px] mb-[20px] font-montserrat">
        Bộ đồ thờ Phật vẽ hoa sen men rạn cổ đơn giản DT026
      </h1>

      {/* SKU & Sold Status */}
      <div className="flex items-center justify-between mb-[20px]">
        <span className="text-[#A0A0A0] text-[18px] font-[600] leading-[24px]">
          MSP: VG001
        </span>
        <div className="flex items-center gap-[6px]">
          <div className="w-[16px] h-[16px] relative">
            <Image
              src="/images/home/green-round-check.png"
              alt="Check"
              width={16}
              height={16}
              className="object-contain"
            />
          </div>
          <span className="text-[#67A865] text-[18px] font-[700] leading-[12px]">
            Đã bán: 12
          </span>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-t border-[#E6E8EC] mb-[21px]" />

      {/* Price Block */}
      <div className="flex items-center gap-4 mb-[15px]">
        <span className="text-[#97400C] text-[32px] font-[700] leading-[40px]">
          2.000.000đ
        </span>
        <span className="text-[#838383] text-[18px] font-[400] line-through leading-[24px]">
          2.500.000đ
        </span>
        <span className="bg-[#97400C] text-white text-[12px] font-[700] uppercase leading-[12px] px-3 py-1 rounded-[4px]">
          Tiết kiệm 30%
        </span>
      </div>

      {/* Quantity Selector & Main Cart Actions */}
      <div className="flex items-center gap-[15px] mb-[30px] w-full">
        {/* Custom style matching the vertical line layout | - | 1 | + | - narrower */}
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
          className="w-full flex items-center justify-between text-left font-montserrat text-[20px] font-[600] text-black leading-[24px] hover:text-[#97400C] transition-colors cursor-pointer py-[20px]"
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
                />
              </div>

              {/* Item details */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-[#141416] text-[18px] font-[600] leading-snug font-montserrat">
                    {item.name}
                  </h4>
                  <div className="text-[#A0A0A0] text-[14px] font-[500] mt-[2px] font-montserrat">
                    {item.sku}
                  </div>
                </div>

                {/* Price Row: space of 5px below the Title/SKU */}
                <div className="mt-[5px]">
                  <div className="flex items-center gap-[40px]">
                    <span className="text-[#97400C] text-[18px] font-[700] font-montserrat">
                      {item.salePrice}
                    </span>
                    <span className="text-[#838383] text-[18px] font-[400] line-through font-montserrat">
                      {item.originalPrice}
                    </span>
                  </div>

                  {/* Sub item quantity selector: 24px gap from Price Row */}
                  <div className="mt-[24px] flex items-center border border-[#E6E8EC] rounded-[8px] overflow-hidden bg-white h-[36px] w-[100px]">
                    <button
                      onClick={() => updateSubItemQuantity(item.id, -1)}
                      className="w-[30px] h-full flex items-center justify-center font-inter font-[700] text-[14px] text-[#353945] hover:bg-gray-50 border-r border-[#E6E8EC] transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-montserrat font-[600] text-[14px] text-[#353945] select-none">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateSubItemQuantity(item.id, 1)}
                      className="w-[30px] h-full flex items-center justify-center font-inter font-[700] text-[14px] text-[#353945] hover:bg-gray-50 border-l border-[#E6E8EC] transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Checkout buttons: 25px space above, 50px space below */}
          <div className="flex items-center gap-4 mt-[25px] mb-[50px]">
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
        </div>
      )}
    </div>
  );
}

// ==========================================
// MAIN PRODUCT INFO COMPONENT
// ==========================================
export default function ProductInfo() {
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
    console.log("Buy now pressed");
  };

  const handleAddToCart = () => {
    console.log("Add to cart pressed");
  };

  return (
    <div className="w-full py-8">
      {/* Breadcrumb path */}
      <div className="mb-6 font-montserrat text-[16px] font-[700] text-[#383838] uppercase leading-[24px] tracking-wide">
        Trang chủ / Bộ đồ thờ /{" "}
        <span className="text-[#97400C]">Bộ hút lộc mạ vàng</span>
      </div>

      {/* Main product wrapper - 62% for left gallery and remainder for right column with 28px gap */}
      <div className="grid grid-cols-1 lg:grid-cols-[62%_1fr] gap-8 lg:gap-[28px] items-start">
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
