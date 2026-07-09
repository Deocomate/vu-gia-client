import AdminOrderDetailPage from "@/features/admin/AdminOrderDetailPage";

export default async function AdminOrderDetailRoute({ params }) {
  const { id } = await params;
  return <AdminOrderDetailPage orderId={id} />;
}
