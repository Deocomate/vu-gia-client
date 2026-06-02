import PrivacyPolicyView from "@/views/PrivacyPolicyView";
import { ROUTES } from "@/utils/routes";

export const metadata = {
  title: "Bảo mật thông tin",
  description: "Chính sách bảo mật thông tin khách hàng của Gốm Sứ Vũ Gia.",
  alternates: {
    canonical: ROUTES.PRIVACY_POLICY,
  },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyView />;
}
