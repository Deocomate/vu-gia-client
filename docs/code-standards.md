# Tiêu chuẩn Lập trình & Thiết kế (Code Standards)

Tài liệu này quy định các tiêu chuẩn viết code, quy tắc đặt tên, hướng dẫn sử dụng CSS và các nguyên tắc phát triển được áp dụng trong dự án **Gốm Sứ Vũ Gia - Client Portal**.

---

## 1. Công nghệ cốt lõi & Style lập trình

Dự án sử dụng **React 19** và **Next.js 15 (App Router)**. Toàn bộ code giao diện được viết dưới dạng:
*   **Functional Components:** Luôn sử dụng functional components kết hợp với React Hooks. Không sử dụng class components.
*   **TypeScript / JavaScript:** Mã nguồn hiện tại viết bằng Modern JavaScript (ES6+). Sử dụng `"use client"` ở đầu tệp đối với các file React Component cần xử lý Event, State hoặc gọi Hooks (như `useState`, `useEffect`, `useRouter`, `useCartStore`).
*   **Tái cấu trúc Logic:** Các logic phức tạp liên quan đến tính toán, đồng bộ dữ liệu hoặc kết nối API nên được tách ra thành các Custom Hooks (ví dụ: `useAltarCustomizer.js`).

---

## 2. Quy chuẩn đặt tên (Naming Conventions)

Kể từ lần tái cấu trúc gần nhất, toàn repo dùng **kebab-case cho tên file** (ngoại lệ duy nhất:
`features/admin/**` giữ PascalCase — quyết định phạm vi có chủ đích, xem `codebase-summary.md` §5).
**Tên export bên trong file (component/hook/store) vẫn PascalCase/camelCase như React quy ước** — chỉ
tên *file* đổi, ví dụ file `cart-view.jsx` vẫn `export default function CartView()`.

| Loại tệp/thư mục | Quy tắc | Ví dụ |
| :--- | :--- | :--- |
| **Component File** | kebab-case (`.jsx`) | `product-card.jsx`, `checkout-form.jsx` |
| **Feature View File** | kebab-case (`<feature>-view.jsx`) | `cart-view.jsx`, `order-detail-view.jsx` |
| **Hook File** | kebab-case (`use-*.js`) | `use-altar-customizer.js`, `use-idempotency-key.js` |
| **Store File** | kebab-case (`*-store.js`) | `cart-store.js`, `customer-auth-store.js` |
| **Service File** | kebab-case (`*-service.js`) | `cart-service.js`, `order-service.js` |
| **Utility File** | kebab-case (`.js`) | `routes.js`, `feedback.js` |
| **Folder (app router)**| kebab-case / brackets | `lien-he`, `[slug]`, `(admin)` |
| **`features/admin/**` (ngoại lệ)** | PascalCase | `AdminResourceManager.jsx`, `AdminSidebar.jsx` |

*   **Tên biến và hàm:** Sử dụng `camelCase` (ví dụ: `handleCheckoutSubmit`, `totalCount`).
*   **Hằng số:** Sử dụng `UPPER_SNAKE_CASE` (ví dụ: `ROUTES`, `API_BASE_URL`).
*   **Bỏ tiền tố domain thừa khi đã nằm trong thư mục feature** (ví dụ `features/cart/components/
    item-list.jsx`, không phải `cart-item-list.jsx`) — **trừ khi** tên trần quá chung chung một khi đã
    colocate cạnh nhiều domain khác dưới `shared/` (ví dụ giữ `order-status-badge.jsx`, không rút gọn
    thành `status-badge.jsx`).
*   **Ranh giới import một chiều:** `features/*` được import `shared/*` tự do; `shared/*` không được
    import ngược lại `features/*` (chi tiết + ngoại lệ đã biết: `codebase-summary.md` §2).

---

## 3. Quy chuẩn Styling (Tailwind CSS v4)

