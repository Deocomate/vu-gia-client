"use client";

import React from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

import thumb1 from "@/assets/images/product-detail/chi-tiet-sp-thumb-1.png";
import thumb2 from "@/assets/images/product-detail/chi-tiet-sp-thumb-2.png";
import thumb3 from "@/assets/images/product-detail/chi-tiet-sp-thumb-3.png";

export default function ProductDetail({ sectionData }) {
  const defaultSections = [
    {
      id: 1,
      title: "Nghệ Thuật Chế Tác Thủ Công",
      description:
        "Từng nét vẽ đắp nổi trên bề mặt gốm sứ Vũ Gia đều được các nghệ nhân Bát Tràng thực hiện hoàn toàn thủ công. Sự tỉ mỉ trong từng đường nét họa tiết Rồng Chầu, Hoa Sen hay Chim Phượng tạo nên khí chất trang nghiêm, tôn kính cho không gian thờ cúng linh thiêng.",
      image: thumb1,
      isImageRight: true,
    },
    {
      id: 2,
      title: "Chất Men Rạn & Men Lam Cổ",
      description:
        "Sản phẩm sử dụng công thức men truyền thống kinh điển của làng nghề Bát Tràng. Được nung luyện ở nhiệt độ cao trên 1.200°C giúp xương gốm đanh chắc, nước men sâu thẫm, bền màu vĩnh cửu cùng thời gian và chịu lực vượt trội.",
      image: thumb2,
      isImageRight: false,
    },
    {
      id: 3,
      title: "Giá Trị Phong Thủy & Tâm Linh",
      description:
        "Mỗi chi tiết hoa văn trên vật phẩm thờ cúng Vũ Gia đều chứa đựng những ý nghĩa phong thủy tốt lành, tụ khí tàng phong, mang lại may mắn, bình an và vượng khí cho gia chủ, thể hiện lòng thành kính hướng về nguồn cội gia tiên.",
      image: thumb3,
      isImageRight: true,
    },
  ];

  const detailSections = sectionData || defaultSections;

  return (
    <div className="w-full pt-[30px] border-t border-[#E6E8EC]">
      {/* Title */}
      <h2 className="font-montserrat text-[#97400C] text-[20px] md:text-[32px] font-[700] leading-[40px] mb-[30px] lg:mb-[40px] tracking-wide">
        Chi tiết sản phẩm
      </h2>

      {/* Grid Sections */}
      <div className="flex flex-col gap-[25px]">
        {detailSections.map((section) => {
          const isDarkBg = section.id === 2;
          return (
            <div
              key={section.id}
              className="grid grid-cols-1 md:grid-cols-2 gap-[25px] w-full"
            >
              {/* Text Card */}
              <div
                className={`flex flex-col justify-center items-center p-8 md:p-12 aspect-square md:aspect-[708/712] w-full h-full ${
                  isDarkBg ? "bg-[#97400C]" : "bg-[#ECDAD1]"
                } ${
                  section.isImageRight
                    ? "order-2 md:order-1"
                    : "order-2 md:order-2"
                }`}
              >
                <h3 className={`font-montserrat text-[24px] md:text-[34px] font-[700] leading-tight md:leading-[40px] text-center mb-5 md:mb-[30px] max-w-[90%] ${
                  isDarkBg ? "text-white" : "text-[#97400C]"
                }`}>
                  {section.title}
                </h3>
                <p className={`font-montserrat text-[15px] md:text-[18px] font-[300] leading-[26px] md:leading-[30px] text-center max-w-[479px] ${
                  isDarkBg ? "text-white/90" : "text-black opacity-90"
                }`}>
                  {section.description}
                </p>
              </div>

              {/* Image Card */}
              <div
                className={`relative aspect-square md:aspect-[708/712] w-full h-full overflow-hidden group ${
                  section.isImageRight
                    ? "order-1 md:order-2"
                    : "order-1 md:order-1"
                }`}
              >
                <Image
                  src={section.image}
                  alt={section.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* View More Button - hidden on mobile, flex on desktop */}
      <div className="hidden md:flex w-full justify-center mt-12">
        <button className="py-2.5 px-5 bg-[#DDAA70]/20 hover:bg-[#DDAA70]/30 active:bg-[#DDAA70]/40 rounded-[5px] flex items-center justify-center gap-2.5 transition-all duration-300 group cursor-pointer border border-transparent hover:border-[#DDAA70]/30 shadow-sm">
          <span className="text-[#97400C] font-montserrat text-[16px] md:text-[18px] font-[700] leading-[16px]">
            Xem thêm
          </span>
          <ChevronRight className="w-5 h-5 text-[#97400C] transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
