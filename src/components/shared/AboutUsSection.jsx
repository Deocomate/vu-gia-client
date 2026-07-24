import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/shared/utils/routes";
import closingThumb from "@/assets/images/home/closing-thumb.png";
import closingThumbMobile from "@/assets/images/home/closing-thumb-mobile.png";

export default function AboutUsSection() {
  return (
    <section className="w-full flex flex-col items-center bg-white overflow-hidden">
      {/* Top Image Banner - Mobile */}
      <div className="relative w-full h-[218px] lg:hidden">
        <Image
          src={closingThumbMobile}
          alt="Xưởng gốm Vũ Gia"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Top Image Banner - Desktop */}
      <div className="relative w-full h-[454px] hidden lg:block">
        <Image
          src={closingThumb}
          alt="Xưởng gốm Vũ Gia"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Content Container */}
      <div className="max-w-[1470px] mx-auto w-full px-[31px] lg:px-[30px] flex flex-col items-center">
        {/* Title */}
        <h2 className="mt-[30px] lg:mt-[60px] text-center text-primary text-[40px] lg:text-[60px] font-amplify font-[400] leading-[35px] lg:leading-[1.2] lg:leading-[40px] px-[20px] md:px-0">
          Khi lò gốm cổ xưa khởi sắc giữa nhịp sống đương đại
        </h2>

        {/* Description */}
        <p className="mt-[30px] lg:mt-[48px] max-w-[370px] lg:max-w-[1071px] text-justify lg:text-center text-[#383838] font-montserrat text-[14px] lg:text-[20px] font-[400] leading-[24px] lg:leading-[34px]">
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
          className="mt-[26px] lg:mt-[46px] mb-[60px] lg:mb-[99px] inline-flex items-center justify-center w-[128px] lg:min-w-[228px] h-[35px] lg:h-[43px] lg:px-6 bg-primary rounded-[10px] text-white font-montserrat text-[16px] lg:text-[18px] xl:text-[24px] font-[700] leading-[24px] hover:bg-opacity-90 transition-colors"
        >
          Về chúng tôi
        </Link>
      </div>
    </section>
  );
}
