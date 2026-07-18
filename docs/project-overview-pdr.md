# Tổng quan Dự án & Yêu cầu Phát triển Sản phẩm (PDR)

Dự án **Gốm Sứ Vũ Gia - Client Portal** là giao diện người dùng (Frontend Client) của thương hiệu Gốm Sứ Vũ Gia, chuyên cung cấp các sản phẩm gốm sứ Bát Tràng chính hãng. Dự án đóng vai trò là cổng thông tin và thương mại điện tử tích hợp hệ thống tùy chỉnh sản phẩm độc đáo.

---

## 1. Giới thiệu chung

**Gốm Sứ Vũ Gia** là thương hiệu gốm sứ thủ công mỹ nghệ cao cấp từ làng nghề Bát Tràng truyền thống. Ứng dụng client này cung cấp cho khách hàng trải nghiệm mua sắm trực tuyến trực quan, hiện đại nhưng vẫn giữ được nét cổ điển, sang trọng của nghệ thuật gốm sứ.

### Mục tiêu dự án
*   **Trải nghiệm mua sắm mượt mà:** Cho phép người dùng duyệt, tìm kiếm, lọc và đặt mua sản phẩm dễ dàng.
*   **Tính năng cá nhân hóa:** Cung cấp công cụ thiết kế và phối ghép bộ đồ thờ (Altar Customizer) trực tuyến giúp khách hàng tự lựa chọn các vật phẩm thờ cúng phù hợp với kích thước bàn thờ gia đình.
*   **Quản lý chuyên nghiệp:** Đầy đủ phân hệ quản trị (Admin CMS) để cập nhật sản phẩm, đơn hàng, tài nguyên đa phương tiện và chăm sóc khách hàng.

---

## 2. Đối tượng người dùng mục tiêu

*   **Khách hàng cá nhân (B2C):** Những người có nhu cầu mua sắm gốm sứ gia dụng, bộ đồ thờ cúng gia tiên, quà tặng gốm sứ cao cấp hoặc bình phong thủy trang trí trong nhà.
*   **Khách hàng doanh nghiệp (B2B):** Các đối tác đặt mua ấm chén quà tặng in logo số lượng lớn, các đại lý ký gửi sản phẩm.
*   **Quản trị viên hệ thống (Admin/Staff):** Nhân viên vận hành cửa hàng, xử lý đơn đặt hàng, cập nhật bài viết tin tức và quản lý danh mục sản phẩm.

---

## 3. Phạm vi sản phẩm (Product Scope)

Ứng dụng bao gồm các phân hệ chính sau:

### Phân hệ công cộng (Public Site)
*   **Trang chủ (Homepage):** Trình diễn các sản phẩm nổi bật, banner danh mục, video quy trình làm gốm và các bài viết tin tức mới nhất.
*   **Trang sản phẩm (Products & Catalog):** Danh sách sản phẩm, bộ lọc theo danh mục, tính năng sắp xếp và thanh tìm kiếm trực quan.
*   **Trang chi tiết sản phẩm (Product Detail):** Hiển thị chi tiết hình ảnh, thông số kỹ thuật, mô tả sản phẩm và đề xuất sản phẩm tương tự.
*   **Bộ tùy chỉnh đồ thờ (Altar Customizer):** Công cụ kéo thả/chọn cấu hình để sắp xếp các vật phẩm trên bàn thờ (bát hương, mâm bồng, kỷ chén, lọ hoa, v.v.).
*   **Quy trình mua hàng (Shopping Cart & Checkout):** Giỏ hàng lưu trữ bằng Zustand (Local Storage), trang điền thông tin thanh toán tích hợp cảnh báo Sonner Toast.
*   **Thông tin thương hiệu:** Các trang Giới thiệu (About Us), Nhà xưởng sản xuất (Factory), Hệ thống Showroom, và Thư viện hình ảnh (Gallery).
*   **Các trang chính sách:** Chính sách đổi trả, chính sách vận chuyển, chính sách bảo mật và trang FAQ.

### Phân hệ quản trị (Admin CMS - Protected)
*   Quản lý danh sách sản phẩm, danh mục sản phẩm và mã giảm giá (coupons).
*   Quản lý đơn hàng, cập nhật trạng thái đơn hàng.
*   Quản lý thư viện media (hình ảnh, tài nguyên tĩnh).
*   Quản lý các bài viết tin tức, thông tin phản hồi (contact leads) và đăng ký bản tin (newsletter).
*   Cấu hình hệ thống (Settings), quản lý người dùng (Users) và chuyển hướng link (Redirects).

---

## 4. Yêu cầu phi chức năng (Non-functional Requirements)

*   **Tốc độ & Hiệu năng:** Sử dụng Next.js Standalone build cùng Turbopack nhằm đạt điểm số Core Web Vitals tối ưu.
*   **Thiết kế đáp ứng (Responsive Design):** Giao diện tương thích hoàn toàn từ màn hình di động nhỏ gọn đến màn hình desktop lớn.
*   **SEO:** Hỗ trợ cấu hình thẻ Meta, thẻ tiêu đề và tối ưu hóa từ khóa chuẩn SEO cho từng danh mục sản phẩm và bài viết tin tức.
*   **Khả năng mở rộng:** Kiến trúc tách biệt rõ ràng giữa views và định tuyến giúp dễ dàng tích hợp thêm các dịch vụ thanh toán hoặc cổng vận chuyển bên thứ ba.
