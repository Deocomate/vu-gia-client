# Lộ trình Phát triển Dự án (Project Roadmap)

Tài liệu này ghi nhận lịch sử phát triển, các cột mốc đã hoàn thành gần đây và lộ trình nâng cấp các tính năng cho ứng dụng **Gốm Sứ Vũ Gia - Client Portal**.

---

## 1. Các tính năng đã hoàn thiện (Milestones Completed)

### 🛒 Thương mại điện tử — API thật, hết mock (2026-07)
*   **Xác thực khách hàng:** Đăng ký/đăng nhập/đăng xuất, refresh token qua cookie `httpOnly`+CSRF,
    đăng nhập Google (bật khi có `NEXT_PUBLIC_GOOGLE_CLIENT_ID`). Guard `RequireCustomerAuth` bảo vệ
    `(user)/*` + thanh toán, redirect kèm `?next=`. Phiên admin CMS vẫn hoạt động độc lập, không bị ảnh
    hưởng (regression gate đã kiểm chứng nhiều lần).
*   **Giỏ hàng đồng bộ server:** `cart-store.js` 2 chế độ (guest/server), merge giỏ khách vào giỏ server
    khi đăng nhập (idempotent, an toàn đa tab qua Web Locks API).
*   **Thanh toán thật:** Đặt hàng qua `POST /api/orders` với `idempotencyKey` ổn định (không tạo đơn
    trùng khi bấm lại), phương thức vận chuyển động (BE-2, admin quản lý phí), mã giảm giá xem trước
    qua endpoint công khai. **COD** xác nhận ngay + đồng bộ lại giỏ từ server (không xoá cứng). **ONL**
    hiển thị VietQR, xác nhận qua webhook SePay (ký HMAC), poll tới `PAID` hoặc timeout → trang chi tiết
    đơn hàng để thanh toán lại.
*   **Đơn hàng & hồ sơ:** Danh sách đơn lọc theo trạng thái + phân trang server, chi tiết đơn (kèm QR
    nếu ONL chưa thanh toán), khách **tự huỷ đơn** khi còn `PENDING_PAYMENT`/`PROCESSING` (hoàn lại lượt
    dùng coupon, khoá luôn việc thanh toán đơn đã huỷ). Hồ sơ đọc dữ liệu thật (`/api/auth/me`), đổi mật
    khẩu thật — các trường khác chỉ đọc vì backend chưa có endpoint tự cập nhật hồ sơ.
*   **Tái cấu trúc thư mục:** Gộp `views/`+`components/`+`lib/`+`stores/`+`utils/`+`hooks/` thành
    `features/*`+`shared/*` theo mô hình feature-based, kebab-case toàn repo (trừ `features/admin/**`),
    dọn 6 component chết + ảnh mock không còn dùng.
*   **Chuyển đổi URL:** Toàn bộ dự án đã chuyển đổi từ liên kết chuỗi tĩnh sang sử dụng tập trung hằng số `ROUTES` (`@/shared/utils/routes`).

### 🎨 Trải nghiệm người dùng (UX/UI)
*   **Global Altar Customizer Widget:** Chuyển đổi Widget tùy biến đồ thờ từ dạng tĩnh tại trang chi tiết thành một ngăn kéo (Drawer) slide-out toàn cục, khả dụng trên hầu hết các trang.
*   **Custom Feedback Popups:** Thay thế toàn bộ 27 điểm gọi hàm `alert()` và `confirm()` mặc định bằng Sonner Toast và Custom Confirm Dialog đồng bộ với màu sắc thương hiệu.
*   **Admin CMS Shell:** Thiết kế bộ khung trang quản trị gồm Sidebar, Topbar, bộ lọc và bảng dữ liệu tái sử dụng cao.

---

## 2. Các kế hoạch đang triển khai (In Progress)

*   **Tối ưu SEO nâng cao:** Tích hợp Dynamic Metadata cho Next.js 15 trên các trang chi tiết sản phẩm (`san-pham/[slug]`) và tin tức (`tin-tuc/[slug]`).
*   **Tối ưu hóa hình ảnh:** Áp dụng component `next/image` để tự động resize và nén các định dạng ảnh `.png`, `.jpg` của sản phẩm Bát Tràng nhằm tăng tốc độ tải trang.

## 2b. Việc còn lại / theo dõi tiếp (Follow-ups)

*   **Reviews / Settings admin:** Đã xóa khỏi Admin CMS vì backend chưa có endpoint tương ứng. Cần
    scope lại yêu cầu nghiệp vụ trước khi backend team bổ sung API.
*   **Storefront block-schema alignment:** `BlockContentEditor` (Editor.js) xuất schema
    `{time, blocks, version}` cho `product.description`, `product-category.detailContent`, `news.des`,
    `page.content`. Cần audit renderer storefront (`news-detail`, `product-detail`, page views) để
    đảm bảo render đúng 1:1 với những gì admin soạn — chưa có test tự động cho việc này.
*   **Media library dùng chung:** `/admin/media` hiện chỉ là tiện ích tải-ảnh-lên-rồi-copy-URL vì
    backend không có API liệt kê media đã upload.
*   **Lỗi serialize `isActive` (backend, phát hiện 2026-07):** 6 resource admin (Banner, Coupon, Faq,
    GalleryImage, Newsletter, Showroom) luôn trả JSON key `"active"` sai giá trị (Lombok `@Builder` +
    getter boolean nguyên thủy không khớp tên) — cột "Hoạt động" trên các bảng admin tương ứng hiển thị
    sai bất kể giá trị thật trong DB. `shippingMethods` (resource mới) đã fix đúng. 6 resource cũ **chưa
    sửa** — cần một đợt sửa riêng ở backend (`vu-gia-backend-api`), không chỉ đổi FE.
