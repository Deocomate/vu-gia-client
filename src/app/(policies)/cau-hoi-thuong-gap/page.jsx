import FaqView from "@/views/FaqView";
import { ROUTES } from "@/utils/routes";

export const metadata = {
  title: "Câu hỏi thường gặp",
  description: "Giải đáp các câu hỏi thường gặp khi mua hàng tại Gốm Sứ Vũ Gia.",
  alternates: {
    canonical: ROUTES.FAQ,
  },
};

export default function FaqPage() {
  return <FaqView />;
}
