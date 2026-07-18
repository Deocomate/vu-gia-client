# Tóm tắt Cấu trúc Mã nguồn (Codebase Summary)

Tài liệu này cung cấp cái nhìn chi tiết về cấu trúc mã nguồn dự án **Gốm Sứ Vũ Gia - Client Portal**, hỗ trợ các nhà phát triển mới nhanh chóng định hướng và nắm bắt cấu trúc dự án.

---

## 1. Cấu trúc Thư mục Tổng quan

Dự án được tổ chức theo mô hình chuẩn của Next.js (App Router), kết hợp với việc tách biệt tầng hiển thị (Views) để tối ưu khả năng tái sử dụng.

```text
├── public/                       # Tài nguyên tĩnh công cộng (fonts, icons, images)
├── src/
│   ├── app/                      # Định nghĩa Routing (Next.js App Router)
│   │   ├── (admin)/              # Phân hệ quản trị CMS (Admin Shell)
│   │   ├── (main)/               # Trang công cộng (Trang chủ, Sản phẩm, Tin tức, Showroom...)
│   │   ├── (policies)/           # Các trang chính sách (Đổi trả, vận chuyển, FAQs)
│   │   ├── (shop)/               # Quy trình mua hàng (Giỏ hàng, Thanh toán)
│   │   ├── (user)/               # Quản lý tài khoản và đơn hàng của khách hàng
│   │   ├── globals.css           # Cấu hình Tailwind v4 và các biến màu CSS
│   │   └── layout.js             # Root layout của toàn bộ ứng dụng
│   ├── assets/                   # Hình ảnh đi kèm mã nguồn (không nằm trong public/)
│   ├── components/               # Các React Component tái sử dụng theo từng tính năng
│   │   ├── admin/                # Component cho trang quản trị (Shell, Table, Sidebar...)
│   │   ├── altar-customizer/     # Component phục vụ tính năng thiết kế đồ thờ
│   │   ├── cart/                 # Component hiển thị giỏ hàng
│   │   ├── checkout/             # Component biểu mẫu thanh toán và tóm tắt đơn hàng
│   │   ├── home/                 # Các phần giao diện trên trang chủ
│   │   ├── shared/               # Component dùng chung (Header, Footer, Toast, Confirm Dialog)
│   │   └── ...
│   ├── features/                 # Logic tính năng nâng cao (ví dụ: admin resource pages)
│   ├── lib/                      # Các thư viện kết nối API hoặc cấu hình hệ thống
│   │   └── adminApi.js           # Client gọi API Backend CMS
│   ├── stores/                   # Quản lý State toàn cục bằng Zustand
│   │   ├── adminAuthStore.js     # Trạng thái đăng nhập quản trị viên
│   │   ├── cartStore.js          # Trạng thái giỏ hàng & sản phẩm đã thêm
│   │   └── confirmStore.js       # Quản thái đóng/mở hộp thoại xác nhận (Confirm Dialog)
│   ├── utils/                    # Các hàm tiện ích dùng chung
│   │   ├── feedback.js           # Facade gọi Sonner Toast và Custom Confirm
│   │   └── routes.js             # Danh sách hằng số đường dẫn (ROUTES)
│   └── views/                    # Tầng logic chính của từng trang (được Page.jsx import)
```

---

## 2. Quy tắc phân tách Routing và Views

Dự án áp dụng nguyên tắc **Tách biệt Views và Routing** nghiêm ngặt:
1.  **Thư mục `src/app/` (Routing):** Chỉ chứa các file `page.jsx` và `layout.js` đóng vai trò là "Cổng kết nối". Các file này định nghĩa Metadata, xử lý Server-side Rendering (nếu có), và import View tương ứng từ `src/views/`. Hạn chế tối đa viết logic JSX hoặc CSS trực tiếp tại đây.
2.  **Thư mục `src/views/` (Logic & Layout chính):** Chứa giao diện hoàn chỉnh của một trang. Các View nhận dữ liệu từ Routing, quản lý State cục bộ của trang, và kết hợp các `components/` để tạo nên bố cục trang.
3.  **Thư mục `src/components/` (UI Components):** Chứa các component nhỏ, cô đọng, nhận dữ liệu qua `props` và thực hiện các tương tác UI cụ thể.

---

## 3. Hệ thống Store Zustand toàn cục

