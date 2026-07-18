"use client";

import React from "react";
import Image from "next/image";
import CustomerServiceLayout from "@/components/customer-service/CustomerServiceLayout";
import { ROUTES } from "@/utils/routes";
import returnPolicyPng from "@/assets/images/customer-services/chinh-sach-doi-tra.png";
import returnPolicyMobilePng from "@/assets/images/customer-services/chinh-sach-doi-tra-mobile.png";
import returnPolicyLastPng from "@/assets/images/customer-services/chinh-sach-doi-tra-last.png";

export default function ReturnPolicyView({ page } = {}) {
  const breadcrumbs = [
    { name: "Trang chủ", href: ROUTES.HOME },
    { name: "Dịch vụ khách hàng", href: null },
    { name: "Chính sách đổi trả", href: null },
  ];

  return (
    <CustomerServiceLayout breadcrumbs={breadcrumbs}>
      {/* Title (heroTitle from `Page` key "return-policy" overrides the
          static default when the admin sets one; body PNG content below
          stays static) */}
      <h1 className="font-arima text-[#2E2F2A] text-[28px] md:text-[36px] font-[400] leading-[40px] md:leading-[48px] mb-6">
        {page?.heroTitle || "Chính sách đổi trả"}
      </h1>

      {page?.heroDes && (
        <p className="font-montserrat text-[#97400C] text-[16px] font-[500] leading-[26px] mb-5">
          {page.heroDes}
        </p>
      )}

      {/* PNG Unified Content */}
      <div className="w-full mt-4">
        {/* Desktop Image */}
        <div className="hidden md:block overflow-hidden">
          <Image
            src={returnPolicyPng}
            alt="Chính sách đổi trả"
            className="w-full h-auto object-contain"
            priority
          />
        </div>

        {/* Mobile Images */}
        <div className="md:hidden flex flex-col">
          <div className="w-full overflow-hidden">
            <Image
              src={returnPolicyMobilePng}
              alt="Chính sách đổi trả"
              className="w-full h-auto object-contain"
              priority
            />
          </div>
          <div className="w-full overflow-x-auto scrollbar-thin">
            <Image
              src={returnPolicyLastPng}
              alt="Bảng chính sách đổi trả"
              height={300}
              className="w-auto h-[260px] max-w-none object-contain"
            />
          </div>
        </div>
      </div>
    </CustomerServiceLayout>
  );
}
