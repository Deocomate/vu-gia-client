# Gốm Sứ Vũ Gia - Client Portal

Dự án giao diện người dùng (Frontend Client) của thương hiệu **Gốm Sứ Vũ Gia** – chuyên cung cấp các sản phẩm gốm sứ Bát Tràng chính hãng (bộ đồ thờ truyền thống, bình phong thủy, lục bình gốm sứ, ấm chén và quà tặng cao cấp).

Dự án được xây dựng trên nền tảng Next.js 15 (App Router) kết hợp cùng Tailwind CSS v4 nhằm tối ưu hóa hiệu năng, tốc độ tải trang và trải nghiệm người dùng trên đa thiết bị.

---

## 📂 Tài Liệu Chi Tiết (Project Documentation)

Để tìm hiểu sâu hơn về kiến trúc và cách phát triển dự án, vui lòng đọc các tài liệu hướng dẫn trong thư mục `docs/`:

1.  **[Tổng quan Dự án & PDR](file:///c:/Users/minhlong/Desktop/projects/vu-gia-fullstack/vu-gia-client/docs/project-overview-pdr.md):** Giới thiệu chung, đối tượng mục tiêu và phạm vi nghiệp vụ.
2.  **[Tóm tắt Mã nguồn](file:///c:/Users/minhlong/Desktop/projects/vu-gia-fullstack/vu-gia-client/docs/codebase-summary.md):** Bản đồ thư mục, cấu trúc định tuyến (Next.js App Router) và các stores quản lý state.
3.  **[Tiêu chuẩn Lập trình](file:///c:/Users/minhlong/Desktop/projects/vu-gia-fullstack/vu-gia-client/docs/code-standards.md):** Coding Style, quy tắc đặt tên và cấu hình màu sắc Tailwind v4.
4.  **[Kiến trúc Hệ thống](file:///c:/Users/minhlong/Desktop/projects/vu-gia-fullstack/vu-gia-client/docs/system-architecture.md):** Luồng dữ liệu, thiết kế bộ tùy chỉnh đồ thờ và hệ thống phản hồi toàn cục.
5.  **[Lộ trình Phát triển](file:///c:/Users/minhlong/Desktop/projects/vu-gia-fullstack/vu-gia-client/docs/project-roadmap.md):** Danh sách tính năng hoàn thành, nhật ký thay đổi và định hướng tiếp theo.
6.  **[Hướng dẫn Triển khai](file:///c:/Users/minhlong/Desktop/projects/vu-gia-fullstack/vu-gia-client/docs/deployment-guide.md):** Hướng dẫn cài đặt phát triển local và đóng gói container Docker.
7.  **[Quy chuẩn Thiết kế](file:///c:/Users/minhlong/Desktop/projects/vu-gia-fullstack/vu-gia-client/docs/design-guidelines.md):** Bảng màu thương hiệu (Bát Tràng clay theme) và phông chữ sử dụng.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

Dự án sử dụng các công nghệ và thư viện cốt lõi sau:
*   **Framework:** [Next.js 15.5.18](https://nextjs.org/) (sử dụng App Router và Turbopack cho môi trường phát triển).
*   **Thư viện giao diện:** [React 19.2.6](https://react.dev/).
*   **Styling:** [Tailwind CSS v4.3.0](https://tailwindcss.com/) (sử dụng gói `@tailwindcss/postcss` mới).
*   **Quản lý trạng thái:** [Zustand 5.0.14](https://github.com/pmndrs/zustand) (được dùng để lưu trữ giỏ hàng, thông tin xác thực admin và điều phối confirm modal).
*   **Hiệu ứng chuyển động:** [Framer Motion 12.40.0](https://www.framer.com/motion/).
*   **Trình chiếu (Carousel):** [Embla Carousel React 8.6.0](https://www.embla-carousel.com/).
*   **Thông báo & Phản hồi:** [Sonner](https://sonner.emilkowal.ski/) và Custom Dialog.

---

## 🚀 Hướng Dẫn Phát Triển & Vận Hành

### Chạy ở môi trường Local

1.  **Cài đặt các thư viện phụ thuộc:**
    ```bash
    npm install
    ```
2.  **Chạy dự án ở chế độ phát triển (Development Mode với Turbopack):**
    ```bash
    npm run dev
    ```
    *Giao diện phát triển mặc định sẽ chạy tại: `http://localhost:3000`*
3.  **Kiểm tra cú pháp và chất lượng mã nguồn (Linting):**
    ```bash
    npm run lint
    ```
4.  **Biên dịch sản phẩm (Production Build):**
    ```bash
    npm run build
    ```

### Chạy bằng Docker Compose
```bash
docker compose up -d --build
```

---

## 📌 Nguyên Tắc Phát Triển Dự Án

*   **Định tuyến:** Toàn bộ liên kết trong dự án cần sử dụng đối tượng `ROUTES` định nghĩa sẵn trong `src/utils/routes.js` để tránh việc sai lệch đường dẫn khi thay đổi cấu trúc URL.
*   **Tách biệt Views và Routing:** Các file `page.jsx` trong thư mục `src/app/` nên đóng vai trò là "Cổng kết nối" (Chứa Metadata, cấu hình Server-side). Logic xử lý giao diện, State nên được triển khai ở thư mục `src/views/` hoặc `src/components/`.
*   **Hệ thống phản hồi:** Tuyệt đối không sử dụng alert/confirm mặc định của trình duyệt. Hãy sử dụng helper `toast` và `confirm` được xuất ra từ `src/utils/feedback.js`.