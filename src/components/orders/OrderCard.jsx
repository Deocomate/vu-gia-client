"use client";

import React from "react";
import Link from "next/link";
import OrderItemRow from "./OrderItemRow";
import OrderStatusBadge from "./OrderStatusBadge";
import { ROUTES } from "@/utils/routes";

// Matches BE-3's cancellable-status rule exactly (ORDER_API.md): only an
// order still `PENDING_PAYMENT` or `PROCESSING` may be self-cancelled.
const CANCELLABLE_STATUSES = ["PENDING_PAYMENT", "PROCESSING"];

/** Renders one `OrderResponse` row in the customer's order list. */
export default function OrderCard({
  order,
  onCancelOrder = () => {},
  onContactSupport = () => {},
}) {
  if (!order) return null;

  const formatPrice = (price) => `${(Number(price) || 0).toLocaleString("vi-VN")} đ`;
  const formatDate = (value) => (value ? new Date(value).toLocaleString("vi-VN") : "—");

  const items = order.items || [];
  const totalQuantity = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const canCancel = CANCELLABLE_STATUSES.includes(order.status);

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
          <Link
            href={ROUTES.ORDER_DETAIL(order.id)}
            className="text-[#C76E00] text-[14px] md:text-[16px] font-[600] md:font-[500] leading-[20px] md:leading-normal hover:underline"
          >
            #{order.orderCode}
          </Link>
          <OrderStatusBadge status={order.status} />
        </div>
        <span className="text-[#2E2F2A]/60 text-[12px] md:text-[14px] font-[600] leading-[18px] md:leading-[40px] text-right">
          {formatDate(order.createdAt)}
        </span>
      </div>

      {/* Product List */}
      <div className="py-4 flex flex-col gap-4">
        {items.map((item) => (
          <OrderItemRow key={item.id} item={item} />
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
                onClick={() => onCancelOrder(order)}
                className="flex-1 md:flex-none w-[163px] md:w-[150px] h-[36px] md:h-[39px] flex items-center justify-center border border-[#C76E00] text-[#C76E00] hover:bg-neutral-50 bg-white rounded-[6px] font-[700] text-[14px] md:text-[15px] leading-[20px] transition duration-200 cursor-pointer"
              >
                Hủy đơn hàng
              </button>
            )}
            <button
              onClick={() => onContactSupport(order)}
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
