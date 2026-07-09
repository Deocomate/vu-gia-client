import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import GlobalAltarWidget from "@/components/shared/GlobalAltarWidget";

export default function PublicLayout({ children }) {
  return (
    <>
      <Header />
      <main className="overflow-x-hidden">{children}</main>
      <Footer />
      <GlobalAltarWidget />
    </>
  );
}
