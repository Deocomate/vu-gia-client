"use client";

import React, { useEffect, useState } from "react";
import { toast } from "@/utils/feedback";

// OQ4 (Validation Decisions): COD is blocked at/above this order amount —
// enforced client-side only, no backend field.
const COD_LIMIT = 1_000_000;
const CUSTOM_ADDRESS_OPTION = "custom";

const CANNED_ADDRESSES = [
  "18 Giang Cao, Bát Tràng, Gia Lâm, Hà Nội",
  "Thôn 3 Giang Cao, Bát Tràng, Gia Lâm, Hà Nội",
];

export default function CheckoutForm({
  onSubmit = () => {},
  shippingMethods = [],
  orderAmount = 0,
  isSubmitting = false,
  onShippingMethodChange = () => {},
}) {
  const [formData, setFormData] = useState({
    fullName: "",
    addressOption: "",
    customAddress: "",
    city: "",
    phone: "",
    note: "",
    shippingMethodId: "",
    paymentMethod: "COD",
  });

  const codBlocked = orderAmount >= COD_LIMIT;

  // Force-switch off COD the moment the cart total crosses the threshold
  // (e.g. quantity bumped up while the form was open) — never let a
  // now-disabled option remain silently selected (Validation Decisions/OQ4).
  useEffect(() => {
    if (codBlocked && formData.paymentMethod === "COD") {
      setFormData((prev) => ({ ...prev, paymentMethod: "ONL" }));
    }
  }, [codBlocked, formData.paymentMethod]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleShippingMethodChange = (value) => {
    handleChange("shippingMethodId", value);
    const method = shippingMethods.find((m) => String(m.id) === String(value));
    onShippingMethodChange(method || null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      toast.error("Vui lòng nhập tên khách hàng.");
      return;
    }
    if (!formData.addressOption.trim()) {
      toast.error("Vui lòng chọn hoặc nhập địa chỉ giao hàng.");
      return;
    }
    if (formData.addressOption === CUSTOM_ADDRESS_OPTION && !formData.customAddress.trim()) {
      toast.error("Vui lòng nhập địa chỉ chi tiết.");
      return;
    }
    if (!formData.city.trim()) {
      toast.error("Vui lòng nhập thành phố.");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại.");
      return;
    }
    if (!formData.shippingMethodId) {
      toast.error("Vui lòng chọn phương thức vận chuyển.");
      return;
    }

    const addressLine =
      formData.addressOption === CUSTOM_ADDRESS_OPTION
        ? formData.customAddress.trim()
        : formData.addressOption;

    onSubmit({
      receiverName: formData.fullName.trim(),
      receiverPhone: formData.phone.trim(),
      receiverAddress: `${addressLine}, ${formData.city.trim()}`,
      note: formData.note.trim() || undefined,
      shippingMethodId: Number(formData.shippingMethodId),
      paymentMethod: formData.paymentMethod,
    });
  };

  const formatFee = (fee) => (Number(fee) > 0 ? `${Number(fee).toLocaleString("en-US")} ₫` : "MIỄN PHÍ");

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
          className="w-full h-[54px] border border-[#E5E5E5] px-[15px] font-montserrat font-[300] text-[16px] text-[#2E2F2A] bg-white rounded-[7px] focus:outline-none focus:border-[#C76E00] placeholder:text-[#909090]"
        />

        {/* Address Dropdown */}
        <div className="relative w-full h-[54px]">
          <select
            value={formData.addressOption}
            onChange={(e) => handleChange("addressOption", e.target.value)}
            className="w-full h-full border border-[#E5E5E5] pl-[15px] pr-10 font-montserrat font-[300] text-[16px] text-[#2E2F2A] bg-white rounded-[7px] focus:outline-none focus:border-[#C76E00] appearance-none cursor-pointer"
          >
            <option value="" disabled hidden>
              Địa chỉ
            </option>
            {CANNED_ADDRESSES.map((addr) => (
              <option key={addr} value={addr}>
                {addr}
              </option>
            ))}
            <option value={CUSTOM_ADDRESS_OPTION}>Nhập địa chỉ mới...</option>
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#909090]">
            <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        {formData.addressOption === CUSTOM_ADDRESS_OPTION && (
          <input
            type="text"
            placeholder="Nhập địa chỉ chi tiết của bạn"
            value={formData.customAddress}
            onChange={(e) => handleChange("customAddress", e.target.value)}
            className="w-full h-[54px] border border-[#E5E5E5] px-[15px] font-montserrat font-[300] text-[16px] text-[#2E2F2A] bg-white rounded-[7px] focus:outline-none focus:border-[#C76E00] placeholder:text-[#909090] animate-fadeIn"
          />
        )}

        {/* City and Phone Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
          <input
            type="text"
            placeholder="Thành phố"
            value={formData.city}
            onChange={(e) => handleChange("city", e.target.value)}
            className="w-full h-[54px] border border-[#E5E5E5] px-[15px] font-montserrat font-[300] text-[16px] text-[#2E2F2A] bg-white rounded-[7px] focus:outline-none focus:border-[#C76E00] placeholder:text-[#909090]"
          />
          <input
            type="text"
            placeholder="Điện thoại"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="w-full h-[54px] border border-[#E5E5E5] px-[15px] font-montserrat font-[300] text-[16px] text-[#2E2F2A] bg-white rounded-[7px] focus:outline-none focus:border-[#C76E00] placeholder:text-[#909090]"
          />
        </div>

        {/* Note */}
        <textarea
          placeholder="Ghi chú cho đơn hàng (tùy chọn)"
          value={formData.note}
          onChange={(e) => handleChange("note", e.target.value)}
          rows={3}
          className="w-full h-[90px] resize-none border border-[#E5E5E5] px-[15px] py-[15px] font-montserrat font-[300] text-[16px] text-[#2E2F2A] bg-white rounded-[7px] focus:outline-none focus:border-[#C76E00] placeholder:text-[#909090]"
        />
      </div>

      {/* Shipping Method Section */}
      <h2 className="text-[16px] font-[600] leading-normal uppercase mb-[16px] tracking-normal">
        Phương thức vận chuyển
      </h2>
      <div className="relative w-full h-[54px] mb-[25px]">
        <select
          value={formData.shippingMethodId}
          onChange={(e) => handleShippingMethodChange(e.target.value)}
          className="w-full h-full border border-[#E5E5E5] pl-[15px] pr-10 font-montserrat font-[300] text-[16px] text-[#2E2F2A] bg-white rounded-[7px] focus:outline-none focus:border-[#C76E00] appearance-none cursor-pointer"
        >
          <option value="" disabled hidden>
            {shippingMethods.length ? "Hình thức vận chuyển" : "Đang tải phương thức vận chuyển..."}
          </option>
          {shippingMethods.map((method) => (
            <option key={method.id} value={method.id}>
              {method.name} - {formatFee(method.fee)}
            </option>
          ))}
        </select>
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#909090]">
          <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      <div className="flex flex-col border border-[#E5E5E5] rounded-[7px] bg-white mb-[42px] overflow-hidden">
        {/* Online / VietQR Option */}
        <label
          className="flex items-center h-[54px] pl-[22px] pr-4 border-b border-[#E5E5E5] cursor-pointer hover:bg-neutral-50 transition-colors select-none"
          onClick={() => handleChange("paymentMethod", "ONL")}
        >
          <div className="w-[18px] h-[18px] rounded-full border border-black flex items-center justify-center mr-[17px] shrink-0">
            {formData.paymentMethod === "ONL" && (
              <div className="w-[10px] h-[10px] rounded-full bg-[#2E2F2A]" />
            )}
          </div>
          <span className="text-black text-[16px] font-[300]">
            Chuyển khoản / QR (VietQR)
          </span>
        </label>

        {/* COD Option */}
        <label
          className={`flex items-center h-[54px] pl-[22px] pr-4 border-b border-[#E5E5E5] select-none transition-colors ${
            codBlocked ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:bg-neutral-50"
          }`}
          onClick={() => {
            if (codBlocked) return;
            handleChange("paymentMethod", "COD");
          }}
        >
          <div className="w-[18px] h-[18px] rounded-full border border-black flex items-center justify-center mr-[17px] shrink-0">
            {formData.paymentMethod === "COD" && (
              <div className="w-[10px] h-[10px] rounded-full bg-[#2E2F2A]" />
            )}
          </div>
          <span className="text-black text-[16px] font-[300]">
            Thanh toán khi nhận hàng (COD)
          </span>
        </label>

        {/* Payment Option Notice */}
        <div className="pl-[57px] pr-[22px] py-[15px] text-black text-[14px] font-[275] italic leading-normal bg-white">
          {codBlocked
            ? `Đơn hàng từ ${COD_LIMIT.toLocaleString("en-US")} ₫ trở lên chỉ hỗ trợ thanh toán chuyển khoản (VietQR).`
            : `Thanh toán khi nhận hàng chỉ áp dụng cho đơn hàng dưới ${COD_LIMIT.toLocaleString("en-US")} ₫.`}
        </div>
      </div>

      {/* Complete Button */}
      <div className="w-full flex justify-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full lg:w-[313px] h-[45px] bg-[#C76E00] hover:bg-[#AD5036] active:bg-[#C76E00] text-white font-archivo font-[800] text-[16px] uppercase tracking-[0.05em] rounded-[3px] transition-all duration-300 shadow-md cursor-pointer flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "ĐANG XỬ LÝ..." : "HOÀN TẤT THANH TOÁN"}
        </button>
      </div>
    </form>
  );
}
