import OrderDetailView from "@/views/OrderDetailView";

export const metadata = {
  title: "Chi tiết đơn hàng",
  description: "Chi tiết đơn hàng tại Gốm Sứ Vũ Gia.",
  robots: {
    index: false,
    follow: false,
  },
};

// Guarded by `RequireCustomerAuth` already wrapping every route under the
// `(user)` layout (`src/app/(user)/layout.js`) — no extra wrapper needed here.
export default async function OrderDetailPage({ params }) {
  const { id } = await params;

  return <OrderDetailView orderId={id} />;
}