*   **Vi phạm ranh giới `shared → features` (đã biết, chưa xử lý):** `shared/components/public-layout.jsx`
    và `shared/stores/cart-store.js` import trực tiếp `features/cart/*` — có từ giai đoạn xây
    server-synced cart, trước khi quy tắc một chiều được chính thức hoá. Xử lý đúng cần tách lại code,
    không phải chỉ dời file.
*   **`features/admin/**` còn PascalCase:** quyết định phạm vi có chủ đích ở đợt tái cấu trúc — có thể
    làm riêng nếu cần nhất quán kebab-case tuyệt đối toàn repo.

---

## 3. Lịch sử thay đổi gần đây (Recent Changelog)

### [2026-07-19 → 2026-07-24] Storefront Cart/Checkout API Sync + tái cấu trúc thư mục
*   **Xác thực khách hàng (BE-1):** `customer-auth-store.js`, `RequireCustomerAuth`, refresh token
    chuyển sang cookie `httpOnly`+CSRF (dùng chung cơ chế với admin, hai phiên độc lập). Đăng nhập Google
    tuỳ chọn qua env.
*   **Giỏ hàng đồng bộ server:** `cart-store.js` 2 chế độ + merge giỏ khách khi đăng nhập (idempotent,
    an toàn đa tab).
*   **Thanh toán thật (BE-2 phí vận chuyển):** `POST /api/orders` với `idempotencyKey` ổn định, COD +
    ONL (VietQR + webhook SePay), coupon xem trước qua endpoint công khai, phương thức vận chuyển động
    do admin quản lý.
*   **Đơn hàng & hồ sơ (BE-3 huỷ đơn):** Danh sách/chi tiết đơn thật, khách tự huỷ đơn (hoàn coupon),
    hồ sơ đọc dữ liệu thật + đổi mật khẩu thật.
*   **Tái cấu trúc thư mục:** `views/`+`components/`+`lib/`+`stores/`+`utils/`+`hooks/` → `features/*`+
    `shared/*`, kebab-case toàn repo (trừ `features/admin/**`), dọn code chết. 14 commit tuần tự, mỗi
    commit `next build`+`next lint` xanh.
*   **Xác minh E2E:** Toàn bộ luồng (đăng ký→đăng nhập cookie→giỏ hàng→merge→thanh toán COD+ONL+phí
    vận chuyển→webhook SePay→`PAID`→huỷ đơn+hoàn coupon→đổi mật khẩu) kiểm thử trực tiếp trên server
    thật (không mock), cùng regression admin CMS. Phát hiện và sửa 2 lỗi backend qua kiểm thử trực tiếp:
    field `isActive` bị MapStruct âm thầm bỏ qua khi serialize (đã sửa cho resource mới, 6 resource cũ
    còn tồn — xem §2b), và đơn ONL đã huỷ vẫn lộ QR có thể thanh toán được (đã sửa: đơn `CANCELLED`/
    `RETURNED` không còn expose `payment`, webhook cũng từ chối đánh dấu `PAID` cho đơn đã huỷ).

### [2026-07-12] Rewire Admin CMS sang Spring Boot API thật + rich UX
*   **Rewire toàn bộ tầng auth/data:** `adminApi.js`, `adminAuthStore.js` chuyển từ API tưởng tượng
    (cookie, `:3001`, `page/limit`) sang API thật (JWT Bearer + refresh xoay vòng, envelope
    `{code,message,data}`, `PageResponse` 1-based).
*   **Rich-input kit mới:** `SearchableSelect` (downshift), `DatePicker` (react-day-picker),
    `ImageUploader`/`ImageField` (react-dropzone), `SortableImageGallery`/`SortableList` (@dnd-kit),
    `BlockContentEditor` (Editor.js) cho 4 trường nội dung khối JSON-string, dùng chung qua
    `AdminResourceManager` config-driven cho 13 resource phẳng.
*   **Module tùy biến:** Products (gallery 2 chế độ tạo/sửa + combo builder), Orders (status
    transition + VietQR payment panel), Dashboard (KPI + recharts + top-products), Users (không có
    generic PUT/DELETE — chỉ đổi role/reset mật khẩu).
*   **Dọn dẹp:** Xóa `reviews`, `settings` (không có backend), `MediaPicker.jsx` (media-library GET
    không tồn tại).

### [2026-07-09] Tích hợp Hệ thống phản hồi & Zustand Cart Store
*   **Tính năng mới:** Phát triển tệp tiện ích `src/utils/feedback.js` làm đầu mối gọi thông báo.
*   **Tính năng mới:** Xây dựng store giỏ hàng `cartStore.js` đồng bộ hóa tự động.
*   **Tối ưu:** Xóa bỏ hoàn toàn tệp widget cũ `FixedActionWidget.jsx` để chuyển sang dùng `GlobalAltarWidget` thống nhất trên layout.

### [2026-07-08] Khởi tạo khung dự án & Cấu hình Tailwind v4
*   **Tính năng mới:** Cài đặt Next.js 15.5.18, React 19, Tailwind CSS v4.3.0.
*   **Thiết kế:** Cấu hình hệ màu đất nung (`#97400C` và `#AD5036`) làm chủ đạo trong `globals.css`.
*   **Định tuyến:** Thiết lập cấu trúc App Router phân nhóm `(main)`, `(shop)`, `(policies)`, `(user)`, `(admin)`.
