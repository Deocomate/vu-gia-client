export const ROLE = {
  CUSTOMER: "CUSTOMER",
  ADMIN: "ADMIN",
  SUPERADMIN: "SUPERADMIN",
};

export const ADMIN_ROLES = [ROLE.ADMIN, ROLE.SUPERADMIN];

export const ROLE_LABEL = {
  CUSTOMER: "Khách hàng",
  ADMIN: "Quản trị",
  SUPERADMIN: "Quản trị cấp cao",
};

export const PRODUCT_TYPE = ["SINGLE", "COMBO"];
export const PRODUCT_TYPE_LABEL = { SINGLE: "Đơn sản phẩm", COMBO: "Combo" };

export const PRODUCT_STATUS = ["DRAFT", "PUBLISHED", "ARCHIVED"];
export const PRODUCT_STATUS_LABEL = {
  DRAFT: "Nháp",
  PUBLISHED: "Đã đăng",
  ARCHIVED: "Lưu trữ",
};

export const CONTENT_STATUS = ["DRAFT", "PUBLISHED"];
export const CONTENT_STATUS_LABEL = { DRAFT: "Nháp", PUBLISHED: "Đã đăng" };

export const ORDER_STATUS = [
  "PENDING_PAYMENT",
  "PROCESSING",
  "SHIPPING",
  "COMPLETED",
  "CANCELLED",
  "RETURNED",
];
export const ORDER_STATUS_LABEL = {
  PENDING_PAYMENT: "Chờ thanh toán",
  PROCESSING: "Đang xử lý",
  SHIPPING: "Đang giao",
  COMPLETED: "Hoàn tất",
  CANCELLED: "Đã hủy",
  RETURNED: "Trả hàng",
};
export const ORDER_STATUS_COLOR = {
  PENDING_PAYMENT: "amber",
  PROCESSING: "blue",
  SHIPPING: "indigo",
  COMPLETED: "emerald",
  CANCELLED: "zinc",
  RETURNED: "rose",
};

export const PAYMENT_STATUS = ["PENDING", "PAID", "FAILED", "REFUNDED"];
export const PAYMENT_STATUS_LABEL = {
  PENDING: "Chờ thanh toán",
  PAID: "Đã thanh toán",
  FAILED: "Thất bại",
  REFUNDED: "Đã hoàn tiền",
};
export const PAYMENT_STATUS_COLOR = {
  PENDING: "amber",
  PAID: "emerald",
  FAILED: "rose",
  REFUNDED: "zinc",
};

export const PAYMENT_METHOD = ["COD", "ONL"];
export const PAYMENT_METHOD_LABEL = { COD: "Tiền mặt (COD)", ONL: "Chuyển khoản (VietQR)" };

export const DISCOUNT_TYPE = ["PERCENT", "FIXED", "FREE_SHIP"];
export const DISCOUNT_TYPE_LABEL = {
  PERCENT: "Phần trăm",
  FIXED: "Số tiền cố định",
  FREE_SHIP: "Miễn phí vận chuyển",
};

export const BANNER_POSITION = ["HOME_HERO", "HOME_CATEGORY", "HOME_PROMO"];
export const BANNER_POSITION_LABEL = {
  HOME_HERO: "Trang chủ - Hero",
  HOME_CATEGORY: "Trang chủ - Danh mục",
  HOME_PROMO: "Trang chủ - Khuyến mãi",
};

export const CONTACT_STATUS = ["NEW", "HANDLED", "CLOSED"];
export const CONTACT_STATUS_LABEL = {
  NEW: "Mới",
  HANDLED: "Đã xử lý",
  CLOSED: "Đã đóng",
};
