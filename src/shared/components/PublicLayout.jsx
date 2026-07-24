import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import GlobalAltarWidget from "@/components/shared/GlobalAltarWidget";
import AppToaster from "@/components/shared/AppToaster";
import ConfirmDialogHost from "@/components/shared/ConfirmDialogHost";
import CartAuthBridge from "@/features/cart/cart-auth-bridge";

export default function PublicLayout({ children, categories = [] }) {
  return (
    <>
      {/* No UI — wires customer-auth transitions to the cart store's guest→
          server merge/reset without the two stores importing each other
          (see cart-auth-bridge.jsx). Mounted once here since every
          storefront route group renders this layout. */}
      <CartAuthBridge />
      <Header categories={categories} />
      <main className="overflow-x-hidden">{children}</main>
      <Footer categories={categories} />
      <GlobalAltarWidget />
      <AppToaster />
      <ConfirmDialogHost />
    </>
  );
}
