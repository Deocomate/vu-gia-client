"use client";

import React from "react";
import { ORDER_STATUS_LABEL, PAYMENT_STATUS_LABEL, PAYMENT_METHOD_LABEL } from "@/shared/api/apiEnums";

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-[14px]">
      <span className="text-[#909090]">{label}</span>
      <span className="font-[500] text-[#2E2F2A]">{value}</span>
    </div>
  );
}

/**
 * Renders a confirmed order — receiver info, items, and the server-authoritative
 * totals breakdown. `title` defaults to the post-checkout "success" heading; pass
 * `null` (order-detail view, Phase 5 — the order may be in any status, not just
 * freshly placed) to omit it and just show the order-code/status summary below.
 */
export default function OrderResultSummary({ order, title = "Đặt hàng thành công!" }) {
  if (!order) return null;

  const formatCurrency = (num) => `${(Number(num) || 0).toLocaleString("en-US")} ₫`;
  const items = order.items || [];

  return (
    <div className="w-full flex flex-col gap-8 font-montserrat text-[#2E2F2A]">
      <div className="flex flex-col items-center gap-2 text-center">
        {title ? <h2 className="text-[24px] font-[700]">{title}</h2> : null}
        <p className="text-[14px] text-[#909090]">
          Mã đơn hàng: <span className="font-[600] text-[#2E2F2A]">{order.orderCode}</span>
        </p>
        <div className="flex gap-3 text-[13px] text-[#909090]">
          <span>Trạng thái: {ORDER_STATUS_LABEL[order.status] || order.status}</span>
          <span>·</span>
          <span>Thanh toán: {PAYMENT_STATUS_LABEL[order.paymentStatus] || order.paymentStatus}</span>
        </div>
      </div>

      <div className="rounded-[6px] border border-[#E5E5E5] p-6 flex flex-col gap-3">
        <h3 className="text-[14px] font-[600] uppercase">Thông tin nhận hàng</h3>
        <div className="text-[14px] flex flex-col gap-1">
          <p>
            {order.receiverName} · {order.receiverPhone}
          </p>
          <p>{order.receiverAddress}</p>
          {order.note ? <p className="text-[#909090] italic">Ghi chú: {order.note}</p> : null}
        </div>
      </div>

      <div className="rounded-[6px] border border-[#E5E5E5] p-6 flex flex-col gap-3">
        <h3 className="text-[14px] font-[600] uppercase mb-1">Sản phẩm</h3>
        {items.map((item) => (
          <div key={item.id ?? item.productId} className="flex justify-between text-[14px]">
            <span>
              {item.productName} x{item.quantity}
            </span>
            <span>{formatCurrency(item.subtotal ?? (Number(item.unitPrice) || 0) * (Number(item.quantity) || 0))}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-1.5">
        {order.discountAmount > 0 ? (
          <Row
            label={order.couponCode ? `Giảm giá (${order.couponCode})` : "Giảm giá"}
            value={`-${formatCurrency(order.discountAmount)}`}
          />
        ) : null}
        <Row
          label={order.shippingMethodName ? `Vận chuyển (${order.shippingMethodName})` : "Vận chuyển"}
          value={order.shippingFee > 0 ? formatCurrency(order.shippingFee) : "MIỄN PHÍ"}
        />
        <Row
          label="Phương thức thanh toán"
          value={PAYMENT_METHOD_LABEL[order.paymentMethod] || order.paymentMethod}
        />
        <div className="flex justify-between text-[16px] font-[700] pt-2 border-t border-[#E5E5E5] mt-1">
          <span>Tổng cộng</span>
          <span>{formatCurrency(order.totalAmount)}</span>
        </div>
      </div>
    </div>
  );
}
