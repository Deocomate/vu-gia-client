---
phase: 1
title: "01-Research"
status: pending
priority: P1
effort: "1h"
dependencies: []
---

# Phase 1: Nghiên cứu cấu trúc & Phân tích Giao diện Figma (Research & Analysis)

## Overview
Giai đoạn này tập trung vào việc nghiên cứu, so sánh mã nguồn hiện tại của `src/components/shared/Header.jsx` với đặc tả thiết kế từ hai Node Figma được cung cấp nhằm đưa ra phương án cấu trúc hóa giao diện mobile một cách tối ưu, giữ nguyên giao diện desktop và xác minh các asset hình ảnh.

## Requirements
- **Functional**:
  - Xác định chính xác các điểm khác biệt về layout giữa hai trạng thái Mobile Đóng (Close) và Mobile Mở (Open).
  - Đối chiếu các biến màu sắc, font chữ của Figma với cấu hình Tailwind v4 trong dự án.
  - Xác minh tất cả asset hình ảnh trong thư mục `public/images/header` có trùng khớp với thiết kế Figma.
- **Non-functional**:
  - Bảo đảm cấu trúc responsive tách biệt hoàn toàn giữa mobile và desktop, hạn chế tối đa trùng lặp code dư thừa.

## Architecture
- **Mô hình Trạng thái (State Model)**:
  - Sử dụng biến `isMobileMenuOpen` (boolean React state) để chuyển đổi giữa hai cấu trúc top-bar khác nhau trên mobile.
- **Phân tích Layout Figma**:
  1. **Mobile Close (Đóng - Node 9844:10799)**:
     - Chiều cao header: `70px` (trên mobile, thay vì `60px` như hiện tại). Giao diện desktop giữ nguyên `84px` (`lg:h-[84px]`).
     - Hamburger Menu Icon: Nằm bên trái (`left: 6.98%` hay khoảng `px-[20px]`). Kích thước `24x24px`. Ảnh: `/images/header/hamburger-menu-icon.png`.
     - Logo Gốm Sứ Vũ Gia: Nằm ở chính giữa màn hình (được căn giữa tuyệt đối trên mobile). Kích thước khoảng `80x40px`. Ảnh: `/images/header/logo.png`.
     - Giỏ hàng (Cart Icon): Nằm bên phải (`right: 6.98%`). Kích thước `24x24px`. Ảnh: `/images/header/cart-icon.png`. Đi kèm badge hình tròn màu vàng `#FFE600`, chữ màu đỏ `#AD5036` (`font-circular`, font-weight `700`, text `8px`).
     - *Lưu ý*: Trên Figma Close không hiển thị icon Tìm kiếm (Search) ở thanh tiêu đề chính bên ngoài. Tuy nhiên, để tối ưu trải nghiệm và dựa trên codebase cũ, ta sẽ ẩn nút Search ở ngoài và chỉ hiển thị trong Menu Open, hoặc tối ưu theo thiết kế Figma là chỉ hiển thị Hamburger - Logo (Center) - Cart.
  2. **Mobile Open (Mở - Node 445:21994)**:
     - Menu mở ra dạng overlay tràn màn hình (`fixed inset-0 z-50 bg-primary`).
     - Background: Có hình nền họa tiết `/images/header/bg-pattern-mobile.png` được phủ mờ phía sau.
     - Top-bar lúc này thay đổi layout:
       - Logo chuyển sang góc trái (`left-[29px]` hay khoảng `px-[20px]`). Kích thước `80x40px`.
       - Bên phải gồm: Icon Search (`18x18px`), Icon Cart (`24x24px` kèm badge) và Icon Close (`24x24px`, ảnh `/images/header/close-icon.png`).
     - Danh sách menu: Căn lề trái (`left-[29px]`), sắp xếp theo chiều dọc.
       - Font chữ: Montserrat, SemiBold, size `16px`, viết hoa (`uppercase`), màu trắng (`text-white`). Khi ở trang hiện tại (active) thì chuyển sang màu vàng nhạt `#EABA96` (hoặc màu active theo dự án).
     - Bản quyền (Footer Copyright): Nằm dưới cùng menu: `© 2026. All rights reserved.`, font Inter, Regular, size `16px`, màu trắng/80.

## Related Code Files
- **Modify**:
  - `src/components/shared/Header.jsx` (Thêm layout mới cho mobile close & mobile open overlay).

## Implementation Steps
1. **Phân tích asset ảnh**:
   - Xác nhận sự tồn tại của `/images/header/bg-pattern-mobile.png` (kích thước gốc, độ hiển thị).
   - Xác nhận sự tồn tại của `/images/header/close-icon.png`, `hamburger-menu-icon.png`, `logo.png`, `search-icon.png`, `cart-icon.png`.
2. **Kiểm tra style**:
   - Đối chiếu màu `#97400C` với class `bg-primary`.
   - Đối chiếu màu `#AD5036` với class `text-sale` hoặc text-[#AD5036].
   - Kiểm tra xem dự án đã cài đặt `framer-motion` chưa (đã cài đặt trong `package.json`).

## Success Criteria
- [x] Có bảng phân tích so sánh chi tiết các thành phần UI mobile.
- [x] Sơ đồ hóa được sự khác biệt layout giữa close và open state.
- [x] Định vị rõ các biến màu sắc và font chữ tương ứng trong dự án Next.js Tailwind v4.

## Risk Assessment
- **Rủi ro**: Việc đổi layout từ Logo (Center) khi đóng sang Logo (Left) khi mở có thể gây giật lag hoặc mất cân đối nếu không xử lý chuyển cảnh mượt.
- **Giải pháp**: Sử dụng overlay menu mở hẳn bằng Framer Motion dạng `AnimatePresence` để chuyển đổi mượt mà hoặc làm mờ nhẹ (fade in) overlay menu để tránh cảm giác đứt gãy trải nghiệm người dùng.
