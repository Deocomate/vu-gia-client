"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { useAdminAuthStore } from "@/stores/adminAuthStore";
import { ROUTES } from "@/utils/routes";

export default function AdminShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { status, error, loadCurrentUser } = useAdminAuthStore();

  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`${ROUTES.ADMIN_LOGIN}?next=${encodeURIComponent(pathname)}`);
    }
  }, [pathname, router, status]);

  if (status === "idle" || status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-100 text-sm font-semibold text-zinc-600">
        Đang kiểm tra phiên quản trị...
      </div>
    );
  }

  if (status === "forbidden") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-100 px-4">
        <div className="max-w-md border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-zinc-950">Không có quyền truy cập</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            {error || "Tài khoản hiện tại không thuộc nhóm STAFF, ADMIN hoặc SUPERADMIN."}
          </p>
          <button
            type="button"
            onClick={() => router.replace(ROUTES.HOME)}
            className="mt-6 h-11 bg-zinc-950 px-5 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900">
      <div className="lg:flex">
        <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="min-w-0 flex-1">
          <AdminTopbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="mx-auto max-w-[1600px] px-4 py-6 lg:px-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
