---
phase: 3
title: "03-Test"
status: pending
priority: P2
effort: "1.5h"
dependencies: ["phase-02-02-implement.md"]
---

# Phase 3: Kiểm thử & Đảm bảo Chất lượng (Testing & QA)

## Overview
Giai đoạn này tập trung vào việc thực thi kiểm thử giao diện mobile của Header mới trên nhiều độ phân giải màn hình khác nhau, kiểm tra toàn bộ các tương tác đóng/mở menu, xác minh độ chính xác về mặt thiết kế (pixel-perfect) và quan trọng nhất là bảo đảm **không xảy ra bất kỳ lỗi hồi quy nào trên giao diện Desktop (Zero Desktop Regressions)**.

## Requirements
- **Functional**:
  - Kiểm thử khả năng đóng/mở menu bằng cách click vào Hamburger và Close button.
  - Xác thực tất cả các liên kết trong menu mobile chuyển hướng đúng trang và đóng menu ngay sau khi click.
  - Kiểm tra giỏ hàng hiển thị đúng số lượng badge và điều hướng chuẩn.
  - Vô hiệu hóa tính năng cuộn trang (scroll lock) khi overlay menu đang mở.
- **Non-functional**:
  - Giao diện đạt tính trực quan cao, hiệu ứng mượt mà (60fps), không bị khựng hay giật hình khi mở overlay menu.
  - Kiểm tra tính responsive trên các mốc kích thước màn hình: Mobile siêu nhỏ (320px), Mobile tiêu chuẩn (375px - 430px), Tablet (768px), và Desktop (1024px, 1440px, 1920px).

## Architecture
- **Môi trường kiểm thử (Testing Scope)**:
  - Kiểm thử thủ công trên trình duyệt (Chrome DevTools Device Mode).
  - Kiểm thử trên thiết bị di động thực tế (nếu có thể) qua mạng LAN.
- **Biện pháp ngăn chặn Scroll Leak**:
  - Thêm `useEffect` lắng nghe sự thay đổi của trạng thái `isMobileMenuOpen` để toggle class `overflow-hidden` trên thẻ `body`.

## Related Code Files
- `src/components/shared/Header.jsx`

## Implementation Steps

### Bước 1: Kiểm thử Giao diện Close (Đóng Menu Mobile)
1. Thu nhỏ màn hình xuống kích thước mobile (ví dụ: iPhone 14 Pro Max - 430px).
2. Kiểm tra xem chiều cao Header có đạt chuẩn `70px` hay không.
3. Kiểm tra tính cân đối của Logo ở chính giữa màn hình. Logo không được lệch sang trái hay phải bất kể chiều rộng của Actions container.
4. Kiểm tra nút Hamburger bên trái và Giỏ hàng kèm badge bên phải hiển thị đầy đủ, không bị chồng đè hay méo ảnh.

### Bước 2: Kiểm thử Giao diện Open (Mở Menu Mobile Overlay)
1. Click vào Hamburger button và quan sát hiệu ứng mở ra của overlay menu.
2. Kiểm tra hình nền họa tiết `/images/header/bg-pattern-mobile.png` hiển thị chìm mờ đẹp mắt phía sau.
3. Kiểm tra thanh top-bar của overlay: Logo nhảy sang trái, nút Search - Cart - Close nằm bên phải, thẳng hàng và cách biên đúng khoảng cách thiết kế.
4. Thử cuộn trang (scroll) xem nền phía sau có bị cuộn hay không (nếu có cuộn thì phải kích hoạt Scroll Lock).
5. Kiểm tra font chữ, khoảng cách, màu sắc (active/inactive) và chữ viết hoa (`uppercase`) của cả 6 liên kết menu.
6. Click vào nút Close (X) và quan sát hiệu ứng đóng mượt mà của menu.

### Bước 3: Kiểm thử Chức năng Điều hướng (Navigation Testing)
1. Mở menu, click vào liên kết "Về chúng tôi" (About).
2. Xác nhận:
   - Menu tự động đóng lại.
   - Trang web chuyển hướng thành công đến URL `/ve-chung-toi`.
   - Khi trang mới tải xong, mở lại menu và kiểm tra xem liên kết "Về chúng tôi" có đổi sang màu active `#EABA96` hay không.
3. Lặp lại cho tất cả 6 liên kết còn lại và giỏ hàng.

### Bước 4: Kiểm thử Hồi quy Desktop (Desktop Regression Check)
1. Mở rộng màn hình lên kích thước lớn hơn `1024px` (ví dụ: 1440px).
2. Xác minh 100% giao diện desktop không thay đổi:
   - Chiều cao header là `84px` (`lg:h-[84px]`).
   - Logo nằm bên trái.
   - Thanh menu ngang chứa đủ 6 liên kết chữ viết hoa, khoảng cách ngang rộng rãi.
   - Các action icons bên phải hiển thị đầy đủ Search - User - Cart.
   - Không thấy bóng dáng của nút Hamburger hay Close button di động.

## Success Criteria
- [ ] Giao diện đóng & mở trên mobile hiển thị cực kỳ đẹp mắt, không bị lỗi vỡ khung hay chồng chéo chữ.
- [ ] Tính năng scroll lock hoạt động hoàn hảo khi menu mở.
- [ ] Hiệu ứng chuyển động đóng/mở mượt mà, tự nhiên.
- [ ] Toàn bộ liên kết menu hoạt động đúng đắn và tự đóng menu sau khi click.
- [ ] Không có bất kỳ lỗi hồi quy nào xảy ra trên màn hình Desktop.

## Risk Assessment
- **Rủi ro**: Lỗi mất trạng thái scroll của body nếu người dùng tắt trình duyệt đột ngột hoặc chuyển hướng trang mà class `overflow-hidden` vẫn bị kẹt trên `body`.
- **Giải pháp**: Đảm bảo trong hàm cleanup của `useEffect` (trong `Header.jsx`) luôn khôi phục lại class `overflow-hidden` về trạng thái ban đầu của `body` (`document.body.style.overflow = "unset"`).
