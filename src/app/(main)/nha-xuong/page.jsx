import FactoryView from "@/views/FactoryView";
import { ROUTES } from "@/utils/routes";

export const metadata = {
  title: "Nhà xưởng",
  description: "Khám phá nhà xưởng và năng lực sản xuất của Gốm Sứ Vũ Gia.",
  alternates: {
    canonical: ROUTES.FACTORY,
  },
};

export default function FactoryPage() {
  return <FactoryView />;
}
