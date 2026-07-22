"use client";

import React, { useState } from "react";

export default function CartSummary({
  subtotal = 0,
  discount = 0,
  tax = 0,
  total = 0,
  disabled = false,
  onApplyPromoCode = () => {},
  onCheckout = () => {},
}) {
  const [promoCode, setPromoCode] = useState("");

  const formatNumber = (num) => {
    if (num === 0) return "0000";
    return num.toLocaleString("en-US");
  };

  const formatDiscount = (num) => {
    if (num === 0) return "-0000";
    return `-${num.toLocaleString("en-US")}`;
  };

  const handleApply = (e) => {
    e.preventDefault();
    onApplyPromoCode(promoCode);
  };

  return (
    <div 
      className="w-full rounded-[6px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] p-8 md:px-[50px] md:pt-[30px] md:pb-[30px] flex flex-col font-montserrat justify-between min-h-[344px]"
      style={{
        border: "1px solid transparent",
        backgroundImage: "linear-gradient(white, white), linear-gradient(to bottom, #C76E00, rgba(199, 110, 0, 0))",
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
      }}
    >
      {/* Promo Code Entry */}
      <div className="flex flex-col gap-2 mb-10">
        <label className="text-[#909090] text-[12px] md:text-[14px] font-[400] leading-[20px]">
          Nhập mã tại đây
        </label>
        <form onSubmit={handleApply} className="flex flex-row gap-0 items-center">
          <input
            type="text"
            placeholder="Mã ưu đãi"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="flex-1 h-[38px] md:h-[42px] border border-[#C76E00] border-r-0 md:border-r px-3 font-montserrat font-[400] text-[14px] text-[#2E2F2A] rounded-l-[3px] focus:outline-none placeholder:text-[#9CA3AF] md:placeholder:text-[#909090]"
          />
          <button
            type="submit"
            className="w-[103px] md:w-[134px] h-[38px] md:h-[42px] bg-[#C76E00] hover:bg-[#a65c00] border border-[#C76E00] text-white font-archivo font-[800] md:font-[700] text-[12px] md:text-[14px] flex items-center justify-center rounded-r-[3px] transition duration-200 cursor-pointer shrink-0"
          >
            ÁP DỤNG
          </button>
        </form>
      </div>

      {/* Breakdown Details */}
      <div className="flex flex-col">
        {/* Discount Line */}
        <div className="flex justify-between items-center text-[rgba(46,47,42,0.60)] text-[14px] md:text-[12px] font-[400] leading-[28px]">
          <span>Giảm giá:</span>
          <span className="text-[#2E2F2A]">{formatDiscount(discount)}</span>
        </div>

        {/* Tax Line */}
        <div className="flex justify-between items-center text-[rgba(46,47,42,0.60)] text-[14px] md:text-[12px] font-[400] leading-[28px]">
          <span>Thuế:</span>
          <span className="text-[#2E2F2A]">{formatNumber(tax)}</span>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-neutral-100 my-2" />

        {/* Total Price Display */}
        <div className="flex justify-between items-start pt-1">
          <span className="text-[#2E2F2A] text-[20px] md:text-[16px] font-[700] leading-[20px] md:leading-[28px]">
            Tổng:
          </span>
          <div className="flex flex-col items-end">
            <span className="text-[#2E2F2A] text-[20px] md:text-[16px] font-[700] leading-[20px] md:leading-[28px]">
              {formatNumber(total)}
            </span>
            <span className="text-[#2E2F2A] text-[10px] md:text-[14px] font-[700] md:font-[600] mt-0.5 leading-[15px] md:leading-normal">
              VND
            </span>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={onCheckout}
        disabled={disabled}
        className="w-full md:max-w-[276px] h-[52px] md:h-[42px] mx-auto flex items-center justify-center bg-[#C76E00] hover:bg-[#a65c00] text-white font-montserrat md:font-archivo font-[700] text-[16px] md:text-[14px] leading-[20px] tracking-[0.70px] md:tracking-normal transition duration-200 cursor-pointer mt-10 rounded-[3px] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        THANH TOÁN
      </button>
    </div>
  );
}
