import { ORDER_STATUS, ORDER_STATUS_LABEL } from "@/shared/api/apiEnums";

export default function OrdersByStatusBar({ ordersByStatus }) {
  if (!ordersByStatus) return null;
  const max = Math.max(1, ...Object.values(ordersByStatus));

  return (
    <section className="border border-zinc-200 bg-white p-5">
      <h2 className="text-lg font-semibold text-zinc-950">Đơn hàng theo trạng thái</h2>
      <div className="mt-4 flex flex-col gap-3">
        {ORDER_STATUS.map((status) => {
          const count = ordersByStatus[status] || 0;
          return (
            <div key={status} className="flex items-center gap-3">
              <span className="w-32 shrink-0 text-xs font-semibold text-zinc-600">
                {ORDER_STATUS_LABEL[status]}
              </span>
              <div className="h-3 flex-1 bg-zinc-100">
                <div
                  className="h-3 bg-zinc-950"
                  style={{ width: `${(count / max) * 100}%` }}
                />
              </div>
              <span className="w-8 shrink-0 text-right text-xs font-semibold text-zinc-900">{count}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
