"use client";

import { LogOut, Menu, ShieldCheck } from "lucide-react";
import { useAdminAuthStore } from "@/stores/adminAuthStore";

export default function AdminTopbar({ onMenuClick }) {
  const { user, signOut } = useAdminAuthStore();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex h-10 w-10 items-center justify-center border border-zinc-300 text-zinc-700 lg:hidden"
          aria-label="Mở menu"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Quản trị nội dung
          </p>
          <h1 className="text-base font-semibold text-zinc-950">Gốm Sứ Vũ Gia</h1>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 border border-zinc-200 px-3 py-2 text-sm text-zinc-700 sm:flex">
          <ShieldCheck className="h-4 w-4 text-emerald-600" aria-hidden="true" />
          <span className="font-semibold">{user?.role || "ADMIN"}</span>
          <span className="text-zinc-400">{user?.email}</span>
        </div>
        <button
          type="button"
          onClick={signOut}
          className="inline-flex h-10 items-center gap-2 border border-zinc-300 px-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Đăng xuất</span>
        </button>
      </div>
    </header>
  );
}
