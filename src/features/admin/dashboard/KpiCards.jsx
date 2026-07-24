import { BadgePercent, Boxes, Inbox, Mail, ShoppingCart, TrendingUp, Users } from "lucide-react";
import { formatVnd } from "@/shared/api/adminApi";

function Card({ icon: Icon, label, value }) {
  return (
    <div className="border border-zinc-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <Icon className="h-5 w-5 text-zinc-500" aria-hidden="true" />
      </div>
      <p className="mt-6 text-sm font-semibold text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-zinc-950">{value}</p>
    </div>
  );
}

export default function KpiCards({ summary }) {
  if (!summary) return null;

  const cards = [
    { icon: TrendingUp, label: "Doanh thu tổng", value: formatVnd(summary.totalRevenue) },
    { icon: TrendingUp, label: "Doanh thu hôm nay", value: formatVnd(summary.todayRevenue) },
    { icon: TrendingUp, label: "Doanh thu tháng", value: formatVnd(summary.monthRevenue) },
    { icon: ShoppingCart, label: "Tổng đơn hàng", value: summary.totalOrders },
    { icon: ShoppingCart, label: "Đơn đã thanh toán", value: summary.paidOrders },
    { icon: ShoppingCart, label: "Đơn hôm nay", value: summary.todayOrders },
    { icon: ShoppingCart, label: "Đơn tháng này", value: summary.monthOrders },
    { icon: Users, label: "Khách hàng", value: summary.totalCustomers },
    { icon: Boxes, label: "Sản phẩm", value: summary.totalProducts },
    { icon: BadgePercent, label: "Sản phẩm đã bán", value: summary.totalProductsSold },
    { icon: Inbox, label: "Lead liên hệ mới", value: summary.newContactRequests },
    { icon: Mail, label: "Đăng ký newsletter", value: summary.activeSubscribers },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label} {...card} />
      ))}
    </div>
  );
}
