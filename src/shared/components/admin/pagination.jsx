import { ChevronLeft, ChevronRight } from "lucide-react";

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export default function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
}) {
  const pageCount = Math.max(1, Math.ceil((total || 0) / pageSize));

  return (
    <div className="flex flex-col gap-3 border-t border-zinc-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-4">
        <p className="text-sm text-zinc-500">
          Tổng <span className="font-semibold text-zinc-900">{total ?? 0}</span> bản ghi
        </p>
        {onPageSizeChange && (
          <label className="flex items-center gap-1.5 text-sm text-zinc-500">
            Số dòng/trang
            <select
              value={pageSize}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
              className="h-8 border border-zinc-300 px-2 text-sm outline-none focus:border-zinc-950"
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      <div className="flex items-center gap-2">
        <p className="text-sm text-zinc-500">
          Trang <span className="font-semibold text-zinc-900">{page}</span> / {pageCount}
        </p>
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="inline-flex h-9 w-9 items-center justify-center border border-zinc-300 text-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Trang trước"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(Math.min(pageCount, page + 1))}
          disabled={page >= pageCount}
          className="inline-flex h-9 w-9 items-center justify-center border border-zinc-300 text-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Trang sau"
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
