import AltarDesignLibraryView from "@/features/account/altar-design-library-view";
import { ROUTES } from "@/shared/utils/routes";

export const metadata = {
  title: "Thư viện thiết kế",
  description: "Danh sách bố cục bàn thờ đã lưu tại Gốm Sứ Vũ Gia.",
  alternates: {
    canonical: ROUTES.ALTAR_DESIGN_LIBRARY,
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AltarDesignLibraryPage() {
  return <AltarDesignLibraryView />;
}
