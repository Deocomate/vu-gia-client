# Tóm tắt Cấu trúc Mã nguồn (Codebase Summary)

Tài liệu này cung cấp cái nhìn chi tiết về cấu trúc mã nguồn dự án **Gốm Sứ Vũ Gia - Client Portal**, hỗ trợ các nhà phát triển mới nhanh chóng định hướng và nắm bắt cấu trúc dự án.

---

## 1. Cấu trúc Thư mục Tổng quan

Dự án tổ chức theo mô hình **feature-based**: mỗi tính năng (`cart`, `checkout`, `orders`, `account`,
`auth`, `admin`, và các trang storefront) sở hữu view + component + service của chính nó; mọi thứ dùng
chung xuyên-tính-năng nằm trong `shared/`. Không còn thư mục `views/`/`lib/`/`stores/`/`utils/`/`hooks/`/
`components/` ở top-level — đã gộp về `features/*` và `shared/*` ở lần tái cấu trúc gần nhất.

```text
├── public/                       # Tài nguyên tĩnh công cộng (fonts, icons, images)
├── src/
│   ├── app/                      # Routing THUẦN (Next.js App Router) — chỉ metadata + delegate
│   │   ├── (admin)/              # Phân hệ quản trị CMS
│   │   ├── (main)/               # Trang công cộng (Trang chủ, Sản phẩm, Tin tức, Showroom...)
│   │   ├── (policies)/           # Các trang chính sách (Đổi trả, vận chuyển, FAQs)
│   │   ├── (shop)/               # Giỏ hàng, Thanh toán, kết quả đặt hàng
│   │   ├── (user)/               # Tài khoản, đơn hàng của khách hàng (guard RequireCustomerAuth)
│   │   ├── globals.css           # Cấu hình Tailwind v4 và các biến màu CSS
│   │   └── layout.js             # Root layout của toàn bộ ứng dụng
│   ├── assets/                   # Hình ảnh đi kèm mã nguồn (không nằm trong public/)
│   ├── features/
│   │   ├── admin/                # CMS — giữ nguyên PascalCase nội bộ (quyết định phạm vi P6, xem §5)
│   │   ├── auth/                 # customer-api.js, RequireCustomerAuth, form đăng nhập/đăng ký
│   │   ├── cart/                 # cart-view.jsx, cart-service.js, cart-view-model.js, cart-auth-bridge.jsx
│   │   ├── checkout/             # checkout-view.jsx, order-result-view.jsx, coupon-service.js,
│   │   │                         # shipping-service.js, use-idempotency-key.js, components/
│   │   ├── orders/               # orders-view.jsx, order-detail-view.jsx, order-service.js, components/
│   │   ├── account/              # profile-view.jsx, components/ (CustomerServiceLayout...)
│   │   └── storefront/           # home, products, news, showroom, gallery, contact, faq, about,
│   │                             # factory, altar-customizer, policies — mỗi domain 1 thư mục
│   │                             # (<domain>-view.jsx + components/)
│   └── shared/
│       ├── api/                  # api-client.js (session-aware), admin-api.js, public-api.js,
│       │                         # api-enums.js, media.js, media-upload.js
│       ├── components/           # header, footer, safe-image, product-card... + admin/ (DataTable,
│       │                         # Pagination, FormField...) + blocks/ (renderer + editor) + seo/
│       ├── stores/               # admin-auth-store.js, customer-auth-store.js, cart-store.js,
│       │                         # confirm-store.js
│       ├── utils/                # feedback.js, routes.js, product-card.js
│       ├── hooks/                # use-debounced-callback.js, use-featured-product-cards.js
│       └── lib/seo/              # page-by-key.js, schemas.js, site-config.js
```

---

## 2. Nguyên tắc phân lớp `app/` → `features/` → `shared/`

1.  **`src/app/` (Routing thuần):** chỉ `page.jsx`/`layout.js` — metadata, SSR fetch nếu có, import
    component top-level của feature tương ứng (`@/features/**`). Không viết logic JSX/CSS trực tiếp.
2.  **`src/features/<domain>/`:** chứa view hoàn chỉnh của tính năng (component top-level cùng tên
    feature, ví dụ `features/cart/cart-view.jsx`), service gọi API riêng của tính năng, và
    `components/` nội bộ. Một feature **không** import thẳng vào `components/` nội bộ của feature khác —
    tái sử dụng chéo phải qua `shared/components/*` hoặc qua bề mặt export public của feature kia.
