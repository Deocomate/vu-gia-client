import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import GlobalAltarWidget from "@/components/shared/GlobalAltarWidget";
import AppToaster from "@/components/shared/AppToaster";
import ConfirmDialogHost from "@/components/shared/ConfirmDialogHost";

export default function PublicLayout({ children }) {
  return (
    <>
      <Header />
      <main className="overflow-x-hidden">{children}</main>
      <Footer />
      <GlobalAltarWidget />
      <AppToaster />
      <ConfirmDialogHost />
    </>
  );
}
