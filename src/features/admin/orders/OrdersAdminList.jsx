"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw, Search } from "lucide-react";
import DataTable from "@/components/admin/DataTable";
import Pagination from "@/components/admin/Pagination";
import DatePicker from "@/components/admin/inputs/DatePicker";
import { adminApi } from "@/shared/api/adminApi";
import { ORDER_STATUS, ORDER_STATUS_LABEL, PAYMENT_STATUS, PAYMENT_STATUS_LABEL } from "@/shared/api/apiEnums";
import { ROUTES } from "@/shared/utils/routes";
import { toast } from "@/shared/utils/feedback";

const PAGE_SIZE = 20;

export default function OrdersAdminList() {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("desc");
  const [loading, setLoading] = useState(true);

  const loadRows = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.get("/orders/admin", {
        page,
        size: PAGE_SIZE,
        sortBy,
        sortDirection,
        ...filters,
      });
      setRows(data?.content || []);
      setTotal(data?.totalElements ?? 0);
    } catch (error) {
      toast.error(error.message || "Không thể tải danh sách đơn hàng.");
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [filters, page, sortBy, sortDirection]);

  useEffect(() => {
    loadRows();
  }, [loadRows]);

  const handleSort = (columnKey) => {
    const sortable = ["id", "orderCode", "totalAmount", "status", "createdAt"];
    if (!sortable.includes(columnKey)) return;
    if (sortBy === columnKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(columnKey);
      setSortDirection("asc");
    }
  };

  return (
    <section>
      <div className="mb-4 flex flex-col gap-3 border border-zinc-200 bg-white p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-zinc-950">Đơn hàng</h2>
          <p className="mt-1 text-sm leading-6 text-zinc-500">Theo dõi và cập nhật trạng thái đơn.</p>
        </div>
        <button
          type="button"
          onClick={loadRows}
          className="inline-flex h-10 items-center gap-2 border border-zinc-300 px-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Tải lại
        </button>
      </div>

      <div className="mb-4 grid gap-3 border border-zinc-200 bg-white p-4 md:grid-cols-6">
        <label className="relative md:col-span-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            value={filters.orderCode || ""}
            onChange={(event) => {
              setPage(1);
              setFilters((current) => ({ ...current, orderCode: event.target.value }));
            }}
            placeholder="Mã đơn"
            className="h-11 w-full border border-zinc-300 pl-10 pr-3 text-sm outline-none focus:border-zinc-950"
          />
        </label>
        <select
          value={filters.status || ""}
          onChange={(event) => {
            setPage(1);
            setFilters((current) => ({ ...current, status: event.target.value }));
          }}
          className="h-11 border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-950"
        >
          <option value="">Trạng thái (tất cả)</option>
          {ORDER_STATUS.map((value) => (
            <option key={value} value={value}>{ORDER_STATUS_LABEL[value]}</option>
          ))}
        </select>
        <select
          value={filters.paymentStatus || ""}
          onChange={(event) => {
            setPage(1);
            setFilters((current) => ({ ...current, paymentStatus: event.target.value }));
          }}
          className="h-11 border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-950"
        >
          <option value="">Thanh toán (tất cả)</option>
          {PAYMENT_STATUS.map((value) => (
            <option key={value} value={value}>{PAYMENT_STATUS_LABEL[value]}</option>
          ))}
        </select>
        <DatePicker
          value={filters.placedFrom || ""}
          onChange={(value) => {
            setPage(1);
            setFilters((current) => ({ ...current, placedFrom: value }));
          }}
        />
        <DatePicker
          value={filters.placedTo || ""}
          onChange={(value) => {
            setPage(1);
            setFilters((current) => ({ ...current, placedTo: value }));
          }}
        />
        <input
          value={filters.couponCode || ""}
          onChange={(event) => {
            setPage(1);
            setFilters((current) => ({ ...current, couponCode: event.target.value }));
          }}
          placeholder="Mã coupon"
          className="h-11 border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-950"
        />
      </div>

      {loading ? (
        <div className="border border-zinc-200 bg-white p-8 text-sm font-semibold text-zinc-500">
          Đang tải dữ liệu...
        </div>
      ) : (
        <>
          <DataTable
            columns={[
              { key: "orderCode", label: "Mã đơn", accessor: "orderCode" },
              { key: "receiverName", label: "Người nhận", accessor: "receiverName" },
              { key: "receiverPhone", label: "Điện thoại", accessor: "receiverPhone" },
              { key: "totalAmount", label: "Tổng", accessor: "totalAmount", type: "money" },
              {
                key: "status",
                label: "Trạng thái",
                accessor: "status",
                type: "status",
              },
              {
                key: "paymentStatus",
                label: "Thanh toán",
                accessor: "paymentStatus",
                type: "status",
              },
              { key: "createdAt", label: "Ngày đặt", accessor: "createdAt", type: "date" },
            ]}
            rows={rows}
            sortable={["id", "orderCode", "totalAmount", "status", "createdAt"]}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSort={handleSort}
            onView={(row) => window.location.assign(`${ROUTES.ADMIN_ORDERS}/${row.id}`)}
          />
          <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} />
        </>
      )}
    </section>
  );
}
