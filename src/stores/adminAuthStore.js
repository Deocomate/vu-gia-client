"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { adminRequest } from "@/lib/adminApi";
import { ADMIN_ROLES } from "@/lib/apiEnums";

export const useAdminAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      status: "idle",
      error: "",

      isAdmin() {
        return ADMIN_ROLES.includes(get().user?.role);
      },

      setTokens({ accessToken, refreshToken }) {
        set({ accessToken, refreshToken });
      },

      async loadCurrentUser() {
        if (!get().accessToken) {
          set({ status: "unauthenticated" });
          return null;
        }

        set({ status: "loading", error: "" });

        try {
          const user = await adminRequest("/auth/me", { method: "GET" });

          if (!ADMIN_ROLES.includes(user?.role)) {
            set({ user, status: "forbidden", error: "Tài khoản không có quyền truy cập CMS." });
            return user;
          }

          set({ user, status: "authenticated", error: "" });
          return user;
        } catch (error) {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            status: error.status === 403 ? "forbidden" : "unauthenticated",
            error: error.message || "Không thể kiểm tra phiên đăng nhập.",
          });
          return null;
        }
      },

      async login(usernameOrEmail, password) {
        set({ status: "loading", error: "" });

        try {
          const data = await adminRequest("/auth/login", {
            method: "POST",
            // Backend DTO field is literally `username` even though it accepts email too.
            body: { username: usernameOrEmail, password },
          });

          const { accessToken, refreshToken, user } = data || {};

          if (!ADMIN_ROLES.includes(user?.role)) {
            set({
              user: null,
              accessToken: null,
              refreshToken: null,
              status: "unauthenticated",
              error: "Tài khoản không có quyền truy cập CMS.",
            });
            throw new Error("Tài khoản không có quyền truy cập CMS.");
          }

          set({ user, accessToken, refreshToken, status: "authenticated", error: "" });
          return user;
        } catch (error) {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            status: "unauthenticated",
            error: error.message || "Đăng nhập không thành công.",
          });
          throw error;
        }
      },

      async logout() {
        const refreshToken = get().refreshToken;
        set({ user: null, accessToken: null, refreshToken: null, status: "unauthenticated", error: "" });

        if (refreshToken) {
          try {
            await adminRequest("/auth/logout", { method: "POST", body: { refreshToken } });
          } catch {
            // Best-effort revoke; local session is already cleared.
          }
        }
      },
    }),
    {
      name: "admin-auth",
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    },
  ),
);
