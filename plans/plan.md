---
title: "Implement Mobile Header Design for Gom Su Vu Gia"
description: "Kế hoạch chi tiết để cập nhật giao diện mobile cho Header.jsx theo đúng thiết kế Figma (mobile close & mobile open), sử dụng các asset có sẵn trong public/images/header và không làm ảnh hưởng đến giao diện desktop."
status: pending
priority: P1
branch: "feature/mobile-header-figma"
tags: [frontend, tailwind, responsive, header, nextjs]
blockedBy: []
blocks: []
created: "2026-06-23T04:16:15.702Z"
createdBy: "ck:plan"
source: skill
---

# Kế hoạch implement Giao diện Mobile cho Header.jsx theo Thiết kế Figma

## 1. Tổng quan (Overview)
Kế hoạch này chi tiết hóa quá trình thiết kế, tái cấu trúc và hoàn thiện giao diện mobile của component `src/components/shared/Header.jsx` dựa trên thiết kế Figma được cung cấp cho cả hai trạng thái: **Mobile Close** (Đóng menu) và **Mobile Open** (Mở menu). 

Mục tiêu cốt lõi:
- **Tái cấu trúc Header mobile** để đạt độ chính xác pixel-perfect so với thiết kế Figma.
- **Giữ nguyên giao diện Desktop**: Toàn bộ thay đổi chỉ áp dụng cho màn hình nhỏ hơn `lg` (dưới `1024px`).
- **Sử dụng tài nguyên tối ưu**: Sử dụng các ảnh asset sẵn có trong thư mục `public/images/header`.
- **Trải nghiệm mượt mà**: Sử dụng hiệu ứng chuyển động mượt mà (slide/fade) khi mở/đóng menu mobile với Framer Motion.

---

## 2. Các giai đoạn thực hiện (Phases)

| Phase | Tên giai đoạn | Trạng thái | Ước lượng thời gian | File chi tiết |
|-------|--------------|------------|---------------------|---------------|
| **1** | [01-Research](./phase-01-01-research.md) | `pending` | 1h | `plans/phase-01-01-research.md` |
| **2** | [02-Implement](./phase-02-02-implement.md) | `pending` | 4h | `plans/phase-02-02-implement.md` |
| **3** | [03-Test](./phase-03-03-test.md) | `pending` | 1.5h | `plans/phase-03-03-test.md` |

---

## 3. Ràng buộc & Tiêu chí kỹ thuật (Technical Constraints)
- **Tailwind v4.3.0**: Sử dụng các biến theme tùy chỉnh đã định nghĩa trong `src/app/globals.css` như `--color-primary` (`#97400C`), `--color-sale` (`#AD5036`), và các font chữ như `font-montserrat`, `font-inter`, `font-circular`.
- **Next.js `next/image` & `next/link`**: Đảm bảo tất cả hình ảnh sử dụng component `Image` của Next.js với thuộc tính `alt`, `fill` hoặc kích thước cố định tối ưu và không bị méo.
- **Không thay đổi Desktop**: Sử dụng utility classes của Tailwind như `lg:flex`, `lg:h-[84px]`, `hidden lg:block` để cô lập hoàn toàn code mobile và desktop.

---

## 4. Quản lý tác vụ (Task Hydration / Todo Tracking)
Các bước chi tiết được tracking trong các file phase tương ứng. Khi bắt đầu triển khai, sử dụng `ck plan check <phase-id> --start` hoặc cập nhật trạng thái trong các phase file thành `in-progress`.
