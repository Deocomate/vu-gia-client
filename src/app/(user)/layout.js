import PublicLayout from "@/shared/components/PublicLayout";
import RequireCustomerAuth from "@/features/auth/RequireCustomerAuth";

export default function UserLayout({ children }) {
  return (
    <PublicLayout>
      <RequireCustomerAuth>{children}</RequireCustomerAuth>
    </PublicLayout>
  );
}
