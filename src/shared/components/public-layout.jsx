import Footer from "@/shared/components/footer";
import Header from "@/shared/components/header";
import GlobalAltarWidget from "@/shared/components/global-altar-widget";
import AppToaster from "@/shared/components/app-toaster";
import ConfirmDialogHost from "@/shared/components/confirm-dialog-host";
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
