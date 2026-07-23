"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/shared/Breadcrumb";
import VietQrPanel from "@/features/checkout/components/VietQrPanel";
import OrderResultSummary from "@/features/checkout/components/OrderResultSummary";
import { getOrder } from "@/features/orders/order-service";
import { ROUTES } from "@/utils/routes";
import { toast } from "@/utils/feedback";

// ONL polling cadence: fixed 4s interval, capped total wait (RT-D/RT-E — the
// webhook never sets `paymentStatus = FAILED`, so we only ever stop on
// `PAID` or this timeout, never on a dead "failed" branch).
const POLL_INTERVAL_MS = 4000;
const POLL_TIMEOUT_MS = 3 * 60 * 1000;

export default function OrderResultView({ orderId }) {
  const [order, setOrder] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const stoppedRef = useRef(false);

  const breadcrumbs = [
    { name: "Trang chủ", href: ROUTES.HOME },
    { name: "Thanh toán", href: ROUTES.CHECKOUT },
    { name: "Kết quả đặt hàng", href: null },
  ];

  const fetchOrder = useCallback(async () => {
    try {
      const data = await getOrder(orderId);
      setOrder(data);
      setLoadError(null);
      return data;
    } catch (error) {
      // A 401 means the customer session is gone — RequireCustomerAuth's own
      // auth-store watcher will redirect to login once `status` flips to
      // "unauthenticated"; we just need to stop polling, not surface a toast.
      if (error?.status === 401) {
        stoppedRef.current = true;
        return null;
      }
      setLoadError(error?.message || "Không thể tải thông tin đơn hàng.");
      return null;
    }
  }, [orderId]);

  // Initial load.
  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  // Poll only while the order is an unpaid ONL order.
  const isUnpaidOnl = order?.paymentMethod === "ONL" && order?.paymentStatus !== "PAID";

  useEffect(() => {
    if (!isUnpaidOnl || stoppedRef.current) return undefined;

    const startedAt = Date.now();
    const interval = setInterval(async () => {
      if (stoppedRef.current) {
        clearInterval(interval);
        return;
      }
      if (Date.now() - startedAt >= POLL_TIMEOUT_MS) {
        clearInterval(interval);
        setTimedOut(true);
        return;
      }
      await fetchOrder();
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [isUnpaidOnl, fetchOrder]);

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

  if (loadError && !order) {
    return (
      <div className="w-full bg-white min-h-screen pt-[40px] pb-[100px] px-[30px] md:px-[60px] lg:px-[80px]">
        <div className="max-w-[720px] mx-auto text-center font-montserrat">
          <p className="text-[#909090] text-[16px] mb-6">{loadError}</p>
          <Link
            href={ROUTES.ORDERS}
            className="inline-block bg-[#C76E00] text-white px-6 py-2.5 rounded-[3px] font-[600] text-[14px] hover:bg-[#AD5036] transition-colors duration-300"
          >
            Xem đơn hàng của tôi
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="w-full bg-white min-h-screen pt-[40px] pb-[100px] px-[30px] md:px-[60px] lg:px-[80px]">
        <div className="max-w-[720px] mx-auto text-center font-montserrat text-[#909090] text-[16px]">
          Đang tải thông tin đơn hàng...
        </div>
      </div>
    );
  }

  const showQr = isUnpaidOnl && !timedOut;

  return (
    <div className="w-full bg-white min-h-screen pt-[40px] pb-[50px] lg:pb-[100px] px-[30px] md:px-[60px] lg:px-[80px]">
      <div className="max-w-[720px] mx-auto flex flex-col">
        <Breadcrumb items={breadcrumbs} className="hidden md:block mb-[25px]" />

        {showQr ? (
          <div className="flex flex-col gap-8">
            <VietQrPanel
              payment={order.payment}
              onRefresh={handleManualRefresh}
              refreshing={refreshing}
            />
            <OrderResultSummary order={order} />
          </div>
        ) : timedOut ? (
          <div className="flex flex-col gap-6 items-center text-center font-montserrat">
            <p className="text-[#2E2F2A] text-[16px]">
              Chúng tôi vẫn chưa nhận được xác nhận thanh toán cho đơn hàng{" "}
              <span className="font-[600]">{order.orderCode}</span>. Đơn hàng vẫn được giữ,
              bạn có thể quay lại kiểm tra hoặc thanh toán lại bất cứ lúc nào.
            </p>
            <Link
              href={ROUTES.ORDERS}
              className="inline-block bg-[#C76E00] text-white px-6 py-2.5 rounded-[3px] font-[600] text-[14px] hover:bg-[#AD5036] transition-colors duration-300"
            >
              Xem đơn hàng của tôi
            </Link>
          </div>
        ) : (
          <OrderResultSummary order={order} />
        )}
      </div>
    </div>
  );
}
