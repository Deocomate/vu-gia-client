# Gốm Sứ Vũ Gia - Client Portal

Dự án giao diện người dùng (Frontend Client) của thương hiệu **Gốm Sứ Vũ Gia** – chuyên cung cấp các sản phẩm gốm sứ Bát Tràng chính hãng (bộ đồ thờ truyền thống, bình phong thủy, lục bình gốm sứ, ấm chén và quà tặng cao cấp).

Dự án được xây dựng trên nền tảng Next.js 15 (App Router) kết hợp cùng Tailwind CSS v4 nhằm tối ưu hóa hiệu năng, tốc độ tải trang và trải nghiệm người dùng trên đa thiết bị.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

Dự án sử dụng các công nghệ và thư viện cốt lõi sau:

- **Framework:** [Next.js 15.5.18](https://nextjs.org/) (sử dụng App Router và Turbopack cho môi trường phát triển).
- **Thư viện giao diện:** [React 19.2.6](https://react.dev/).
- **Styling:** [Tailwind CSS v4.3.0](https://tailwindcss.com/) (sử dụng gói `@tailwindcss/postcss` mới).
- **Quản lý trạng thái:** [Zustand 5.0.14](https://github.com/pmndrs/zustand).
- **Hiệu ứng chuyển động:** [Framer Motion 12.40.0](https://www.framer.com/motion/).
- **Trình chiếu (Carousel):** [Embla Carousel React 8.6.0](https://www.embla-carousel.com/).
- **Icon:** [Lucide React 1.17.0](https://lucide.dev/).

---

## 📂 Cấu Trúc Thư Mục (Directory Structure)

Dự án được tổ chức theo mô hình phân tách rõ ràng giữa cấu trúc định tuyến (Routing) và tầng hiển thị (Views/Components):

```text
├── public/                       # Tài nguyên tĩnh (Fonts, Icons, Images)
├── src/
│   ├── app/                      # Cấu trúc Routing (App Router)
│   │   ├── (main)/               # Nhóm trang chính (Trang chủ, Sản phẩm, Tin tức, Giới thiệu...)
│   │   ├── (policies)/           # Nhóm trang chính sách (Bảo mật, Đổi trả, Vận chuyển, FAQ)
│   │   ├── (shop)/               # Nhóm trang thương mại điện tử (Giỏ hàng, Thanh toán)
│   │   ├── (user)/               # Nhóm trang quản lý tài khoản & Đơn hàng
│   │   ├── globals.css           # Cấu hình Tailwind v4 và Custom Theme Variables
│   │   └── layout.js             # Layout gốc, tích hợp Fonts toàn cục
│   ├── assets/                   # Hình ảnh, tài nguyên đi kèm mã nguồn
│   ├── components/               # Các React Component dùng cho từng tính năng
│   │   ├── home/                 # Khối giao diện trang chủ
│   │   ├── product-detail/       # Khối chi tiết sản phẩm
│   │   ├── products/             # Bộ lọc, lưới sản phẩm, danh mục
│   │   └── shared/               # Component dùng chung (Header, Footer, Breadcrumb, Card, Pagination)
│   ├── utils/
│   │   └── routes.js             # Định nghĩa danh sách đường dẫn hệ thống (ROUTES)
│   └── views/                    # Tầng logic và Layout chính của từng trang (được gọi từ app/page.jsx)
```

---

## 🎨 Cấu Hình Giao Diện & Fonts

### 1. Hệ thống Fonts
Dự án tích hợp cả Google Fonts trực tuyến lẫn Fonts cục bộ (Local Fonts) thông qua `next/font`:
- **Fonts hệ thống:** Montserrat, Inter, Arima, Archivo, Be Vietnam Pro, Aref Ruqaa.
- **Local Fonts:** `CircularStd` (sử dụng cho các thẻ chữ phụ/thương mại) và `UVF-Amplify` (sử dụng cho các tiêu đề mang tính cổ điển, mỹ nghệ).

### 2. Bảng màu thương hiệu (Tailwind v4 Theme variables)
Được định nghĩa trực tiếp trong `src/app/globals.css`:
- `--color-primary`: `#97400C` (Màu cam đất/gốm truyền thống)
- `--color-sale`: `#AD5036` (Màu đỏ cam đất hỗ trợ làm nổi bật chương trình ưu đãi)
- `--color-text-main`: `#777E90` (Màu chữ chính)
- `--color-text-sub`: `#838383` (Màu chữ phụ)
- `--color-success`: `#67A865` (Màu xanh hiển thị trạng thái)

---

## 🚀 Hướng Dẫn Phát Triển & Vận Hành

### Cài đặt môi trường
Đảm bảo bạn đã cài đặt Node.js phiên bản tối thiểu là 18.x hoặc cao hơn.

1. **Cài đặt các gói thư viện phụ thuộc:**
   ```bash
   npm install
   ```

2. **Chạy dự án ở chế độ phát triển (Development Mode với Turbopack):**
   ```bash
   npm run dev
   ```
   *Giao diện phát triển mặc định sẽ chạy tại đường dẫn: `http://localhost:3000`*

3. **Kiểm tra cú pháp và chất lượng mã nguồn (Linting):**
   ```bash
   npm run lint
   ```

4. **Biên dịch sản phẩm (Production Build):**
   ```bash
   npm run build
   ```

5. **Khởi chạy môi trường Production sau khi build:**
   ```bash
   npm run start
   ```

---

## 📌 Nguyên Tắc Phát Triển Dự Án

- **Định tuyến:** Toàn bộ liên kết trong dự án cần sử dụng đối tượng `ROUTES` định nghĩa sẵn trong `src/utils/routes.js` để tránh việc sai lệch đường dẫn khi thay đổi cấu trúc URL.
- **Tách biệt Views và Routing:** Các file `page.jsx` trong thư mục `src/app/` nên đóng vai trò là "Cổng kết nối" (Chứa Metadata, cấu hình Server-side). Logic xử lý giao diện, State nên được triển khai ở thư mục `src/views/` hoặc `src/components/`.
- **Sử dụng tài nguyên:** Trước khi thêm hình ảnh hoặc biểu tượng mới, hãy kiểm tra thư mục `public/` hoặc `src/assets/` để tái sử dụng tối đa các tài nguyên sẵn có, đảm bảo tối ưu dung lượng của gói build.