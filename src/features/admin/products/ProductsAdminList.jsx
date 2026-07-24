"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, RefreshCw, Search, Star } from "lucide-react";
import DataTable from "@/components/admin/DataTable";
import Pagination from "@/components/admin/Pagination";
import SearchableSelect from "@/components/admin/inputs/SearchableSelect";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { adminApi } from "@/shared/api/adminApi";
import { PRODUCT_TYPE, PRODUCT_TYPE_LABEL, PRODUCT_STATUS, PRODUCT_STATUS_LABEL } from "@/shared/api/apiEnums";
import { makeAsyncOptions } from "@/features/admin/adminResources";
import { ROUTES } from "@/shared/utils/routes";
import { toast } from "@/shared/utils/feedback";

const PAGE_SIZE = 20;
const loadCategoryOptions = makeAsyncOptions("/product-categories", { searchParam: "name" });

export default function ProductsAdminList() {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [name, setName] = useState("");
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [confirmRow, setConfirmRow] = useState(null);

  const loadRows = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.get("/products", {
        page,
        size: PAGE_SIZE,
        sortBy,
        sortDirection,
        name: name || undefined,
        ...filters,
      });
      setRows(data?.content || []);
      setTotal(data?.totalElements ?? 0);
    } catch (error) {
      toast.error(error.message || "Không thể tải danh sách sản phẩm.");
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [filters, name, page, sortBy, sortDirection]);

  useEffect(() => {
    loadRows();
  }, [loadRows]);

  const handleSort = (columnKey) => {
    const sortable = ["id", "name", "price", "priority", "soldCount", "createdAt"];
    if (!sortable.includes(columnKey)) return;
    if (sortBy === columnKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(columnKey);
      setSortDirection("asc");
    }
  };

  const toggleFeatured = async (row) => {
    try {
      await adminApi.patch(`/products/${row.id}/featured`, { featured: !row.isFeatured });
      toast.success(row.isFeatured ? "Đã bỏ nổi bật." : "Đã đặt nổi bật.");
      loadRows();
    } catch (error) {
      toast.error(error.message || "Không thể cập nhật.");
    }
  };

  const changeStatus = async (row, status) => {
    try {
      await adminApi.patchBody(`/products/${row.id}/status`, { status });
      toast.success("Đã cập nhật trạng thái.");
      loadRows();
    } catch (error) {
      toast.error(error.message || "Không thể cập nhật trạng thái.");
    }
  };

  const remove = async () => {
    if (!confirmRow) return;
    try {
      await adminApi.delete(`/products/${confirmRow.id}`);
      setConfirmRow(null);
      toast.success("Đã xóa sản phẩm.");
      loadRows();
    } catch (error) {
      setConfirmRow(null);
      toast.error(error.message || "Không thể xóa sản phẩm.");
    }
  };

  return (
    <section>
      <div className="mb-4 flex flex-col gap-3 border border-zinc-200 bg-white p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-zinc-950">Sản phẩm</h2>
          <p className="mt-1 text-sm leading-6 text-zinc-500">Catalog, giá, gallery và SEO.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={loadRows}
            className="inline-flex h-10 items-center gap-2 border border-zinc-300 px-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Tải lại
          </button>
          <a
            href={`${ROUTES.ADMIN_PRODUCTS}/new`}
            className="inline-flex h-10 items-center gap-2 bg-zinc-950 px-3 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Tạo sản phẩm
          </a>
        </div>
      </div>

      <div className="mb-4 grid gap-3 border border-zinc-200 bg-white p-4 md:grid-cols-6">
        <label className="relative md:col-span-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            value={name}
            onChange={(event) => {
              setPage(1);
              setName(event.target.value);
            }}
            placeholder="Tìm theo tên"
            className="h-11 w-full border border-zinc-300 pl-10 pr-3 text-sm outline-none focus:border-zinc-950"
          />
        </label>
        <SearchableSelect
          value={filters.productCategoryId || ""}
          onChange={(value) => {
            setPage(1);
            setFilters((current) => ({ ...current, productCategoryId: value }));
          }}
          loadOptions={loadCategoryOptions}
          placeholder="Danh mục"
        />
        <select
          value={filters.type || ""}
          onChange={(event) => {
            setPage(1);
            setFilters((current) => ({ ...current, type: event.target.value }));
          }}
          className="h-11 border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-950"
        >
          <option value="">Loại (tất cả)</option>
          {PRODUCT_TYPE.map((value) => (
            <option key={value} value={value}>{PRODUCT_TYPE_LABEL[value]}</option>
          ))}
        </select>
        <select
          value={filters.status || ""}
          onChange={(event) => {
            setPage(1);
            setFilters((current) => ({ ...current, status: event.target.value }));
          }}
          className="h-11 border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-950"
        >
          <option value="">Trạng thái (tất cả)</option>
          {PRODUCT_STATUS.map((value) => (
            <option key={value} value={value}>{PRODUCT_STATUS_LABEL[value]}</option>
          ))}
        </select>
        <select
          value={filters.isFeatured ?? ""}
          onChange={(event) => {
            setPage(1);
            setFilters((current) => ({ ...current, isFeatured: event.target.value }));
          }}
          className="h-11 border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-950"
        >
          <option value="">Nổi bật (tất cả)</option>
          <option value="true">Có</option>
          <option value="false">Không</option>
        </select>
        <input
          type="number"
          value={filters.minPrice || ""}
          onChange={(event) => {
            setPage(1);
            setFilters((current) => ({ ...current, minPrice: event.target.value }));
          }}
          placeholder="Giá từ"
          className="h-11 border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-950"
        />
        <input
          type="number"
          value={filters.maxPrice || ""}
          onChange={(event) => {
            setPage(1);
            setFilters((current) => ({ ...current, maxPrice: event.target.value }));
          }}
          placeholder="Giá đến"
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
              { key: "thumb", label: "Ảnh", accessor: "thumb", type: "image" },
              { key: "name", label: "Tên", accessor: "name" },
              { key: "sku", label: "SKU", accessor: "sku" },
              { key: "type", label: "Loại", accessor: "type", type: "status" },
              { key: "price", label: "Giá", accessor: "price", type: "money" },
              {
                key: "status",
                label: "Trạng thái",
                accessor: "status",
                render: (value, row) => (
                  <select
                    value={value}
                    onChange={(event) => changeStatus(row, event.target.value)}
                    onClick={(event) => event.stopPropagation()}
                    className="h-8 border border-zinc-200 bg-white px-1.5 text-xs font-semibold outline-none"
                  >
                    {PRODUCT_STATUS.map((status) => (
                      <option key={status} value={status}>{PRODUCT_STATUS_LABEL[status]}</option>
                    ))}
                  </select>
                ),
              },
              { key: "soldCount", label: "Đã bán", accessor: "soldCount" },
              {
                key: "isFeatured",
                label: "Nổi bật",
                accessor: "isFeatured",
                render: (value, row) => (
                  <button
                    type="button"
                    onClick={() => toggleFeatured(row)}
                    className={`inline-flex h-8 w-8 items-center justify-center border ${value ? "border-amber-300 bg-amber-50 text-amber-500" : "border-zinc-200 text-zinc-300"}`}
                    aria-label="Bật/tắt nổi bật"
                  >
                    <Star className="h-4 w-4" aria-hidden="true" fill={value ? "currentColor" : "none"} />
                  </button>
                ),
              },
            ]}
            rows={rows}
            sortable={["id", "name", "price", "priority", "soldCount", "createdAt"]}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSort={handleSort}
            onView={(row) => window.location.assign(`${ROUTES.ADMIN_PRODUCTS}/${row.id}`)}
            onDelete={setConfirmRow}
          />
          <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} />
        </>
      )}

      <ConfirmDialog
        open={Boolean(confirmRow)}
        title="Xóa sản phẩm"
        description="Xóa sản phẩm sẽ xóa cả ảnh trên MinIO. Bạn muốn tiếp tục?"
        destructive
        onCancel={() => setConfirmRow(null)}
        onConfirm={remove}
      />
    </section>
  );
}
