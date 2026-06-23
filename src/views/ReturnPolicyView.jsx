"use client";

import React from "react";
import Image from "next/image";
import CustomerServiceLayout from "@/components/customer-service/CustomerServiceLayout";
import { ROUTES } from "@/utils/routes";
import returnPolicyPng from "@/assets/images/customer-services/chinh-sach-doi-tra.png";

export default function ReturnPolicyView() {
  const breadcrumbs = [
    { name: "Trang chủ", href: ROUTES.HOME },
    { name: "Dịch vụ khách hàng", href: null },
    { name: "Chính sách đổi trả", href: null },
  ];

  return (
    <CustomerServiceLayout breadcrumbs={breadcrumbs}>
      {/* Title */}
      <h1 className="font-arima text-[#2E2F2A] text-[28px] md:text-[36px] font-[400] leading-[40px] md:leading-[48px] mb-6">
        Chính sách đổi trả
      </h1>

      {/* PNG Unified Content */}
      <div className="w-full mt-4 overflow-hidden">
        <Image
          src={returnPolicyPng}
          alt="Chính sách đổi trả"
          className="w-full h-auto object-contain"
          priority
        />
      </div>
    </CustomerServiceLayout>
  );
}
