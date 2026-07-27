"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, Eye, ImageIcon, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import EmptyState from "@/shared/components/admin/empty-state";
import StatusBadge from "@/shared/components/admin/status-badge";
import { formatVnd, getValueByPath } from "@/shared/api/admin-api";
import { formatImageUrl } from "@/shared/api/media";

const renderCell = (row, column, context) => {
  const value =
    typeof column.accessor === "function"
      ? column.accessor(row)
      : getValueByPath(row, column.accessor || column.key);

  if (column.render) {
    // Custom cell renderer: (value, row, { reload }) => ReactNode. `context` (currently just
    // `reload`) is additive — existing `render(value, row)` callers simply ignore the 3rd arg.
    return column.render(value, row, context);
  }

  if (column.type === "image") {
    return value ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={formatImageUrl(value)} alt="" className="h-10 w-10 object-cover" loading="lazy" />
    ) : (
      <div className="flex h-10 w-10 items-center justify-center bg-zinc-100 text-zinc-300">
        <ImageIcon className="h-4 w-4" aria-hidden="true" />
      </div>
    );
  }

  if (column.type === "status") {
    return <StatusBadge value={value} />;
  }

  if (column.type === "money") {
    return <span className="font-semibold text-zinc-900">{formatVnd(value)}</span>;
  }

  if (column.type === "boolean") {
    return value ? "Có" : "Không";
  }

  if (column.type === "date") {
    return value ? new Date(value).toLocaleString("vi-VN") : "-";
  }

  return value === undefined || value === null || value === "" ? "-" : String(value);
};

export default function DataTable({
  columns,
  rows,
  getRowId = (row, index) => row?.id ?? row?.productId ?? row?.key ?? index,
  sortable,
  sortBy,
  sortDirection,
  onSort,
  onView,
  onEdit,
  onDelete,
  actions,
  reload,
  emptyState,
}) {
  if (!rows?.length) {
    return <EmptyState {...emptyState} />;
  }

  // `actions` can be a static array (existing behavior, unchanged) or a
  // `(row) => Action[]` factory for cases where the extra row buttons genuinely differ per row
  // (e.g. Users' "Đổi vai trò" only for superadmins). A function is always treated as "this
  // resource has row actions" for column-visibility purposes, even if it returns [] for some rows.
  const hasRowActionsCapability = typeof actions === "function" || Boolean(actions?.length);
  const hasActionsColumn = Boolean(onView || onEdit || onDelete || hasRowActionsCapability);
  const cellContext = { reload };

  return (
    <div className="overflow-x-auto border border-zinc-200 bg-white">
      <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
        <thead className="sticky top-0 z-10 bg-zinc-50">
          <tr>
            {columns.map((column, colIndex) => {
              const columnKey = column.key || (typeof column.accessor === "string" ? column.accessor : undefined);
              const isSortable = columnKey && sortable?.includes(columnKey);
              const isActive = sortBy === columnKey;
              const SortIcon = isActive ? (sortDirection === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;

              return (
                <th
                  key={columnKey || column.label || colIndex}
                  scope="col"
                  className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500"
                >
                  {isSortable ? (
                    <button
                      type="button"
                      onClick={() => onSort(columnKey)}
                      className={`inline-flex items-center gap-1 hover:text-zinc-900 ${isActive ? "text-zinc-900" : ""}`}
                    >
                      {column.label}
                      <SortIcon
                        className={`h-3.5 w-3.5 ${isActive ? "text-zinc-900" : "text-zinc-300"}`}
                        aria-hidden="true"
                      />
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              );
            })}
            {hasActionsColumn && (
              <th scope="col" className="w-12 px-4 py-3">
                <span className="sr-only">Thao tác</span>
                <MoreHorizontal className="h-4 w-4 text-zinc-400" aria-hidden="true" />
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 bg-white">
          {rows.map((row, index) => {
            const rowId = getRowId(row, index) ?? index;
            const resolvedActions = typeof actions === "function" ? actions(row) : actions;
            return (
              <tr key={rowId} className="hover:bg-zinc-50">
                {columns.map((column, colIndex) => {
                  const cellKey = column.key || (typeof column.accessor === "string" ? column.accessor : undefined) || column.label || colIndex;
                  const cellValue = renderCell(row, column, cellContext);
                  return (
                    <td
                      key={cellKey}
                      className="max-w-[260px] truncate px-4 py-3 text-zinc-700"
                      title={typeof cellValue === "string" ? cellValue : undefined}
                    >
                      {cellValue}
                    </td>
                  );
                })}
                {hasActionsColumn && (
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {onView && (
                        <button
                          type="button"
                          onClick={() => onView(row)}
                          className="inline-flex h-8 w-8 items-center justify-center text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 active:bg-zinc-100"
                          aria-label="Xem"
                        >
                          <Eye className="h-4 w-4" aria-hidden="true" />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(row)}
                          className="inline-flex h-8 w-8 items-center justify-center text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 active:bg-zinc-100"
                          aria-label="Sửa"
                        >
                          <Pencil className="h-4 w-4" aria-hidden="true" />
                        </button>
                      )}
                      {resolvedActions?.map((action, actionIndex) => (
                        <button
                          key={action.key || action.label || actionIndex}
                          type="button"
                          onClick={() => action.onClick(row)}
                          className="h-8 whitespace-nowrap border border-zinc-200 px-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 active:bg-zinc-100"
                        >
                          {action.label}
                        </button>
                      ))}
                      {onDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(row)}
                          className="inline-flex h-8 w-8 items-center justify-center text-rose-500 hover:bg-rose-50 hover:text-rose-700 active:bg-zinc-100"
                          aria-label="Xóa"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