3.  **`src/shared/`:** primitive xuyên-tính-năng (API client, store, UI atom dùng chung, hằng số, hook).
    **Nguyên tắc một chiều:** `features/*` được import `shared/*` tự do; `shared/*` **không được** import
    ngược lại `features/*`. *(Ngoại lệ tồn tại từ trước lần tái cấu trúc: `shared/components/public-layout.jsx`
    và `shared/stores/cart-store.js` vẫn import `features/cart/*` — nợ kỹ thuật có từ giai đoạn xây
    server-synced cart, chưa xử lý vì tách đúng đòi hỏi đổi code chứ không chỉ đổi vị trí file.)*

---

## 3. Hệ thống Store Zustand toàn cục

4 store Zustand chính, tất cả nằm trong `src/shared/stores/`:

### A. Giỏ hàng (`cart-store.js`)
*   **2 chế độ (`mode: "guest" | "server"`):** khách chưa đăng nhập lưu local (`persist` →
    `localStorage`, `productId` số thật); đăng nhập xong tự merge giỏ khách vào giỏ server
    (`mergeGuestCartToServer`, khoá bằng Web Locks API + cờ localStorage, idempotent/an toàn đa tab), sau
    đó mọi thao tác gọi thẳng `/api/cart/*` rồi đồng bộ lại toàn bộ từ response server
    (`hydrateFromServer`) — không tự tính lại số lượng/tổng tiền ở client khi đã ở chế độ `server`.
