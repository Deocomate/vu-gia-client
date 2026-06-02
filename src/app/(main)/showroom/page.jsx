import ShowroomView from "@/views/ShowroomView";
import { ROUTES } from "@/utils/routes";

export const metadata = {
  title: "Showroom",
  description: "Không gian showroom trưng bày sản phẩm gốm sứ của Gốm Sứ Vũ Gia.",
  alternates: {
    canonical: ROUTES.SHOWROOM,
  },
};

export default function ShowroomPage() {
  return <ShowroomView />;
}
