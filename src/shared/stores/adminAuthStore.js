"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiRequest } from "@/shared/api/api-client";
import { ADMIN_ROLES } from "@/lib/apiEnums";

// Calls the shared api-client directly (not `adminRequest` from `@/lib/adminApi`)
// so this store never imports `@/lib/adminApi` — avoids a circular import,
// since `@/lib/adminApi` imports THIS store to bind its own requests. Both
// modules independently bind `@/shared/api/api-client` to `useAdminAuthStore`.
export const useAdminAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      status: "idle",
      error: "",

      isAdmin() {
        return ADMIN_ROLES.includes(get().user?.role);
      },

      /** Called by the shared api-client after a successful token refresh. */
      setAccessToken(accessToken) {
        set({ accessToken });
      },

      /** Local-only session clear (no network call) — used when a refresh fails. */
      clearSession() {
        set({ user: null, accessToken: null, status: "unauthenticated", error: "" });
      },

      async loadCurrentUser() {
        if (!get().accessToken) {
          set({ status: "unauthenticated" });
          return null;
        }

        set({ status: "loading", error: "" });

        try {
          const user = await apiRequest(useAdminAuthStore, "/auth/me", { method: "GET" });

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
            status: error.status === 403 ? "forbidden" : "unauthenticated",
            error: error.message || "Không thể kiểm tra phiên đăng nhập.",
          });
          return null;
        }
      },

      async login(usernameOrEmail, password) {
        set({ status: "loading", error: "" });

        try {
          const data = await apiRequest(useAdminAuthStore, "/auth/login", {
            method: "POST",
            // Backend DTO field is literally `username` even though it accepts email too.
            body: { username: usernameOrEmail, password },
          });

          const { accessToken, user } = data || {};

          if (!ADMIN_ROLES.includes(user?.role)) {
            set({
              user: null,
              accessToken: null,
              status: "unauthenticated",
              error: "Tài khoản không có quyền truy cập CMS.",
            });
            throw new Error("Tài khoản không có quyền truy cập CMS.");
          }

          set({ user, accessToken, status: "authenticated", error: "" });
          return user;
        } catch (error) {
          set({
            user: null,
            accessToken: null,
            status: "unauthenticated",
            error: error.message || "Đăng nhập không thành công.",
          });
          throw error;
        }
      },

      async logout() {
        // Refresh token now lives only in the httpOnly cookie — the backend
        // reads it server-side, no body needed (see docs/AUTH_USER_API.md §3.5).
        set({ user: null, accessToken: null, status: "unauthenticated", error: "" });

        try {
          await apiRequest(useAdminAuthStore, "/auth/logout", { method: "POST" });
        } catch {
          // Best-effort revoke; local session is already cleared.
        }
      },
    }),
    {
      name: "admin-auth",
      // Only the short-lived access token + user are persisted (bootstraps a
      // silent refresh attempt on reload); the refresh token is no longer
      // client-visible at all (httpOnly cookie, BE-1).
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      }),
    },
  ),
);
