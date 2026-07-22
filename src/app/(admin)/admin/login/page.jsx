"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, LockKeyhole } from "lucide-react";
import { useAdminAuthStore } from "@/stores/adminAuthStore";
import { ROUTES, sanitizeNextPath } from "@/utils/routes";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = sanitizeNextPath(searchParams.get("next"), ROUTES.ADMIN);
  const { status, error, login, isAdmin } = useAdminAuthStore();
  const [form, setForm] = useState({ usernameOrEmail: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAdmin()) {
      router.replace(next);
    }
  }, [isAdmin, next, router]);

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await login(form.usernameOrEmail, form.password);
      router.replace(next);
    } catch {
      // error is surfaced via the store's `error` state below
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-10">
      <form onSubmit={submit} className="w-full max-w-md border border-white/10 bg-white p-6 shadow-2xl">
        <div className="mb-6">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center bg-zinc-950 text-white">
            <LockKeyhole className="h-5 w-5" aria-hidden="true" />
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
            Vũ Gia CMS
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-zinc-950">Đăng nhập quản trị</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Chỉ tài khoản ADMIN hoặc SUPERADMIN được truy cập khu vực này.
          </p>
        </div>

        {error && status !== "authenticated" && (
          <div className="mb-4 border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">
            {error}
          </div>
        )}

        <label className="mb-4 block">
          <span className="mb-1.5 block text-sm font-semibold text-zinc-800">
            Tên đăng nhập hoặc email
          </span>
          <input
            type="text"
            value={form.usernameOrEmail}
            onChange={(event) =>
              setForm((current) => ({ ...current, usernameOrEmail: event.target.value }))
            }
            className="h-11 w-full border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-950"
            autoComplete="username"
            required
          />
        </label>

        <label className="mb-5 block">
          <span className="mb-1.5 block text-sm font-semibold text-zinc-800">Mật khẩu</span>
          <div className="flex border border-zinc-300 focus-within:border-zinc-950">
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({ ...current, password: event.target.value }))
              }
              className="h-11 min-w-0 flex-1 px-3 text-sm outline-none"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="inline-flex h-11 w-11 items-center justify-center text-zinc-500 hover:text-zinc-950"
              aria-label="Hiện mật khẩu"
            >
              <Eye className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </label>

        <button
          type="submit"
          disabled={submitting || status === "loading"}
          className="h-11 w-full bg-zinc-950 px-4 text-sm font-semibold text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting || status === "loading" ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-sm font-semibold text-white">
          Đang tải trang đăng nhập...
        </main>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
