"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BadgePercent, FileText, Inbox, Package, ShoppingCart } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import { adminApi, formatVnd, normalizeCollection } from "@/lib/adminApi";
import { ROUTES } from "@/utils/routes";

const CARDS = [
  { label: "Sản phẩm", key: "products", href: ROUTES.ADMIN_PRODUCTS, icon: Package },
  { label: "Đơn hàng", key: "orders", href: ROUTES.ADMIN_ORDERS, icon: ShoppingCart },
  { label: "Tin tức", key: "news", href: ROUTES.ADMIN_NEWS, icon: FileText },
  { label: "Lead mới", key: "leads", href: ROUTES.ADMIN_CONTACT_LEADS, icon: Inbox },
  { label: "Coupon", key: "coupons", href: ROUTES.ADMIN_COUPONS, icon: BadgePercent },
];

export default function AdminDashboard() {
  const [state, setState] = useState({ loading: true, error: "", data: {} });

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [products, orders, news, leads, coupons] = await Promise.allSettled([
          adminApi.get("/admin/products"),
          adminApi.get("/admin/orders"),
          adminApi.get("/admin/news"),
          adminApi.get("/admin/contact-leads"),
          adminApi.get("/admin/coupons"),
        ]);

        if (!active) {
          return;
        }

        setState({
          loading: false,
          error: "",
          data: {
            products: products.status === "fulfilled" ? normalizeCollection(products.value).items : [],
            orders: orders.status === "fulfilled" ? normalizeCollection(orders.value).items : [],
            news: news.status === "fulfilled" ? normalizeCollection(news.value).items : [],
            leads: leads.status === "fulfilled" ? normalizeCollection(leads.value).items : [],
            coupons: coupons.status === "fulfilled" ? normalizeCollection(coupons.value).items : [],
          },
        });
      } catch (error) {
        if (active) {
          setState({ loading: false, error: error.message, data: {} });
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  const revenue = useMemo(
    () =>
      (state.data.orders || [])
        .filter((order) => order.status === "COMPLETED")
        .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0),
    [state.data.orders],
  );

  return (
    <div>
      <div className="mb-6 border border-zinc-200 bg-white p-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Admin CMS
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-zinc-950">
          Tổng quan vận hành Vũ Gia
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-500">
          Dữ liệu tổng hợp từ các endpoint admin hiện có. User và Review đang chờ backend bổ sung.
        </p>
      </div>

      {state.error && (
        <div className="mb-4 border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
          {state.error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {CARDS.map((card) => {
          const Icon = card.icon;
          const count = state.loading ? "..." : state.data[card.key]?.length || 0;

          return (
            <Link
              key={card.key}
              href={card.href}
              className="border border-zinc-200 bg-white p-4 transition hover:border-zinc-950"
            >
              <div className="flex items-center justify-between">
                <Icon className="h-5 w-5 text-zinc-500" aria-hidden="true" />
                <ArrowRight className="h-4 w-4 text-zinc-400" aria-hidden="true" />
              </div>
              <p className="mt-6 text-sm font-semibold text-zinc-500">{card.label}</p>
              <p className="mt-2 text-3xl font-semibold text-zinc-950">{count}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <section className="border border-zinc-200 bg-white p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-950">Đơn hàng gần đây</h2>
            <Link href={ROUTES.ADMIN_ORDERS} className="text-sm font-semibold text-zinc-950">
              Xem tất cả
            </Link>
          </div>
          <div className="mt-4 divide-y divide-zinc-100">
            {(state.data.orders || []).slice(0, 6).map((order) => (
              <Link
                key={order.id}
                href={`${ROUTES.ADMIN_ORDERS}/${order.id}`}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div>
                  <p className="font-semibold text-zinc-950">#{order.orderNumber || order.id}</p>
                  <p className="text-sm text-zinc-500">{order.customerName || order.customerPhone}</p>
                </div>
                <div className="text-right">
                  <StatusBadge value={order.status} />
                  <p className="mt-1 text-sm font-semibold text-zinc-900">
                    {formatVnd(order.totalAmount)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="border border-zinc-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-zinc-950">Doanh thu hoàn tất</h2>
          <p className="mt-4 text-3xl font-semibold text-zinc-950">{formatVnd(revenue)}</p>
          <p className="mt-3 text-sm leading-6 text-zinc-500">
            Tính từ các đơn có trạng thái `COMPLETED` trong dữ liệu hiện tải.
          </p>
        </section>
      </div>
    </div>
  );
}
