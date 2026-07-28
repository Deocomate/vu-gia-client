import { ShieldCheck, Star } from "lucide-react";
import { adminApi } from "@/shared/api/admin-api";
import { toast } from "@/shared/utils/feedback";
import { ROUTES } from "@/shared/utils/routes";
import {
  DISCOUNT_TYPE,
  DISCOUNT_TYPE_LABEL,
  BANNER_POSITION,
  BANNER_POSITION_LABEL,
  CONTACT_STATUS,
  CONTACT_STATUS_LABEL,
  CONTENT_STATUS,
  CONTENT_STATUS_LABEL,
  ORDER_STATUS,
  ORDER_STATUS_LABEL,
  PAYMENT_STATUS,
  PAYMENT_STATUS_LABEL,
  PRODUCT_TYPE,
  PRODUCT_TYPE_LABEL,
  PRODUCT_STATUS,
  PRODUCT_STATUS_LABEL,
  ROLE,
  ROLE_LABEL,
} from "@/shared/api/api-enums";

/** Async FK-picker loader for a `/{endpoint}?{searchParam}=` list. */
export function makeAsyncOptions(endpoint, { searchParam = "name", labelField = "name" } = {}) {
  return async (query) => {
    const data = await adminApi.get(endpoint, { [searchParam]: query || undefined, page: 1, size: 20 });
    return (data?.content || []).map((item) => ({ value: item.id, label: item[labelField] }));
  };
}

