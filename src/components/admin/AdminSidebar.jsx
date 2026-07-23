"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BadgePercent,
  Boxes,
  FileText,
  Gauge,
  ImageIcon,
  Inbox,
  Layout,
  MapPin,
  MessageSquare,
  Newspaper,
  Package,
  PanelTop,
  RefreshCcw,
  ShoppingCart,
  Tags,
  Truck,
  Users,
} from "lucide-react";
import { ROUTES } from "@/utils/routes";

export const ADMIN_NAV = [
  { label: "Tổng quan", href: ROUTES.ADMIN, icon: Gauge },
  { label: "Sản phẩm", href: ROUTES.ADMIN_PRODUCTS, icon: Package },
  { label: "Danh mục", href: ROUTES.ADMIN_CATEGORIES, icon: Tags },
  { label: "Tải ảnh lên", href: ROUTES.ADMIN_MEDIA, icon: ImageIcon },
  { label: "Đơn hàng", href: ROUTES.ADMIN_ORDERS, icon: ShoppingCart },
  { label: "Coupon", href: ROUTES.ADMIN_COUPONS, icon: BadgePercent },
  { label: "Tin tức", href: ROUTES.ADMIN_NEWS, icon: Newspaper },
  { label: "Trang CMS", href: ROUTES.ADMIN_PAGES, icon: FileText },
  { label: "FAQ", href: ROUTES.ADMIN_FAQ, icon: MessageSquare },
  { label: "Thư viện ảnh", href: ROUTES.ADMIN_GALLERY, icon: Boxes },
  { label: "Showroom", href: ROUTES.ADMIN_SHOWROOMS, icon: MapPin },
  { label: "Vận chuyển", href: ROUTES.ADMIN_SHIPPING_METHODS, icon: Truck },
  { label: "Banner", href: ROUTES.ADMIN_BANNERS, icon: PanelTop },
  { label: "Liên hệ", href: ROUTES.ADMIN_CONTACT_LEADS, icon: Inbox },
  { label: "Newsletter", href: ROUTES.ADMIN_NEWSLETTER, icon: Layout },
  { label: "Redirect", href: ROUTES.ADMIN_REDIRECTS, icon: RefreshCcw },
  { label: "Người dùng", href: ROUTES.ADMIN_USERS, icon: Users },
];

export default function AdminSidebar({ open, onClose }) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-zinc-950/40 lg:hidden ${open ? "block" : "hidden"}`}
        onClick={onClose}
        role="presentation"
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[280px] border-r border-zinc-200 bg-zinc-950 text-white transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center border-b border-white/10 px-5">
          <Link href={ROUTES.ADMIN} className="block">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-200">
              Vũ Gia
            </p>
            <p className="text-lg font-bold text-white">Admin CMS</p>
          </Link>
        </div>
        <nav className="h-[calc(100vh-4rem)] overflow-y-auto px-3 py-4">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== ROUTES.ADMIN && pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`mb-1 flex h-10 items-center gap-3 px-3 text-sm font-semibold transition ${
                  active
                    ? "bg-white text-zinc-950"
                    : "text-zinc-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
