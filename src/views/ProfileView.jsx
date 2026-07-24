"use client";

import React, { useState } from "react";
import CustomerServiceLayout from "@/features/account/components/CustomerServiceLayout";
import { ROUTES } from "@/shared/utils/routes";
import { toast } from "@/shared/utils/feedback";
import { useCustomerAuthStore } from "@/shared/stores/customer-auth-store";

function formatDob(dob) {
  if (!dob) return "Chưa cập nhật";
  const date = new Date(dob);
  if (Number.isNaN(date.getTime())) return dob;
  return date.toLocaleDateString("vi-VN");
}

/** A single label + read-only value row, styled like the original editable input row. */
function ReadOnlyRow({ label, value }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center mb-[20px] md:mb-[19px]">
      <span className="w-full md:w-[121px] font-montserrat font-[400] md:font-[600] text-[14px] md:text-[12px] text-[#2E2F2A] shrink-0 mb-[16px] md:mb-0">
        {label}
      </span>
      <span className="w-full max-w-[592px] min-h-[46px] md:h-[35px] border border-[#D1D5DB] md:border-[0.5px] md:border-[#909090] rounded-[6px] md:rounded-[5px] bg-neutral-50 px-[21px] md:px-3 font-montserrat font-[400] text-[14px] md:text-[12px] text-[#2E2F2A] flex items-center">
        {value || "Chưa cập nhật"}
      </span>
    </div>
  );
}

function PasswordField({ id, label, name, value, onChange, error }) {
  return (
    <div className="flex flex-col md:flex-row md:items-start mb-[20px] md:mb-[19px]">
      <label
        htmlFor={id}
        className="w-full md:w-[121px] font-montserrat font-[400] md:font-[600] text-[14px] md:text-[12px] text-[#2E2F2A] shrink-0 mb-[16px] md:mb-0 md:pt-[8px]"
      >
        {label}
      </label>
      <div className="w-full max-w-[592px] flex flex-col gap-1">
        <input
          id={id}
          type="password"
          name={name}
          value={value}
          onChange={onChange}
          autoComplete={name === "oldPassword" ? "current-password" : "new-password"}
          className={`w-full h-[46px] md:h-[35px] border rounded-[6px] md:rounded-[5px] bg-white px-[21px] md:px-3 font-montserrat font-[400] text-[14px] md:text-[12px] text-[#2E2F2A] focus:outline-none ${
            error ? "border-red-500 focus:border-red-500" : "border-[#D1D5DB] md:border-[0.5px] md:border-[#909090]"
          }`}
        />
        {error && <span className="text-red-500 text-[12px] font-montserrat">{error}</span>}
      </div>
    </div>
  );
}

const INITIAL_PASSWORD_FORM = { oldPassword: "", newPassword: "", confirmPassword: "" };

