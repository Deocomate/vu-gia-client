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

---

## 5. Chuẩn hóa kích thước theo Windows OS Scale (Desktop Viewport Scaling)

**Quy tắc bắt buộc khi thiết kế UI desktop mới:** mọi bố cục desktop phải được thiết kế trên khung **1920px width @ 100% OS scale**. Đây là baseline duy nhất mà toàn bộ hệ thống scaling dưới đây quy chiếu tới — thiết kế ở tỉ lệ khác sẽ làm sai lệch công thức bù trừ.

### Vấn đề

Font chữ trong dự án được hardcode dạng `text-[Npx]` theo đúng Figma 1920@100%. Trên máy Windows đặt OS display scale 125%/150%, `window.innerWidth` của trình duyệt co lại theo tỉ lệ đó (ví dụ màn 1920px vật lý @125% → `innerWidth ≈ 1536`), khiến layout 1920px bị bó hẹp và chữ đọc to bất thường so với thiết kế gốc.

### Giải pháp

Một CSS `zoom` toàn trang, được set động bằng JS trên `<html>`, bù trừ theo công thức có giới hạn (damped):

```
scale = clamp(0.82, window.innerWidth / 1920, 1.0)   // chỉ áp dụng khi innerWidth >= 1280
scale = 1                                             // dưới 1280px (mobile/tablet/laptop nhỏ giữ nguyên hành vi hiện tại)
```

- **Floor `0.82`:** không bao giờ thu nhỏ quá mức, tránh chữ quá bé ở OS scale 150%.
- **Cap `1.0`:** không bao giờ phóng to hơn thiết kế gốc (màn hình lớn hơn 1920 thì hiển thị native, các container `max-width` tự canh giữa).
- **Ngưỡng `1280`:** chỉ áp dụng cho desktop thật; tablet-landscape (1024-1279, ví dụ iPad ngang) giữ nguyên không bị scale.
- **Trang `/admin` được loại trừ hoàn toàn** — khu vực quản trị dense-data, không ràng buộc theo Figma 1920.
- **Feature-detect, không version-gate:** code kiểm tra `'zoom' in document.documentElement.style` trước khi áp dụng; trình duyệt không hỗ trợ sẽ không làm gì (`scale = 1`, hành vi hiện tại không đổi) — không hardcode danh sách phiên bản trình duyệt cụ thể.

### Code nằm ở đâu

- `src/shared/lib/viewport-scale/viewport-scale-config.js` — hằng số (`DESIGN_WIDTH`, `MIN_SCALE`, `MAX_SCALE`, `MIN_VIEWPORT`) + `computeScale()`.
- `src/shared/lib/viewport-scale/viewport-scale-inline-script.js` — script inline chạy trước khi trang vẽ (pre-paint), tránh flash nội dung chưa scale (FOUC). Hằng số ở đây **phải giữ đồng bộ thủ công** với file config ở trên (không thể import module vào script inline).
- `src/shared/components/viewport-scale/viewport-scaler.jsx` — component client, tính lại scale khi resize cửa sổ hoặc đổi màn hình (DPR thay đổi).
- `src/app/layout.js` — nơi gắn script inline + mount `<ViewportScaler>`.

### Cách chỉnh hằng số

Muốn đổi độ "bù trừ" (ví dụ chữ ở 125% vẫn hơi to, muốn khớp chính xác hơn), chỉnh `MIN_SCALE` trong **cả hai** file (`viewport-scale-config.js` và `viewport-scale-inline-script.js`) — một giá trị duy nhất, không cần đổi logic.
