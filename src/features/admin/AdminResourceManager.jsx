"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, RefreshCw, Search, X } from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import DataTable from "@/components/admin/DataTable";
import FormField from "@/components/admin/FormField";
import Pagination from "@/components/admin/Pagination";
import SeoFields from "@/components/admin/SeoFields";
import { adminApi, normalizeCollection } from "@/lib/adminApi";

const PAGE_SIZE = 12;

const makeInitialForm = (resource, row = null) => {
  const form = { ...(resource.defaults || {}), ...(row || {}) };
  (resource.fields || []).forEach((field) => {
    if (form[field.name] === undefined || form[field.name] === null) {
      if (field.type === "boolean") {
        form[field.name] = false;
      } else if (field.type === "json") {
        form[field.name] = field.defaultJson || "{}";
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
    [
      "metaTitle",
      "metaDescription",
      "canonicalUrl",
      "ogTitle",
      "ogDescription",
      "ogImageId",
      "noIndex",
      "noFollow",
    ].forEach((name) => fieldNames.add(name));
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

    if (field?.type === "json") {
      if (typeof value === "string") {
        payload[name] = value.trim() ? JSON.parse(value) : {};
      } else {
        payload[name] = value || {};
      }
      return;
    }

    if (field?.type === "date") {
      payload[name] = value ? new Date(value).toISOString() : undefined;
      return;
    }

    payload[name] = value;
  });

  return payload;
};

export default function AdminResourceManager({ resource, compact = false }) {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [form, setForm] = useState(() => makeInitialForm(resource));
  const [confirmRow, setConfirmRow] = useState(null);

  const pagedRows = useMemo(() => {
    if (total > PAGE_SIZE || rows.length <= PAGE_SIZE) {
      return rows;
    }
    const start = (page - 1) * PAGE_SIZE;
    return rows.slice(start, start + PAGE_SIZE);
  }, [page, rows, total]);

  const loadRows = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const payload = await adminApi.get(resource.endpoint, {
        search: resource.searchable ? search : undefined,
        page,
        limit: PAGE_SIZE,
        ...filters,
      });
      const collection = normalizeCollection(payload);
      setRows(collection.items);
      setTotal(collection.total || collection.items.length);
    } catch (requestError) {
      setError(requestError.message || "Không thể tải dữ liệu.");
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [filters, page, resource.endpoint, resource.searchable, search]);

  useEffect(() => {
    loadRows();
  }, [loadRows]);

  const openCreate = () => {
    setEditingRow(null);
    setForm(makeInitialForm(resource));
    setEditorOpen(true);
    setNotice("");
    setError("");
  };

  const openEdit = (row) => {
    setEditingRow(row);
    setForm(makeInitialForm(resource, row));
    setEditorOpen(true);
    setNotice("");
    setError("");
  };

  const save = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");

    try {
      const payload = toPayload(resource, form, editingRow ? "update" : "create");
      if (editingRow) {
        await adminApi.patch(`${resource.endpoint}/${editingRow.id}`, payload);
      } else {
        await adminApi.post(resource.endpoint, payload);
      }
      setEditorOpen(false);
      setNotice(editingRow ? "Đã cập nhật." : "Đã tạo mới.");
      await loadRows();
    } catch (requestError) {
      const message =
        requestError instanceof SyntaxError
          ? "JSON không hợp lệ. Vui lòng kiểm tra lại nội dung."
          : requestError.message;
      setError(message || "Không thể lưu dữ liệu.");
    }
  };

  const remove = async () => {
    if (!confirmRow) {
      return;
    }
    setError("");
    try {
      await adminApi.delete(`${resource.endpoint}/${confirmRow.id}`);
      setConfirmRow(null);
      setNotice("Đã xóa.");
      await loadRows();
    } catch (requestError) {
      setError(requestError.message || "Không thể xóa dữ liệu.");
    }
  };

  const publish = async (row) => {
    setError("");
    setNotice("");
    try {
      await adminApi.post(`${resource.endpoint}/${row.id}/publish`, {});
      setNotice("Đã publish.");
      await loadRows();
    } catch (requestError) {
      setError(requestError.message || "Không thể publish.");
    }
  };

  const actions = resource.publishable
    ? [{ label: "Publish", onClick: publish }]
    : resource.actions || [];

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
          {!resource.readOnlyCreate && (
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
              {filter.options ? (
                <select
                  value={filters[filter.name] || ""}
                  onChange={(event) => {
                    setPage(1);
                    setFilters((current) => ({
                      ...current,
                      [filter.name]: event.target.value,
                    }));
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
                    setFilters((current) => ({
                      ...current,
                      [filter.name]: event.target.value,
                    }));
                  }}
                  placeholder={filter.label}
                  className="h-11 w-full border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-950"
                />
              )}
            </label>
          ))}
        </div>
      )}

      {notice && (
        <div className="mb-4 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          {notice}
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
            rows={pagedRows}
            onView={resource.detailPath ? (row) => window.location.assign(`${resource.detailPath}/${row.id}`) : undefined}
            onEdit={openEdit}
            onDelete={resource.noDelete ? undefined : setConfirmRow}
            actions={actions}
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
                {resource.fields.map((field) => (
                  <FormField
                    key={field.name}
                    field={field}
                    value={form[field.name]}
                    onChange={(name, value) =>
                      setForm((current) => ({ ...current, [name]: value }))
                    }
                  />
                ))}
                {resource.seo && (
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
        description="Thao tác này sẽ xóa hoặc soft-delete dữ liệu tùy theo backend. Bạn muốn tiếp tục?"
        destructive
        onCancel={() => setConfirmRow(null)}
        onConfirm={remove}
      />
    </section>
  );
}
