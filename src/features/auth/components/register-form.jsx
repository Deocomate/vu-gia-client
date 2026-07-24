"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCustomerAuthStore } from "@/shared/stores/customer-auth-store";
import { ROUTES, sanitizeNextPath } from "@/shared/utils/routes";
import { toast } from "@/shared/utils/feedback";
import GoogleLoginButton from "./google-login-button";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Field({ id, label, name, value, onChange, error, type = "text", autoComplete }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-montserrat text-[#344054] text-[14px] font-medium leading-[20px]">
        {label}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        className={`w-full font-montserrat h-11 px-5 text-[14px] rounded-[8px] bg-white border outline-none transition-all placeholder:text-[#A7A7A7] text-[#383838] ${
          error ? "border-red-500 focus:border-red-500" : "border-[#B5B5B5] focus:border-[#97400C]"
        }`}
      />
      {error && <span className="text-red-500 text-[12px] font-montserrat">{error}</span>}
    </div>
  );
}

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = sanitizeNextPath(searchParams.get("next"), ROUTES.ACCOUNT);

  const register = useCustomerAuthStore((state) => state.register);
  const login = useCustomerAuthStore((state) => state.login);
  const storeError = useCustomerAuthStore((state) => state.error);
  const status = useCustomerAuthStore((state) => state.status);

  const [form, setForm] = useState({ username: "", email: "", password: "", name: "", phone: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Matches backend Bean Validation constraints (docs/AUTH_USER_API.md §3.1):
  // username 3-50, email valid + <=50, password 6-100, phone exactly 10
  // digits when provided (optional otherwise).
  const validate = () => {
    const errors = {};
    const username = form.username.trim();
    if (username.length < 3 || username.length > 50) {
      errors.username = "Tên đăng nhập phải từ 3-50 ký tự";
    }

    const email = form.email.trim();
    if (!EMAIL_PATTERN.test(email) || email.length > 50) {
      errors.email = "Email không hợp lệ (tối đa 50 ký tự)";
    }

    if (form.password.length < 6 || form.password.length > 100) {
      errors.password = "Mật khẩu phải từ 6-100 ký tự";
    }

    if (form.name.trim().length > 50) {
      errors.name = "Họ tên tối đa 50 ký tự";
    }

    if (form.phone.trim() && !/^\d{10}$/.test(form.phone.trim())) {
      errors.phone = "Số điện thoại phải gồm đúng 10 chữ số";
    }

    return errors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      await register({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        name: form.name.trim() || undefined,
        phone: form.phone.trim() || undefined,
      });

      // Register only returns the created account (no tokens) — auto-login
      // right after for a one-step signup UX instead of bouncing to /dang-nhap.
      await login(form.username.trim(), form.password);
      toast.success("Đăng ký thành công!");
      router.replace(next);
    } catch (error) {
      toast.error(error.message || "Đăng ký không thành công.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-[440px] mx-auto px-6 py-16">
      <h1 className="font-montserrat text-[#97400C] text-[24px] font-[700] mb-2 text-center">
        Đăng ký
      </h1>
      <p className="font-montserrat text-[#383838] text-[14px] mb-8 text-center">
        Tạo tài khoản để theo dõi đơn hàng và mua sắm nhanh hơn.
      </p>

      {storeError && status !== "authenticated" && (
        <div className="mb-4 rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-montserrat text-red-600">
          {storeError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <Field
          id="register-username"
          label="Tên đăng nhập"
          name="username"
          value={form.username}
          onChange={handleChange}
          error={fieldErrors.username}
          autoComplete="username"
        />
        <Field
          id="register-email"
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          error={fieldErrors.email}
          autoComplete="email"
        />
        <Field
          id="register-password"
          label="Mật khẩu"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          error={fieldErrors.password}
          autoComplete="new-password"
        />
        <Field
          id="register-name"
          label="Họ tên (không bắt buộc)"
          name="name"
          value={form.name}
          onChange={handleChange}
          error={fieldErrors.name}
          autoComplete="name"
        />
        <Field
          id="register-phone"
          label="Số điện thoại (không bắt buộc)"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          error={fieldErrors.phone}
          autoComplete="tel"
        />

        <button
          type="submit"
          disabled={submitting || status === "loading"}
          className="w-full h-[48px] bg-[#97400C] hover:bg-[#7E3208] disabled:bg-[#97400C]/50 text-white flex items-center justify-center font-montserrat text-[16px] font-medium leading-[24px] rounded-[8px] transition-all duration-300 active:scale-[0.98] select-none cursor-pointer shadow-sm"
        >
          {submitting || status === "loading" ? "Đang đăng ký..." : "Đăng ký"}
        </button>
      </form>

      <GoogleLoginButton className="mt-5" onSuccess={() => router.replace(next)} />

      <p className="mt-6 text-center font-montserrat text-[14px] text-[#383838]">
        Đã có tài khoản?{" "}
        <Link
          href={`${ROUTES.LOGIN}?next=${encodeURIComponent(next)}`}
          className="text-[#97400C] font-semibold hover:underline"
        >
          Đăng nhập
        </Link>
      </p>
    </section>
  );
}
