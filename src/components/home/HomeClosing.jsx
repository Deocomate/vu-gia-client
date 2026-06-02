// src/components/home/HomeClosing.jsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/utils/routes";
import closingThumb from "@/assets/images/home/closing-thumb.png";

export default function HomeClosing() {
  return (
    <section className="w-full flex flex-col items-center bg-white overflow-hidden">
      {/* Top Image Banner */}
      <div className="relative w-full h-[250px] lg:h-[454px]">
        <Image
          src={closingThumb}
          alt="Xưởng gốm Vũ Gia"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Content Container */}
      <div className="max-w-[1470px] mx-auto w-full px-[20px] lg:px-[30px] flex flex-col items-center">
        {/* Title */}
        <h2 className="mt-[40px] lg:mt-[60px] text-center text-primary text-[40px] lg:text-[60px] font-amplify font-[400] leading-[1.2] lg:leading-[40px]">
          Khi lò gốm cổ xưa khởi sắc giữa nhịp sống đương đại
        </h2>

        {/* Description */}
        <p className="mt-[30px] lg:mt-[48px] max-w-[1071px] text-center text-[#383838] font-montserrat text-[16px] lg:text-[20px] font-[400] leading-[1.6] lg:leading-[34px]">
          Tọa lạc giữa lòng Bát Tràng – mảnh đất tinh hoa với nghìn năm lửa đỏ,
          Gốm sứ Vũ Gia không chỉ là một thương hiệu, mà là nhịp cầu nối liền di
          sản rực rỡ của tiền nhân với những khoảng lặng tinh tế bên bàn trà
          hiện đại. Qua đôi bàn tay tài hoa của người nghệ nhân và gu thẩm mỹ
          tinh tuyển, mỗi tác phẩm tại Vũ Gia là một kết tinh của sự tĩnh tại –
          một nét an nhiên vỗ về tâm hồn giữa thế gian đầy biến động.
        </p>

        {/* Button */}
        <Link
          href={ROUTES.ABOUT}
          className="mt-[30px] lg:mt-[46px] mb-[60px] lg:mb-[99px] inline-flex items-center justify-center min-w-[228px] h-[43px] px-6 bg-primary rounded-[10px] text-white font-montserrat text-[18px] lg:text-[24px] font-[700] leading-[24px] hover:bg-opacity-90 transition-colors"
        >
          Về chúng tôi
        </Link>
      </div>
    </section>
  );
}
