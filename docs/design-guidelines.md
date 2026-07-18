# Hướng dẫn Thiết kế & Giao diện (Design Guidelines)

Tài liệu này định nghĩa hệ thống nhận diện thương hiệu số, quy chuẩn màu sắc, phông chữ và các nguyên tắc thiết kế giao diện được sử dụng trong dự án **Gốm Sứ Vũ Gia - Client Portal**.

---

## 1. Triết lý Thiết kế

Thương hiệu **Gốm Sứ Vũ Gia** đại diện cho tinh hoa làng nghề gốm sứ Bát Tràng truyền thống. Vì vậy, phong cách thiết kế giao diện cần đạt được sự cân bằng giữa:
*   **Tinh thần Truyền thống & Di sản:** Sử dụng tông màu đất nung ấm áp, các họa tiết đường hoa văn gốm cổ điển và phông chữ tiêu đề bay bổng.
*   **Trải nghiệm Hiện đại & Chuyên nghiệp:** Bố cục dạng lưới (grid) sạch sẽ, khoảng trắng hợp lý, hiệu ứng chuyển động mượt mà bằng Framer Motion và quy trình tương tác đơn giản, rõ ràng.

---

## 2. Hệ thống Màu sắc (Color Palette)

Hệ màu của dự án được khai báo tập trung trong `globals.css` dưới dạng các biến CSS của Tailwind CSS v4:

### Màu thương hiệu chủ đạo (Brand Colors)
*   **Primary Clay (`--color-primary` / `#97400C`):** Màu cam đất nung đặc trưng của lò gốm Bát Tràng, được sử dụng cho các thành phần nhận diện chính (Navbar header, tiêu đề mục lớn, trạng thái kích hoạt).
*   **Terracotta Sale (`--color-sale` / `#AD5036`):** Màu đỏ cam đất đậm, dùng để tạo điểm nhấn thị giác mạnh như nút kêu gọi hành động (Call-to-Action - CTA), thẻ giá giảm hoặc huy hiệu khuyến mãi.

### Màu văn bản & Nền (Text & Background Colors)
*   **Text Main (`--color-text-main` / `#777E90`):** Màu chữ xám đen chính cho các đoạn mô tả dài và nội dung chung, tránh dùng màu đen nguyên bản (`#000`) nhằm giảm mỏi mắt cho người dùng.
*   **Text Sub (`--color-text-sub` / `#838383`):** Màu chữ phụ, dùng cho nhãn mô tả thông số kỹ thuật, ngày tháng bài viết hoặc các ghi chú nhỏ.

### Màu trạng thái (Status Colors)
*   **Success (`--color-success` / `#67A865`):** Màu xanh lá mạ dịu, dùng cho thông báo hoàn thành đơn hàng, thông báo thêm vào giỏ thành công.
*   **Warning (`#C76E00`):** Màu cam đậm cảnh báo, dùng cho trạng thái chờ hoặc lưu ý.

---

## 3. Hệ thống Phông chữ (Typography)

Dự án sử dụng sự kết hợp giữa phông chữ Serifs nghệ thuật cho tiêu đề và Sans-serif hình học cho nội dung thương mại:

1.  **Phông tiêu đề lớn (`font-playfair` hoặc `UVF-Amplify`):**
    *   **Áp dụng:** Tiêu đề trang giới thiệu, tiêu đề các danh mục lớn trên trang chủ, tên sản phẩm chi tiết.
    *   **Cảm giác:** Mang lại sự hoài cổ, nghệ thuật thủ công và tính thẩm mỹ cao.
2.  **Phông chữ thương mại (`font-montserrat` hoặc `CircularStd`):**
    *   **Áp dụng:** Giá tiền, số lượng sản phẩm, menu thanh điều hướng, nút bấm, nhãn input biểu mẫu và nội dung bảng dữ liệu.
    *   **Cảm giác:** Hiện đại, dễ đọc trên cả màn hình di động nhỏ, tạo sự chuyên nghiệp cho quy trình mua sắm trực tuyến.

---

## 4. Họa tiết và Trang trí (Visual Assets)

Để nâng cao tính thẩm mỹ gốm sứ Bát Tràng, giao diện công cộng tích hợp tinh tế các họa tiết trang trí:
*   **Pattern nền (`public/images/bg-pattern/bg-pattern.svg`):** Họa tiết hoa sen gốm chìm được dùng làm nền nhẹ cho các phần như Hero section trang chủ hoặc chân trang Footer.
*   **Đường viền cách điệu:** Sử dụng các dải pattern hoa văn gốm ngăn cách giữa các khối sản phẩm lớn.
