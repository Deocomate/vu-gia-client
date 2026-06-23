"use client";

import React, { useState } from "react";
import Image from "next/image";

export default function CheckoutOrderSummary({
  items = [],
  discount = 0,
  tax = 0,
  total = 0,
  onApplyPromo = () => {},
  onRemoveItem = () => {},
  onEditItem = () => {},
}) {
  const [promoCode, setPromoCode] = useState("");

  const formatNumber = (num) => {
    return num.toLocaleString("en-US");
  };

  const formatCurrency = (num) => {
    return `${num.toLocaleString("en-US")} ₫`;
  };

  const handleApply = (e) => {
    e.preventDefault();
    onApplyPromo(promoCode);
  };

  return (
    <div className="w-full bg-white border-[0.5px] border-[#909090] rounded-[6px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] p-4 md:pl-[44px] md:pr-[43px] md:pt-[35px] md:pb-[35px] flex flex-col font-montserrat">
      {/* Top Divider */}
      <div className="hidden md:block w-full h-[1px] bg-neutral-200 mb-[15px]" />

      {/* Items List */}
      <div className="flex flex-col gap-[25px] mb-[15px]">
        {items.map((item) => {
          const rowTotal = (item.price || 0) * (item.quantity || 0);
          return (
            <div key={item.id} className="grid grid-cols-12 gap-4 items-start">
              {/* Product Info (Col span 9) */}
              <div className="col-span-9 flex gap-[26.5px] items-start">
                {/* Image Wrapper */}
                <div className="relative shrink-0">
                  {/* Image Container */}
                  <div className="w-[91px] h-[91px] border-[0.5px] border-[#909090] rounded-[5px] bg-white flex items-center justify-center overflow-hidden relative">
                    {item.image && typeof item.image === "object" ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <img
                        src={item.image || "/images/products/product-image-thumb.png"}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  {/* Quantity Badge overlay */}
                  <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 bg-[#C76E00] text-white text-[14px] font-[600] w-[26px] h-[22px] rounded-[3px] flex items-center justify-center z-10 shadow-sm">
                    {item.quantity}
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-col min-h-[91px]">
                  <h4 className="text-[#2E2F2A] text-[16px] font-[600] leading-normal">
                    {item.title}
                  </h4>
                  <div className="text-[#909090] text-[12px] font-[400] leading-[20px] mt-[5px]">
                    <div>MSP: {item.sku || item.msp || "N/A"}</div>
                    <div>Phân loại: {item.classification || "Mặc định"}</div>
                    <div>x{item.packSize || 100}</div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex gap-4 text-[#909090] text-[12px] font-[400] leading-[20px] mt-2">
                    <button
                      type="button"
                      onClick={() => onEditItem(item.id)}
                      className="hover:text-primary transition cursor-pointer"
                    >
                      Sửa
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="hover:text-red-600 transition cursor-pointer"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>

              {/* Total Column (Col span 3) */}
              <div className="col-span-3 flex flex-col items-end text-[#2E2F2A]">
                <span className="text-[14px] font-[600] leading-[22px] mb-[13px]">
                  Tổng
                </span>
                <span className="text-[14px] font-[400] leading-[22px]">
                  {formatNumber(rowTotal)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Promo Code Section */}
      <div className="flex flex-col gap-2 mb-[35px]">
        <label className="text-[#909090] text-[12px] font-[400] leading-[20px]">
          Nhập mã tại đây
        </label>
        <form onSubmit={handleApply} className="flex flex-row gap-0 items-center">
          <input
            type="text"
            placeholder="Mã ưu đãi"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="w-[297px] h-[42px] border border-[#C76E00] px-3 font-montserrat font-[400] text-[12px] text-[#2E2F2A] rounded-l-[3px] focus:outline-none placeholder:text-[#909090]"
          />
          <button
            type="submit"
            className="w-[133px] h-[42px] bg-[#C76E00] hover:bg-[#AD5036] text-white font-montserrat font-[700] text-[14px] rounded-r-[3px] transition-colors duration-300 cursor-pointer flex items-center justify-center"
          >
            ÁP DỤNG
          </button>
        </form>
      </div>

      {/* Divider */}
      <div className="w-full h-[1px] bg-neutral-200" />

      {/* Summary Breakdown */}
      <div className="flex flex-col gap-[5px] text-[#2E2F2A] mt-[18px]">
        {/* Discount Row */}
        <div className="flex justify-between items-center text-[13px] font-[300] leading-[40px]">
          <span>Giảm giá</span>
          <span>
            {discount > 0 ? `-${formatNumber(discount)} ₫` : "-0000 ₫"}
          </span>
        </div>

        {/* Tax Row */}
        <div className="flex justify-between items-center text-[13px] font-[300] leading-[40px]">
          <span>Thuế</span>
          <span>{tax === 0 ? "MIỄN PHÍ" : formatCurrency(tax)}</span>
        </div>

        {/* Total Price Row */}
        <div className="flex justify-between items-center text-[16px] font-[600] leading-[40px] mt-[12px]">
          <span>Tổng</span>
          <span className="text-[16px] font-[600]">
            {formatCurrency(total)}
          </span>
        </div>
      </div>
    </div>
  );
}
