export const ROUTES = {
  HOME: "/",
  PRODUCTS: "/san-pham",
  NEWS: "/tin-tuc",
  ABOUT: "/ve-chung-toi",
  FACTORY: "/nha-xuong",
  SHOWROOM: "/showroom",
  GALLERY: "/thu-vien-hinh-anh",
  CONTACT: "/lien-he",
  PRIVACY_POLICY: "/bao-mat-thong-tin",
  SHIPPING_POLICY: "/chinh-sach-van-chuyen",
  RETURN_POLICY: "/chinh-sach-doi-tra",
  FAQ: "/cau-hoi-thuong-gap",
  CART: "/gio-hang",
  CHECKOUT: "/thanh-toan",
  CHECKOUT_RESULT: (orderId) => `/thanh-toan/ket-qua/${orderId}`,
  LOGIN: "/dang-nhap",
  REGISTER: "/dang-ky",
  ACCOUNT: "/tai-khoan",
  ORDERS: "/tai-khoan/don-hang",
  ORDER_DETAIL: (orderId) => `/tai-khoan/don-hang/${orderId}`,
  ALTAR_CUSTOMIZER: "/tuy-chinh-bo-do-tho",
  ALTAR_DESIGN_LIBRARY: "/tai-khoan/thu-vien-thiet-ke",
  ADMIN: "/admin",
  ADMIN_LOGIN: "/admin/login",
  ADMIN_PRODUCTS: "/admin/products",
  ADMIN_CATEGORIES: "/admin/categories",
  ADMIN_MEDIA: "/admin/media",
  ADMIN_ORDERS: "/admin/orders",
  ADMIN_COUPONS: "/admin/coupons",
  ADMIN_SITE_SETTINGS: "/admin/site-settings",
  ADMIN_NEWS: "/admin/news",
  ADMIN_PAGES: "/admin/pages",
  ADMIN_SHOWROOMS: "/admin/showrooms",
  ADMIN_SHIPPING_METHODS: "/admin/shipping-methods",
  ADMIN_BANNERS: "/admin/banners",
  ADMIN_CONTACT_LEADS: "/admin/contact-leads",
  ADMIN_USERS: "/admin/users",
  ADMIN_ALTAR_ITEM_GROUPS: "/admin/altar-item-groups",
  ADMIN_ALTAR_STYLES: "/admin/altar-styles",
  ADMIN_ALTAR_MODELS: "/admin/altar-models",
  ADMIN_ALTAR_PRESETS: "/admin/altar-presets",
};

/**
 * Guards `?next=` redirect targets against open-redirect: only a single
 * same-origin relative path is allowed (must start with exactly one "/",
 * never a protocol-relative "//" or backslash variant an attacker could use
 * to redirect off-site after a legitimate login).
 */
export function sanitizeNextPath(next, fallback = ROUTES.HOME) {
  if (
    typeof next !== "string" ||
    !next.startsWith("/") ||
    next.startsWith("//") ||
    next.startsWith("/\\")
  ) {
    return fallback;
  }
  return next;
}
