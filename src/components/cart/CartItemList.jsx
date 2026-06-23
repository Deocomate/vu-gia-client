"use client";

import React from "react";
import Image from "next/image";

export default function CartItemList({
  items = [],
  onQuantityChange = () => {},
  onRemoveItem = () => {},
  onEditItem = () => {},
}) {
  const formatNumber = (num) => {
    return num.toLocaleString("en-US");
  };

  const formatDecimal = (num) => {
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const totalQuantity = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalAmount = items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );

  return (
    <div className="w-full bg-white border-[0.5px] border-[#909090] rounded-[6px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] p-4 md:pl-[45px] md:pr-[50px] md:pt-[35px] md:pb-[30px] flex flex-col font-montserrat">
      {/* Top Divider Line */}
      <div className="hidden md:block w-full h-[1px] bg-neutral-200 mb-[15px]" />

      {/* Cart Items List */}
      <div className="flex flex-col gap-[30px]">
        {items.map((item) => {
          const rowTotal = (item.price || 0) * (item.quantity || 0);
          return (
            <div
              key={item.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start"
            >
              {/* Product Info Column */}
              <div className="col-span-1 md:col-span-6 flex gap-[15px] items-start">
                {/* Image Container */}
                <div className="w-[91px] h-[91px] shrink-0 border-[0.5px] border-[#909090] rounded-[5px] bg-white flex items-center justify-center overflow-hidden relative">
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

                {/* Text Details */}
                <div className="flex flex-col min-h-[91px]">
                  <h4 className="text-[#2E2F2A] text-[16px] font-[600] leading-normal">
                    {item.title}
                  </h4>
                  <div className="text-[#909090] text-[12px] font-[400] leading-[20px] mt-1">
                    <div>MSP: {item.sku || item.msp || "N/A"}</div>
                    <div>Phân loại: {item.classification || "Mặc định"}</div>
                    <div>x{item.packSize || 100}</div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex gap-4 text-[#909090] text-[12px] font-[400] leading-[20px] mt-2">
                    <button
                      onClick={() => onEditItem(item.id)}
                      className="hover:text-primary transition cursor-pointer"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="hover:text-red-600 transition cursor-pointer"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>

              {/* Price Column */}
              <div className="col-span-1 md:col-span-2 flex md:flex-col justify-between md:justify-start md:items-start text-[#2E2F2A] font-montserrat">
                <span className="hidden md:inline text-[#2E2F2A] text-[14px] font-[600] leading-[22px] mb-[15px]">
                  Đơn giá
                </span>
                <span className="md:hidden text-[14px] font-[600]">Đơn giá:</span>
                <span className="text-[14px] font-[400] md:text-[16px] md:leading-[22px]">
                  {formatNumber(item.price)}
                </span>
              </div>

              {/* Quantity Selector Column */}
              <div className="col-span-1 md:col-span-2 flex md:flex-col justify-between md:justify-start md:items-start">
                <span className="hidden md:inline text-[#2E2F2A] text-[14px] font-[600] leading-[22px] mb-[8px]">
                  Số lượng
                </span>
                <span className="md:hidden text-[14px] font-[600]">Số lượng:</span>
                <div className="w-[97px] h-[33px] shrink-0">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => {
                      const valStr = e.target.value;
                      if (valStr === "") {
                        onQuantityChange(item.id, "");
                        return;
                      }
                      const val = parseInt(valStr, 10);
                      if (!isNaN(val) && val >= 1) {
                        onQuantityChange(item.id, val);
                      }
                    }}
                    onBlur={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (isNaN(val) || val < 1) {
                        onQuantityChange(item.id, 1);
                      }
                    }}
                    className="w-full h-full px-3 border border-[#909090] rounded-[3px] bg-white font-montserrat font-[600] text-[14px] text-[#3C4043] focus:outline-none focus:border-[#C76E00] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>

              {/* Row Total Column */}
              <div className="col-span-1 md:col-span-2 flex md:flex-col justify-between md:justify-start md:items-end text-[#2E2F2A] font-montserrat">
                <span className="hidden md:inline text-[#2E2F2A] text-[14px] font-[600] leading-[22px] mb-[15px]">
                  Tổng
                </span>
                <span className="md:hidden text-[14px] font-[600]">Tổng:</span>
                <span className="text-[14px] font-[400] md:text-[16px] md:leading-[22px]">
                  {formatNumber(rowTotal)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table Divider */}
      <div className="w-full h-[1px] bg-neutral-200 mt-[20px] mb-[15px]" />

      {/* Cart Footer */}
      <div className="flex items-start justify-between font-montserrat text-[#2E2F2A]">
        <span className="text-[16px] font-[700] mt-1">
          Số lượng: {totalQuantity}
        </span>
        <div className="flex flex-col items-end">
          <span className="text-[24px] font-[700] leading-none">
            {formatDecimal(totalAmount)}
          </span>
          <span className="text-[16px] font-[700] mt-1.5 leading-none">VND</span>
        </div>
      </div>
    </div>
  );
}
