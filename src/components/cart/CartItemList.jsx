"use client";

import React from "react";
import SafeImage from "@/components/shared/SafeImage";

export default function CartItemList({
  items = [],
  pendingIds = [],
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
  const totalAmount = items.reduce((sum, item) => sum + (item.lineTotal || 0), 0);

  return (
    <div 
      className="w-full rounded-[6px] shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.10),0px_10px_15px_-3px_rgba(0,0,0,0.10)] px-4 py-8 md:pl-[45px] md:pr-[50px] md:pt-[35px] md:pb-[30px] flex flex-col font-montserrat"
      style={{
        border: "1px solid transparent",
        backgroundImage: "linear-gradient(white, white), linear-gradient(to bottom, #C76E00, rgba(199, 110, 0, 0))",
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
      }}
    >
      {/* Top Divider Line */}
      <div className="hidden md:block w-full h-[1px] bg-neutral-200 mb-[15px]" />

      {/* Cart Items List */}
      <div className="flex flex-col gap-[30px]">
        {items.map((item) => {
          const rowTotal = item.lineTotal || 0;
          const isPending = pendingIds.includes(item.id);
          return (
            <div key={item.id} className={isPending ? "opacity-60 pointer-events-none" : ""}>
              {/* MOBILE LAYOUT */}
              <div className="block md:hidden">
                <div className="flex gap-[15px]">
                  <div className="w-[80px] h-[80px] shrink-0 rounded-[6px] overflow-hidden relative border border-[#D1D5DB]">
                    <SafeImage
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-[14px] font-[700] text-[#2E2F2A] leading-tight">
                      {item.title}
                    </h4>

                    <div className="flex justify-between items-start mt-1">
                      <div className="text-[11px] font-[400] text-[rgba(46,47,42,0.40)] leading-[17px]">
                        <div>MSP: {item.sku || item.msp || "N/A"}</div>
                        <div>Phân loại: {item.classification || "Mặc định"}</div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <button
                          onClick={() => {
                            const newQty = Math.max(1, (item.quantity || 1) - 1);
                            onQuantityChange(item.id, newQty);
                          }}
                          className="w-[18px] h-[18px] flex items-center justify-center cursor-pointer"
                        >
                          <svg width="9" height="1" viewBox="0 0 9 1" fill="none">
                            <path d="M0 0.5H9" stroke="#BBBBBB" strokeWidth="1.5" />
                          </svg>
                        </button>
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
                          className="w-[34px] h-[23px] border border-[#D1D5DB] rounded-[4px] text-center text-[12px] font-[600] text-black bg-white focus:outline-none focus:border-[#C76E00] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <button
                          onClick={() => onQuantityChange(item.id, (item.quantity || 0) + 1)}
                          className="w-[18px] h-[18px] flex items-center justify-center cursor-pointer"
                        >
                          <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                            <path d="M0 4.5H9" stroke="#BBBBBB" strokeWidth="1.5" />
                            <path d="M4.5 0V9" stroke="#BBBBBB" strokeWidth="1.5" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      <div className="text-[11px] text-black">
                        <span className="font-[400]">Đơn giá: </span>
                        <span className="font-[600]">{formatNumber(item.price)}</span>
                      </div>

                      <div className="flex gap-4 shrink-0 ml-2">
                        <button
                          onClick={() => onEditItem(item.id)}
                          className="text-[12px] font-[700] text-[rgba(46,47,42,0.40)] hover:text-primary transition cursor-pointer"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-[12px] font-[700] text-[rgba(46,47,42,0.40)] hover:text-red-600 transition cursor-pointer"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-3">
                  <span className="text-[10px] font-[700] uppercase text-[#2E2F2A] leading-[15px]">
                    Tổng
                  </span>
                  <span className="text-[13px] font-[700] text-black leading-[19.5px]">
                    {formatNumber(rowTotal)}
                  </span>
                </div>
              </div>

              {/* DESKTOP LAYOUT */}
              <div className="hidden md:grid md:grid-cols-12 gap-4 items-start">
                {/* Product Info Column */}
                <div className="col-span-1 md:col-span-6 flex gap-[15px] items-start">
                  {/* Image Container */}
                  <div className="w-[91px] h-[91px] shrink-0 border-[0.5px] border-[#909090] rounded-[5px] bg-white flex items-center justify-center overflow-hidden relative">
                    <SafeImage
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="91px"
                    />
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
            </div>
          );
        })}
      </div>

      {/* Table Divider */}
      <div className="w-full h-[1px] bg-neutral-200 mt-[20px] mb-[15px]" />

      {/* Mobile Footer */}
      <div className="md:hidden flex items-start justify-between font-archivo text-[#2E2F2A]">
        <span className="text-[14px] font-[700]">
          Số lượng: {totalQuantity}
        </span>
        <div className="flex flex-col items-end">
          <span className="text-[16px] font-[700] leading-none">
            {formatDecimal(totalAmount)}
          </span>
          <span className="text-[12px] font-[700] mt-1 leading-none">VND</span>
        </div>
      </div>

      {/* Desktop Footer */}
      <div className="hidden md:flex items-start justify-between font-montserrat text-[#2E2F2A]">
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
