import OrdersView from "@/views/OrdersView";
import { ROUTES } from "@/utils/routes";

export const metadata = {
  title: "Đơn hàng",
  description: "Theo dõi trạng thái đơn hàng tại Gốm Sứ Vũ Gia.",
  alternates: {
    canonical: ROUTES.ORDERS,
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function OrdersPage() {
  return <OrdersView />;
}
