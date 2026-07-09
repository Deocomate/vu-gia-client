import AdminResourceManager from "@/features/admin/AdminResourceManager";
import { resources } from "@/features/admin/adminResources";

export default function AdminResourcePage({ resourceKey }) {
  const resource = resources[resourceKey];

  if (!resource) {
    return (
      <div className="border border-rose-200 bg-rose-50 p-6 text-sm font-semibold text-rose-700">
        Resource không tồn tại: {resourceKey}
      </div>
    );
  }

  return (
    <div>
      <AdminResourceManager resource={resource} />
      {resource.auxiliary && <AdminResourceManager resource={resource.auxiliary} compact />}
    </div>
  );
}
