"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCustomerAuthStore } from "@/shared/stores/customer-auth-store";
import { ROUTES, sanitizeNextPath } from "@/utils/routes";
import GoogleLoginButton from "./GoogleLoginButton";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = sanitizeNextPath(searchParams.get("next"), ROUTES.ACCOUNT);

  const login = useCustomerAuthStore((state) => state.login);
  const storeError = useCustomerAuthStore((state) => state.error);
  const status = useCustomerAuthStore((state) => state.status);

  const [form, setForm] = useState({ usernameOrEmail: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errors = {};
    if (!form.usernameOrEmail.trim()) {
      errors.usernameOrEmail = "Vui lòng nhập tên đăng nhập hoặc email";
    }
    if (!form.password) {
      errors.password = "Vui lòng nhập mật khẩu";
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
      await login(form.usernameOrEmail.trim(), form.password);
      router.replace(next);
    } catch {
      // error is surfaced via the store's `error` state below
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-[440px] mx-auto px-6 py-16">
      <h1 className="font-montserrat text-[#97400C] text-[24px] font-[700] mb-2 text-center">
        Đăng nhập
      </h1>
      <p className="font-montserrat text-[#383838] text-[14px] mb-8 text-center">
        Đăng nhập để quản lý đơn hàng và thông tin tài khoản của bạn.
      </p>

      {storeError && status !== "authenticated" && (
        <div className="mb-4 rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-montserrat text-red-600">
          {storeError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="login-usernameOrEmail"
            className="font-montserrat text-[#344054] text-[14px] font-medium leading-[20px]"
          >
            Tên đăng nhập hoặc email
          </label>
          <input
            id="login-usernameOrEmail"
            type="text"
            name="usernameOrEmail"
            value={form.usernameOrEmail}
            onChange={handleChange}
            autoComplete="username"
            className={`w-full font-montserrat h-11 px-5 text-[14px] rounded-[8px] bg-white border outline-none transition-all placeholder:text-[#A7A7A7] text-[#383838] ${
              fieldErrors.usernameOrEmail
                ? "border-red-500 focus:border-red-500"
                : "border-[#B5B5B5] focus:border-[#97400C]"
            }`}
          />
          {fieldErrors.usernameOrEmail && (
            <span className="text-red-500 text-[12px] font-montserrat">
              {fieldErrors.usernameOrEmail}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="login-password"
            className="font-montserrat text-[#344054] text-[14px] font-medium leading-[20px]"
          >
            Mật khẩu
          </label>
          <input
            id="login-password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            className={`w-full font-montserrat h-11 px-5 text-[14px] rounded-[8px] bg-white border outline-none transition-all placeholder:text-[#A7A7A7] text-[#383838] ${
              fieldErrors.password
                ? "border-red-500 focus:border-red-500"
                : "border-[#B5B5B5] focus:border-[#97400C]"
            }`}
          />
          {fieldErrors.password && (
            <span className="text-red-500 text-[12px] font-montserrat">{fieldErrors.password}</span>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting || status === "loading"}
          className="w-full h-[48px] bg-[#97400C] hover:bg-[#7E3208] disabled:bg-[#97400C]/50 text-white flex items-center justify-center font-montserrat text-[16px] font-medium leading-[24px] rounded-[8px] transition-all duration-300 active:scale-[0.98] select-none cursor-pointer shadow-sm"
        >
          {submitting || status === "loading" ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>

      <GoogleLoginButton className="mt-5" onSuccess={() => router.replace(next)} />

      <p className="mt-6 text-center font-montserrat text-[14px] text-[#383838]">
        Chưa có tài khoản?{" "}
        <Link
          href={`${ROUTES.REGISTER}?next=${encodeURIComponent(next)}`}
          className="text-[#97400C] font-semibold hover:underline"
        >
          Đăng ký ngay
        </Link>
      </p>
    </section>
  );
}
