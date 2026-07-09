const STATUS_STYLES = {
  PUBLISHED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  DRAFT: "border-zinc-200 bg-zinc-50 text-zinc-700",
  ARCHIVED: "border-zinc-300 bg-zinc-100 text-zinc-600",
  ACTIVE: "border-emerald-200 bg-emerald-50 text-emerald-700",
  INACTIVE: "border-zinc-200 bg-zinc-50 text-zinc-600",
  UNPAID: "border-amber-200 bg-amber-50 text-amber-700",
  PROCESSING: "border-blue-200 bg-blue-50 text-blue-700",
  SHIPPING: "border-indigo-200 bg-indigo-50 text-indigo-700",
  COMPLETED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  CANCELLED: "border-rose-200 bg-rose-50 text-rose-700",
  RETURNED: "border-orange-200 bg-orange-50 text-orange-700",
  PAID: "border-emerald-200 bg-emerald-50 text-emerald-700",
  PENDING: "border-amber-200 bg-amber-50 text-amber-700",
  FAILED: "border-rose-200 bg-rose-50 text-rose-700",
  REFUNDED: "border-purple-200 bg-purple-50 text-purple-700",
  NEW: "border-blue-200 bg-blue-50 text-blue-700",
  HANDLED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  CLOSED: "border-zinc-200 bg-zinc-50 text-zinc-600",
};

export default function StatusBadge({ value }) {
  if (value === undefined || value === null || value === "") {
    return <span className="text-sm text-zinc-400">-</span>;
  }

  const normalized = String(value).toUpperCase();
  const className =
    STATUS_STYLES[normalized] || "border-zinc-200 bg-zinc-50 text-zinc-700";

  return (
    <span
      className={`inline-flex h-7 items-center border px-2.5 text-xs font-semibold tracking-wide ${className}`}
    >
      {String(value)}
    </span>
  );
}
