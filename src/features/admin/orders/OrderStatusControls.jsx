"use client";

import { useState } from "react";
import ConfirmDialog from "@/shared/components/admin/confirm-dialog";
import { adminApi } from "@/shared/api/admin-api";
import { ORDER_STATUS, ORDER_STATUS_LABEL, PAYMENT_STATUS, PAYMENT_STATUS_LABEL } from "@/shared/api/api-enums";
import { toast } from "@/shared/utils/feedback";

const CONFIRM_STATUSES = new Set(["COMPLETED", "RETURNED"]);

export default function OrderStatusControls({ order, onUpdated, onSavingChange }) {
  const [status, setStatus] = useState(order.status);
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
  const [saving, setSaving] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);

  const persist = async () => {
    setSaving(true);
    onSavingChange?.(true);
    try {
      await adminApi.patchBody(`/orders/${order.id}/status`, { status, paymentStatus });
      toast.success("Đã cập nhật trạng thái đơn.");
      onUpdated();
    } catch (error) {
      toast.error(error.message || "Không thể cập nhật trạng thái.");
    } finally {
      setSaving(false);
      onSavingChange?.(false);
    }
  };

  const submit = (event) => {
    event.preventDefault();
    if (CONFIRM_STATUSES.has(status) && status !== order.status) {
      setPendingSubmit(true);
      return;
    }
    persist();
  };

  return (
    <form onSubmit={submit} className="border border-zinc-200 bg-white p-5">
      <h2 className="text-lg font-semibold text-zinc-950">Cập nhật trạng thái</h2>
      <p className="mt-1 text-xs text-zinc-500">
        Chuyển sang COMPLETED tăng soldCount; rời khỏi COMPLETED sẽ giảm lại.
      </p>
      <div className="mt-4 grid gap-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-zinc-800">Trạng thái đơn hàng</span>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="h-11 w-full border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-950"
          >
            {ORDER_STATUS.map((value) => (
              <option key={value} value={value}>{ORDER_STATUS_LABEL[value]}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-zinc-800">Trạng thái thanh toán</span>
          <select
            value={paymentStatus}
            onChange={(event) => setPaymentStatus(event.target.value)}
            className="h-11 w-full border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-950"
          >
            {PAYMENT_STATUS.map((value) => (
              <option key={value} value={value}>{PAYMENT_STATUS_LABEL[value]}</option>
            ))}
          </select>
        </label>
      </div>
      <button type="submit" disabled={saving} className="mt-4 h-10 bg-zinc-950 px-4 text-sm font-semibold text-white disabled:opacity-60">
        {saving ? "Đang lưu..." : "Lưu trạng thái"}
      </button>

      <ConfirmDialog
        open={pendingSubmit}
        title={`Chuyển sang ${ORDER_STATUS_LABEL[status]}`}
        description="Thao tác này ảnh hưởng đến soldCount của sản phẩm và khó hoàn tác. Bạn muốn tiếp tục?"
        destructive
        onCancel={() => setPendingSubmit(false)}
        onConfirm={() => {
          setPendingSubmit(false);
          persist();
        }}
      />
    </form>
  );
}
