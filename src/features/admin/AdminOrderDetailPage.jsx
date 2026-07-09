"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, PackagePlus, RefreshCw } from "lucide-react";
import DataTable from "@/components/admin/DataTable";
import FormField from "@/components/admin/FormField";
import StatusBadge from "@/components/admin/StatusBadge";
import { adminApi, formatVnd } from "@/lib/adminApi";
import { ORDER_STATUS, SHIPMENT_STATUS } from "@/features/admin/adminResources";
import { ROUTES } from "@/utils/routes";

export default function AdminOrderDetailPage({ orderId }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [statusForm, setStatusForm] = useState({ status: "", note: "" });
  const [shipmentForm, setShipmentForm] = useState({
    carrier: "",
    trackingCode: "",
    status: "PENDING",
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const payload = await adminApi.get(`/admin/orders/${orderId}`);
      setOrder(payload);
      setStatusForm({ status: payload.status || "UNPAID", note: "" });
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
      ["Tạm tính", order?.subtotalAmount],
      ["Giảm giá", order?.discountAmount],
      ["Thuế", order?.taxAmount],
      ["Phí vận chuyển", order?.shippingFee],
      ["Tổng", order?.totalAmount],
    ],
    [order],
  );

  const updateStatus = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    try {
      await adminApi.patch(`/admin/orders/${order.id}/status`, statusForm);
      setNotice("Đã cập nhật trạng thái đơn.");
      await load();
    } catch (requestError) {
      setError(requestError.message || "Không thể cập nhật trạng thái.");
    }
  };

  const createShipment = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    try {
      await adminApi.post(`/admin/orders/${order.id}/shipments`, shipmentForm);
      setShipmentForm({ carrier: "", trackingCode: "", status: "PENDING" });
      setNotice("Đã tạo shipment.");
      await load();
    } catch (requestError) {
      setError(requestError.message || "Không thể tạo shipment.");
    }
  };

  const updateShipmentStatus = async (shipment, nextStatus) => {
    setError("");
    setNotice("");
    try {
      await adminApi.patch(`/admin/orders/${order.id}/shipments/${shipment.id}`, {
        status: nextStatus,
      });
      setNotice("Đã cập nhật shipment.");
      await load();
    } catch (requestError) {
      setError(requestError.message || "Không thể cập nhật shipment.");
    }
  };

  if (loading) {
    return <div className="border border-zinc-200 bg-white p-8">Đang tải đơn hàng...</div>;
  }

  if (error && !order) {
    return (
      <div className="border border-rose-200 bg-rose-50 p-5 text-sm font-semibold text-rose-700">
        {error}
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
          <h1 className="mt-3 text-2xl font-semibold text-zinc-950">
            #{order.orderNumber || order.id}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <StatusBadge value={order.status} />
            <StatusBadge value={order.paymentStatus} />
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

      {notice && (
        <div className="mb-4 border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">
          {notice}
        </div>
      )}
      {error && (
        <div className="mb-4 border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-3">
        <section className="border border-zinc-200 bg-white p-5 xl:col-span-2">
          <h2 className="text-lg font-semibold text-zinc-950">Sản phẩm trong đơn</h2>
          <div className="mt-4">
            <DataTable
              columns={[
                { label: "Tên", accessor: "productName" },
                { label: "SKU", accessor: "sku" },
                { label: "Phân loại", accessor: "classification" },
                { label: "SL", accessor: "quantity" },
                { label: "Đơn giá", accessor: "unitPrice", type: "money" },
                { label: "Tổng", accessor: "lineTotal", type: "money" },
              ]}
              rows={order.items || order.orderItems || []}
            />
          </div>
        </section>

        <section className="border border-zinc-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-zinc-950">Khách hàng</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="font-semibold text-zinc-500">Tên</dt>
              <dd className="text-zinc-950">{order.customerName}</dd>
            </div>
            <div>
              <dt className="font-semibold text-zinc-500">Phone</dt>
              <dd className="text-zinc-950">{order.customerPhone}</dd>
            </div>
            <div>
              <dt className="font-semibold text-zinc-500">Email</dt>
              <dd className="text-zinc-950">{order.customerEmail || "-"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-zinc-500">Địa chỉ giao</dt>
              <dd className="text-zinc-950">
                {[order.shipStreet, order.shipWard, order.shipDistrict, order.shipProvince]
                  .filter(Boolean)
                  .join(", ")}
              </dd>
            </div>
          </dl>
        </section>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <form onSubmit={updateStatus} className="border border-zinc-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-zinc-950">Cập nhật trạng thái</h2>
          <div className="mt-4 grid gap-4">
            <FormField
              field={{ name: "status", label: "Order status", type: "select", options: ORDER_STATUS }}
              value={statusForm.status}
              onChange={(name, value) => setStatusForm((current) => ({ ...current, [name]: value }))}
            />
            <FormField
              field={{ name: "note", label: "Ghi chú", type: "textarea", rows: 4 }}
              value={statusForm.note}
              onChange={(name, value) => setStatusForm((current) => ({ ...current, [name]: value }))}
            />
          </div>
          <button type="submit" className="mt-4 h-10 bg-zinc-950 px-4 text-sm font-semibold text-white">
            Lưu trạng thái
          </button>
        </form>

        <form onSubmit={createShipment} className="border border-zinc-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-zinc-950">Tạo shipment</h2>
          <div className="mt-4 grid gap-4">
            <FormField
              field={{ name: "carrier", label: "Carrier" }}
              value={shipmentForm.carrier}
              onChange={(name, value) => setShipmentForm((current) => ({ ...current, [name]: value }))}
            />
            <FormField
              field={{ name: "trackingCode", label: "Tracking code" }}
              value={shipmentForm.trackingCode}
              onChange={(name, value) => setShipmentForm((current) => ({ ...current, [name]: value }))}
            />
            <FormField
              field={{ name: "status", label: "Shipment status", type: "select", options: SHIPMENT_STATUS }}
              value={shipmentForm.status}
              onChange={(name, value) => setShipmentForm((current) => ({ ...current, [name]: value }))}
            />
          </div>
          <button
            type="submit"
            className="mt-4 inline-flex h-10 items-center gap-2 bg-zinc-950 px-4 text-sm font-semibold text-white"
          >
            <PackagePlus className="h-4 w-4" aria-hidden="true" />
            Tạo shipment
          </button>
        </form>

        <section className="border border-zinc-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-zinc-950">Tổng tiền</h2>
          <dl className="mt-4 space-y-2 text-sm">
            {totals.map(([label, value]) => (
              <div key={label} className="flex justify-between gap-3">
                <dt className="text-zinc-500">{label}</dt>
                <dd className="font-semibold text-zinc-950">{formatVnd(value)}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <section className="mt-5 border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-zinc-950">Shipments</h2>
        <div className="mt-4">
          <DataTable
            columns={[
              { label: "Carrier", accessor: "carrier" },
              { label: "Tracking", accessor: "trackingCode" },
              { label: "Status", accessor: "status", type: "status" },
              { label: "Shipped", accessor: "shippedAt", type: "date" },
              { label: "Delivered", accessor: "deliveredAt", type: "date" },
            ]}
            rows={order.shipments || []}
            actions={SHIPMENT_STATUS.map((status) => ({
              label: status,
              onClick: (shipment) => updateShipmentStatus(shipment, status),
            }))}
          />
        </div>
      </section>
    </div>
  );
}
