import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";

export default function PublicLayout({ children }) {
  return (
    <>
      <Header />
      <main className="overflow-x-hidden">{children}</main>
      <Footer />
    </>
  );
}
