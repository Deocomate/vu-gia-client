import AdminShell from "@/shared/components/admin/AdminShell";

export default function ProtectedAdminLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}
