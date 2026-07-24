"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, RefreshCw, Search, X } from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import DataTable from "@/components/admin/DataTable";
import FormField from "@/components/admin/FormField";
import Pagination from "@/components/admin/Pagination";
import SeoFields from "@/components/admin/SeoFields";
import { adminApi, AdminApiError } from "@/shared/api/adminApi";
import { useAdminAuthStore } from "@/shared/stores/adminAuthStore";
import { toast } from "@/shared/utils/feedback";

const PAGE_SIZE = 20;

const SEO_FIELD_NAMES = [
  "seoTitle",
  "seoDescription",
  "seoImage",
  "metaTitle",
  "metaDescription",
  "canonicalUrl",
  "ogTitle",
  "ogDescription",
  "ogImageId",
  "noIndex",
  "noFollow",
];

const makeInitialForm = (resource, row = null) => {
  const form = { ...(resource.defaults || {}), ...(row || {}) };
  (resource.fields || []).forEach((field) => {
    if (form[field.name] === undefined || form[field.name] === null) {
      if (field.type === "boolean") {
        form[field.name] = false;
      } else if (field.type === "json-string") {
        form[field.name] = field.defaultJson || "";
      } else {
        form[field.name] = "";
      }
    }
  });
  return form;
};

const toPayload = (resource, form, mode) => {
  const fieldNames = new Set((resource.fields || []).map((field) => field.name));
  if (resource.seo) {
    SEO_FIELD_NAMES.forEach((name) => fieldNames.add(name));
  }

  const payload = {};

  fieldNames.forEach((name) => {
    const field = resource.fields?.find((item) => item.name === name);
    const value = form[name];

    if (mode === "update" && value === undefined) {
      return;
    }

    if (value === "" && !field?.required) {
      return;
    }

    // RT-F1: json-string / block-content fields are already strings — send verbatim.
    payload[name] = value;
  });

  return payload;
};

