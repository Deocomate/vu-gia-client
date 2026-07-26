"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import { Plus, RefreshCw, Search, X } from "lucide-react";
import AdminPageHeader from "@/shared/components/admin/admin-page-header";
import ConfirmDialog from "@/shared/components/admin/confirm-dialog";
import DataTable from "@/shared/components/admin/data-table";
import DatePicker from "@/shared/components/admin/inputs/date-picker";
import FormField from "@/shared/components/admin/form-field";
import Modal from "@/shared/components/admin/modal";
import Pagination from "@/shared/components/admin/pagination";
import SearchableSelect from "@/shared/components/admin/inputs/searchable-select";
import SeoFields from "@/shared/components/admin/seo-fields";
import TableSkeleton from "@/shared/components/admin/table-skeleton";
import { adminApi, AdminApiError } from "@/shared/api/admin-api";
import { useAdminAuthStore } from "@/shared/stores/admin-auth-store";
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

/**
 * Scrolls to and focuses the first field (in form-definition order) that has a
 * validation error, so a save failure doesn't just show inline errors the user
 * has to hunt for.
 */
const focusFirstInvalidField = (fields, fieldErrorsMap) => {
  const firstInvalidField = (fields || []).find((field) => fieldErrorsMap[field.name]);
  if (!firstInvalidField) return;

  requestAnimationFrame(() => {
    const selector =
      typeof CSS !== "undefined" && CSS.escape
        ? `[data-field-name="${CSS.escape(firstInvalidField.name)}"]`
        : `[data-field-name="${firstInvalidField.name}"]`;
    const container = document.querySelector(selector);
    if (!container) return;

    container.scrollIntoView({ behavior: "smooth", block: "center" });
    const focusable = container.querySelector("input, textarea, select, button");
    if (focusable) {
      focusable.focus({ preventScroll: true });
    }
  });
};

