import CheckoutView from "@/features/checkout/checkout-view";
import RequireCustomerAuth from "@/features/auth/require-customer-auth";
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
