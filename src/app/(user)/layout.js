import PublicLayout from "@/shared/components/public-layout";
import RequireCustomerAuth from "@/features/auth/require-customer-auth";

export default function UserLayout({ children }) {
  return (
    <PublicLayout>
      <RequireCustomerAuth>{children}</RequireCustomerAuth>
    </PublicLayout>
  );
}
