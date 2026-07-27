import PublicLayout from "@/shared/components/public-layout";
import CartModeGuard from "./cart-mode-guard";

export default function ShopLayout({ children }) {
  return (
    <PublicLayout>
      <CartModeGuard>{children}</CartModeGuard>
    </PublicLayout>
  );
}
