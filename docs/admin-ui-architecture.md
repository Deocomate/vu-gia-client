# Admin UI Architecture

Kiến trúc phân hệ quản trị (`vu-gia-client/src/**/admin`) sau khi rewire sang API thật của
`vu-gia-backend-api` (Spring Boot, JWT, MinIO). Tham chiếu kế hoạch gốc:
`plans/260712-1850-admin-ui-nextjs/`.

## 1. Auth flow

- `POST /auth/login` (`usernameOrEmail` + `password`) trả `{accessToken, refreshToken, user}`.
- Token lưu trong `localStorage` qua `useAdminAuthStore` (`zustand/middleware persist`), không dùng cookie.
- `src/lib/adminApi.js` tự đính `Authorization: Bearer <accessToken>` vào mọi request; khi gặp `401`
  (ngoại trừ chính các endpoint `/auth/*`) sẽ gọi `POST /auth/refresh` một lần (single-flight promise
  chống refresh storm khi nhiều request 401 cùng lúc), lưu token mới rồi retry request gốc. Refresh
  thất bại → `logout()` + văng về `/admin/login`.
- `AdminShell.jsx` hydrate `GET /auth/me` khi mount; role không phải `ADMIN`/`SUPERADMIN` → màn hình
  "Không có quyền truy cập".

## 2. API client

- Envelope thật: `{code, message, data, timestamp}`; `code !== 1000` → ném `AdminApiError` với
  `status`, `code`, `data` (map lỗi validation cho `code=4001`, hiển thị theo field trong `FormField`).
- Phân trang: `page`/`size` 1-based → `data.content` + `data.totalElements`. Không còn slicing phía
  client (bug cũ RT-F5) — trang nào cũng lấy đúng từ server.
- `adminApi.patch(path, query)` dùng cho các endpoint PATCH nhận **query param**
  (`/products/{id}/featured?featured=`, `/products/{id}/images/{imageId}?priority=`);
  `adminApi.patchBody(path, body)` dùng cho PATCH nhận **JSON body**
  (`/products/{id}/status`, `/orders/{id}/status`, `/news/{id}/status`). Đừng lẫn hai loại.

## 3. Rich-input kit (`src/components/admin/inputs/`)

| Component | Thư viện | Dùng cho |
|---|---|---|
| `SearchableSelect` | `downshift` | FK picker (category, product, news-category) — static hoặc async `loadOptions` |
| `DatePicker` | `react-day-picker` + `date-fns` | `date` (yyyy-MM-dd) và `datetime` (ISO instant) |
| `ImageUploader` / `ImageField` | `react-dropzone` | multi-upload / single-upload → URL (MinIO) |
| `SortableImageGallery` | `@dnd-kit/*` | gallery ảnh có priority + kéo-thả sắp xếp |
| `SortableList` | `@dnd-kit/*` | reorder generic (combo items, sortOrder) |
| `BlockContentEditor` | `@editorjs/*` | soạn nội dung khối cho 4 trường JSON-string |

## 4. JSON-string fields (quan trọng)

`product.description`, `product-category.detailContent`, `news.des`, `page.content` và `product.comboProducts`
được backend lưu là **chuỗi JSON**, không phải object. `BlockContentEditor` giữ state là object
`{time, blocks, version}` nội bộ nhưng luôn `JSON.stringify()` trước khi gọi `onChange` — **không bao
giờ** `JSON.parse` trước khi gửi lên server. `ComboBuilder` áp dụng cùng nguyên tắc cho
`comboProducts` (`[{productId, sortOrder}]` → JSON string).

Rủi ro lớn nhất: schema khối mà Editor.js xuất ra phải khớp với những gì storefront
(`src/components/news-detail`, `product-detail`, page views) render. Việc này cần audit/đối chiếu
renderer storefront hiện có trước khi coi nội dung khối là "final" — xem mục QA checklist bên dưới.

## 5. CRUD engine vs. custom modules

- **Generic** (`AdminResourceManager` + `adminResources.js`): resource phẳng — danh mục sản phẩm,
  coupon, danh mục tin, FAQ, gallery ảnh (`galleryImages`), showroom, banner, redirect, liên hệ
  (`contactRequests`, status-only), newsletter (`newsletterSubscribers`, isActive-only), tin tức,
  trang CMS, cùng các resource bàn thờ tùy chỉnh (`altarItemGroups`, `altarStyles`, `altarModels`,
  `altarPresets`).
