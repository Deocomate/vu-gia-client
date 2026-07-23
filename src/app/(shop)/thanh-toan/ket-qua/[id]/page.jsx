import OrderResultView from "@/views/OrderResultView";
import RequireCustomerAuth from "@/features/auth/RequireCustomerAuth";

export const metadata = {
  title: "Kết quả đặt hàng",
  description: "Chi tiết đơn hàng vừa đặt tại Gốm Sứ Vũ Gia.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CheckoutResultPage({ params }) {
  const { id } = await params;

  return (
    <RequireCustomerAuth>
      <OrderResultView orderId={id} />
    </RequireCustomerAuth>
  );
}
