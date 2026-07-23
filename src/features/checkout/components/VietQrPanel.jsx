"use client";

import React from "react";

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4 text-[14px]">
      <span className="text-[#909090]">{label}</span>
      <span className="font-[600] text-[#2E2F2A] text-right">{value || "—"}</span>
    </div>
  );
}

/**
 * VietQR payment panel for an ONL order awaiting `paymentStatus === 'PAID'`.
 * `payment` is the order's `PaymentInfoResponse` (ORDER_API.md §4):
 * `{ qrImageUrl, amount, bankName, accountNumber, accountHolder, transferContent }`.
 */
export default function VietQrPanel({ payment, onRefresh = () => {}, refreshing = false }) {
  if (!payment) return null;

  const formatCurrency = (num) => `${(Number(num) || 0).toLocaleString("en-US")} ₫`;

  return (
    <div className="w-full flex flex-col items-center gap-6 rounded-[6px] border border-[#E5E5E5] bg-white p-8 font-montserrat">
      <h2 className="text-[18px] font-[600] text-[#2E2F2A] uppercase text-center">
        Quét mã QR để thanh toán
      </h2>

      {payment.qrImageUrl ? (
        // External VietQR image URL from the payment provider, not a local/Next asset.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={payment.qrImageUrl}
          alt="Mã QR thanh toán VietQR"
          className="w-[240px] h-[240px] object-contain border border-[#E5E5E5] rounded-[6px]"
        />
      ) : null}

      <div className="w-full max-w-[420px] flex flex-col gap-2">
        <Row label="Số tiền" value={formatCurrency(payment.amount)} />
        <Row label="Ngân hàng" value={payment.bankName} />
        <Row label="Số tài khoản" value={payment.accountNumber} />
        <Row label="Chủ tài khoản" value={payment.accountHolder} />
        <Row label="Nội dung chuyển khoản" value={payment.transferContent} />
      </div>

      <p className="text-[13px] text-[#909090] text-center italic">
        Đơn hàng sẽ tự động xác nhận sau khi hệ thống nhận được thanh toán. Vui lòng không đóng
        trang này trong lúc chờ.
      </p>

      <button
        type="button"
        onClick={onRefresh}
        disabled={refreshing}
        className="h-[45px] px-8 bg-[#C76E00] hover:bg-[#AD5036] text-white font-archivo font-[800] text-[14px] uppercase tracking-[0.05em] rounded-[3px] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {refreshing ? "Đang kiểm tra..." : "Tôi đã thanh toán / Làm mới"}
      </button>
    </div>
  );
}