export const resources = {
  productCategories: {
    title: "Danh mục sản phẩm",
    description: "6 danh mục cố định — chỉ sửa nội dung/ảnh/SEO, không thêm hoặc xoá được.",
    endpoint: "/product-categories",
    searchable: true,
    searchParam: "name",
    readOnlyCreate: true,
    noDelete: true,
    filters: [{ name: "isActive", label: "Hoạt động", type: "boolean" }],
    sortable: ["id", "name", "priority", "createdAt"],
    defaultSort: { field: "priority", direction: "asc" },
    columns: [
      { key: "thumb", label: "Ảnh", accessor: "thumb", type: "image" },
      { key: "name", label: "Tên", accessor: "name" },
      { key: "slug", label: "Slug", accessor: "slug" },
      { key: "priority", label: "Thứ tự", accessor: "priority" },
      { key: "isActive", label: "Hoạt động", accessor: "isActive", type: "boolean" },
    ],
    fields: [
      { name: "name", label: "Tên danh mục", required: true },
      { name: "thumb", label: "Ảnh đại diện", type: "media", required: true, fullWidth: true, folder: "categories" },
      { name: "slug", label: "Slug", description: "Để trống sẽ tự sinh từ tên." },
      { name: "priority", label: "Thứ tự", type: "number" },
      { name: "shortDescription", label: "Mô tả ngắn", type: "textarea", rows: 4, fullWidth: true },
      { name: "detailContent", label: "Nội dung chi tiết (khối)", type: "category-block-content", fullWidth: true, folder: "categories" },
      { name: "isActive", label: "Đang hoạt động", type: "boolean" },
    ],
    defaults: { priority: 0, isActive: true },
    seo: true,
  },

  coupons: {
    title: "Coupon",
    description: "Quản lý mã giảm giá theo phần trăm, số tiền cố định hoặc freeship.",
    endpoint: "/coupons",
    searchable: true,
    searchParam: "code",
    filters: [
      { name: "discountType", label: "Loại giảm", options: DISCOUNT_TYPE.map((v) => ({ value: v, label: DISCOUNT_TYPE_LABEL[v] })) },
      { name: "isActive", label: "Hoạt động", type: "boolean" },
    ],
    sortable: ["id", "code", "discountValue", "usedCount", "startsAt", "endsAt", "createdAt"],
    defaultSort: { field: "createdAt", direction: "desc" },
    columns: [
      { key: "code", label: "Code", accessor: "code" },
      { key: "discountType", label: "Loại", accessor: "discountType", type: "status" },
      { key: "discountValue", label: "Giá trị", accessor: "discountValue" },
      { key: "usedCount", label: "Đã dùng", accessor: "usedCount" },
      { key: "isActive", label: "Hoạt động", accessor: "isActive", type: "boolean" },
    ],
    fields: [
      { name: "code", label: "Mã coupon", required: true },
      {
        name: "discountType",
        label: "Loại giảm",
        type: "select",
        required: true,
        options: DISCOUNT_TYPE.map((v) => ({ value: v, label: DISCOUNT_TYPE_LABEL[v] })),
      },
      { name: "discountValue", label: "Giá trị", type: "number", required: true, min: 0 },
      { name: "minOrderAmount", label: "Đơn tối thiểu", type: "money", min: 0 },
      { name: "maxDiscountAmount", label: "Giảm tối đa", type: "money", min: 0 },
      { name: "usageLimit", label: "Giới hạn tổng", type: "number", min: 0 },
      { name: "usageLimitPerUser", label: "Giới hạn/user", type: "number", min: 0 },
      { name: "startsAt", label: "Bắt đầu", type: "datetime" },
      { name: "endsAt", label: "Kết thúc", type: "datetime" },
      { name: "isActive", label: "Đang hoạt động", type: "boolean" },
    ],
    defaults: { discountType: "PERCENT", isActive: true },
  },

  newsCategories: {
    title: "Danh mục tin tức",
    description: "Quản lý danh mục cho bài viết tin tức.",
    endpoint: "/news-categories",
    searchable: true,
    searchParam: "name",
    sortable: ["id", "name", "priority", "createdAt"],
    defaultSort: { field: "priority", direction: "asc" },
    columns: [
      { key: "name", label: "Tên", accessor: "name" },
      { key: "slug", label: "Slug", accessor: "slug" },
      { key: "priority", label: "Thứ tự", accessor: "priority" },
    ],
    fields: [
      { name: "name", label: "Tên danh mục", required: true },
      { name: "slug", label: "Slug", description: "Để trống sẽ tự sinh từ tên." },
      { name: "priority", label: "Thứ tự", type: "number" },
    ],
    defaults: { priority: 0 },
  },

  faqs: {
    title: "FAQ",
    description: "Quản lý câu hỏi thường gặp.",
    endpoint: "/faqs",
    searchable: true,
    searchParam: "question",
    filters: [{ name: "category", label: "Nhóm" }, { name: "isActive", label: "Hoạt động", type: "boolean" }],
    sortable: ["id", "sortOrder", "createdAt"],
    defaultSort: { field: "sortOrder", direction: "asc" },
    columns: [
      { key: "question", label: "Câu hỏi", accessor: "question" },
      { key: "category", label: "Nhóm", accessor: "category" },
      { key: "isActive", label: "Hoạt động", accessor: "isActive", type: "boolean" },
      { key: "sortOrder", label: "Thứ tự", accessor: "sortOrder" },
    ],
    fields: [
      { name: "question", label: "Câu hỏi", required: true, fullWidth: true },
      { name: "answer", label: "Câu trả lời", type: "textarea", rows: 6, required: true, fullWidth: true },
      { name: "category", label: "Nhóm" },
      { name: "sortOrder", label: "Thứ tự", type: "number" },
      { name: "isActive", label: "Đang hiển thị", type: "boolean" },
    ],
    defaults: { isActive: true, sortOrder: 0 },
  },

  galleryImages: {
    title: "Thư viện hình ảnh",
    description: "Quản lý hình ảnh hiển thị ở trang gallery.",
    endpoint: "/gallery-images",
    searchable: true,
    searchParam: "title",
    filters: [{ name: "category", label: "Nhóm" }, { name: "isActive", label: "Hoạt động", type: "boolean" }],
    sortable: ["id", "sortOrder", "createdAt"],
    defaultSort: { field: "sortOrder", direction: "asc" },
    columns: [
      { key: "imageUrl", label: "Ảnh", accessor: "imageUrl", type: "image" },
      { key: "title", label: "Tiêu đề", accessor: "title" },
      { key: "category", label: "Danh mục", accessor: "category" },
      { key: "isActive", label: "Hoạt động", accessor: "isActive", type: "boolean" },
    ],
    fields: [
      { name: "imageUrl", label: "Ảnh", type: "media", required: true, fullWidth: true, folder: "gallery" },
      { name: "title", label: "Tiêu đề" },
      { name: "category", label: "Danh mục" },
      { name: "sortOrder", label: "Thứ tự", type: "number" },
      { name: "isActive", label: "Đang hiển thị", type: "boolean" },
    ],
    defaults: { sortOrder: 0, isActive: true },
  },

  showrooms: {
    title: "Showroom",
    description: "Quản lý showroom, map, giờ mở cửa và ảnh liên quan.",
    endpoint: "/showrooms",
    searchable: true,
    searchParam: "name",
    filters: [{ name: "isActive", label: "Hoạt động", type: "boolean" }],
    sortable: ["id", "name", "sortOrder", "createdAt"],
    defaultSort: { field: "sortOrder", direction: "asc" },
    columns: [
      { key: "name", label: "Tên", accessor: "name" },
      { key: "address", label: "Địa chỉ", accessor: "address" },
      { key: "phone", label: "Điện thoại", accessor: "phone" },
      { key: "isActive", label: "Hoạt động", accessor: "isActive", type: "boolean" },
    ],
    fields: [
      { name: "name", label: "Tên showroom", required: true },
      { name: "phone", label: "Điện thoại" },
      { name: "address", label: "Địa chỉ", type: "textarea", rows: 3, required: true, fullWidth: true },
      { name: "mapEmbedUrl", label: "Map embed URL", type: "url", fullWidth: true },
      { name: "openingHours", label: "Giờ mở cửa" },
      { name: "sortOrder", label: "Thứ tự", type: "number" },
      { name: "isActive", label: "Đang hoạt động", type: "boolean" },
    ],
    defaults: { sortOrder: 0, isActive: true },
  },

  shippingMethods: {
    title: "Phương thức vận chuyển",
    description: "Quản lý các phương thức vận chuyển và phí giao hàng hiển thị ở trang thanh toán.",
    endpoint: "/shipping-methods",
    searchable: true,
    searchParam: "name",
    filters: [{ name: "isActive", label: "Hoạt động", type: "boolean" }],
    sortable: ["id", "sortOrder", "fee", "createdAt"],
    defaultSort: { field: "sortOrder", direction: "asc" },
    columns: [
      { key: "name", label: "Tên", accessor: "name" },
      { key: "fee", label: "Phí (VND)", accessor: "fee" },
      { key: "sortOrder", label: "Thứ tự", accessor: "sortOrder" },
      { key: "isActive", label: "Hoạt động", accessor: "isActive", type: "boolean" },
    ],
    fields: [
      { name: "name", label: "Tên phương thức", required: true },
      { name: "fee", label: "Phí vận chuyển", type: "money", min: 0, required: true },
      { name: "sortOrder", label: "Thứ tự", type: "number" },
      { name: "isActive", label: "Đang hoạt động", type: "boolean" },
    ],
    defaults: { sortOrder: 0, isActive: true },
  },

  banners: {
    title: "Banner",
    description: "Quản lý banner trang chủ/category/promo.",
    endpoint: "/banners",
    searchable: true,
    searchParam: "title",
    filters: [
      { name: "position", label: "Vị trí", options: BANNER_POSITION.map((v) => ({ value: v, label: BANNER_POSITION_LABEL[v] })) },
      { name: "isActive", label: "Hoạt động", type: "boolean" },
    ],
    sortable: ["id", "sortOrder", "position", "createdAt"],
    defaultSort: { field: "sortOrder", direction: "asc" },
    columns: [
      { key: "imageUrl", label: "Ảnh", accessor: "imageUrl", type: "image" },
      { key: "title", label: "Tiêu đề", accessor: "title" },
      { key: "position", label: "Vị trí", accessor: "position", type: "status" },
      { key: "isActive", label: "Hoạt động", accessor: "isActive", type: "boolean" },
    ],
    fields: [
      { name: "title", label: "Tiêu đề" },
      { name: "imageUrl", label: "Ảnh", type: "media", required: true, fullWidth: true, folder: "banners" },
      { name: "linkUrl", label: "Link URL", type: "url" },
      {
        name: "position",
        label: "Vị trí",
        type: "select",
        required: true,
        options: BANNER_POSITION.map((v) => ({ value: v, label: BANNER_POSITION_LABEL[v] })),
      },
      { name: "sortOrder", label: "Thứ tự", type: "number" },
      { name: "isActive", label: "Đang hiển thị", type: "boolean" },
      { name: "startsAt", label: "Bắt đầu", type: "datetime" },
      { name: "endsAt", label: "Kết thúc", type: "datetime" },
    ],
    defaults: { position: "HOME_HERO", sortOrder: 0, isActive: true },
  },

  altarItemGroups: {
    title: "Nhóm sản phẩm thờ",
    description: "Quản lý nhóm sản phẩm thờ (bộ tam sự - ngũ sự, bát hương, lọ hoa, phụ kiện, thần tài - thổ địa) dùng cho công cụ tùy chỉnh bàn thờ.",
    endpoint: "/altar-item-groups",
    searchable: true,
    searchParam: "name",
    filters: [{ name: "isActive", label: "Hoạt động", type: "boolean" }],
    sortable: ["id", "name", "priority", "createdAt"],
    defaultSort: { field: "priority", direction: "asc" },
    columns: [
      { key: "thumb", label: "Ảnh", accessor: "thumb", type: "image" },
      { key: "name", label: "Tên", accessor: "name" },
      { key: "slug", label: "Slug", accessor: "slug" },
      { key: "renderOnAltar", label: "Hiện trên bàn thờ", accessor: "renderOnAltar", type: "boolean" },
      { key: "priority", label: "Thứ tự", accessor: "priority" },
      { key: "isActive", label: "Hoạt động", accessor: "isActive", type: "boolean" },
    ],
    fields: [
      { name: "name", label: "Tên nhóm", required: true },
      { name: "thumb", label: "Ảnh đại diện", type: "media", required: true, fullWidth: true, folder: "altar" },
      { name: "slug", label: "Slug", description: "Để trống sẽ tự sinh từ tên." },
      {
        name: "renderOnAltar",
        label: "Hiển thị trên bàn thờ",
        type: "boolean",
        helper: "Bật",
        description: "Tắt nếu nhóm này chỉ là phụ kiện liệt kê tóm tắt, không đặt trực tiếp lên bàn thờ.",
      },
      { name: "priority", label: "Thứ tự", type: "number" },
      { name: "isActive", label: "Đang hoạt động", type: "boolean" },
    ],
    defaults: { priority: 0, isActive: true, renderOnAltar: true },
  },

  altarStyles: {
    title: "Kiểu men",
    description: "Quản lý kiểu men/dáng (men lam, men rạn, men lam vẽ vàng, men rạn dát vàng, men màu theo mệnh) dùng cho công cụ tùy chỉnh bàn thờ.",
    endpoint: "/altar-styles",
    searchable: true,
    searchParam: "name",
    filters: [{ name: "isActive", label: "Hoạt động", type: "boolean" }],
    sortable: ["id", "name", "priority", "createdAt"],
    defaultSort: { field: "priority", direction: "asc" },
    columns: [
      { key: "thumb", label: "Ảnh", accessor: "thumb", type: "image" },
      { key: "name", label: "Tên", accessor: "name" },
      { key: "slug", label: "Slug", accessor: "slug" },
      { key: "priority", label: "Thứ tự", accessor: "priority" },
      { key: "isActive", label: "Hoạt động", accessor: "isActive", type: "boolean" },
    ],
    fields: [
      { name: "name", label: "Tên kiểu men", required: true },
      { name: "thumb", label: "Ảnh đại diện", type: "media", required: true, fullWidth: true, folder: "altar" },
      { name: "slug", label: "Slug", description: "Để trống sẽ tự sinh từ tên." },
      { name: "description", label: "Mô tả", type: "textarea", rows: 4, required: true, fullWidth: true },
      { name: "priority", label: "Thứ tự", type: "number" },
      { name: "isActive", label: "Đang hoạt động", type: "boolean" },
    ],
    defaults: { priority: 0, isActive: true },
  },

  altarModels: {
    title: "Loại bàn thờ",
    description: "Quản lý loại bàn thờ (kích thước, ảnh nền, vùng đặt đồ) dùng cho công cụ tùy chỉnh bàn thờ.",
    endpoint: "/altar-models",
    searchable: true,
    searchParam: "name",
    filters: [{ name: "isActive", label: "Hoạt động", type: "boolean" }],
    sortable: ["id", "name", "priority", "createdAt"],
    defaultSort: { field: "priority", direction: "asc" },
    columns: [
      { key: "thumb", label: "Ảnh", accessor: "thumb", type: "image" },
      { key: "name", label: "Tên", accessor: "name" },
      { key: "slug", label: "Slug", accessor: "slug" },
      {
        key: "sizes",
        label: "Kích thước",
        accessor: "sizes",
        render: (value) => (Array.isArray(value) ? value.length : 0),
      },
      { key: "priority", label: "Thứ tự", accessor: "priority" },
      { key: "isActive", label: "Hoạt động", accessor: "isActive", type: "boolean" },
    ],
    fields: [
      { name: "name", label: "Tên loại bàn thờ", required: true },
      { name: "thumb", label: "Ảnh đại diện", type: "media", required: true, fullWidth: true, folder: "altar" },
      { name: "slug", label: "Slug", description: "Để trống sẽ tự sinh từ tên." },
      { name: "description", label: "Mô tả", type: "textarea", rows: 4, required: true, fullWidth: true },
      { name: "priority", label: "Thứ tự", type: "number" },
      { name: "isActive", label: "Đang hoạt động", type: "boolean" },
      // Nested-collection field — sizes have their own CRUD endpoints
      // (`/altar-models/{modelId}/sizes[/{sizeId}]`), see `AltarSizesEditor`. Disabled
      // (with an explanatory placeholder) until the model itself has been saved once.
      { name: "sizes", label: "Kích thước", type: "altar-sizes", fullWidth: true },
    ],
    defaults: { priority: 0, isActive: true },
  },

  // No generic create/edit form: authoring a preset means arranging items on the shared
  // `altar-canvas.jsx`, which only makes sense as a dedicated page (`AltarPresetBuilder`), not a
  // generic field-driven modal — same reasoning/mechanism as `products` above (`fields` stays
  // empty, `noEdit: true` suppresses the pencil icon, `detailPath` routes the eye icon to the
  // builder page, `onCreate` redirects to the "new" route). List/search/delete still go through
  // the generic manager against the same `/altar-presets` endpoint.
  altarPresets: {
    title: "Bộ gợi ý",
    description: "Quản lý các bộ bàn thờ dựng sẵn (\"bộ gợi ý\") để khách chọn nhanh khi tùy chỉnh.",
    endpoint: "/altar-presets",
    searchable: true,
    searchParam: "name",
    detailPath: ROUTES.ADMIN_ALTAR_PRESETS,
    noEdit: true,
    createLabel: "Tạo bộ gợi ý",
    emptyTitle: "Chưa có bộ gợi ý",
    emptyDescription: "Tạo bộ gợi ý đầu tiên để khách chọn nhanh trong bước \"Chọn bộ gợi ý\".",
    filters: [{ name: "isActive", label: "Hoạt động", type: "boolean" }],
    sortable: ["id", "name", "priority", "createdAt"],
    defaultSort: { field: "priority", direction: "asc" },
    columns: [
      { key: "thumb", label: "Ảnh", accessor: "thumb", type: "image" },
      { key: "name", label: "Tên", accessor: "name" },
      { key: "slug", label: "Slug", accessor: "slug" },
      {
        key: "altarModelSize",
        label: "Kích thước",
        accessor: "altarModelSize",
        render: (value, row) => value?.label || row.altarModelSizeId || "—",
      },
      {
        key: "altarStyle",
        label: "Kiểu men",
        accessor: "altarStyle",
        render: (value) => value?.name || "Mọi kiểu men",
      },
      { key: "priority", label: "Thứ tự", accessor: "priority" },
      { key: "isActive", label: "Hoạt động", accessor: "isActive", type: "boolean" },
    ],
    fields: [],
    onCreate: () => window.location.assign(`${ROUTES.ADMIN_ALTAR_PRESETS}/new`),
  },

  redirects: {
    title: "Redirects",
    description: "Quản lý 301/302 redirect cho SEO khi đổi slug.",
    endpoint: "/redirects",
    searchable: true,
    searchParam: "fromPath",
    filters: [{ name: "isActive", label: "Hoạt động", type: "boolean" }],
    sortable: ["id", "createdAt"],
    defaultSort: { field: "createdAt", direction: "desc" },
    columns: [
      { key: "fromPath", label: "Đường dẫn gốc (From)", accessor: "fromPath" },
      { key: "toPath", label: "Đường dẫn đích (To)", accessor: "toPath" },
      { key: "statusCode", label: "Code", accessor: "statusCode" },
      { key: "hitCount", label: "Lượt truy cập", accessor: "hitCount" },
      { key: "isActive", label: "Hoạt động", accessor: "isActive", type: "boolean" },
    ],
    fields: [
      { name: "fromPath", label: "Đường dẫn gốc (From path)", required: true },
      { name: "toPath", label: "Đường dẫn đích (To path)", required: true },
      { name: "statusCode", label: "Status code", type: "select", options: [301, 302] },
      { name: "isActive", label: "Đang hoạt động", type: "boolean" },
    ],
    defaults: { statusCode: 301, isActive: true },
  },

  contactRequests: {
    title: "Liên hệ",
    description: "Quản lý lead từ form liên hệ. Chỉ cập nhật được trạng thái.",
    endpoint: "/contact-requests",
    searchable: true,
    searchParam: "name",
    readOnlyCreate: true,
    noDelete: true,
    updateMode: "status",
    filters: [
      { name: "status", label: "Trạng thái", options: CONTACT_STATUS.map((v) => ({ value: v, label: CONTACT_STATUS_LABEL[v] })) },
    ],
    sortable: ["id", "name", "status", "createdAt"],
    defaultSort: { field: "createdAt", direction: "desc" },
    columns: [
      { key: "name", label: "Tên", accessor: "name" },
      { key: "email", label: "Email", accessor: "email" },
      { key: "phone", label: "Điện thoại", accessor: "phone" },
      { key: "status", label: "Trạng thái", accessor: "status", type: "status" },
      { key: "handledByUsername", label: "Xử lý bởi", accessor: "handledByUsername" },
      { key: "createdAt", label: "Ngày gửi", accessor: "createdAt", type: "date" },
    ],
    fields: [
      { name: "status", label: "Trạng thái", type: "select", options: CONTACT_STATUS.map((v) => ({ value: v, label: CONTACT_STATUS_LABEL[v] })) },
    ],
  },

  newsletterSubscribers: {
    title: "Newsletter",
    description: "Danh sách email đăng ký nhận tin. Chỉ bật/tắt trạng thái.",
    endpoint: "/newsletter-subscribers",
    searchable: true,
    searchParam: "email",
    readOnlyCreate: true,
    updateMode: "isActive",
    filters: [{ name: "isActive", label: "Hoạt động", type: "boolean" }],
    sortable: ["id", "email", "createdAt"],
    defaultSort: { field: "createdAt", direction: "desc" },
    columns: [
      { key: "email", label: "Email", accessor: "email" },
      { key: "isActive", label: "Hoạt động", accessor: "isActive", type: "boolean" },
      { key: "createdAt", label: "Ngày đăng ký", accessor: "createdAt", type: "date" },
    ],
    fields: [{ name: "isActive", label: "Đang hoạt động", type: "boolean" }],
  },

  news: {
    title: "Tin tức",
    description: "Quản lý bài viết, cover, nội dung khối và SEO.",
    endpoint: "/news",
    searchable: true,
    searchParam: "title",
    filters: [
      { name: "status", label: "Trạng thái", options: CONTENT_STATUS.map((v) => ({ value: v, label: CONTENT_STATUS_LABEL[v] })) },
    ],
    sortable: ["id", "priority", "viewCount", "publishedAt", "createdAt"],
    defaultSort: { field: "createdAt", direction: "desc" },
    columns: [
      { key: "thumb", label: "Ảnh", accessor: "thumb", type: "image" },
      { key: "title", label: "Tiêu đề", accessor: "title" },
      { key: "newsCategoryName", label: "Danh mục", accessor: "category.name" },
      { key: "status", label: "Trạng thái", accessor: "status", type: "status" },
      { key: "viewCount", label: "Lượt xem", accessor: "viewCount" },
    ],
    fields: [
      { name: "title", label: "Tiêu đề", required: true, fullWidth: true },
      {
        name: "newsCategoryId",
        label: "Danh mục tin",
        type: "searchable-select",
        required: true,
        fullWidth: true,
        loadOptions: makeAsyncOptions("/news-categories", { searchParam: "name" }),
      },
      { name: "thumb", label: "Ảnh cover", type: "media", required: true, fullWidth: true, folder: "news" },
      { name: "shortContent", label: "Tóm tắt", type: "textarea", rows: 3, required: true, fullWidth: true },
      { name: "des", label: "Nội dung (khối)", type: "news-block-content", fullWidth: true, folder: "news" },
      { name: "slug", label: "Slug", description: "Để trống sẽ tự sinh từ tiêu đề." },
      { name: "priority", label: "Thứ tự", type: "number" },
      { name: "publishedAt", label: "Ngày xuất bản", type: "datetime" },
      {
        name: "status",
        label: "Trạng thái",
        type: "select",
        options: CONTENT_STATUS.map((v) => ({ value: v, label: CONTENT_STATUS_LABEL[v] })),
      },
    ],
    defaults: { status: "DRAFT" },
    seo: true,
    get auxiliary() {
      return resources.newsCategories;
    },
    rowActions: [
      {
        label: "Publish",
        onClick: async (row, { reload }) => {
          try {
            await adminApi.patchBody(`/news/${row.id}/status`, { status: "PUBLISHED" });
            toast.success("Đã publish bài viết.");
            reload();
          } catch (error) {
            toast.error(error.message || "Không thể publish.");
          }
        },
      },
    ],
  },

  pages: {
    title: "Trang CMS",
    description: "Quản lý Page dạng nội dung khối cho about, showroom, policy, factory.",
    endpoint: "/pages",
    searchable: true,
    searchParam: "key",
    filters: [
      { name: "status", label: "Trạng thái", options: CONTENT_STATUS.map((v) => ({ value: v, label: CONTENT_STATUS_LABEL[v] })) },
    ],
    sortable: ["id", "key", "title", "status", "createdAt"],
    defaultSort: { field: "createdAt", direction: "desc" },
    columns: [
      { key: "key", label: "Key", accessor: "key" },
      { key: "title", label: "Tiêu đề", accessor: "title" },
      { key: "status", label: "Trạng thái", accessor: "status", type: "status" },
    ],
    fields: [
      { name: "key", label: "Key", required: true, description: "vd: home, about-us, chinh-sach-van-chuyen" },
      { name: "title", label: "Tiêu đề" },
      { name: "heroTitle", label: "Tiêu đề Hero" },
      { name: "heroSubtitle", label: "Phụ đề Hero" },
      { name: "heroDes", label: "Hero mô tả", type: "textarea", rows: 3, fullWidth: true },
      { name: "heroImage", label: "Ảnh Hero", type: "media", fullWidth: true, folder: "pages" },
      { name: "content", label: "Nội dung (khối)", type: "block-content", fullWidth: true, folder: "pages" },
      {
        name: "status",
        label: "Trạng thái",
        type: "select",
        options: CONTENT_STATUS.map((v) => ({ value: v, label: CONTENT_STATUS_LABEL[v] })),
      },
    ],
    defaults: { status: "DRAFT" },
    seo: true,
  },

  // No generic create/edit form: create/edit both happen on the dedicated
  // `AdminProductDetailPage.jsx` (gallery/combo builder, SEO, block content) — `fields` stays
  // empty, `noEdit: true` suppresses the pencil icon (the view/eye icon already routes to that
  // page via `detailPath`), and `onCreate` below redirects to the "new" route instead of opening
  // the generic modal. Status and "Nổi bật" stay quick-editable inline from the list via
  // `column.render`, mirroring the pre-migration bespoke table exactly (same endpoints/methods).
  products: {
    title: "Sản phẩm",
    description: "Catalog, giá, gallery và SEO.",
    endpoint: "/products",
    searchable: true,
    searchParam: "name",
    detailPath: ROUTES.ADMIN_PRODUCTS,
    noEdit: true,
    createLabel: "Tạo sản phẩm",
    emptyTitle: "Chưa có sản phẩm",
    emptyDescription: "Tạo sản phẩm đầu tiên để hiển thị trên cửa hàng.",
    // Additive resource-level override for the generic delete-confirm copy (see
    // `AdminResourceManager.jsx`'s `ConfirmDialog` — falls back to the generic wording when
    // absent) — deleting a product also deletes its images on MinIO, worth calling out.
    deleteTitle: "Xóa sản phẩm",
    deleteDescription: "Xóa sản phẩm sẽ xóa cả ảnh trên MinIO. Bạn muốn tiếp tục?",
    filters: [
      {
        name: "productCategoryId",
        label: "Danh mục",
        // Additive filter type — async FK picker backed by `loadOptions`, reusing the shared
        // `SearchableSelect` input `fields`' "searchable-select"
        // type already uses.
        type: "async-select",
        loadOptions: makeAsyncOptions("/product-categories", { searchParam: "name" }),
      },
      { name: "type", label: "Loại (tất cả)", options: PRODUCT_TYPE.map((v) => ({ value: v, label: PRODUCT_TYPE_LABEL[v] })) },
      { name: "status", label: "Trạng thái (tất cả)", options: PRODUCT_STATUS.map((v) => ({ value: v, label: PRODUCT_STATUS_LABEL[v] })) },
      { name: "isFeatured", label: "Nổi bật", type: "boolean" },
      // Additive filter type — numeric `<input type="number">`, falls back cleanly to the
      // existing text-input branch for every other resource.
      { name: "minPrice", label: "Giá từ", type: "number" },
      { name: "maxPrice", label: "Giá đến", type: "number" },
    ],
    sortable: ["id", "name", "price", "priority", "soldCount", "createdAt"],
    defaultSort: { field: "createdAt", direction: "desc" },
    columns: [
      { key: "thumb", label: "Ảnh", accessor: "thumb", type: "image" },
      { key: "name", label: "Tên", accessor: "name" },
      { key: "sku", label: "SKU", accessor: "sku" },
      { key: "type", label: "Loại", accessor: "type", type: "status" },
      { key: "price", label: "Giá", accessor: "price", type: "money" },
      {
        key: "status",
        label: "Trạng thái",
        accessor: "status",
        render: (value, row, { reload }) => (
          <select
            value={value}
            onChange={async (event) => {
              const status = event.target.value;
              try {
                await adminApi.patchBody(`/products/${row.id}/status`, { status });
                toast.success("Đã cập nhật trạng thái.");
                reload();
              } catch (error) {
                toast.error(error.message || "Không thể cập nhật trạng thái.");
              }
            }}
            onClick={(event) => event.stopPropagation()}
            className="h-8 border border-zinc-200 bg-white px-1.5 text-xs font-semibold outline-none"
          >
            {PRODUCT_STATUS.map((status) => (
              <option key={status} value={status}>{PRODUCT_STATUS_LABEL[status]}</option>
            ))}
          </select>
        ),
      },
      { key: "soldCount", label: "Đã bán", accessor: "soldCount" },
      {
        key: "isFeatured",
        label: "Nổi bật",
        accessor: "isFeatured",
        render: (value, row, { reload }) => (
          <button
            type="button"
            onClick={async () => {
              try {
                await adminApi.patch(`/products/${row.id}/featured`, { featured: !value });
                toast.success(value ? "Đã bỏ nổi bật." : "Đã đặt nổi bật.");
                reload();
              } catch (error) {
                toast.error(error.message || "Không thể cập nhật.");
              }
            }}
            className={`inline-flex h-8 w-8 items-center justify-center border ${value ? "border-amber-300 bg-amber-50 text-amber-500" : "border-zinc-200 text-zinc-300"}`}
            aria-label="Bật/tắt nổi bật"
          >
            <Star className="h-4 w-4" aria-hidden="true" fill={value ? "currentColor" : "none"} />
          </button>
        ),
      },
    ],
    fields: [],
    onCreate: () => window.location.assign(`${ROUTES.ADMIN_PRODUCTS}/new`),
  },

  // No generic create/edit form and no delete: orders are read/transition-only (status changes
  // go through `/orders/{id}/status`, not a generic PUT). `fields` stays empty and `noEdit`/
  // `noDelete` suppress the generic editor/delete affordances — status/paymentStatus transitions
  // and VietQR payment access are wired as custom `rowActions` at the page level (see
  // `features/admin/orders/OrdersAdminList.jsx`), reusing `OrderStatusControls`/
  // `OrderPaymentPanel` (the same components `AdminOrderDetailPage.jsx` uses, untouched).
  orders: {
    title: "Đơn hàng",
    description: "Theo dõi và cập nhật trạng thái đơn.",
    endpoint: "/orders/admin",
    searchable: true,
    searchParam: "orderCode",
    searchPlaceholder: "Mã đơn",
    detailPath: ROUTES.ADMIN_ORDERS,
    readOnlyCreate: true,
    noEdit: true,
    noDelete: true,
    emptyTitle: "Chưa có đơn hàng",
    emptyDescription: "Đơn hàng mới sẽ xuất hiện tại đây khi khách hàng đặt mua.",
    filters: [
      {
        name: "status",
        label: "Trạng thái (tất cả)",
        options: ORDER_STATUS.map((v) => ({ value: v, label: ORDER_STATUS_LABEL[v] })),
      },
      {
        name: "paymentStatus",
        label: "Thanh toán (tất cả)",
        options: PAYMENT_STATUS.map((v) => ({ value: v, label: PAYMENT_STATUS_LABEL[v] })),
      },
      { name: "placedFrom", label: "Từ ngày", type: "date" },
      { name: "placedTo", label: "Đến ngày", type: "date" },
      { name: "couponCode", label: "Mã coupon" },
    ],
    sortable: ["id", "orderCode", "totalAmount", "status", "createdAt"],
    defaultSort: { field: "id", direction: "desc" },
    columns: [
      { key: "orderCode", label: "Mã đơn", accessor: "orderCode" },
      { key: "receiverName", label: "Người nhận", accessor: "receiverName" },
      { key: "receiverPhone", label: "Điện thoại", accessor: "receiverPhone" },
      { key: "totalAmount", label: "Tổng", accessor: "totalAmount", type: "money" },
      { key: "status", label: "Trạng thái", accessor: "status", type: "status" },
      { key: "paymentStatus", label: "Thanh toán", accessor: "paymentStatus", type: "status" },
      { key: "createdAt", label: "Ngày đặt", accessor: "createdAt", type: "date" },
    ],
    fields: [],
  },

  // No generic create/edit form: there's no single PUT/POST contract that covers a user (role
  // change and password reset are separate endpoints, and create takes its own shape) — `fields`
  // stays empty and the generic editor modal is never opened for this resource (`noEdit: true`,
  // and the page-level wrapper always supplies a custom `onCreate`/`rowActions`, see
  // `features/admin/users/UsersAdminPage.jsx`).
  users: {
    title: "Người dùng",
    description: "Không có API sửa/xóa chung — chỉ đổi vai trò (SUPERADMIN) và reset mật khẩu.",
    endpoint: "/users",
    searchable: true,
    searchParam: "username",
    searchPlaceholder: "Tìm theo tên đăng nhập",
    createRoles: [ROLE.SUPERADMIN],
    createLabel: "Tạo tài khoản",
    noEdit: true,
    noDelete: true,
    emptyTitle: "Chưa có người dùng",
    emptyDescription: "Tài khoản mới sẽ xuất hiện tại đây sau khi được tạo.",
    columns: [
      { key: "username", label: "Tên đăng nhập", accessor: "username" },
      { key: "email", label: "Email", accessor: "email" },
      { key: "name", label: "Họ tên", accessor: "name" },
      {
        key: "role",
        label: "Vai trò",
        accessor: "role",
        render: (value) => (
          <span className="inline-flex items-center gap-1.5 text-sm">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
            {ROLE_LABEL[value] || value}
          </span>
        ),
      },
      { key: "createdAt", label: "Ngày tạo", accessor: "createdAt", type: "date" },
    ],
    fields: [],
  },
};
