"use client";

import { create } from "zustand";
import { adminApi, adminRequest } from "@/lib/adminApi";

const ADMIN_ROLES = ["STAFF", "ADMIN", "SUPERADMIN"];

export const useAdminAuthStore = create((set, get) => ({
  user: null,
  status: "idle",
  error: "",

  isAdmin() {
    return ADMIN_ROLES.includes(get().user?.role);
  },

  async loadCurrentUser() {
    set({ status: "loading", error: "" });

    try {
      const user = await adminApi.get("/users/me");
      const role = user?.role;

      if (!ADMIN_ROLES.includes(role)) {
        set({
          user,
          status: "forbidden",
          error: "Tài khoản không có quyền truy cập CMS.",
        });
        return user;
      }

      set({ user, status: "authenticated", error: "" });
      return user;
    } catch (error) {
      set({
        user: null,
        status: error.status === 403 ? "forbidden" : "unauthenticated",
        error: error.message || "Không thể kiểm tra phiên đăng nhập.",
      });
      return null;
    }
  },

  async signIn(email, password) {
    set({ status: "loading", error: "" });

    try {
      await adminRequest("/auth/sign-in/email", {
        method: "POST",
        body: { email, password },
      });

      return get().loadCurrentUser();
    } catch (error) {
      set({
        user: null,
        status: "unauthenticated",
        error: error.message || "Đăng nhập không thành công.",
      });
      throw error;
    }
  },

  async signOut() {
    try {
      await adminRequest("/auth/sign-out", { method: "POST" });
    } finally {
      set({ user: null, status: "unauthenticated", error: "" });
    }
  },
}));
