"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/utils/routes";

import heroBg from "@/assets/images/about/hero-bg.png";
import vaseImage from "@/assets/images/showroom/showroom-hero-1.png";

export default function ContactView() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Họ tên không được để trống";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Số điện thoại không được để trống";
    } else if (!/^\d{10,11}$/.test(formData.phone.trim())) {
      newErrors.phone = "Số điện thoại phải gồm 10-11 chữ số";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Nội dung liên hệ không được để trống";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1200);
  };

  return (
    <div className="w-full bg-[#FAF7F7]">
      {/* Header Banner */}
      <section className="relative w-full h-[150px] md:h-[220px] bg-[#2E2F2A] overflow-hidden flex flex-col justify-center items-center">
        {/* Background Image */}
        <Image
          src={heroBg}
          alt="Gốm Sứ Vũ Gia"
          fill
          priority
          className="object-cover opacity-35 z-0"
        />
        {/* Breadcrumbs */}
        <div className="relative z-10 text-center text-white px-4 select-none">
          <h1 className="font-archivo text-[20px] md:text-[24px] font-bold uppercase tracking-widest leading-none">
            Trang chủ / Liên hệ
          </h1>
        </div>
      </section>

      {/* Main Grid Content Container */}
      <section className="w-[85%] max-w-[1320px] mx-auto py-12 md:py-20 flex flex-col lg:flex-row items-stretch justify-between gap-12 lg:gap-[146px]">
        {/* Left Column: Form & Info */}
        <div className="w-full lg:w-[588px] flex-shrink-0 flex flex-col justify-between">
          <div className="flex flex-col">
            {/* Main Title */}
            <h2 className="font-montserrat text-[#97400C] text-[24px] font-semibold leading-[32px] mb-5 tracking-wide">
              Gốm Vũ Gia - Thanh Hai Co., LTD
            </h2>

            {/* Subtitle 1: HQ & Showroom */}
            <div className="flex flex-col gap-[5px] mb-[11px]">
              <span className="font-montserrat text-[#383838] text-[16px] font-semibold leading-[24px]">
                TRỤ SỞ CHÍNH & SHOWROOM 1
              </span>
              <div className="w-[25px] h-[3px] bg-[#383838]"></div>
            </div>

            {/* Address Info */}
            <p className="font-montserrat text-[#383838] text-[16px] font-normal leading-[26px] mb-[30px]">
              Địa chỉ: Số 18 Giang Cao, Bát Tràng, Gia Lâm, Hà Nội
              <br />
              Điện thoại: 091 7777 247
            </p>

            {/* Subtitle 2: Instruction */}
            <div className="flex flex-col gap-[5px] mb-[20px]">
              <span className="font-montserrat text-[#383838] text-[16px] font-semibold leading-[24px]">
                Quý khách vui lòng gửi thông tin liên hệ theo form sau :
              </span>
              <div className="w-[25px] h-[3px] bg-[#383838]"></div>
            </div>

            {/* Form Action */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Field 1: Họ tên */}
              <div className="flex flex-col gap-1.5 w-full">
                <label className="font-montserrat text-[#344054] text-[14px] font-medium leading-[20px]">
                  Họ tên
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nhập Họ và tên của bạn"
                  className={`w-full font-montserrat h-11 px-5 text-[14px] rounded-[8px] bg-white border outline-none transition-all placeholder:text-[#A7A7A7] text-[#383838] ${
                    errors.name ? "border-red-500 focus:border-red-500" : "border-[#B5B5B5] focus:border-[#97400C]"
                  }`}
                />
                {errors.name && <span className="text-red-500 text-[12px] font-montserrat">{errors.name}</span>}
              </div>

              {/* Field 2: Email */}
              <div className="flex flex-col gap-1.5 w-full">
                <label className="font-montserrat text-[#344054] text-[14px] font-medium leading-[20px]">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Nhập Email của bạn"
                  className={`w-full font-montserrat h-11 px-5 text-[14px] rounded-[8px] bg-white border outline-none transition-all placeholder:text-[#A7A7A7] text-[#383838] ${
                    errors.email ? "border-red-500 focus:border-red-500" : "border-[#B5B5B5] focus:border-[#97400C]"
                  }`}
                />
                {errors.email && <span className="text-red-500 text-[12px] font-montserrat">{errors.email}</span>}
              </div>

              {/* Field 3: Số điện thoại */}
              <div className="flex flex-col gap-1.5 w-full">
                <label className="font-montserrat text-[#344054] text-[14px] font-medium leading-[20px]">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Nhập Số điện thoại của bạn"
                  className={`w-full font-montserrat h-11 px-5 text-[14px] rounded-[8px] bg-white border outline-none transition-all placeholder:text-[#A7A7A7] text-[#383838] ${
                    errors.phone ? "border-red-500 focus:border-red-500" : "border-[#B5B5B5] focus:border-[#97400C]"
                  }`}
                />
                {errors.phone && <span className="text-red-500 text-[12px] font-montserrat">{errors.phone}</span>}
              </div>

              {/* Field 4: Nội dung */}
              <div className="flex flex-col gap-1.5 w-full">
                <label className="font-montserrat text-[#344054] text-[14px] font-medium leading-[20px]">
                  Nội dung
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Nhập nội dung"
                  className={`w-full font-montserrat h-[138px] py-3 px-5 text-[14px] rounded-[8px] bg-white border outline-none transition-all placeholder:text-[#A7A7A7] text-[#383838] resize-none ${
                    errors.message ? "border-red-500 focus:border-red-500" : "border-[#B5B5B5] focus:border-[#97400C]"
                  }`}
                />
                {errors.message && <span className="text-red-500 text-[12px] font-montserrat">{errors.message}</span>}
              </div>

              {/* Success Alert */}
              {isSubmitted && (
                <div className="p-4 bg-green-50 text-green-700 text-sm font-montserrat rounded-lg border border-green-200">
                  Cảm ơn bạn đã liên hệ! Thông tin của bạn đã được gửi thành công. Chúng tôi sẽ phản hồi sớm nhất.
                </div>
              )}

              {/* Submit Button wrapper */}
              <div className="w-full mt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-[48px] bg-[#97400C] hover:bg-[#7E3208] disabled:bg-[#97400C]/50 text-white flex items-center justify-center font-montserrat text-[16px] font-medium leading-[24px] rounded-[8px] transition-all duration-300 active:scale-[0.98] select-none cursor-pointer shadow-sm"
                >
                  {isSubmitting ? (
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    "Gửi liên hệ"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Vase Image */}
        <div className="flex-grow w-full lg:w-auto relative h-[450px] lg:h-[751px] rounded-[8px] overflow-hidden shadow-md">
          <Image
            src={vaseImage}
            alt="Gốm sứ nghệ thuật Vũ Gia"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 588px"
          />
        </div>
      </section>
    </div>
  );
}
