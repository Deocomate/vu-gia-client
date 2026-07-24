import { Suspense } from "react";
import RegisterForm from "@/features/auth/components/register-form";
import { ROUTES } from "@/shared/utils/routes";

export const metadata = {
  title: "Đăng ký",
  description: "Tạo tài khoản Gốm Sứ Vũ Gia để theo dõi đơn hàng và mua sắm nhanh hơn.",
  alternates: {
    canonical: ROUTES.REGISTER,
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center font-montserrat text-[14px] text-[#383838]">
          Đang tải...
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
