import NewsView from "@/views/NewsView";
import { ROUTES } from "@/utils/routes";

export const metadata = {
  title: "Tin tức",
  description: "Tin tức và sự kiện mới nhất từ Gốm Sứ Vũ Gia.",
  alternates: {
    canonical: ROUTES.NEWS,
  },
};

export default function NewsPage() {
  return <NewsView />;
}
