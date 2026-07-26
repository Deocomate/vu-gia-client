"use client";

/**
 * Shimmering placeholder rows matching the DataTable layout so page height
 * doesn't jump while data is loading. Reused by every admin list/table surface.
 */
export default function TableSkeleton({ columns = 5, rows = 6, hasActionsColumn = true }) {
  const columnCount = Math.max(1, columns);

  return (
    <div
      className="overflow-x-auto border border-zinc-200 bg-white"
      role="status"
      aria-label="Đang tải dữ liệu"
    >
      <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
        <thead className="bg-zinc-50">
          <tr>
            {Array.from({ length: columnCount }).map((_, index) => (
              <th key={index} scope="col" className="px-4 py-3">
                <div className="h-3 w-20 animate-pulse rounded-sm bg-zinc-200" />
              </th>
            ))}
            {hasActionsColumn && (
              <th scope="col" className="w-12 px-4 py-3">
                <div className="h-3 w-3 animate-pulse rounded-sm bg-zinc-200" />
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 bg-white">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columnCount }).map((_, colIndex) => (
                <td key={colIndex} className="px-4 py-3">
                  <div
                    className="h-4 animate-pulse rounded-sm bg-zinc-100"
                    style={{ width: `${55 + ((rowIndex * 7 + colIndex * 13) % 35)}%` }}
                  />
                </td>
              ))}
              {hasActionsColumn && (
                <td className="px-4 py-3">
                  <div className="ml-auto h-4 w-10 animate-pulse rounded-sm bg-zinc-100" />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
