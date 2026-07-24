"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import CustomerServiceLayout from "@/features/account/components/CustomerServiceLayout";
import OrderStatusBadge from "@/features/orders/components/OrderStatusBadge";
import VietQrPanel from "@/features/checkout/components/VietQrPanel";
import OrderResultSummary from "@/features/checkout/components/OrderResultSummary";
import { getOrder, cancelOrder } from "@/features/orders/order-service";
import { ROUTES } from "@/shared/utils/routes";
import { confirm, toast } from "@/shared/utils/feedback";

// Same cancellable-status rule as OrderCard (BE-3, ORDER_API.md).
const CANCELLABLE_STATUSES = ["PENDING_PAYMENT", "PROCESSING"];

// Backend error codes surfaced inline (ORDER_API.md, BE-3): 4059 not
// found/not owner (existence hidden), 4107 order not in a cancellable status.
function describeCancelError(error) {
  switch (error?.code) {
    case 4059:
      return "Không tìm thấy đơn hàng.";
    case 4107:
      return "Đơn hàng không còn ở trạng thái có thể hủy.";
    default:
      return error?.message || "Hủy đơn hàng không thành công.";
  }
}

/**
 * Single-order detail view (`GET /api/orders/{id}`) under the account area.
 * For an ONL order still awaiting payment, shows the same VietQR panel used
 * on the post-checkout result page (Phase 4) so the customer can resume
 * payment — this is also the route `OrderResultView` falls back to once its
 * own poll times out.
 */
export default function OrderDetailView({ orderId }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const breadcrumbs = [
    { name: "Trang chủ", href: ROUTES.HOME },
    { name: "Dịch vụ khách hàng", href: null },
    { name: "Trạng thái đơn hàng", href: ROUTES.ORDERS },
    { name: "Chi tiết đơn hàng", href: null },
  ];

  const fetchOrder = useCallback(async () => {
    try {
      const data = await getOrder(orderId);
      setOrder(data);
      setLoadError(null);
      return data;
    } catch (error) {
      // A 401 means the session is gone — RequireCustomerAuth (the `(user)`
      // layout guard) redirects to login once `status` flips; nothing to do here.
      if (error?.status === 401) return null;
      setLoadError(error?.message || "Không thể tải thông tin đơn hàng.");
      return null;
    }
  }, [orderId]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchOrder().finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [fetchOrder]);

  const handleManualRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await fetchOrder();
      if (data?.paymentStatus === "PAID") {
        toast.success("Đã xác nhận thanh toán!");
      } else if (data) {
        toast.info("Chưa nhận được thanh toán. Vui lòng thử lại sau ít phút.");
      }
    } finally {
      setRefreshing(false);
    }
  };

  const handleCancel = async () => {
    if (!order) return;
    const ok = await confirm({
      title: "Hủy đơn hàng",
      description: `Bạn có chắc chắn muốn hủy đơn hàng #${order.orderCode} không?`,
      confirmLabel: "Hủy đơn",
      cancelLabel: "Không",
      destructive: true,
    });
    if (!ok) return;

    setCancelling(true);
    try {
      await cancelOrder(order.id);
      toast.success(`Đã hủy đơn hàng #${order.orderCode} thành công.`);
      await fetchOrder();
    } catch (error) {
      toast.error(describeCancelError(error));
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <CustomerServiceLayout breadcrumbs={breadcrumbs}>
        <div className="py-24 text-center font-montserrat text-[#909090] text-[15px]">
          Đang tải thông tin đơn hàng...
        </div>
      </CustomerServiceLayout>
    );
  }

  if (loadError && !order) {
    return (
      <CustomerServiceLayout breadcrumbs={breadcrumbs}>
        <div className="py-24 text-center font-montserrat">
          <p className="text-[#909090] text-[15px] mb-6">{loadError}</p>
          <Link
            href={ROUTES.ORDERS}
            className="inline-block bg-[#C76E00] text-white px-6 py-2.5 rounded-[6px] font-[600] text-[14px] hover:bg-[#a65c00] transition-colors duration-300"
          >
            Xem đơn hàng của tôi
          </Link>
        </div>
      </CustomerServiceLayout>
    );
  }

  if (!order) return null;

  // Backend already omits `payment` for CANCELLED/RETURNED orders (see
  // OrderServiceImpl.buildResponse) — the status check here is defense-in-depth,
  // not the primary guard.
  const showQr =
    order.paymentMethod === "ONL" &&
    order.payment !== null &&
    order.status !== "CANCELLED" &&
    order.status !== "RETURNED";
  const canCancel = CANCELLABLE_STATUSES.includes(order.status);

  return (
    <CustomerServiceLayout breadcrumbs={breadcrumbs}>
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <h1 className="font-arima text-[#2E2F2A] text-[26px] md:text-[32px] font-[400] leading-[40px]">
          Đơn hàng #{order.orderCode}
        </h1>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="flex flex-col gap-8 max-w-[720px]">
        {showQr ? (
          <VietQrPanel payment={order.payment} onRefresh={handleManualRefresh} refreshing={refreshing} />
        ) : null}

        <OrderResultSummary order={order} title={null} />

        {canCancel && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleCancel}
              disabled={cancelling}
              className="w-[180px] h-[42px] flex items-center justify-center border border-[#C76E00] text-[#C76E00] hover:bg-neutral-50 bg-white rounded-[6px] font-[700] text-[14px] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {cancelling ? "Đang hủy..." : "Hủy đơn hàng"}
            </button>
          </div>
        )}
      </div>
    </CustomerServiceLayout>
  );
}