Dự án tích hợp **Tailwind CSS v4**. Tránh việc định nghĩa màu sắc tùy tiện bằng mã hex trong class của component. Thay vào đó, hãy sử dụng các biến màu hệ thống (Theme Variables) đã được cấu hình trong `src/app/globals.css`:

*   `bg-primary` / `text-primary` (`--color-primary`): Màu cam đất gốm sứ truyền thống (`#97400C`).
*   `bg-sale` / `text-sale` (`--color-sale`): Màu đỏ cam đất hiển thị thông báo giảm giá hoặc nút nhấn chính (`#AD5036`).
*   `text-text-main` (`--color-text-main`): Màu chữ chính (`#777E90`).
*   `text-text-sub` (`--color-text-sub`): Màu chữ phụ (`#838383`).
*   `border-success` / `text-success` (`--color-success`): Màu xanh lá cây hiển thị trạng thái hoàn thành (`#67A865`).

### Fonts sử dụng trong class:
*   `font-montserrat`: Phông chữ tiêu chuẩn cho nội dung thương mại, hiển thị rõ ràng.
*   `font-playfair`: Phông chữ tiêu đề mang lại cảm giác cổ kính, nghệ thuật.

---

## 4. Nguyên tắc Tương tác & Thông báo (Feedback System)

Tuyệt đối **không sử dụng** các hộp thoại mặc định của trình duyệt như `alert()` hay `confirm()` vì chúng phá vỡ trải nghiệm người dùng và không đồng bộ với thiết kế thương hiệu.

*   **Thông báo ngắn (Toast):** Sử dụng `toast.success`, `toast.error`, `toast.info` từ `@/shared/utils/feedback` (bản chất là Sonner Toast).
*   **Hộp thoại xác nhận (Confirm):** Sử dụng hàm async `confirm` từ `@/shared/utils/feedback` để hiển thị modal thiết kế riêng.
*   Các thông báo thành công hoặc lỗi cần giữ đúng ý nghĩa nguyên bản tiếng Việt để thân thiện với người dùng trong nước.

---

## 5. Quản lý tài nguyên và tối ưu hóa

*   **Hình ảnh & Icons:** Trước khi thêm mới bất kỳ ảnh hoặc icon nào, hãy kiểm tra thư mục `public/` hoặc `src/assets/images/` xem đã có tài nguyên tương tự chưa để tái sử dụng.
*   **Đường dẫn liên kết:** Mọi thẻ liên kết hoặc router chuyển trang đều phải import đối tượng `ROUTES` từ `@/shared/utils/routes` thay vì viết cứng chuỗi url.
*   **Ảnh động từ API (MinIO):** `<Image>` nào nhận `src` là kết quả `formatImageUrl()` (dữ liệu từ backend — banner, product thumb, gallery, news thumb…) **phải** dùng `SafeImage` (`@/shared/components/safe-image`) thay vì `next/image` trực tiếp. `SafeImage` tự fallback sang `PLACEHOLDER_IMAGE` khi `src` rỗng hoặc load lỗi (MinIO down) — tránh vỡ layout và loop request. Ảnh import tĩnh từ `@/assets/images` giữ nguyên `next/image`, không cần bọc.
*   **`sizes` bắt buộc với `fill`:** Mọi `<Image fill>` / `<SafeImage fill>` phải có `sizes` phản ánh đúng breakpoint thật của container (không copy nguyên `100vw` cho ảnh nhỏ) — thiếu `sizes` khiến Next mặc định `100vw` và sinh biến thể ảnh lớn nhất (`w=3840`) cho cả thumbnail.
*   **`priority` chỉ cho ảnh LCP:** Chỉ đặt `priority` trên ảnh above-the-fold thực sự quan trọng cho LCP (hero/banner đầu trang, ảnh chính trang chi tiết sản phẩm) — tối đa 1-2 ảnh mỗi route. Không đặt `priority` cho ảnh dưới fold, ảnh trong slider không phải slide đầu, hay ảnh trong Footer.
