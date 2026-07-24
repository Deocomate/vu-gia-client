import CheckoutView from "@/views/CheckoutView";
import RequireCustomerAuth from "@/features/auth/RequireCustomerAuth";
import { ROUTES } from "@/shared/utils/routes";

export const metadata = {
  title: "Thanh toán",
  description: "Hoàn tất đơn hàng tại Gốm Sứ Vũ Gia.",
  alternates: {
    canonical: ROUTES.CHECKOUT,
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutPage() {
  return (
    <RequireCustomerAuth>
      <CheckoutView />
    </RequireCustomerAuth>
  );
}
