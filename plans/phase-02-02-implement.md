---
phase: 2
title: "02-Implement"
status: pending
priority: P1
effort: "4h"
dependencies: ["phase-01-01-research.md"]
---

# Phase 2: Triển khai Giao diện Mobile Header mới (Implementation)

## Overview
Giai đoạn này tập trung vào việc thực thi viết mã nguồn, chỉnh sửa `src/components/shared/Header.jsx` để thay thế giao diện dropdown mobile cũ bằng giao diện mobile đóng/mở chuẩn Figma, tích hợp ảnh nền họa tiết và tối ưu hóa hiệu ứng chuyển cảnh mà không làm ảnh hưởng đến layout desktop.

## Requirements
- **Functional**:
  - Giao diện Mobile Close có Hamburger (Trái), Logo (Căn giữa tuyệt đối), và Giỏ hàng (Phải) với chiều cao `70px`.
  - Giao diện Mobile Open mở ra overlay toàn màn hình có hình nền họa tiết `bg-pattern-mobile.png`, Logo góc trái, các nút Search - Cart - Close góc phải, danh sách menu 6 liên kết dọc viết hoa, và copyright footer ở dưới cùng.
  - Đóng menu khi người dùng click vào nút Close hoặc chọn một liên kết.
- **Non-functional**:
  - Sử dụng Framer Motion `AnimatePresence` để chuyển đổi mượt mà giữa trạng thái mở và đóng.
  - Đảm bảo layout desktop (`lg:h-[84px]`, ngang) hoàn toàn không bị ảnh hưởng hay thay đổi style.

## Architecture
Cấu trúc JSX của `Header.jsx` sau khi cập nhật:
- `<header className="relative w-full bg-primary z-50">`
  - **Phần 1: Top Bar (Desktop & Mobile Close)**
    - Chiều cao: `h-[70px] lg:h-[84px] flex items-center justify-between`
    - **Nút Hamburger (Chỉ hiển thị trên mobile - `< lg`)**:
      - Vị trí: `left-side`, kích thước `24x24px`.
      - Khi click: `setIsMobileMenuOpen(true)`.
    - **Logo**:
      - Trên mobile: Căn giữa tuyệt đối: `absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:static lg:transform-none`.
      - Trên desktop: Vị trí bình thường.
    - **Desktop Navigation**: `hidden lg:flex` (Giữ nguyên không đổi).
    - **Actions Container**:
      - Tìm kiếm (Search): Ẩn trên mobile close (`hidden lg:block`), chỉ hiển thị trong Menu Open.
      - Tài khoản (User): `hidden lg:block` (Giữ nguyên).
      - Giỏ hàng (Cart): Hiển thị cả trên mobile & desktop. Badge màu vàng `#FFE600`, chữ đỏ `#AD5036`.
  - **Phần 2: Full-screen Mobile Menu Open Overlay**
    - Sử dụng `<AnimatePresence>` của `framer-motion`.
    - Khi `isMobileMenuOpen` là `true`:
      - `<motion.div className="fixed inset-0 bg-primary z-50 overflow-hidden flex flex-col md:hidden">`
      - **Background Pattern Layer**:
        - Một thẻ `div` hoặc `Image` tuyệt đối chứa `/images/header/bg-pattern-mobile.png` ở góc dưới/giữa với kích thước thích hợp và `opacity-20 pointer-events-none mix-blend-overlay` để làm nền chìm.
      - **Overlay Top Bar**:
        - Chiều cao `h-[70px] px-[20px] flex items-center justify-between w-full border-b border-white/10`.
        - Góc trái: Logo `/images/header/logo.png`, `w-[80px] h-[40px]`.
        - Góc phải: Container `flex items-center gap-[20px]`:
          - Icon Search: kích thước `18x18px`.
          - Icon Cart: kích thước `24x24px` kèm Badge.
          - Icon Close (Nút X): kích thước `24x24px`, khi click gọi `setIsMobileMenuOpen(false)`.
      - **Danh sách Menu**:
        - Khối `nav` có class `flex flex-col gap-[30px] pt-[76px] px-[29px]`.
        - Duyệt qua `NAV_LINKS` (6 links):
          - Viết hoa (`uppercase`), font Montserrat (`font-montserrat`), Semibold (`font-semibold`), size `16px` (`text-[16px]`).
          - Active: màu `#EABA96`. Inactive: màu trắng (`text-white`).
          - Khi click vào bất kỳ liên kết nào: gọi `setIsMobileMenuOpen(false)`.
      - **Footer**:
        - Khối `div` có class `mt-auto pb-[40px] px-[29px]`.
        - Dòng chữ: `© 2026. All rights reserved.`, font Inter (`font-inter`), Regular, size `16px`, màu trắng (`text-white/80`).

