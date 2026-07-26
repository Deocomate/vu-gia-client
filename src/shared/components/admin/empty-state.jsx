import { Inbox } from "lucide-react";

/**
 * `action` (optional): { label: string, onClick: () => void } — rendered as a
 * CTA button below the description, e.g. "Tạo mới" (no data) or "Xóa bộ lọc"
 * (no matches for current filters).
 */
export default function EmptyState({
  title = "Chưa có dữ liệu",
  description = "Dữ liệu sẽ xuất hiện tại đây sau khi được tạo.",
  action,
}) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center border border-dashed border-zinc-300 bg-white p-8 text-center">
      <Inbox className="h-10 w-10 text-zinc-400" aria-hidden="true" />
      <h3 className="mt-4 text-base font-semibold text-zinc-900">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">{description}</p>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-4 inline-flex h-10 items-center gap-2 bg-zinc-950 px-4 text-sm font-semibold text-white hover:bg-zinc-800"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
