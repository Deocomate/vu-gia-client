import ReturnPolicyView from "@/views/ReturnPolicyView";
import { ROUTES } from "@/utils/routes";

export const metadata = {
  title: "Chính sách đổi trả",
  description: "Chính sách đổi trả sản phẩm của Gốm Sứ Vũ Gia.",
  alternates: {
    canonical: ROUTES.RETURN_POLICY,
  },
};

export default function ReturnPolicyPage() {
  return <ReturnPolicyView />;
}