## Related Code Files
- `src/components/shared/Header.jsx`

## Implementation Steps

### Bước 1: Khai báo thư viện chuyển động (Framer Motion)
Import `motion` và `AnimatePresence` từ `framer-motion` ở đầu file `Header.jsx`.

### Bước 2: Tái cấu trúc Top Bar chính (Desktop & Mobile Close)
1. Cập nhật class chiều cao của container ngoài cùng từ `h-[60px] lg:h-[84px]` thành `h-[70px] lg:h-[84px]`.
2. Ẩn nút Tìm kiếm (Search) ở giao diện mobile ngoài cùng bằng cách thêm class `hidden lg:block` (hoặc giữ lại nếu muốn tối ưu, nhưng thiết kế Figma Close chỉ hiển thị Hamburger - Logo - Cart). Để đúng chuẩn Figma, ta sẽ ẩn Search ở ngoài trên mobile.
3. Căn giữa Logo tuyệt đối trên mobile bằng cách thêm class `absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:relative lg:left-0 lg:top-0 lg:translate-x-0 lg:translate-y-0`.

### Bước 3: Triển khai Giao diện Mobile Menu Open Overlay
1. Thay thế khối Dropdown menu cũ bằng khối `motion.div` sử dụng `AnimatePresence`.
2. Tạo lớp phủ chìm chứa ảnh `/images/header/bg-pattern-mobile.png`.
3. Tạo thanh tiêu đề mobile open có Logo (Trái), cụm [Search, Cart, Close] (Phải).
4. Render danh sách 6 liên kết dọc chuẩn font Montserrat và viết hoa, loại bỏ liên kết "Tài khoản" khỏi danh sách lặp dọc để đồng bộ thiết kế Figma (tránh dư thừa).
5. Thêm dòng Copyright footer ở dưới cùng màn hình với căn lề và style chuẩn.

### Bước 4: Kiểm tra sự hòa nhập của các hiệu ứng
Sử dụng transition mượt mà như `initial={{ opacity: 0, x: "-100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "-100%" }}` hoặc fade in/out đơn giản để menu hiển thị trơn tru nhất.

## Success Criteria
- [ ] Giao diện mobile đóng đạt chiều cao `70px`, Logo nằm chính giữa một cách hoàn hảo.
- [ ] Khi click Hamburger, menu mở ra dạng overlay tràn màn hình, che toàn bộ nội dung phía dưới, có họa tiết chìm mượt mà.
- [ ] Giao diện mở có Logo bên trái, các icon điều hướng và Close bên phải.
- [ ] Toàn bộ 6 liên kết menu viết hoa, có màu active chuẩn. Copyright nằm ở đáy menu.
- [ ] Toàn bộ giao diện desktop giữ nguyên 100%, không bị lệch hay thay đổi khoảng cách/màu sắc.

## Risk Assessment
- **Rủi ro**: Scrolling nền phía sau khi menu đang mở (người dùng có thể cuộn trang web bên dưới overlay menu).
- **Giải pháp**: Khi `isMobileMenuOpen` là `true`, tạm thời thêm style `overflow: hidden` vào thẻ `document.body` hoặc sử dụng Framer Motion overlay thích hợp để vô hiệu hóa cuộn nền, sau đó khôi phục lại khi đóng menu.