export default function ProfileView() {
  const breadcrumbs = [
    { name: "Trang chủ", href: ROUTES.HOME },
    { name: "Dịch vụ khách hàng", href: null },
    { name: "Tài khoản của tôi", href: null },
  ];

  // `RequireCustomerAuth` (the `(user)` layout guard) already resolves
  // `GET /api/auth/me` before rendering children, so `user` here is already
  // fresh — no need for a second /auth/me call (Phase 2's customer-auth-store).
  const user = useCustomerAuthStore((state) => state.user);
  const changePassword = useCustomerAuthStore((state) => state.changePassword);

  const [passwordForm, setPasswordForm] = useState(INITIAL_PASSWORD_FORM);
  const [passwordErrors, setPasswordErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handlePasswordFieldChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Matches backend Bean Validation (ChangePasswordRequest — AUTH_USER_API.md): newPassword 6-100 chars.
  const validatePasswordForm = () => {
    const errors = {};
    if (!passwordForm.oldPassword) {
      errors.oldPassword = "Vui lòng nhập mật khẩu hiện tại";
    }
    if (passwordForm.newPassword.length < 6 || passwordForm.newPassword.length > 100) {
      errors.newPassword = "Mật khẩu mới phải từ 6-100 ký tự";
    }
    if (passwordForm.confirmPassword !== passwordForm.newPassword) {
      errors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }
    return errors;
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    const errors = validatePasswordForm();
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      await changePassword(passwordForm.oldPassword, passwordForm.newPassword);
      toast.success("Đổi mật khẩu thành công!");
      setPasswordForm(INITIAL_PASSWORD_FORM);
      setPasswordErrors({});
    } catch (error) {
      // The store already resolves `4004` -> "Mật khẩu cũ không đúng."
      // (customer-auth-store.js's ERROR_MESSAGES map).
      setPasswordErrors({ oldPassword: error.message || "Đổi mật khẩu không thành công." });
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <CustomerServiceLayout breadcrumbs={breadcrumbs}>
        <div className="py-24 text-center font-montserrat text-[#909090] text-[15px]">
          Đang tải thông tin tài khoản...
        </div>
      </CustomerServiceLayout>
    );
  }

  const cardClassName =
    "w-full max-w-[920px] rounded-[6px] shadow-[0_4px_6px_-4px_rgba(0,0,0,0.1),_0_10px_15px_-3px_rgba(0,0,0,0.1)] md:shadow-[0px_4px_4px_rgba(0,0,0,0.25)] pt-[25px] pb-[25px] md:pt-[17px] md:pb-[24px] px-[49px] md:px-[89px] mb-6 font-montserrat";
  const cardBorderStyle = {
    border: "1px solid transparent",
    backgroundImage: "linear-gradient(white, white), linear-gradient(to bottom, #C76E00, rgba(199, 110, 0, 0))",
    backgroundOrigin: "border-box",
    backgroundClip: "padding-box, border-box",
  };

  return (
    <CustomerServiceLayout breadcrumbs={breadcrumbs}>
      {/* Title */}
      <h1 className="font-arima text-[#2E2F2A] text-[30px] md:text-[36px] font-[400] leading-[40px] mb-6">
        Tài khoản của tôi
      </h1>

      {/* Profile Card — read-only (RT-A: no customer self-update-profile endpoint exists) */}
      <div className={cardClassName} style={cardBorderStyle}>
        <h2 className="text-center font-archivo md:font-montserrat font-[700] text-[18px] md:text-[16px] text-[#C76E00] uppercase leading-[28px] md:leading-[40px] tracking-[0.18px] md:tracking-normal mb-[30px]">
          Hồ sơ cá nhân
        </h2>

        <div className="flex flex-col">
          <ReadOnlyRow label="Họ tên" value={user.name} />
          <ReadOnlyRow label="Số điện thoại" value={user.phone} />
          <ReadOnlyRow label="Email" value={user.email} />
          <ReadOnlyRow label="Giới tính" value={user.gender} />
          <ReadOnlyRow label="Ngày sinh" value={formatDob(user.dob)} />
        </div>
      </div>

      {/* Change Password Card */}
      <div className={cardClassName} style={cardBorderStyle}>
        <h2 className="text-center font-archivo md:font-montserrat font-[700] text-[18px] md:text-[16px] text-[#C76E00] uppercase leading-[28px] md:leading-[40px] tracking-[0.18px] md:tracking-normal mb-[30px]">
          Đổi mật khẩu
        </h2>

        <form onSubmit={handlePasswordSubmit} className="flex flex-col" noValidate>
          <PasswordField
            id="old-password"
            label="Mật khẩu hiện tại*"
            name="oldPassword"
            value={passwordForm.oldPassword}
            onChange={handlePasswordFieldChange}
            error={passwordErrors.oldPassword}
          />
          <PasswordField
            id="new-password"
            label="Mật khẩu mới*"
            name="newPassword"
            value={passwordForm.newPassword}
            onChange={handlePasswordFieldChange}
            error={passwordErrors.newPassword}
          />
          <PasswordField
            id="confirm-password"
            label="Xác nhận mật khẩu*"
            name="confirmPassword"
            value={passwordForm.confirmPassword}
            onChange={handlePasswordFieldChange}
            error={passwordErrors.confirmPassword}
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-[197px] h-[44px] md:h-[35px] mx-auto flex items-center justify-center bg-[#C76E00] hover:bg-[#a65c00] disabled:bg-[#C76E00]/50 rounded-[6px] md:rounded-[5px] text-white font-montserrat font-[700] text-[16px] leading-[28px] transition duration-200 cursor-pointer"
          >
            {submitting ? "Đang lưu..." : "Đổi mật khẩu"}
          </button>
        </form>
      </div>
    </CustomerServiceLayout>
  );
}
