# Lộ trình Phát triển Dự án (Project Roadmap)

Tài liệu này ghi nhận lịch sử phát triển, các cột mốc đã hoàn thành gần đây và lộ trình nâng cấp các tính năng cho ứng dụng **Gốm Sứ Vũ Gia - Client Portal**.

---

## 1. Các tính năng đã hoàn thiện (Milestones Completed)

### 🛒 Thương mại điện tử & Giỏ hàng
*   **Zustand Cart Store:** Quản lý trạng thái giỏ hàng thực tế, tự lưu trạng thái xuống Local Storage, hiển thị số lượng sản phẩm trực tiếp trên Header Badge.
*   **Mua nhanh & Giỏ hàng:** Tích hợp chuyển tiếp trang hợp lý từ chi tiết sản phẩm sang Giỏ hàng hoặc Thanh toán.
*   **Chuyển đổi URL:** Toàn bộ dự án đã chuyển đổi từ liên kết chuỗi tĩnh sang sử dụng tập trung hằng số `ROUTES`.

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
    `{time, blocks, version}` cho `product.description`, `product-category.des`, `news.des`,
    `page.content`. Cần audit renderer storefront (`news-detail`, `product-detail`, page views) để
    đảm bảo render đúng 1:1 với những gì admin soạn — chưa có test tự động cho việc này.
*   **Media library dùng chung:** `/admin/media` hiện chỉ là tiện ích tải-ảnh-lên-rồi-copy-URL vì
    backend không có API liệt kê media đã upload.

---

## 3. Lịch sử thay đổi gần đây (Recent Changelog)

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
