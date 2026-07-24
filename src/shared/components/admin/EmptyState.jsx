import { Inbox } from "lucide-react";

export default function EmptyState({
  title = "Chưa có dữ liệu",
  description = "Dữ liệu sẽ xuất hiện tại đây sau khi được tạo.",
}) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center border border-dashed border-zinc-300 bg-white p-8 text-center">
      <Inbox className="h-10 w-10 text-zinc-400" aria-hidden="true" />
      <h3 className="mt-4 text-base font-semibold text-zinc-900">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">{description}</p>
    </div>
  );
}
