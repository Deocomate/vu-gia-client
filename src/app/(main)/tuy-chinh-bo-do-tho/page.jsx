import AltarCustomizerView from "@/views/AltarCustomizerView";
import { ROUTES } from "@/utils/routes";

export const metadata = {
  title: "Tùy chỉnh bộ đồ thờ",
  description:
    "Trực quan hóa và tùy chỉnh bộ đồ thờ theo kích thước bàn thờ và phong cách men.",
  alternates: {
    canonical: ROUTES.ALTAR_CUSTOMIZER,
  },
};

export default function AltarCustomizerPage() {
  return <AltarCustomizerView />;
}
