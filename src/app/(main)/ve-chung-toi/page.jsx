import AboutView from "@/views/AboutView";
import { ROUTES } from "@/utils/routes";

export const metadata = {
  title: "Về chúng tôi",
  description: "Gốm Sứ Vũ Gia - kết tinh di sản rực rỡ nghìn năm lửa đỏ Bát Tràng.",
  alternates: {
    canonical: ROUTES.ABOUT,
  },
};

export default function AboutPage() {
  return <AboutView />;
}
