"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiRequest } from "@/shared/api/api-client";

// Maps backend business error codes (docs/AUTH_USER_API.md §2) to Vietnamese
// copy. Falls back to the envelope message (already Vietnamese from the
// backend) or a generic fallback when the code isn't one we special-case.
const ERROR_MESSAGES = {
  4011: "Sai tên đăng nhập/email hoặc mật khẩu.",
  4090: "Tên đăng nhập đã tồn tại.",
  4091: "Email đã tồn tại.",
  4004: "Mật khẩu cũ không đúng.",
  4015: "Đăng nhập Google không hợp lệ. Vui lòng thử lại.",
  4016: "Email Google chưa được xác minh.",
};

function resolveErrorMessage(error, fallback) {
  return ERROR_MESSAGES[error?.code] || error?.message || fallback;
}

/**
 * Customer session store. Mirrors `useAdminAuthStore`'s shape (persist key,
 * `accessToken`/`user` partialize, `setAccessToken`/`clearSession` contract
 * consumed by `@/shared/api/api-client`) but does NOT gate on any role — any
 * authenticated `CUSTOMER` (or any role, really) is a valid session here;
 * role-based access control is the admin store's job, not this one's.
 *
 * Calls `@/shared/api/api-client` directly (not `@/features/auth/customer-api`)
 * so this module — living under `@/shared/*` — never imports from
 * `@/features/*`, preserving the one-directional shared→features dependency
 * rule. `@/features/auth/customer-api.js` is a separate thin binding for
 * OTHER feature code (cart/checkout/orders) to make customer-authenticated
 * calls; it imports this store, not the other way around.
 */
export const useCustomerAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      status: "idle", // idle | loading | authenticated | unauthenticated
      error: "",

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
          const user = await apiRequest(useCustomerAuthStore, "/auth/me", { method: "GET" });
          set({ user, status: "authenticated", error: "" });
          return user;
        } catch (error) {
          set({
            user: null,
            accessToken: null,
            status: "unauthenticated",
            error: error.message || "Không thể kiểm tra phiên đăng nhập.",
          });
          return null;
        }
      },

      async register({ username, email, password, name, phone }) {
        set({ status: "loading", error: "" });

        try {
          // Register only returns the created UserResponse — no tokens
          // (docs/AUTH_USER_API.md §3.1). Callers typically follow up with
          // `login()` using the same credentials for a one-step signup UX.
          const user = await apiRequest(useCustomerAuthStore, "/auth/register", {
            method: "POST",
            body: { username, email, password, name, phone },
          });
          set({ status: "unauthenticated", error: "" });
          return user;
        } catch (error) {
          const message = resolveErrorMessage(error, "Đăng ký không thành công.");
          set({ status: "unauthenticated", error: message });
          throw new Error(message);
        }
      },

      async login(usernameOrEmail, password) {
        set({ status: "loading", error: "" });

        try {
          const data = await apiRequest(useCustomerAuthStore, "/auth/login", {
            method: "POST",
            // Backend DTO field is literally `username` even though it accepts email too.
            body: { username: usernameOrEmail, password },
          });

          const { accessToken, user } = data || {};
          set({ user, accessToken, status: "authenticated", error: "" });
          return user;
        } catch (error) {
          const message = resolveErrorMessage(error, "Đăng nhập không thành công.");
          set({ user: null, accessToken: null, status: "unauthenticated", error: message });
          throw new Error(message);
        }
      },

      async googleLogin(idToken) {
        set({ status: "loading", error: "" });

        try {
          const data = await apiRequest(useCustomerAuthStore, "/auth/google", {
            method: "POST",
            body: { idToken },
          });

          const { accessToken, user } = data || {};
          set({ user, accessToken, status: "authenticated", error: "" });
          return user;
        } catch (error) {
          const message = resolveErrorMessage(error, "Đăng nhập Google không thành công.");
          set({ user: null, accessToken: null, status: "unauthenticated", error: message });
          throw new Error(message);
        }
      },

      async logout() {
        // Refresh token now lives only in the httpOnly cookie — the backend
        // reads it server-side, no body needed (see docs/AUTH_USER_API.md §3.5).
        set({ user: null, accessToken: null, status: "unauthenticated", error: "" });

        try {
          await apiRequest(useCustomerAuthStore, "/auth/logout", { method: "POST" });
        } catch {
          // Best-effort revoke; local session is already cleared.
        }
      },

      async changePassword(oldPassword, newPassword) {
        try {
          await apiRequest(useCustomerAuthStore, "/auth/change-password", {
            method: "POST",
            body: { oldPassword, newPassword },
          });
        } catch (error) {
          throw new Error(resolveErrorMessage(error, "Đổi mật khẩu không thành công."));
        }
      },
    }),
    {
      name: "customer-auth",
      // Only the short-lived access token + user are persisted (bootstraps a
      // silent refresh attempt on reload); the refresh token is never
      // client-visible at all (httpOnly cookie, BE-1).
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      }),
    },
  ),
);
