"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import DataTable from "@/shared/components/admin/data-table";
import StatusBadge from "@/shared/components/admin/status-badge";
import OrderStatusControls from "@/features/admin/orders/OrderStatusControls";
import OrderPaymentPanel from "@/features/admin/orders/OrderPaymentPanel";
import { adminApi, formatVnd } from "@/shared/api/admin-api";
import { ORDER_STATUS_LABEL, PAYMENT_STATUS_LABEL } from "@/shared/api/api-enums";
import { ROUTES } from "@/shared/utils/routes";

export default function AdminOrderDetailPage({ orderId }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const payload = await adminApi.get(`/orders/${orderId}`);
      setOrder(payload);
    } catch (requestError) {
      setError(requestError.message || "Không thể tải đơn hàng.");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    load();
  }, [load]);

  const totals = useMemo(
    () => [
      // OrderResponse has no subtotalAmount — derive it as totalAmount + discountAmount.
      ["Tạm tính", (order?.totalAmount ?? 0) + (order?.discountAmount ?? 0)],
      ["Giảm giá", order?.discountAmount],
      ["Tổng", order?.totalAmount],
    ],
    [order],
  );

  if (loading) {
    return <div className="border border-zinc-200 bg-white p-8">Đang tải đơn hàng...</div>;
  }

  if (error || !order) {
    return (
      <div className="border border-rose-200 bg-rose-50 p-5 text-sm font-semibold text-rose-700">
        {error || "Không tìm thấy đơn hàng."}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex flex-col gap-4 border border-zinc-200 bg-white p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            href={ROUTES.ADMIN_ORDERS}
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-950"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Đơn hàng
          </Link>
          <h1 className="mt-3 text-2xl font-semibold text-zinc-950">#{order.orderCode}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <StatusBadge value={order.status} label={ORDER_STATUS_LABEL[order.status]} />
            <StatusBadge value={order.paymentStatus} label={PAYMENT_STATUS_LABEL[order.paymentStatus]} />
            <span className="text-sm font-semibold text-zinc-900">{formatVnd(order.totalAmount)}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={load}
          className="inline-flex h-10 items-center gap-2 border border-zinc-300 px-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Tải lại
        </button>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <section className="border border-zinc-200 bg-white p-5 xl:col-span-2">
          <h2 className="text-lg font-semibold text-zinc-950">Sản phẩm trong đơn</h2>
          <p className="mt-1 text-xs text-zinc-500">Dữ liệu snapshot tại thời điểm đặt hàng.</p>
          <div className="mt-4">
            <DataTable
              columns={[
                { key: "productName", label: "Tên", accessor: "productName" },
                { key: "productType", label: "Loại", accessor: "productType", type: "status" },
                { key: "quantity", label: "SL", accessor: "quantity" },
                { key: "unitPrice", label: "Đơn giá", accessor: "unitPrice", type: "money" },
                { key: "subtotal", label: "Tổng", accessor: "subtotal", type: "money" },
              ]}
              rows={order.items || []}
            />
          </div>
        </section>

        <section className="border border-zinc-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-zinc-950">Người nhận</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="font-semibold text-zinc-500">Tên</dt>
              <dd className="text-zinc-950">{order.receiverName}</dd>
            </div>
            <div>
              <dt className="font-semibold text-zinc-500">Điện thoại</dt>
              <dd className="text-zinc-950">{order.receiverPhone}</dd>
            </div>
            <div>
              <dt className="font-semibold text-zinc-500">Địa chỉ</dt>
              <dd className="text-zinc-950">{order.receiverAddress}</dd>
            </div>
            {order.note && (
              <div>
                <dt className="font-semibold text-zinc-500">Ghi chú</dt>
                <dd className="text-zinc-950">{order.note}</dd>
              </div>
            )}
          </dl>
        </section>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <OrderStatusControls order={order} onUpdated={load} />

        <section className="border border-zinc-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-zinc-950">Tổng tiền</h2>
          <dl className="mt-4 space-y-2 text-sm">
            {totals.map(([label, value]) => (
              <div key={label} className="flex justify-between gap-3">
                <dt className="text-zinc-500">{label}</dt>
                <dd className="font-semibold text-zinc-950">{formatVnd(value)}</dd>
              </div>
            ))}
            {order.couponCode && (
              <div className="flex justify-between gap-3">
                <dt className="text-zinc-500">Mã giảm giá (Coupon)</dt>
                <dd className="font-semibold text-zinc-950">{order.couponCode}</dd>
              </div>
            )}
          </dl>
        </section>

        {order.payment && <OrderPaymentPanel payment={order.payment} />}
      </div>
    </div>
  );
}
