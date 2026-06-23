"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/utils/routes";

export default function CustomerServiceSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Trạng thái đơn hàng", href: ROUTES.ORDERS },
    { name: "Tài khoản của tôi", href: ROUTES.ACCOUNT },
    { name: "Chính sách vận chuyển", href: ROUTES.SHIPPING_POLICY },
    { name: "Chính sách đổi trả", href: ROUTES.RETURN_POLICY },
    { name: "Bảo mật thông tin", href: ROUTES.PRIVACY_POLICY },
    { name: "FAQ", href: ROUTES.FAQ },
  ];

  return (
    <aside className="w-full md:w-[280px] shrink-0 font-montserrat">
      {/* Sidebar Header */}
      <div className="border-b border-neutral-200 pb-[30px]">
        <h2 className="text-[#2E2F2A] text-[20px] font-[500] leading-[40px]">
          Dịch vụ khách hàng
        </h2>
      </div>

      {/* Menu List */}
      <ul className="flex flex-col">
        {menuItems.map((item, idx) => {
          const isActive = pathname === item.href;
          return (
            <li key={idx} className="border-b border-neutral-200 py-[7px]">
              <Link
                href={item.href}
                className={`block text-[15px] leading-[40px] transition-all duration-300 ${
                  isActive
                    ? "text-[#2E2F2A] font-[700] select-none"
                    : "text-[#2E2F2A] font-[500] hover:text-primary"
                }`}
              >
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
