"use client";

import React from "react";
import OrderItemRow from "./OrderItemRow";

export default function OrderCard({
  order,
  onCancelOrder = () => {},
  onContactSupport = () => {},
}) {
  if (!order) return null;

  const formatPrice = (price) => {
    if (typeof price === "number") {
      return price.toLocaleString("vi-VN") + " đ";
    }
    return price;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "unpaid":
        return {
          label: "Chờ thanh toán",
          classes: "bg-[#FEF0C7] text-[#B54708]",
        };
      case "processing":
        return {
          label: "Đang xử lý",
          classes: "bg-[#D1EFFF] text-[#2F80ED]",
        };
      case "shipping":
        return {
          label: "Đang giao",
          classes: "bg-[#E0F2FE] text-[#0369A1]",
        };
      case "completed":
        return {
          label: "Hoàn tất",
          classes: "bg-[#D1FADF] text-[#027A48]",
        };
      case "cancelled":
        return {
          label: "Bị hủy",
          classes: "bg-[#FEE4E2] text-[#D92D20]",
        };
      case "returned":
        return {
          label: "Đổi trả",
          classes: "bg-[#F9F5FF] text-[#6941C6]",
        };
      default:
        return {
          label: status,
          classes: "bg-neutral-100 text-neutral-700",
        };
    }
  };

  const badge = getStatusBadge(order.status);
  const totalQuantity = order.items.reduce((sum, item) => sum + (item.quantity || 0), 0);

  // Can cancel order only if it is unpaid or processing
  const canCancel = order.status === "unpaid" || order.status === "processing";

  return (
    <div 
      className="w-full rounded-[6px] shadow-[0px_4px_4px_rgba(0,0,0,0.10)] px-4 py-4 md:px-[40px] md:py-[28px] mb-6 font-montserrat hover:shadow-md transition-all duration-300"
      style={{
        border: "1px solid transparent",
        backgroundImage: "linear-gradient(white, white), linear-gradient(to bottom, #C76E00, rgba(199, 110, 0, 0))",
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
      }}
    >
      {/* Header section */}
      <div className="flex flex-row items-center justify-between pb-3 border-b border-neutral-100 gap-3">
        <div className="flex items-center gap-3">
          <span className="text-[#C76E00] text-[14px] md:text-[16px] font-[600] md:font-[500] leading-[20px] md:leading-normal">
            #{order.id}
          </span>
          <span
            className={`w-[85px] h-[20px] md:w-[105px] md:h-[24px] rounded-[46px] md:rounded-[14px] text-[10px] md:text-[14px] font-[700] font-archivo md:font-montserrat uppercase inline-flex items-center justify-center ${badge.classes}`}
          >
            {badge.label}
          </span>
        </div>
        <span className="text-[#2E2F2A]/60 text-[12px] md:text-[14px] font-[600] leading-[18px] md:leading-[40px] text-right">
          {order.date}
        </span>
      </div>

      {/* Product List */}
      <div className="py-4 flex flex-col gap-4">
        {order.items.map((item, idx) => (
          <OrderItemRow key={item.id || idx} item={item} />
        ))}
      </div>

      {/* Divider */}
      <div className="w-full h-[1px] bg-neutral-100 my-1" />

      {/* Footer section */}
      <div className="flex flex-col pt-4 font-montserrat">
        {/* Mobile-only Quantity and Total Price (Quantity above Total Price) */}
        <div className="flex flex-col md:hidden gap-[11px] mb-[21px] pl-[5px]">
          <span className="text-[#2E2F2A] font-[600] text-[14px] leading-[20px]">
            Số lượng: {totalQuantity}
          </span>
          <div className="flex justify-between items-center w-full">
            <span className="text-[#C76E00] text-[14px] font-[600] leading-[20px]">
              Tổng tiền:
            </span>
            <span className="text-[#2E2F2A] text-[15px] font-[700] leading-[20px] text-right">
              {formatPrice(order.totalAmount)}
            </span>
          </div>
        </div>

        {/* Desktop-only Total Price display */}
        <div className="hidden md:flex justify-end items-center mb-[20px]">
          <span className="text-[#C76E00] text-[16px] font-[600] mr-[4px] leading-[20px]">
            Tổng tiền:
          </span>
          <span className="text-[#2E2F2A] text-[16px] font-[600] leading-[20px]">
            {formatPrice(order.totalAmount)}
          </span>
        </div>

        {/* Action Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Desktop-only Quantity display */}
          <span className="hidden md:inline text-[#2E2F2A] font-[600] text-[16px] leading-[20px]">
            Số lượng: {totalQuantity}
          </span>
          <div className="flex flex-row justify-between md:justify-end gap-[9px] md:gap-[15px] w-full md:w-auto">
            {canCancel && (
              <button
                onClick={() => onCancelOrder(order.id)}
                className="flex-1 md:flex-none w-[163px] md:w-[150px] h-[36px] md:h-[39px] flex items-center justify-center border border-[#C76E00] text-[#C76E00] hover:bg-neutral-50 bg-white rounded-[6px] font-[700] text-[14px] md:text-[15px] leading-[20px] transition duration-200 cursor-pointer"
              >
                Hủy đơn hàng
              </button>
            )}
            <button
              onClick={() => onContactSupport(order.id)}
              className="flex-1 md:flex-none w-[163px] md:w-[150px] h-[36px] md:h-[39px] flex items-center justify-center bg-[#C76E00] hover:bg-[#a65c00] text-white rounded-[6px] font-[700] text-[14px] md:text-[15px] leading-[20px] transition duration-200 cursor-pointer"
            >
              Liên hệ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

