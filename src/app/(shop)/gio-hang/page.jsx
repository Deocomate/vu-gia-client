import CartView from "@/views/CartView";
import { ROUTES } from "@/utils/routes";

export const metadata = {
  title: "Giỏ hàng",
  description: "Giỏ hàng của bạn tại Gốm Sứ Vũ Gia.",
  alternates: {
    canonical: ROUTES.CART,
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartPage() {
  return <CartView />;
}
