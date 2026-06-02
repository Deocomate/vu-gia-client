import ShippingPolicyView from "@/views/ShippingPolicyView";
import { ROUTES } from "@/utils/routes";

export const metadata = {
  title: "Chính sách vận chuyển",
  description: "Thông tin vận chuyển và giao nhận đơn hàng tại Gốm Sứ Vũ Gia.",
  alternates: {
    canonical: ROUTES.SHIPPING_POLICY,
  },
};

export default function ShippingPolicyPage() {
  return <ShippingPolicyView />;
}
