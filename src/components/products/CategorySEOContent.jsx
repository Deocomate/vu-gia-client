"use client";

import React, { useState } from "react";
import Image from "next/image";
import productContentImageThumb from "@/assets/images/products/product-content-image-thumb.png";

export default function CategorySEOContent() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="py-12 border-t border-b border-[#97400D] mt-12">
      <div className="max-w-[1438px] mx-auto text-left relative font-montserrat">
        
        {/* Intro italic paragraph */}
        <p className="font-montserrat text-[20px] font-[400] italic text-black leading-[28px] break-words mb-8">
          Tựa như một ống kính chuyên nghiệp trong thế giới nghệ thuật trà đạo.&nbsp;
          <span className="font-semibold font-montserrat">Ấm bạc đun nước</span>&nbsp;biết cách bắt trọn mọi tinh túy từ từng lá trà để tạo ra những giọt trà thơm ngon, tròn đầy hương vị. Hãy cùng TITA Art bước vào hành trình khám phá những giá trị thực của chiếc ấm đun bạc trên bàn trà.
        </p>

        {/* Collapsible wrapper */}
        <div 
          className={`relative transition-all duration-500 overflow-hidden ${
            isExpanded ? "max-h-[2000px]" : "max-h-[380px]"
          }`}
        >
          {/* Section Heading */}
          <h2 className="font-montserrat text-[32px] font-[600] text-black leading-[24px] break-words mb-6">
            1. Đặc điểm của ấm bạc đun nước
          </h2>

          {/* Paragraph 2 */}
          <p className="font-montserrat text-[20px] font-[400] text-black leading-[28px] break-words mb-6">
            <span className="font-semibold font-montserrat">Ấm bạc đun nước</span>&nbsp;không chỉ là một loại&nbsp;
            <span className="font-semibold font-montserrat">trà cụ</span>&nbsp;mà còn là một tác phẩm nghệ thuật. Với chất liệu bạc tinh túy, ấm bạc đun nước không chỉ thể hiện sự lịch lãm và thanh lịch, mà còn mang đến khả năng giữ nhiệt vượt trội. Bạc làm cho nhiệt lượng được truyền qua nước một cách nhanh chóng và hiệu quả, giữ cho nước trong ấm luôn ở nhiệt độ lý tưởng để tráng chén trà mà không làm mất đi hương vị tinh túy.
          </p>

          {/* Paragraph 3 */}
          <p className="font-montserrat text-[20px] font-[400] text-black leading-[28px] break-words mb-8">
            Được chế tác bởi các nghệ nhân tài ba,&nbsp;
            <span className="font-semibold font-montserrat">ấm bạc đun nước</span>&nbsp;pha trà mang trong mình nét đẹp đa dạng văn hóa và phong cách. Từ các mẫu truyền thống tinh tế đến các thiết kế hiện đại sáng tạo, mỗi chiếc ấm bạc đều là một tác phẩm mang đến vẻ đẹp đậm chất nghệ thuật và sự tỉ mỉ trong từng chi tiết.
          </p>

          {/* Image */}
          <div className="relative w-full max-w-[800px] h-[247px] mx-auto rounded-[8px] overflow-hidden mb-6">
            <Image
              src={productContentImageThumb}
              alt="Ấm bạc đun nước"
              fill
              className="object-cover"
            />
          </div>

          {/* Gradient overlay for collapse effect */}
          {!isExpanded && (
            <div 
              className="absolute bottom-0 left-0 right-0 h-[248px] pointer-events-none" 
              style={{
                background: "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #ffffff 100%)"
              }}
            />
          )}
        </div>

        {/* Expand/Collapse Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-[207px] h-[49px] flex items-center justify-center border border-[#97400D] text-[#97400D] hover:bg-[#97400D] hover:text-white transition-all duration-300 font-montserrat font-[700] text-[24px] leading-[24px] rounded-[8px] uppercase cursor-pointer"
          >
            {isExpanded ? "THU GỌN" : "XEM THÊM"}
          </button>
        </div>
      </div>
    </div>
  );
}
