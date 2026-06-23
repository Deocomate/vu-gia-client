"use client";

import React, { useState } from "react";

export default function CheckoutForm({ onSubmit = () => {} }) {
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    phone: "",
    shippingMethod: "standard",
    paymentMethod: "cod",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      alert("Vui lòng nhập tên khách hàng.");
      return;
    }
    if (!formData.address.trim()) {
      alert("Vui lòng chọn hoặc nhập địa chỉ giao hàng.");
      return;
    }
    if (!formData.city.trim()) {
      alert("Vui lòng nhập thành phố.");
      return;
    }
    if (!formData.phone.trim()) {
      alert("Vui lòng nhập số điện thoại.");
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col text-[#2E2F2A] font-montserrat bg-white">
      {/* Shipping Address Section */}
      <h2 className="text-[16px] font-[600] leading-normal uppercase mb-[17px] tracking-normal">
        Địa chỉ giao hàng
      </h2>
      <div className="flex flex-col gap-[15px] mb-[25px]">
        {/* Full Name */}
        <input
          type="text"
          placeholder="Tên khách hàng"
          value={formData.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
          className="w-full h-[50px] border border-[#E5E5E5] px-[15px] font-montserrat font-[300] text-[16px] text-[#2E2F2A] bg-white rounded-[3px] focus:outline-none focus:border-[#C76E00] placeholder:text-[#909090]"
        />

        {/* Address Dropdown */}
        <div className="relative w-full h-[50px]">
          <select
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
            className="w-full h-full border border-[#E5E5E5] pl-[15px] pr-10 font-montserrat font-[300] text-[16px] text-[#2E2F2A] bg-white rounded-[3px] focus:outline-none focus:border-[#C76E00] appearance-none cursor-pointer"
          >
            <option value="" disabled hidden>
              Địa chỉ
            </option>
            <option value="18 Giang Cao, Bát Tràng, Gia Lâm, Hà Nội">
              18 Giang Cao, Bát Tràng, Gia Lâm, Hà Nội
            </option>
            <option value="Thôn 3 Giang Cao, Bát Tràng, Gia Lâm, Hà Nội">
              Thôn 3 Giang Cao, Bát Tràng, Gia Lâm, Hà Nội
            </option>
            <option value="custom">Nhập địa chỉ mới...</option>
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#909090]">
            <svg
              width="14"
              height="8"
              viewBox="0 0 14 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L7 7L13 1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Custom Address text field if selected custom */}
        {formData.address === "custom" && (
          <input
            type="text"
            placeholder="Nhập địa chỉ chi tiết của bạn"
            onChange={(e) => handleChange("address", e.target.value)}
            className="w-full h-[50px] border border-[#E5E5E5] px-[15px] font-montserrat font-[300] text-[16px] text-[#2E2F2A] bg-white rounded-[3px] focus:outline-none focus:border-[#C76E00] placeholder:text-[#909090] animate-fadeIn"
          />
        )}

        {/* City and Phone Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
          <input
            type="text"
            placeholder="Thành phố"
            value={formData.city}
            onChange={(e) => handleChange("city", e.target.value)}
            className="w-full h-[50px] border border-[#E5E5E5] px-[15px] font-montserrat font-[300] text-[16px] text-[#2E2F2A] bg-white rounded-[3px] focus:outline-none focus:border-[#C76E00] placeholder:text-[#909090]"
          />
          <input
            type="text"
            placeholder="Điện thoại"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="w-full h-[50px] border border-[#E5E5E5] px-[15px] font-montserrat font-[300] text-[16px] text-[#2E2F2A] bg-white rounded-[3px] focus:outline-none focus:border-[#C76E00] placeholder:text-[#909090]"
          />
        </div>
      </div>

      {/* Shipping Method Section */}
      <h2 className="text-[16px] font-[600] leading-normal uppercase mb-[16px] tracking-normal">
        Phương thức vận chuyển
      </h2>
      <div className="relative w-full h-[50px] mb-[25px]">
        <select
          value={formData.shippingMethod}
          onChange={(e) => handleChange("shippingMethod", e.target.value)}
          className="w-full h-full border border-[#E5E5E5] pl-[15px] pr-10 font-montserrat font-[300] text-[16px] text-[#2E2F2A] bg-white rounded-[3px] focus:outline-none focus:border-[#C76E00] appearance-none cursor-pointer"
        >
          <option value="" disabled hidden>
            Hình thức vận chuyển
          </option>
          <option value="standard">Giao hàng nhanh - MIỄN PHÍ</option>
          <option value="express">Giao hàng hỏa tốc (24h) - 50,000 ₫</option>
        </select>
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#909090]">
          <svg
            width="14"
            height="8"
            viewBox="0 0 14 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1L7 7L13 1"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Payment Method Section */}
      <h2 className="text-[16px] font-[600] leading-normal uppercase mb-[15px] tracking-normal">
        Phương thức thanh toán
      </h2>
      <div className="flex flex-col border border-[#E5E5E5] rounded-[3px] bg-white mb-[42px] overflow-hidden">
        {/* Credit Card Option */}
        <label
          className="flex items-center h-[54px] pl-[22px] pr-4 border-b border-[#E5E5E5] cursor-pointer hover:bg-neutral-50 transition-colors select-none"
          onClick={() => handleChange("paymentMethod", "online")}
        >
          <div className="w-[18px] h-[18px] rounded-full border border-black flex items-center justify-center mr-[17px] shrink-0">
            {formData.paymentMethod === "online" && (
              <div className="w-[10px] h-[10px] rounded-full bg-[#2E2F2A]" />
            )}
          </div>
          <span className="text-black text-[16px] font-[300]">
            Credit / ATM card / QR
          </span>
        </label>

        {/* COD Option */}
        <label
          className="flex items-center h-[54px] pl-[22px] pr-4 border-b border-[#E5E5E5] cursor-pointer hover:bg-neutral-50 transition-colors select-none"
          onClick={() => handleChange("paymentMethod", "cod")}
        >
          <div className="w-[18px] h-[18px] rounded-full border border-black flex items-center justify-center mr-[17px] shrink-0">
            {formData.paymentMethod === "cod" && (
              <div className="w-[10px] h-[10px] rounded-full bg-[#2E2F2A]" />
            )}
          </div>
          <span className="text-black text-[16px] font-[300]">
            Thanh toán khi nhận hàng (COD)
          </span>
        </label>

        {/* Payment Option Notice */}
        <div className="pl-[57px] pr-[22px] py-[15px] text-black text-[14px] font-[275] italic leading-normal bg-white">
          Phương thức thanh toán trực tiếp chỉ áp dụng cho đơn hàng dưới 1,000,000 VND.
        </div>
      </div>

      {/* Complete Button */}
      <div className="w-full flex justify-center">
        <button
          type="submit"
          className="w-full max-w-[276px] h-[45px] bg-[#C76E00] hover:bg-[#AD5036] active:bg-[#C76E00] text-white font-archivo font-[800] text-[16px] uppercase tracking-[0.05em] rounded-[3px] transition-all duration-300 shadow-md cursor-pointer flex items-center justify-center"
        >
          Hoàn tất thanh toán
        </button>
      </div>
    </form>
  );
}
