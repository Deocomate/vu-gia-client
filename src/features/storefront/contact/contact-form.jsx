"use client";

import React, { useState } from "react";
import { publicPost, PublicApiError } from "@/shared/api/public-api";
import { toast } from "@/shared/utils/feedback";

/**
 * Shared contact form body, used both by the standalone `/lien-he` page
 * (`ContactView`) and `ContactModal` (product/customizer "Liên hệ tư vấn"
 * CTAs when cart mode is off). Extracted so both surfaces share identical
 * validation/submit logic instead of duplicating it.
 *
 * `initialContent` optionally pre-fills the `content` (local `message`)
 * field — e.g. with product/combo context from the modal caller — while
 * keeping it fully editable.
 */
export default function ContactForm({ initialContent = "" }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: initialContent,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // `name` and `content` (mapped from local `message` field) are required by
  // the backend contract; `email`/`phone` are optional, so only validate
  // their format client-side when the user actually filled them in.
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Họ tên không được để trống";
    }
    if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (formData.phone.trim() && !/^\d{9,11}$/.test(formData.phone.trim())) {
      newErrors.phone = "Số điện thoại phải gồm 9-11 chữ số";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Backend contract expects `content`, not the local `message` field
      // name — explicit rename, not a bare pass-through.
      await publicPost("/contact-requests", {
        name: formData.name.trim(),
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        content: formData.message.trim(),
      });

      setIsSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
      setErrors({});
      toast.success("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.");
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      const message =
        error instanceof PublicApiError
          ? error.message
          : "Không thể gửi liên hệ. Vui lòng thử lại sau.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
  );
}
