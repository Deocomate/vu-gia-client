"use client";

import React from "react";
import Image from "next/image";
import ContactForm from "@/features/storefront/contact/contact-form";

import heroBg from "@/assets/images/gallery/hero-bg.jpg";
import vaseImage from "@/assets/images/lien-he/lien-he-main-thumbnail.png";

export default function ContactView() {
  return (
    <div className="w-full bg-[#FAF7F7]">
      {/* Header Banner */}
      <section className="relative w-full h-[182px] lg:h-[320px] overflow-hidden flex flex-col justify-center items-center">
        {/* Background Image */}
        <Image
          src={heroBg}
          alt="Gốm Sứ Vũ Gia"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Dark Screen Overlay (49% as per Figma context) */}
        <div className="absolute inset-0 bg-black/[0.49] z-10" />
        {/* Breadcrumbs */}
        <div className="relative z-20 text-center text-white px-4 select-none">
          <h1 className="font-montserrat text-[20px] md:text-[24px] font-bold uppercase tracking-widest leading-none">
            Trang chủ / Liên hệ
          </h1>
        </div>
      </section>

      {/* Main Grid Content Container */}
      <section className="max-w-[1440px] mx-auto px-[31px] lg:px-0 pt-[48px] pb-[70px] lg:pt-[114px] lg:pb-[120px] flex flex-col lg:flex-row items-stretch justify-between gap-12 lg:gap-[146px]">
        {/* Left Column: Form & Info */}
        <div className="w-full lg:w-[588px] flex-shrink-0 flex flex-col justify-between">
          <div className="flex flex-col">
            {/* Main Title */}
            <h2 className="font-montserrat text-[#97400C] text-[24px] font-[700] lg:font-[600] leading-[32px] mb-5 tracking-wide">
              <span className="lg:hidden">Gốm Vũ Gia</span>
              <span className="hidden lg:inline">Gốm Vũ Gia - Thanh Hai Co., LTD</span>
            </h2>

            {/* Subtitle 1: HQ & Showroom */}
            <div className="flex flex-col gap-[5px] mb-[11px]">
              <span className="font-montserrat text-[#383838] text-[16px] font-semibold leading-[24px]">
                TRỤ SỞ CHÍNH & SHOWROOM 1
              </span>
              <div className="w-[25px] h-[3px] bg-[#383838]"></div>
            </div>

            {/* Address Info */}
            <p className="font-montserrat text-[#383838] text-[16px] font-normal leading-[26px] mb-[30px]">
              Địa chỉ: Số 18 Giang Cao, Bát Tràng, Gia Lâm, Hà Nội
              <br />
              <span className="lg:hidden">Hotline: 091 7777 247</span>
              <span className="hidden lg:inline">Điện thoại: 091 7777 247</span>
            </p>

            {/* Subtitle 2: Instruction */}
            <div className="flex flex-col gap-[5px] mb-[34px] lg:mb-[20px]">
              <span className="font-montserrat text-[#383838] text-[16px] font-semibold leading-[24px]">
                Quý khách vui lòng gửi thông tin liên hệ theo form sau :
              </span>
              <div className="w-[25px] h-[3px] bg-[#383838]"></div>
            </div>

            {/* Form Action */}
            <ContactForm />
          </div>
        </div>

        {/* Right Column: Vase Image */}
        <div className="hidden lg:block w-full lg:w-[708px] lg:flex-shrink-0 relative h-[450px] lg:h-[763px] rounded-[8px] overflow-hidden shadow-md">
          <Image
            src={vaseImage}
            alt="Gốm sứ nghệ thuật Vũ Gia"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 708px"
          />
        </div>
      </section>
    </div>
  );
}
