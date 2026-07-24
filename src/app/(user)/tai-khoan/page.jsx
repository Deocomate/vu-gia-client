import ProfileView from "@/features/account/ProfileView";
import { ROUTES } from "@/shared/utils/routes";

export const metadata = {
  title: "Tài khoản của tôi",
  description: "Quản lý tài khoản khách hàng tại Gốm Sứ Vũ Gia.",
  alternates: {
    canonical: ROUTES.ACCOUNT,
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfilePage() {
  return <ProfileView />;
}
