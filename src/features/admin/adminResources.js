import { adminApi } from "@/lib/adminApi";
import { toast } from "@/utils/feedback";
import {
  DISCOUNT_TYPE,
  DISCOUNT_TYPE_LABEL,
  BANNER_POSITION,
  BANNER_POSITION_LABEL,
  CONTACT_STATUS,
  CONTACT_STATUS_LABEL,
  CONTENT_STATUS,
  CONTENT_STATUS_LABEL,
} from "@/lib/apiEnums";

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
    description: "Quản lý cây danh mục, ảnh đại diện, nội dung và SEO danh mục.",
    endpoint: "/product-categories",
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
      { name: "name", label: "Tên danh mục", required: true },
      { name: "thumb", label: "Ảnh đại diện", type: "media", required: true, fullWidth: true, folder: "categories" },
      { name: "slug", label: "Slug", description: "Để trống sẽ tự sinh từ tên." },
      { name: "priority", label: "Thứ tự", type: "number" },
      { name: "longContent", label: "Nội dung dài", type: "textarea", rows: 4, fullWidth: true },
      { name: "des", label: "Mô tả (nội dung khối)", type: "block-content", fullWidth: true, folder: "categories" },
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
      { key: "newsCategoryName", label: "Danh mục", accessor: "newsCategory.name" },
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
      { name: "des", label: "Nội dung (khối)", type: "block-content", fullWidth: true, folder: "news" },
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
};
