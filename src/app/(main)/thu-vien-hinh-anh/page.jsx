import GalleryView from "@/views/GalleryView";
import { ROUTES } from "@/utils/routes";

export const metadata = {
  title: "Thư viện hình ảnh",
  description: "Thư viện hình ảnh sản phẩm, showroom và nhà xưởng của Gốm Sứ Vũ Gia.",
  alternates: {
    canonical: ROUTES.GALLERY,
  },
};

export default function GalleryPage() {
  return <GalleryView />;
}
