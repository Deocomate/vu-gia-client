"use client";

import React, { useCallback, useEffect, useState } from "react";
import CustomerServiceLayout from "@/features/account/components/CustomerServiceLayout";
import OrderStatusTabs from "@/features/orders/components/OrderStatusTabs";
import OrderCard from "@/features/orders/components/OrderCard";
import OrderPagination from "@/features/orders/components/OrderPagination";
import { ROUTES } from "@/shared/utils/routes";
import { confirm, toast } from "@/shared/utils/feedback";
import { listOrders, cancelOrder } from "@/features/orders/order-service";
import { ORDER_STATUS } from "@/shared/api/apiEnums";

const PAGE_SIZE = 5;

// UI tab ids (kept lowercase — they drive the tab bar + eventually the URL)
// mapped to the backend's real `ORDER_STATUS` enum values (ORDER_API.md).
const TAB_STATUS_MAP = {
  unpaid: "PENDING_PAYMENT",
  processing: "PROCESSING",
  shipping: "SHIPPING",
  completed: "COMPLETED",
  cancelled: "CANCELLED",
  returned: "RETURNED",
};
const STATUS_TAB_MAP = Object.fromEntries(
  Object.entries(TAB_STATUS_MAP).map(([tabId, status]) => [status, tabId])
);

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

export default function OrdersView() {
  const breadcrumbs = [
    { name: "Trang chủ", href: ROUTES.HOME },
    { name: "Dịch vụ khách hàng", href: null },
    { name: "Trạng thái đơn hàng", href: null },
  ];

  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Per-tab counts (keyed by the lowercase tab ids OrderStatusTabs expects).
  const [counts, setCounts] = useState({});

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        size: PAGE_SIZE,
        sortBy: "createdAt",
        sortDirection: "DESC",
      };
      if (activeTab !== "all") {
        params.status = TAB_STATUS_MAP[activeTab];
      }
      const data = await listOrders(params);
      setOrders(data?.content || []);
      setTotalPages(data?.totalPages || 1);
    } catch (err) {
      setError(err?.message || "Không thể tải danh sách đơn hàng.");
      setOrders([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [activeTab, currentPage]);

  // Tab badge counts: there is no single "counts by status" endpoint, so we
  // fetch each status bucket with `size=1` (cheap — only `totalElements`
  // matters) and sum them for "all" instead of firing a 7th unfiltered call.
  const fetchCounts = useCallback(async () => {
    try {
      const results = await Promise.all(
        ORDER_STATUS.map((status) => listOrders({ status, page: 1, size: 1 }))
      );
      const next = { all: 0 };
      ORDER_STATUS.forEach((status, idx) => {
        const total = results[idx]?.totalElements || 0;
        next[STATUS_TAB_MAP[status]] = total;
        next.all += total;
      });
      setCounts(next);
    } catch {
      // Non-critical — tabs simply show no counts if this fails.
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1); // reset to first page when changing tabs
  };

  const handleCancelOrder = async (order) => {
    const ok = await confirm({
      title: "Hủy đơn hàng",
      description: `Bạn có chắc chắn muốn hủy đơn hàng #${order.orderCode} không?`,
      confirmLabel: "Hủy đơn",
      cancelLabel: "Không",
      destructive: true,
    });
    if (!ok) return;

    try {
      await cancelOrder(order.id);
      toast.success(`Đã hủy đơn hàng #${order.orderCode} thành công.`);
      await Promise.all([fetchOrders(), fetchCounts()]);
    } catch (err) {
      toast.error(describeCancelError(err));
    }
  };

  const handleContactSupport = (order) => {
    toast.info(`Kết nối với bộ phận chăm sóc khách hàng cho đơn hàng #${order.orderCode}.`);
  };

  return (
    <CustomerServiceLayout breadcrumbs={breadcrumbs}>
      {/* Title */}
      <h1 className="font-arima text-[#2E2F2A] text-[30px] md:text-[36px] font-[400] leading-[40px] mb-6">
        Trạng thái đơn hàng
      </h1>

      {/* Sub Title */}
      <h2 className="font-montserrat text-[#2E2F2A] text-[16px] md:text-[18px] font-[600] mb-4">
        Đơn hàng của tôi
      </h2>

      {/* Status Tabs Filter */}
      <OrderStatusTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        counts={counts}
      />

      {/* Order Cards Container */}
      <div className="flex flex-col mt-4 min-h-[300px]">
        {loading ? (
          <div className="flex items-center justify-center py-12 font-montserrat text-[#8C8C8C] text-[15px]">
            Đang tải đơn hàng...
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center font-montserrat gap-4">
            <p className="text-[#D92D20] text-[15px]">{error}</p>
            <button
              onClick={fetchOrders}
              className="px-5 py-2 bg-[#C76E00] hover:bg-[#a65c00] text-white rounded-[6px] font-[700] text-[14px] transition duration-200 cursor-pointer"
            >
              Thử lại
            </button>
          </div>
        ) : orders.length > 0 ? (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onCancelOrder={handleCancelOrder}
              onContactSupport={handleContactSupport}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center font-montserrat">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8C8C8C"
              strokeWidth="1.5"
              className="mb-3"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
            <p className="text-[#8C8C8C] text-[15px]">
              Không tìm thấy đơn hàng nào ở trạng thái này.
            </p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {!loading && !error && (
        <OrderPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </CustomerServiceLayout>
  );
}
