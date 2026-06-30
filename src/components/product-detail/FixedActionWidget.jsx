"use client";

import Link from "next/link";
import { ROUTES } from "@/utils/routes";

export default function FixedActionWidget() {
  return (
    <div className="fixed right-0 top-[368px] z-50 hidden lg:block">
      <div className="w-[186px] h-[167px] bg-white rounded-l-[20px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] pl-[25px] pr-[14px] pt-[23px] pb-[18px]">
        <p className="text-[13px] font-montserrat font-[700] text-black leading-[18px]">
          Chưa tìm thấy mẫu đồ thờ mong muốn ?
        </p>
        <p className="text-[12px] font-montserrat font-[400] text-[#606060] leading-[16px] mt-[10px]">
          Tự tay tạo mẫu đồ thờ phù hợp với yêu cầu của bạn
        </p>
        <Link
          href={ROUTES.ALTAR_CUSTOMIZER}
          className="flex items-center justify-center gap-[8px] bg-[#97400C] rounded-[10px] w-[114px] h-[19px] mt-[10px] mx-auto">
          <span className="text-white text-[12px] font-montserrat font-[600] leading-[12px]">
            Tạo bàn thờ
          </span>
          <svg
            width="9"
            height="9"
            viewBox="0 0 9 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0"
          >
            <line x1="0" y1="4.5" x2="6" y2="4.5" stroke="white" strokeWidth="1.03" />
            <path d="M3.5 1L6.5 4.5L3.5 8" stroke="white" strokeWidth="1.03" fill="none" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
