import AdminShell from "@/shared/components/admin/admin-shell";

export default function ProtectedAdminLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}
