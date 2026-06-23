"use client";

import React from "react";

export default function OrderStatusTabs({
  activeTab = "all",
  onTabChange = () => {},
  counts = {
    all: 10,
    unpaid: 0,
    processing: 1,
    shipping: 1,
    completed: 1,
    cancelled: 1,
    returned: 0,
  },
}) {
  const tabs = [
    { id: "all", name: "Tất cả" },
    { id: "unpaid", name: "Chờ thanh toán" },
    { id: "processing", name: "Đang xử lý" },
    { id: "shipping", name: "Đang giao" },
    { id: "completed", name: "Hoàn tất" },
    { id: "cancelled", name: "Bị hủy" },
    { id: "returned", name: "Đổi trả" },
  ];

  return (
    <div className="w-full border-b border-neutral-200 overflow-x-auto scrollbar-none mb-6">
      <div className="flex min-w-max md:min-w-0 md:grid md:grid-cols-7 gap-4 md:gap-0">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const count = counts[tab.id] ?? 0;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center pb-3 pt-2 px-3 border-b-2 transition-all duration-300 relative focus:outline-none cursor-pointer ${
                isActive
                  ? "border-[#97400C]"
                  : "border-transparent hover:opacity-85"
              }`}
            >
              {/* Count above */}
              <span
                className={`text-[16px] font-archivo font-[600] leading-[20px] transition-all ${
                  isActive ? "text-[#97400C]" : "text-[#2E2F2A]"
                }`}
              >
                {count}
              </span>
              {/* Name below */}
              <span
                className={`text-[16px] font-montserrat font-[600] leading-[22px] mt-1 text-center whitespace-nowrap transition-all ${
                  isActive ? "text-[#97400C]" : "text-[#2E2F2A]"
                }`}
              >
                {tab.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