- **Custom**: `products/` (gallery hai chế độ + combo + block-content), `orders/` (status/paymentStatus
  transition + VietQR payment panel), `dashboard/` (KPI + recharts + top-products), `users/` (không có
  generic PUT/DELETE — chỉ đổi role/reset password), `site-settings/` (bộ chuyển đổi cài đặt toàn site, singleton,
  không có endpoint danh sách — AdminSiteSettingsPage.jsx với lưu xác nhận modal).

### 5.2 Sidebar grouping & merged pages

`admin-sidebar.jsx`'s `ADMIN_NAV` là một mảng nhóm (`{ section, items }`), không còn danh sách phẳng —
mỗi nhóm render một tiêu đề nhỏ (trừ "Tổng quan" đứng riêng ở đầu, không có tiêu đề nhóm). 6 nhóm:
Bán hàng, Bàn thờ tùy chỉnh, Nội dung, Khách hàng & Tiếp thị, Hệ thống (cộng "Tổng quan" đứng riêng).

4 cặp resource đơn giản/liên quan được gộp thành 1 route + tab-bar (`shared/components/admin/tab-bar.jsx`),
route cũ của resource thứ hai bị xóa hẳn (không có redirect shim — hệ thống chưa launch, không cần giữ
bookmark cũ):

| Route (giữ nguyên) | Tab 1 | Tab 2 | Component |
|---|---|---|---|
| `/admin/pages` | Trang CMS (`pages`) | FAQ (`faqs`) | `AdminPagesAndFaqPage.jsx` |
| `/admin/banners` | Banner (`banners`) | Thư viện ảnh (`galleryImages`) | `AdminBannersAndGalleryPage.jsx` |
| `/admin/contact-leads` | Liên hệ (`contactRequests`) | Newsletter (`newsletterSubscribers`) | `AdminContactAndNewsletterPage.jsx` |
| `/admin/site-settings` | Chế độ giỏ hàng (`AdminSiteSettingsPage`) | Redirect (`redirects`) | `AdminSystemSettingsPage.jsx` |

Route đã xóa: `/admin/faq`, `/admin/gallery`, `/admin/newsletter`, `/admin/redirects` (404 — không còn
trong app tree). Tab state là local (`useState`), không nằm trên URL, nên active-route highlighting của
sidebar không cần thay đổi (vẫn match theo prefix route).

## 5.1 Site Settings (Custom Singleton Module)

**`AdminSiteSettingsPage.jsx`** là một custom module bespoke (không phải entry trong `adminResources.js`) vì nó quản lý một singleton config, không có danh sách phân trang nào. Hạng lưu được bảo vệ bằng:
- **Client-side role check**: `currentUser?.role === ROLE.SUPERADMIN` — chỉ SUPERADMIN mới nhìn thấy nút Save.
- **Server-side enforcement**: Backend yêu cầu `hasRole('SUPERADMIN')` trên `PUT /api/site-settings` (không dựa vào client check).
- **Confirm dialog**: Trước khi gửi `PUT`, người dùng phải xác nhận qua modal (`base-confirm-dialog.jsx`) vì thay đổi này ảnh hưởng toàn site.

## 6. Đã loại bỏ

- `reviews`, `settings` — không có endpoint backend tương ứng; xóa trang + sidebar link, ghi vào
  roadmap làm việc tương lai.
- `MediaPicker.jsx` (media-library GET không tồn tại) — thay bằng `ImageField`/`ImageUploader` upload
  trực tiếp. Trang `/admin/media` giờ chỉ là tiện ích tải ảnh lên + copy URL.

## 7. QA checklist trước khi coi module content là hoàn chỉnh

1. Round-trip nội dung khối: soạn trong `BlockContentEditor` → lưu → tải lại → xác nhận storefront
   render đúng (rủi ro tích hợp cao nhất).
2. Không còn tham chiếu API tưởng tượng: `localhost:3001`, `/admin/media`, `sign-in/email`,
   `page,limit`, `normalizeCollection`.
3. `npm run lint` + `npm run build` xanh.