Ứng dụng quản lý trạng thái chia sẻ thông qua 3 store Zustand chính nằm trong thư mục `src/stores/`:

### A. Giỏ hàng (`cartStore.js`)
*   **Chức năng:** Lưu trữ danh sách sản phẩm trong giỏ, tự động đồng bộ hóa với Local Storage qua middleware `persist`.
*   **Actions chính:**
    *   `addItem(product, qty)`: Thêm sản phẩm vào giỏ, gộp số lượng nếu đã tồn tại.
    *   `updateQuantity(id, quantity)`: Cập nhật số lượng của một sản phẩm.
    *   `removeItem(id)`: Xóa sản phẩm khỏi giỏ hàng.
    *   `clearCart()`: Xóa sạch toàn bộ giỏ hàng (ví dụ sau khi đặt hàng thành công).
    *   `totalCount()` & `subtotal()`: Tính tổng số lượng và tổng số tiền của giỏ hàng.

### B. Hộp thoại xác nhận (`confirmStore.js`)
*   **Chức năng:** Cung cấp cơ chế mở hộp thoại xác nhận (Confirm Dialog) dạng Promise giúp viết code đồng bộ gọn gàng.
*   **Cách sử dụng:**
    ```javascript
    import { confirm } from "@/utils/feedback";
    const ok = await confirm({
      title: "Xóa sản phẩm?",
      description: "Hành động này không thể hoàn tác.",
      destructive: true
    });
    if (ok) { // Thực hiện xóa }
    ```

### C. Xác thực admin (`adminAuthStore.js`)
*   **Chức năng:** Quản lý phiên JWT (access + refresh token) của ADMIN/SUPERADMIN, lưu vào
    `localStorage` qua middleware `persist`. Không dùng cookie.
*   **Thuộc tính:** `user`, `accessToken`, `refreshToken`, `status` (`idle`, `loading`, `authenticated`,
    `forbidden`, `unauthenticated`), `error`.
*   **Actions:** `login(usernameOrEmail, password)`, `logout()`, `loadCurrentUser()` (hydrate qua
    `GET /auth/me`), `isAdmin()`.

---

## 4. Các tiện ích cốt lõi (Core Utilities)

*   `src/utils/routes.js`: Định nghĩa đối tượng hằng số `ROUTES` duy nhất chứa toàn bộ các đường dẫn trong hệ thống. Việc sử dụng `ROUTES.HOME` thay vì viết cứng `"/"` giúp đảm bảo tính nhất quán và dễ dàng bảo trì khi cấu trúc URL thay đổi.
*   `src/lib/adminApi.js`: fetch client cho API thật (`{code,message,data}` envelope, `PageResponse`
    1-based). Tự đính kèm `Authorization: Bearer`, tự refresh-on-401 (single-flight), ném
    `AdminApiError` (`status`, `code`, `data` — validation map cho lỗi `4001`).
*   `src/lib/apiEnums.js`: hằng số enum thật của backend (role, product type/status, order/payment
    status, discount type, banner position, contact status) kèm nhãn tiếng Việt.
*   `src/lib/mediaUpload.js`: wrapper `uploadOne`/`uploadMany` cho `/media/upload` và
    `/media/upload-multiple` (MinIO), validate ảnh ≤10MB trước khi gửi.

### Admin CMS — kiến trúc rewire

Xem chi tiết tại `docs/admin-ui-architecture.md`. Tóm tắt:
*   `src/components/admin/inputs/` — bộ rich-input dùng chung: `SearchableSelect` (downshift),
    `DatePicker` (react-day-picker), `ImageUploader`/`ImageField` (react-dropzone),
    `SortableImageGallery`/`SortableList` (@dnd-kit), `BlockContentEditor` (Editor.js).
*   `src/features/admin/AdminResourceManager.jsx` — engine CRUD chung (server-side paging/sort/filter,
    `PUT` partial update, validation-map rendering) dùng cho 13 resource "phẳng" khai báo trong
    `src/features/admin/adminResources.js`.
*   Products, Orders, Dashboard có trang tùy biến riêng dưới `src/features/admin/{products,orders,dashboard}/`
    vì nghiệp vụ (gallery reorder, snapshot items, charts) vượt quá khả năng của engine chung.
*   Users không có generic PUT/DELETE ở backend — `src/features/admin/users/UsersAdminPage.jsx` chỉ
    hỗ trợ đổi vai trò (SUPERADMIN) và reset mật khẩu.