export default function AdminResourceManager({ resource, compact = false }) {
  const currentUser = useAdminAuthStore((state) => state.user);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState(resource.defaultSort?.field || null);
  const [sortDirection, setSortDirection] = useState(resource.defaultSort?.direction || "desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [form, setForm] = useState(() => makeInitialForm(resource));
  const [confirmRow, setConfirmRow] = useState(null);

  const updateMode = resource.updateMode || "full";
  const canCreate = !resource.readOnlyCreate && (!resource.createRoles || resource.createRoles.includes(currentUser?.role));
  const canEdit = !resource.noEdit;

  const loadRows = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const query = { page, size: PAGE_SIZE };
      if (sortBy) {
        query.sortBy = sortBy;
        query.sortDirection = sortDirection;
      }
      if (resource.searchable && search) {
        query[resource.searchParam || "name"] = search;
      }
      Object.entries(filters).forEach(([key, value]) => {
        if (value === "" || value === undefined) return;
        query[key] = value;
      });

      const data = await adminApi.get(resource.endpoint, query);
      setRows(data?.content || []);
      setTotal(data?.totalElements ?? (data?.content || []).length);
    } catch (requestError) {
      setError(requestError.message || "Không thể tải dữ liệu.");
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [filters, page, resource, search, sortBy, sortDirection]);

  useEffect(() => {
    loadRows();
  }, [loadRows]);

  const handleSort = (columnKey) => {
    if (!resource.sortable?.includes(columnKey)) return;
    if (sortBy === columnKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(columnKey);
      setSortDirection("asc");
    }
  };

  const openCreate = () => {
    setEditingRow(null);
    setForm(makeInitialForm(resource));
    setEditorOpen(true);
    setError("");
    setFieldErrors({});
  };

  const openEdit = (row) => {
    if (!canEdit) return;
    setEditingRow(row);
    setForm(makeInitialForm(resource, row));
    setEditorOpen(true);
    setError("");
    setFieldErrors({});
  };

  const applyRequestError = (requestError) => {
    if (requestError instanceof AdminApiError && requestError.code === 4001 && requestError.data) {
      setFieldErrors(requestError.data);
    }
    setError(requestError.message || "Không thể lưu dữ liệu.");
  };

  const save = async (event) => {
    event.preventDefault();
    setError("");
    setFieldErrors({});

    try {
      if (updateMode === "status" || updateMode === "isActive") {
        const key = updateMode === "status" ? "status" : "isActive";
        await adminApi.put(`${resource.endpoint}/${editingRow[resource.idField || "id"]}`, {
          [key]: form[key],
        });
      } else {
        const payload = toPayload(resource, form, editingRow ? "update" : "create");
        if (editingRow) {
          await adminApi.put(`${resource.endpoint}/${editingRow[resource.idField || "id"]}`, payload);
        } else {
          await adminApi.post(resource.endpoint, payload);
        }
      }
      setEditorOpen(false);
      toast.success(editingRow ? "Đã cập nhật." : "Đã tạo mới.");
      await loadRows();
    } catch (requestError) {
      applyRequestError(requestError);
    }
  };

  const remove = async () => {
    if (!confirmRow) return;
    setError("");
    try {
      await adminApi.delete(`${resource.endpoint}/${confirmRow[resource.idField || "id"]}`);
      setConfirmRow(null);
      toast.success("Đã xóa.");
      await loadRows();
    } catch (requestError) {
      setConfirmRow(null);
      toast.error(requestError.message || "Không thể xóa dữ liệu.");
    }
  };

  const rowActions = (resource.rowActions || []).map((action) => ({
    label: action.label,
    onClick: (row) => action.onClick(row, { reload: loadRows, currentUser }),
    visible: action.visible,
  }));

  const visibleRowActions = rowActions.filter(
    (action) => !action.visible || action.visible(currentUser),
  );

  const editableFields =
    updateMode === "status"
      ? resource.fields.filter((field) => field.name === "status")
      : updateMode === "isActive"
        ? resource.fields.filter((field) => field.name === "isActive")
        : resource.fields;

  return (
    <section className={compact ? "mt-6" : ""}>
      <div className="mb-4 flex flex-col gap-3 border border-zinc-200 bg-white p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-zinc-950">{resource.title}</h2>
          {resource.description && (
            <p className="mt-1 text-sm leading-6 text-zinc-500">{resource.description}</p>
          )}
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
          {canCreate && (
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex h-10 items-center gap-2 bg-zinc-950 px-3 text-sm font-semibold text-white hover:bg-zinc-800"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Tạo mới
            </button>
          )}
        </div>
      </div>

      {(resource.searchable || resource.filters?.length) && (
        <div className="mb-4 grid gap-3 border border-zinc-200 bg-white p-4 md:grid-cols-4">
          {resource.searchable && (
            <label className="relative md:col-span-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                value={search}
                onChange={(event) => {
                  setPage(1);
                  setSearch(event.target.value);
                }}
                placeholder="Tìm kiếm"
                className="h-11 w-full border border-zinc-300 pl-10 pr-3 text-sm outline-none focus:border-zinc-950"
              />
            </label>
          )}
          {resource.filters?.map((filter) => (
            <label key={filter.name} className="block">
              {filter.type === "boolean" ? (
                <select
                  value={filters[filter.name] ?? ""}
                  onChange={(event) => {
                    setPage(1);
                    setFilters((current) => ({ ...current, [filter.name]: event.target.value }));
                  }}
                  className="h-11 w-full border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-950"
                >
                  <option value="">{filter.label} (tất cả)</option>
                  <option value="true">Có</option>
                  <option value="false">Không</option>
                </select>
              ) : filter.options ? (
                <select
                  value={filters[filter.name] || ""}
                  onChange={(event) => {
                    setPage(1);
                    setFilters((current) => ({ ...current, [filter.name]: event.target.value }));
                  }}
                  className="h-11 w-full border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-950"
                >
                  <option value="">{filter.label}</option>
                  {filter.options.map((option) => (
                    <option key={option.value ?? option} value={option.value ?? option}>
                      {option.label ?? option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  value={filters[filter.name] || ""}
                  onChange={(event) => {
                    setPage(1);
                    setFilters((current) => ({ ...current, [filter.name]: event.target.value }));
                  }}
                  placeholder={filter.label}
                  className="h-11 w-full border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-950"
                />
              )}
            </label>
          ))}
        </div>
      )}

      {error && (
        <div className="mb-4 border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="border border-zinc-200 bg-white p-8 text-sm font-semibold text-zinc-500">
          Đang tải dữ liệu...
        </div>
      ) : (
        <>
          <DataTable
            columns={resource.columns}
            rows={rows}
            getRowId={(row) => row[resource.idField || "id"]}
            sortable={resource.sortable}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSort={handleSort}
            onView={resource.detailPath ? (row) => window.location.assign(`${resource.detailPath}/${row[resource.idField || "id"]}`) : undefined}
            onEdit={canEdit ? openEdit : undefined}
            onDelete={resource.noDelete ? undefined : setConfirmRow}
            actions={visibleRowActions}
          />
          <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} />
        </>
      )}

      {editorOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-zinc-950/50 px-4 py-8">
          <div className="w-full max-w-4xl border border-zinc-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-zinc-950">
                  {editingRow ? `Sửa ${resource.title}` : `Tạo ${resource.title}`}
                </h2>
                <p className="text-sm text-zinc-500">
                  Trường bỏ trống sẽ không gửi lên API nếu không bắt buộc.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditorOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center hover:bg-zinc-100"
                aria-label="Đóng"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <form onSubmit={save} className="p-5">
              <div className="grid gap-4 md:grid-cols-2">
                {editableFields.map((field) => (
                  <FormField
                    key={field.name}
                    field={field}
                    value={form[field.name]}
                    error={fieldErrors[field.name]}
                    onChange={(name, value) =>
                      setForm((current) => ({ ...current, [name]: value }))
                    }
                  />
                ))}
                {resource.seo && updateMode === "full" && (
                  <SeoFields
                    values={form}
                    onChange={(name, value) =>
                      setForm((current) => ({ ...current, [name]: value }))
                    }
                  />
                )}
              </div>
              <div className="mt-6 flex justify-end gap-2 border-t border-zinc-200 pt-4">
                <button
                  type="button"
                  onClick={() => setEditorOpen(false)}
                  className="h-11 border border-zinc-300 px-4 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="h-11 bg-zinc-950 px-5 text-sm font-semibold text-white hover:bg-zinc-800"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(confirmRow)}
        title="Xóa dữ liệu"
        description="Thao tác này sẽ xóa dữ liệu vĩnh viễn. Bạn muốn tiếp tục?"
        destructive
        onCancel={() => setConfirmRow(null)}
        onConfirm={remove}
      />
    </section>
  );
}
