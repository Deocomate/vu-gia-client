import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import GlobalAltarWidget from "@/components/shared/GlobalAltarWidget";
import AppToaster from "@/components/shared/AppToaster";
import ConfirmDialogHost from "@/components/shared/ConfirmDialogHost";

export default function PublicLayout({ children, categories = [] }) {
  return (
    <>
      <Header categories={categories} />
      <main className="overflow-x-hidden">{children}</main>
      <Footer categories={categories} />
      <GlobalAltarWidget />
      <AppToaster />
      <ConfirmDialogHost />
    </>
  );
}
