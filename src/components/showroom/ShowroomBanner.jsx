import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/utils/routes";
import showroomHeaderBanner from "@/assets/images/showroom/showroom-header-banner.png";

export default function ShowroomBanner() {
  return (
    <section className="relative w-full h-[150px] md:h-[207px] bg-[#2E2F2A] overflow-hidden flex flex-col justify-center items-center">
      {/* Background Image */}
      <Image
        src={showroomHeaderBanner}
        alt="Showroom Gốm Sứ Vũ Gia"
        fill
        className="object-cover z-0"
        priority
      />
      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center gap-[10px] text-[#FFFAF3] px-4 select-none">
        {/* Title */}
        <h1 className="font-archivo text-[24px] md:text-[30px] font-bold uppercase tracking-wider leading-none">
          Showroom
        </h1>

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-[7px] text-[13px] md:text-[14px] font-normal leading-normal">
          <Link href={ROUTES.HOME} className="hover:underline transition-all opacity-85 hover:opacity-100">
            Trang chủ
          </Link>
          <div className="w-[8px] h-[8px] flex items-center justify-center">
            <svg
              width="6"
              height="10"
              viewBox="0 0 6 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="opacity-70"
            >
              <path
                d="M1 9L5 5L1 1"
                stroke="white"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="opacity-70">Showroom</span>
        </nav>
      </div>
    </section>
  );
}
