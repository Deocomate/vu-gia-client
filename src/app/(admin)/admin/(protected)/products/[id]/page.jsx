import AdminProductDetailPage from "@/features/admin/AdminProductDetailPage";

export default async function AdminProductDetailRoute({ params }) {
  const { id } = await params;
  return <AdminProductDetailPage productId={id} />;
}
