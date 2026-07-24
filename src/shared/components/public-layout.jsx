import Footer from "@/shared/components/Footer";
import Header from "@/shared/components/Header";
import GlobalAltarWidget from "@/shared/components/GlobalAltarWidget";
import AppToaster from "@/shared/components/AppToaster";
import ConfirmDialogHost from "@/shared/components/ConfirmDialogHost";
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
