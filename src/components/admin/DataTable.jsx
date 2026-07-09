"use client";

import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import EmptyState from "@/components/admin/EmptyState";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatVnd, getValueByPath } from "@/lib/adminApi";

const renderCell = (row, column) => {
  const value =
    typeof column.accessor === "function"
      ? column.accessor(row)
      : getValueByPath(row, column.accessor || column.key);

  if (column.render) {
    return column.render(value, row);
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
  getRowId = (row) => row.id,
  onView,
  onEdit,
  onDelete,
  actions,
}) {
  if (!rows?.length) {
    return <EmptyState />;
  }

  return (
    <div className="overflow-x-auto border border-zinc-200 bg-white">
      <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
        <thead className="bg-zinc-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key || column.accessor || column.label}
                scope="col"
                className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500"
              >
                {column.label}
              </th>
            ))}
            {(onView || onEdit || onDelete || actions?.length) && (
              <th scope="col" className="w-12 px-4 py-3">
                <MoreHorizontal className="h-4 w-4 text-zinc-400" aria-hidden="true" />
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 bg-white">
          {rows.map((row) => (
            <tr key={getRowId(row)} className="hover:bg-zinc-50">
              {columns.map((column) => (
                <td
                  key={column.key || column.accessor || column.label}
                  className="max-w-[260px] truncate px-4 py-3 text-zinc-700"
                  title={typeof renderCell(row, column) === "string" ? renderCell(row, column) : undefined}
                >
                  {renderCell(row, column)}
                </td>
              ))}
              {(onView || onEdit || onDelete || actions?.length) && (
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    {onView && (
                      <button
                        type="button"
                        onClick={() => onView(row)}
                        className="inline-flex h-8 w-8 items-center justify-center text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950"
                        aria-label="Xem"
                      >
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      </button>
                    )}
                    {onEdit && (
                      <button
                        type="button"
                        onClick={() => onEdit(row)}
                        className="inline-flex h-8 w-8 items-center justify-center text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950"
                        aria-label="Sửa"
                      >
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                      </button>
                    )}
                    {actions?.map((action) => (
                      <button
                        key={action.label}
                        type="button"
                        onClick={() => action.onClick(row)}
                        className="h-8 whitespace-nowrap border border-zinc-200 px-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100"
                      >
                        {action.label}
                      </button>
                    ))}
                    {onDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete(row)}
                        className="inline-flex h-8 w-8 items-center justify-center text-rose-500 hover:bg-rose-50 hover:text-rose-700"
                        aria-label="Xóa"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
