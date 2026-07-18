const COLOR_STYLES = {
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
  zinc: "border-zinc-200 bg-zinc-50 text-zinc-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  blue: "border-blue-200 bg-blue-50 text-blue-700",
  indigo: "border-indigo-200 bg-indigo-50 text-indigo-700",
  rose: "border-rose-200 bg-rose-50 text-rose-700",
  purple: "border-purple-200 bg-purple-50 text-purple-700",
  orange: "border-orange-200 bg-orange-50 text-orange-700",
};

const STATUS_COLOR = {
  PUBLISHED: "emerald",
  DRAFT: "zinc",
  ARCHIVED: "zinc",
  SINGLE: "zinc",
  COMBO: "indigo",
  PENDING_PAYMENT: "amber",
  PROCESSING: "blue",
  SHIPPING: "indigo",
  COMPLETED: "emerald",
  CANCELLED: "zinc",
  RETURNED: "rose",
  PAID: "emerald",
  PENDING: "amber",
  FAILED: "rose",
  REFUNDED: "purple",
  NEW: "blue",
  HANDLED: "emerald",
  CLOSED: "zinc",
  HOME_HERO: "amber",
  HOME_CATEGORY: "blue",
  HOME_PROMO: "purple",
};

const STATUS_LABELS = {
  PUBLISHED: "Đã đăng",
  DRAFT: "Nháp",
  ARCHIVED: "Lưu trữ",
  SINGLE: "Đơn sản phẩm",
  COMBO: "Combo",
  PENDING_PAYMENT: "Chờ thanh toán",
  PROCESSING: "Đang xử lý",
  SHIPPING: "Đang giao",
  COMPLETED: "Hoàn tất",
  CANCELLED: "Đã hủy",
  RETURNED: "Trả hàng",
  PAID: "Đã thanh toán",
  PENDING: "Chờ thanh toán",
  FAILED: "Thất bại",
  REFUNDED: "Đã hoàn tiền",
  NEW: "Mới",
  HANDLED: "Đã xử lý",
  CLOSED: "Đã đóng",
  HOME_HERO: "Trang chủ - Hero",
  HOME_CATEGORY: "Trang chủ - Danh mục",
  HOME_PROMO: "Trang chủ - Khuyến mãi",
  PERCENT: "Phần trăm",
  FIXED: "Số tiền cố định",
  FREE_SHIP: "Miễn phí vận chuyển",
};

export default function StatusBadge({ value, label }) {
  if (value === undefined || value === null || value === "") {
    return <span className="text-sm text-zinc-400">-</span>;
  }

  const normalized = String(value).toUpperCase();
  const color = STATUS_COLOR[normalized] || "zinc";
  const className = COLOR_STYLES[color];
  const displayLabel = label || STATUS_LABELS[normalized] || String(value);

  return (
    <span
      className={`inline-flex h-7 items-center border px-2.5 text-xs font-semibold tracking-wide ${className}`}
    >
      {displayLabel}
    </span>
  );
}
