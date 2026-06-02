import ContactView from "@/views/ContactView";
import { ROUTES } from "@/utils/routes";

export const metadata = {
  title: "Liên hệ",
  description: "Liên hệ Gốm Sứ Vũ Gia để được tư vấn sản phẩm và dịch vụ.",
  alternates: {
    canonical: ROUTES.CONTACT,
  },
};

export default function ContactPage() {
  return <ContactView />;
}
