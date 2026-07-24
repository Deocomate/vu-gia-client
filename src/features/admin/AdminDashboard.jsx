"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { subDays } from "date-fns";
import KpiCards from "@/features/admin/dashboard/KpiCards";
import TopProductsTable from "@/features/admin/dashboard/TopProductsTable";
import OrdersByStatusBar from "@/features/admin/dashboard/OrdersByStatusBar";
import { adminApi } from "@/shared/api/adminApi";
import { toast } from "@/shared/utils/feedback";

const RevenueChart = dynamic(() => import("@/features/admin/dashboard/RevenueChart"), {
  ssr: false,
  loading: () => (
    <section className="border border-zinc-200 bg-white p-5">
      <div className="h-72 animate-pulse bg-zinc-100" />
    </section>
  ),
});

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [limit, setLimit] = useState(10);
  const [range, setRange] = useState({
    from: subDays(new Date(), 30).toISOString(),
    to: new Date().toISOString(),
  });
  const [loading, setLoading] = useState(true);

  const loadSummary = useCallback(async () => {
    try {
      const data = await adminApi.get("/admin/dashboard/summary");
      setSummary(data);
    } catch (error) {
      toast.error(error.message || "Không thể tải tổng quan.");
    }
  }, []);

  const loadRevenue = useCallback(async () => {
    try {
      const data = await adminApi.get("/admin/dashboard/revenue", { from: range.from, to: range.to });
      setRevenue(data || []);
    } catch (error) {
      toast.error(error.message || "Không thể tải doanh thu.");
    }
  }, [range]);

  const loadTopProducts = useCallback(async () => {
    try {
      const data = await adminApi.get("/admin/dashboard/top-products", { limit });
      setTopProducts(data || []);
    } catch (error) {
      toast.error(error.message || "Không thể tải top sản phẩm.");
    }
  }, [limit]);

  useEffect(() => {
    setLoading(true);
    Promise.all([loadSummary(), loadRevenue(), loadTopProducts()]).finally(() => setLoading(false));
  }, [loadSummary, loadRevenue, loadTopProducts]);

  return (
    <div>
      <div className="mb-6 border border-zinc-200 bg-white p-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Admin CMS</p>
        <h1 className="mt-2 text-2xl font-semibold text-zinc-950">Tổng quan vận hành Vũ Gia</h1>
      </div>

      {loading ? (
        <div className="border border-zinc-200 bg-white p-8 text-sm font-semibold text-zinc-500">
          Đang tải dữ liệu tổng quan...
        </div>
      ) : (
        <div className="grid gap-5">
          <KpiCards summary={summary} />

          <div className="grid gap-5 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <RevenueChart data={revenue} from={range.from} to={range.to} onRangeChange={setRange} />
            </div>
            <OrdersByStatusBar ordersByStatus={summary?.ordersByStatus} />
          </div>

          <TopProductsTable items={topProducts} limit={limit} onLimitChange={setLimit} />
        </div>
      )}
    </div>
  );
}
