"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import productDetailBigThumb from "@/assets/images/product-detail/product-detail-big-thumb.png";
import productDetailThumbnail from "@/assets/images/product-detail/product-detail-thumbnail.png";
import productCardImage1 from "@/assets/images/product-detail/product-card-image-1.png";
import productCardImage2 from "@/assets/images/product-detail/product-card-image-2.png";
import productCardImage3 from "@/assets/images/product-detail/product-card-image-3.png";

export default function ProductSpecifications() {
  const [currentIdx, setCurrentIdx] = useState(0);

  const sliderImages = [
    productDetailBigThumb,
    productDetailThumbnail,
    productCardImage1,
    productCardImage2,
    productCardImage3,
  ];

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev === 0 ? sliderImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev === sliderImages.length - 1 ? 0 : prev + 1));
  };

  const specs = [
    {
      stt: 1,
      name: "Bát hương",
      quantity: "3",
      unit: "Chiếc",
      usage: "Dùng cắm hương, thờ Thần linh - Gia tiên",
    },
    {
      stt: 2,
      name: "Bát thờ",
      quantity: "10",
      unit: "Chiếc",
      usage: "Dùng dâng cơm trắng và lễ vật",
      hideStt: true,
    },
    {
      stt: 3,
      name: "Chóe thờ",
      quantity: "3",
      unit: "Chiếc",
      usage: "Dùng đựng gạo, muối và nước",
    },
    {
      stt: 4,
      name: "Bát sâm",
      quantity: "1 - 2",
      unit: "Chiếc",
      usage: "Dùng dâng nước, trà hoặc sâm",
      hideStt: true,
    },
    {
      stt: 5,
      name: "Bộ kỷ chén",
      quantity: "3 hoặc 5",
      unit: "Chén",
      usage: "Dùng đựng nước sạch hoặc rượu",
    },
    {
      stt: 6,
      name: "Nậm rượu",
      quantity: "1 - 2",
      unit: "Chiếc",
      usage: "Dùng đựng và dâng rượu cúng",
    },
    {
      stt: 7,
      name: "Bộ ấm chén thờ\n(1 ấm - 5 chén)",
      quantity: "1 - 2",
      unit: "Bộ",
      usage: "Dùng pha và dâng trà lên bàn thờ",
    },
    {
      stt: 8,
      name: "Ống cắm hương",
      quantity: "1",
      unit: "Chiếc",
      usage: "Dùng cắm nhang chưa sử dụng",
    },
    {
      stt: 9,
      name: "Mâm bồng",
      quantity: "3",
      unit: "Chiếc",
      usage: (
        <div className="flex flex-col gap-1 text-left">
          <span>Dùng bày hoa quả và lễ vật</span>
          <div className="flex items-start gap-1.5 pl-4">
            <span className="text-[#101010] flex-shrink-0">•</span>
            <span>
              Thông thường 1 chiếc to dùng để bày mâm ngũ quả vào ngày lễ
            </span>
          </div>
          <div className="flex items-start gap-1.5 pl-4">
            <span className="text-[#101010] flex-shrink-0">•</span>
            <span>
              Ngày thường có thể bày 1 mâm bồng bé ở giữa hoặc vào giỗ lễ bày 2
              mâm bé hai bên
            </span>
          </div>
        </div>
      ),
    },
    {
      stt: 10,
      name: "Lọ hoa",
      quantity: "2",
      unit: "Chiếc",
      usage: "Dùng cắm hoa trang trí bàn thờ",
    },
    {
      stt: 11,
      name: "Đèn thờ",
      quantity: "2",
      unit: "Chiếc",
      usage: "Dùng thắp sáng và tạo sự trang nghiêm",
    },
    {
      stt: 12,
      name: "Chân nến",
      quantity: "2",
      unit: "Chiếc",
      usage: "Dùng thắp sáng và tạo sự trang nghiêm",
    },
  ];

  return (
    <div className="w-full mt-8">
      {/* Full-width Image Slider - height 1280px on desktop, naturally spans full screen width, no borders, no rounding */}
      <div className="w-full relative h-[300px] md:h-[600px] lg:h-[1280px] overflow-hidden bg-gray-100 mb-12 group">
        <div className="relative w-full h-full">
          <Image
            src={sliderImages[currentIdx]}
            alt={`Slide ${currentIdx + 1}`}
            fill
            priority
            className="object-cover transition-all duration-700 ease-in-out"
          />

          {/* Left Arrow - Premium Glassmorphism */}
          <button
            onClick={handlePrev}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 border border-white/30 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 cursor-pointer shadow-lg opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow - Premium Glassmorphism */}
          <button
            onClick={handleNext}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 border border-white/30 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 cursor-pointer shadow-lg opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
            {sliderImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIdx(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIdx === idx
                    ? "w-8 bg-white"
                    : "w-2.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Container (Title & Table) - Center aligned matching page grid layout */}
      <div className="max-w-[1470px] mx-auto px-[20px] lg:px-[60px] pb-8">
        {/* Title */}
        <h2 className="font-montserrat text-[#97400C] text-[28px] font-[700] leading-[40px] mb-[40px] uppercase tracking-wide">
          Công năng sản phẩm
        </h2>

        {/* Responsive Table Container */}
        <div className="w-full overflow-x-auto lg:px-[100px]">
          <table className="w-full min-w-[1000px] lg:min-w-0 border-collapse bg-white font-montserrat text-[18px] text-[#101010] text-left">
            <thead>
              <tr className="bg-[#F2F3F5] border-b border-[#E6E8EC]">
                <th className="py-[21px] pl-6 pr-2 font-montserrat font-[700] text-[18px] text-[#2E2F2A] uppercase w-[87px] text-center">
                  STT
                </th>
                <th className="py-[21px] pl-[64px] pr-4 font-montserrat font-[700] text-[18px] text-[#2E2F2A] uppercase w-[297px] text-left">
                  Tên vật phẩm
                </th>
                <th className="py-[21px] px-4 font-montserrat font-[700] text-[18px] text-[#2E2F2A] uppercase w-[188px] text-center">
                  Số lượng
                </th>
                <th className="py-[21px] px-4 font-montserrat font-[700] text-[18px] text-[#2E2F2A] uppercase w-[197px] text-center">
                  ĐVT
                </th>
                <th className="py-[21px] pl-[23px] pr-6 font-montserrat font-[700] text-[18px] text-[#2E2F2A] uppercase w-[471px] text-left">
                  Công dụng
                </th>
              </tr>
            </thead>
            <tbody>
              {specs.map((item, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-[#E6E8EC] hover:bg-[#F2F3F5]/30 transition-colors ${
                    idx % 2 === 1 ? "bg-[#F2F3F5]" : "bg-white"
                  }`}
                >
                  <td className="py-[21px] pl-6 pr-2 font-[400] text-[18px] text-[#101010] text-center">
                    {item.hideStt ? "" : item.stt}
                  </td>
                  <td className="py-[21px] pl-[64px] pr-4 font-[600] text-[18px] text-[#101010] text-left whitespace-pre-line">
                    {item.name}
                  </td>
                  <td className="py-[21px] px-4 font-[400] text-[18px] text-[#101010] text-center">
                    {item.quantity}
                  </td>
                  <td className="py-[21px] px-4 font-[400] text-[18px] text-[#101010] text-center">
                    {item.unit}
                  </td>
                  <td className="py-[21px] pl-[23px] pr-6 font-[400] text-[18px] text-[#101010] text-left leading-[25px] whitespace-pre-line text-justify">
                    {item.usage}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