*   **Actions chính:** `addToCart(product, qty)`, `updateLineQuantity(id, qty)`, `removeLine(id)`,
    `clearAllItems()` (mode-aware — tự route vào reducer guest hay gọi API server); `totalCount()` &
    `subtotal()` (mode-aware). UI đọc qua `features/cart/cart-view-model.js`'s `toCartLineVMList(items,
    mode)` để không cần biết đang ở chế độ nào.

### B. Hộp thoại xác nhận (`confirm-store.js`)
*   **Chức năng:** Cung cấp cơ chế mở hộp thoại xác nhận (Confirm Dialog) dạng Promise giúp viết code đồng bộ gọn gàng.
*   **Cách sử dụng:**
    ```javascript
    import { confirm } from "@/shared/utils/feedback";
    const ok = await confirm({
      title: "Xóa sản phẩm?",
      description: "Hành động này không thể hoàn tác.",
      destructive: true
    });
    if (ok) { // Thực hiện xóa }
    ```

### C. Xác thực admin (`admin-auth-store.js`)
*   **Chức năng:** Quản lý phiên JWT (access token) của ADMIN/SUPERADMIN. Refresh token nằm trong cookie
    `httpOnly` (không phải localStorage) kể từ khi rewire sang cookie-based auth — chỉ `accessToken`/`user`
    được `persist` vào `localStorage`.
*   **Thuộc tính:** `user`, `accessToken`, `status` (`idle`, `loading`, `authenticated`, `forbidden`,
    `unauthenticated`), `error`.
*   **Actions:** `login(usernameOrEmail, password)`, `logout()`, `loadCurrentUser()` (hydrate qua
    `GET /auth/me`), `isAdmin()`.

### D. Xác thực khách hàng (`customer-auth-store.js`)
*   **Chức năng:** Phiên JWT độc lập cho CUSTOMER — cùng cơ chế cookie-refresh với admin nhưng
    `refreshPromise`/khoá `persist` riêng biệt, không đụng phiên admin dù mở cùng trình duyệt.
*   **Actions:** `login`, `register`, `loginWithGoogle` (chỉ bật khi có
    `NEXT_PUBLIC_GOOGLE_CLIENT_ID`), `logout`, `loadCurrentUser()`, `changePassword({oldPassword,
    newPassword})`.
*   Được tiêu thụ bởi `features/auth/RequireCustomerAuth.jsx` (guard cho route group `(user)` + thanh
    toán) và `features/cart/cart-auth-bridge.jsx` (kích hoạt merge giỏ hàng khi trạng thái đổi).

---

## 4. Các tiện ích cốt lõi (Core Utilities)

*   `src/shared/utils/routes.js`: Định nghĩa đối tượng hằng số `ROUTES` duy nhất chứa toàn bộ các đường
    dẫn trong hệ thống (bao gồm cả route dạng hàm tham số hoá như `ROUTES.CHECKOUT_RESULT(orderId)`,
    `ROUTES.ORDER_DETAIL(orderId)`). Việc dùng `ROUTES.HOME` thay vì viết cứng `"/"` giúp đảm bảo tính
    nhất quán và dễ bảo trì khi cấu trúc URL thay đổi.
*   `src/shared/api/api-client.js`: fetch client dùng chung, **session-aware** — nhận một Zustand store
    (`admin-auth-store` hoặc `customer-auth-store`) làm tham số để biết đính token/refresh của phiên nào.
    Envelope thật `{code,message,data}`, `PageResponse` 1-based. Tự đính `Authorization: Bearer`, tự
    refresh-on-401 (single-flight per phiên), ném lỗi kèm `status`/`code`/`data` (validation map cho lỗi
    `4001`).
*   `src/shared/api/admin-api.js` (`adminApi`) và `src/features/auth/customer-api.js` (`customerApi`):
    hai binding mỏng của `api-client.js` — cùng method-surface (`.get/.post/.put/.patch/.delete`), khác
    session.
*   `src/shared/api/public-api.js` (`publicGet`/`publicPost`): gọi endpoint công khai (catalog, banner,
    coupon-validate, shipping-methods...) — không đính token, không tự refresh.
*   `src/shared/api/api-enums.js`: hằng số enum thật của backend (role, product type/status, order/payment
    status, payment method, discount type, banner position, contact status) kèm nhãn tiếng Việt.
*   `src/shared/api/media-upload.js`: wrapper `uploadOne`/`uploadMany` cho `/media/upload` và
    `/media/upload-multiple` (MinIO), validate ảnh ≤10MB trước khi gửi.

### Admin CMS — kiến trúc rewire

Xem chi tiết tại `docs/admin-ui-architecture.md`. Tóm tắt:
*   `src/shared/components/admin/inputs/` — bộ rich-input dùng chung: `SearchableSelect` (downshift),
    `DatePicker` (react-day-picker), `ImageUploader`/`ImageField` (react-dropzone),
    `SortableImageGallery`/`SortableList` (@dnd-kit), `BlockContentEditor` (Editor.js, nằm dưới
    `shared/components/blocks/editor/` — xem §5).
*   `src/features/admin/AdminResourceManager.jsx` — engine CRUD chung (server-side paging/sort/filter,
    `PUT` partial update, validation-map rendering) dùng cho các resource "phẳng" khai báo trong
    `src/features/admin/adminResources.js` (bao gồm `shippingMethods` từ đợt tích hợp checkout).
*   Products, Orders, Dashboard có trang tùy biến riêng dưới `src/features/admin/{products,orders,dashboard}/`
    vì nghiệp vụ (gallery reorder, snapshot items, charts) vượt quá khả năng của engine chung.
*   Users không có generic PUT/DELETE ở backend — `src/features/admin/users/UsersAdminPage.jsx` chỉ
    hỗ trợ đổi vai trò (SUPERADMIN) và reset mật khẩu.

## 5. Quyết định phạm vi tái cấu trúc (Phase 6)

*   **`features/admin/**` giữ PascalCase**, không đổi kebab-case như phần còn lại của repo — quyết định
    có chủ đích: admin đã đúng vị trí/hình dạng feature-based từ trước, và đây là bề mặt lưu lượng/rủi ro
    cao nhất (CMS resource manager, kéo-thả gallery, combo builder). Đổi tên hàng loạt ở đây có tỷ lệ
    rủi ro/giá-trị cao nhất trong khi mục tiêu của lần tái cấu trúc là dọn cấu trúc thư mục, không phải
    ép chuẩn code-style. Có thể làm riêng ở một đợt dọn dẹp hẹp phạm vi sau này nếu cần nhất quán tuyệt
    đối.
*   **Block editor** (`BlockBuilder` + `AddBlockMenu`/`BlockBuilderRow`/editor con) nằm dưới
    `shared/components/blocks/editor/*` thay vì `features/admin/*` như đề xuất ban đầu — vì
    `shared/components/admin/form-field.jsx` (một atom dùng chung đúng nghĩa) import thẳng block editor;
    đặt editor dưới `features/admin/` sẽ tạo vi phạm `shared → features` (xem §2). Renderer đọc-side
    (`block-renderer.jsx` + `renderers/*`) vẫn ở `shared/components/blocks/` vì storefront (`news-detail`,
    `product-detail`) cũng render CMS content.