export default function AdminResourceManager({ resource, compact = false }) {
  const currentUser = useAdminAuthStore((state) => state.user);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
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
  // Threaded into the Modal primitive's `preventClose` prop below so Escape/backdrop
  // dismissal is blocked while a save is in flight (avoids a lost-edit race condition).
  const [saving, setSaving] = useState(false);
  // Generic escape hatch for resource-specific modal content (e.g. Users' role/password/create
  // modals) invoked from `rowActions`/`onCreate` — see the `openModal`/`closeModal` helpers below.
  const [customModal, setCustomModal] = useState(null);

  const updateMode = resource.updateMode || "full";
  const canCreate = !resource.readOnlyCreate && (!resource.createRoles || resource.createRoles.includes(currentUser?.role));
  const canEdit = !resource.noEdit;

  const loadRows = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const query = { page, size: pageSize };
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
  }, [filters, page, pageSize, resource, search, sortBy, sortDirection]);

  useEffect(() => {
    loadRows();
  }, [loadRows]);

  const handlePageSizeChange = (nextSize) => {
    setPageSize(nextSize);
    setPage(1);
  };

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
      focusFirstInvalidField(resource.fields, requestError.data);
    }
    setError(requestError.message || "Không thể lưu dữ liệu.");
  };

  const save = async (event) => {
    event.preventDefault();
    setError("");
    setFieldErrors({});
    setSaving(true);

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
    } finally {
      setSaving(false);
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

  // Escape hatch for resource-specific modal content (Users' role/password/create modals are
  // the first consumer) invoked from `rowActions`/`onCreate`. The resource-specific component
  // is expected to render its own `Modal` shell (the shared admin modal primitive) — this just
  // hosts whatever node is passed in and clears it on close.
  const openModal = (node) => setCustomModal(node);
  const closeModal = () => setCustomModal(null);
  const actionContext = { reload: loadRows, currentUser, openModal, closeModal };

  // `resource.rowActions` supports two shapes:
  // - a static array of `{ label, onClick(row, context), visible(currentUser) }` (existing
  //   mechanism, e.g. news' "Publish") — resolved once per render, filtered by `visible`.
  // - a `(row, context) => Action[]` factory for actions that depend on per-row data (e.g.
  //   Users' "Đổi vai trò"/"Reset mật khẩu", gated by both `currentUser` and the row's own
  //   role) — passed straight through to `DataTable`, which already supports a function
  //   `actions` prop.
  const rowActionsIsFunction = typeof resource.rowActions === "function";

  const staticRowActions = rowActionsIsFunction
    ? []
    : (resource.rowActions || []).map((action) => ({
        label: action.label,
        onClick: (row) => action.onClick(row, actionContext),
        visible: action.visible,
      }));

  const visibleRowActions = staticRowActions.filter(
    (action) => !action.visible || action.visible(currentUser),
  );

  const hasRowActionsCapability = rowActionsIsFunction || visibleRowActions.length > 0;

  const tableRowActions = rowActionsIsFunction
    ? (row) => resource.rowActions(row, actionContext)
    : visibleRowActions;

  const editableFields =
    updateMode === "status"
      ? resource.fields.filter((field) => field.name === "status")
      : updateMode === "isActive"
        ? resource.fields.filter((field) => field.name === "isActive")
        : resource.fields;

  const activeFilterValues = Object.values(filters).filter(
    (value) => value !== "" && value !== undefined && value !== null,
  );
  const hasActiveFilters = Boolean(search) || activeFilterValues.length > 0;
  const activeFilterCount = (search ? 1 : 0) + activeFilterValues.length;

  const clearFilters = () => {
    setSearch("");
    setFilters({});
    setPage(1);
  };

  const hasActionsColumn = Boolean(
    resource.detailPath || canEdit || !resource.noDelete || hasRowActionsCapability,
  );

  const createLabel = resource.createLabel || "Tạo mới";
  // Resources with modal-based create flows that don't fit the generic field-driven editor
  // (Users' `CreateUserModal`) supply `onCreate` to override the default "open the generic
  // editor" behavior; everything else keeps using `openCreate`.
  const handleCreateClick = () => {
    if (resource.onCreate) {
      resource.onCreate(actionContext);
    } else {
      openCreate();
    }
  };

  const emptyState = hasActiveFilters
    ? {
        title: "Không tìm thấy kết quả",
        description: "Không có bản ghi khớp với bộ lọc hoặc từ khóa hiện tại. Thử điều chỉnh hoặc xóa bộ lọc.",
        action: { label: "Xóa bộ lọc", onClick: clearFilters },
      }
    : {
        title: resource.emptyTitle || "Chưa có dữ liệu",
        description: resource.emptyDescription || "Dữ liệu sẽ xuất hiện tại đây sau khi được tạo.",
        action: canCreate ? { label: createLabel, onClick: handleCreateClick } : undefined,
      };

  return (
    <section className={compact ? "mt-6" : ""}>
      <AdminPageHeader
        title={resource.title}
        description={resource.description}
        actions={
          <>
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
                onClick={handleCreateClick}
                className="inline-flex h-10 items-center gap-2 bg-zinc-950 px-3 text-sm font-semibold text-white hover:bg-zinc-800"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                {createLabel}
              </button>
            )}
          </>
        }
      />

      {(resource.searchable || resource.filters?.length) && (
        <div className="mb-4 border border-zinc-200 bg-white p-4">
          {hasActiveFilters && (
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500">
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-zinc-900 px-1.5 text-[11px] font-semibold text-white">
                  {activeFilterCount}
                </span>
                bộ lọc đang áp dụng
              </span>
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-950"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
                Xóa bộ lọc
              </button>
            </div>
          )}
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {resource.searchable && (
            <label className="relative md:col-span-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                value={search}
                onChange={(event) => {
                  setPage(1);
                  setSearch(event.target.value);
                }}
                placeholder={resource.searchPlaceholder || "Tìm kiếm"}
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
              ) : filter.type === "date" ? (
                // Additive filter type — reuses the shared `DatePicker` used by `fields`'
                // "datetime" type. `dateVariant` lets a resource
                // opt into date-only ("date") vs the default ISO-instant ("datetime") emit shape;
                // Orders' placedFrom/placedTo keep the pre-migration default (datetime).
                <DatePicker
                  value={filters[filter.name] || ""}
                  onChange={(value) => {
                    setPage(1);
                    setFilters((current) => ({ ...current, [filter.name]: value }));
                  }}
                  variant={filter.dateVariant || "datetime"}
                />
              ) : filter.type === "async-select" ? (
                // Additive filter type — async FK picker, e.g. Products' "Danh mục" filter.
                // Reuses the same `SearchableSelect` + `loadOptions`
                // pattern `fields`' "searchable-select" type already uses.
                <SearchableSelect
                  value={filters[filter.name] || ""}
                  onChange={(value) => {
                    setPage(1);
                    setFilters((current) => ({ ...current, [filter.name]: value }));
                  }}
                  loadOptions={filter.loadOptions}
                  placeholder={filter.label}
                />
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
                  // Additive: "number" type (e.g. Products' minPrice/maxPrice) falls back to the
                  // pre-existing "text" behavior for every other resource.
                  type={filter.type === "number" ? "number" : "text"}
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
        </div>
      )}

      {/* Save-failure errors are rendered inside the modal below (it's fixed inset-0 z-50 and
          stays open on failure, so a banner here would be hidden behind it). This banner only
          covers errors surfaced while the modal is closed, e.g. a failed list load. */}
      {error && !editorOpen && (
        <div className="mb-4 border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}

      {loading ? (
        <TableSkeleton columns={resource.columns.length} hasActionsColumn={hasActionsColumn} />
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
            actions={tableRowActions}
            reload={loadRows}
            emptyState={emptyState}
          />
          <Pagination
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
          />
        </>
      )}

      <Modal
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        title={editingRow ? `Sửa ${resource.title}` : `Tạo ${resource.title}`}
        description="Trường bỏ trống sẽ không gửi lên API nếu không bắt buộc."
        size="lg"
        align="start"
        preventClose={saving}
      >
        <form onSubmit={save} className="p-5">
          {error && (
            <div
              className="mb-4 border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700"
              role="alert"
            >
              {error}
            </div>
          )}
          <div className="grid gap-4 md:grid-cols-2">
            {editableFields.map((field) => (
              <Fragment key={field.name}>
                {/* Purely-presentational section break for the two content-heavy resources
                    (productCategories.detailContent, pages.content) — driven by these fields'
                    distinct block-content types, not a reusable schema. */}
                {(field.type === "category-block-content" || field.type === "block-content") && (
                  <div className="flex items-center gap-3 pt-2 md:col-span-2">
                    <hr className="flex-1 border-zinc-200" />
                    <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Nội dung chi tiết
                    </span>
                    <hr className="flex-1 border-zinc-200" />
                  </div>
                )}
                <FormField
                  field={field}
                  value={form[field.name]}
                  error={fieldErrors[field.name]}
                  onChange={(name, value) =>
                    setForm((current) => ({ ...current, [name]: value }))
                  }
                />
              </Fragment>
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
              disabled={saving}
              className="h-11 border border-zinc-300 px-4 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="h-11 bg-zinc-950 px-5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(confirmRow)}
        title={resource.deleteTitle || "Xóa dữ liệu"}
        description={resource.deleteDescription || "Thao tác này sẽ xóa dữ liệu vĩnh viễn. Bạn muốn tiếp tục?"}
        destructive
        onCancel={() => setConfirmRow(null)}
        onConfirm={remove}
      />

      {/* Resource-specific modal content opened via `openModal` (rowActions/onCreate) — the
          node itself owns its `Modal` shell, this just hosts whatever is currently set. */}
      {customModal}
    </section>
  );
}
