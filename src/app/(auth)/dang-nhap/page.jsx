import { Suspense } from "react";
import LoginForm from "@/features/auth/components/LoginForm";
import { ROUTES } from "@/shared/utils/routes";

export const metadata = {
  title: "Đăng nhập",
  description: "Đăng nhập tài khoản Gốm Sứ Vũ Gia để quản lý đơn hàng và thông tin cá nhân.",
  alternates: {
    canonical: ROUTES.LOGIN,
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center font-montserrat text-[14px] text-[#383838]">
          Đang tải...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
