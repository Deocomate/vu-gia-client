"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCustomerAuthStore } from "@/shared/stores/customer-auth-store";
import { ROUTES } from "@/utils/routes";

/**
 * Client guard for customer-only routes (`(user)` layout, checkout, and the
 * checkout-result route per Phase 2/4 RT-F). Shows a loading state while
 * `loadCurrentUser()` resolves, redirects unauthenticated visitors to
 * `/dang-nhap?next=<currentPath>`, and renders `children` once authenticated.
 */
export default function RequireCustomerAuth({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const status = useCustomerAuthStore((state) => state.status);
  const user = useCustomerAuthStore((state) => state.user);
  const loadCurrentUser = useCustomerAuthStore((state) => state.loadCurrentUser);

  useEffect(() => {
    if (status === "idle") {
      loadCurrentUser();
    }
  }, [status, loadCurrentUser]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`${ROUTES.LOGIN}?next=${encodeURIComponent(pathname)}`);
    }
  }, [status, pathname, router]);

  if (status === "authenticated" && user) {
    return children;
  }

  return (
    <div className="flex min-h-[50vh] items-center justify-center px-6 py-24">
      <p className="font-montserrat text-[14px] text-[#383838]">Đang kiểm tra phiên đăng nhập...</p>
    </div>
  );
}
