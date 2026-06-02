import HomeView from "@/views/HomeView";
import { ROUTES } from "@/utils/routes";

export const metadata = {
  title: "Trang chủ",
  description: "Gốm Sứ Vũ Gia - gốm sứ Bát Tràng chính hãng.",
  alternates: {
    canonical: ROUTES.HOME,
  },
};

export default function HomePage() {
  return <HomeView />;
}
