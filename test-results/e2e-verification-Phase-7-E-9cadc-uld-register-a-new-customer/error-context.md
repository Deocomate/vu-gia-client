# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e-verification.spec.js >> Phase 7 E2E Verification >> Auth (BE-1) >> should register a new customer
- Location: e2e-verification.spec.js:29:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[name="confirmPassword"]')

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - link "Gốm Sứ Vũ Gia" [ref=e4] [cursor=pointer]:
        - /url: /
        - img "Gốm Sứ Vũ Gia" [ref=e5]
      - navigation [ref=e6]:
        - link "Trang chủ" [ref=e7] [cursor=pointer]:
          - /url: /
        - link "Về chúng tôi" [ref=e8] [cursor=pointer]:
          - /url: /ve-chung-toi
        - link "Sản phẩm" [ref=e10] [cursor=pointer]:
          - /url: /san-pham
        - link "Thưởng lãm" [ref=e11] [cursor=pointer]:
          - /url: /thu-vien-hinh-anh
        - link "Tin tức" [ref=e12] [cursor=pointer]:
          - /url: /tin-tuc
        - link "Liên hệ" [ref=e13] [cursor=pointer]:
          - /url: /lien-he
      - generic [ref=e14]:
        - button "Tìm kiếm" [ref=e15]:
          - img "Search" [ref=e16]
        - link "Đăng nhập" [ref=e17] [cursor=pointer]:
          - /url: /dang-nhap
          - img "User" [ref=e18]
        - link "Giỏ hàng" [ref=e19] [cursor=pointer]:
          - /url: /gio-hang
          - img "Cart" [ref=e20]
  - main [ref=e21]:
    - generic [ref=e22]:
      - heading "Đăng ký" [level=1] [ref=e23]
      - paragraph [ref=e24]: Tạo tài khoản để theo dõi đơn hàng và mua sắm nhanh hơn.
      - generic [ref=e25]:
        - generic [ref=e26]:
          - generic [ref=e27]: Tên đăng nhập
          - textbox "Tên đăng nhập" [ref=e28]: testuser_1784864846108
        - generic [ref=e29]:
          - generic [ref=e30]: Email
          - textbox "Email" [ref=e31]: test_1784864846108@example.com
        - generic [ref=e32]:
          - generic [ref=e33]: Mật khẩu
          - textbox "Mật khẩu" [active] [ref=e34]: TestPass123!@#
        - generic [ref=e35]:
          - generic [ref=e36]: Họ tên (không bắt buộc)
          - textbox "Họ tên (không bắt buộc)" [ref=e37]
        - generic [ref=e38]:
          - generic [ref=e39]: Số điện thoại (không bắt buộc)
          - textbox "Số điện thoại (không bắt buộc)" [ref=e40]
        - button "Đăng ký" [ref=e41] [cursor=pointer]
      - paragraph [ref=e42]:
        - text: Đã có tài khoản?
        - link "Đăng nhập" [ref=e43] [cursor=pointer]:
          - /url: /dang-nhap?next=%2Ftai-khoan
  - contentinfo [ref=e44]:
    - generic [ref=e46]:
      - generic [ref=e47]:
        - link "Gốm Sứ Vũ Gia" [ref=e48] [cursor=pointer]:
          - /url: /
          - img "Gốm Sứ Vũ Gia" [ref=e49]
        - generic [ref=e50]:
          - generic [ref=e51]: Thanh hai
          - generic [ref=e52]: CO., LTD
        - list [ref=e53]:
          - listitem [ref=e54]:
            - img "Location" [ref=e55]
            - generic [ref=e56]: 18 Giang Cao, Bát Tràng
          - listitem [ref=e57]:
            - img "Email" [ref=e58]
            - generic [ref=e59]: gomvugia@gmail.com
          - listitem [ref=e60]:
            - img "Phone" [ref=e61]
            - generic [ref=e62]: 091 7777 247
      - generic [ref=e63]:
        - generic [ref=e64]:
          - generic [ref=e65]:
            - heading "Để lại thông tin tư vấn" [level=3] [ref=e66]
            - generic [ref=e67]:
              - textbox "Email của bạn" [ref=e68]
              - button "Gửi" [ref=e69]
            - img "Đã thông báo Bộ Công Thương" [ref=e71]
          - generic [ref=e72]:
            - generic [ref=e73]:
              - heading "Tổng quan" [level=3] [ref=e74]
              - list [ref=e75]:
                - listitem [ref=e76]:
                  - link "Về chúng tôi" [ref=e77] [cursor=pointer]:
                    - /url: /ve-chung-toi
                - listitem [ref=e78]:
                  - link "Nhà xưởng" [ref=e79] [cursor=pointer]:
                    - /url: /nha-xuong
                - listitem [ref=e80]:
                  - link "Thưởng lãm" [ref=e81] [cursor=pointer]:
                    - /url: /thu-vien-hinh-anh
                - listitem [ref=e82]:
                  - link "Liên hệ" [ref=e83] [cursor=pointer]:
                    - /url: /lien-he
            - generic [ref=e84]:
              - heading "Dịch vụ" [level=3] [ref=e85]
              - list [ref=e86]:
                - listitem [ref=e87]:
                  - link "Tài khoản" [ref=e88] [cursor=pointer]:
                    - /url: /tai-khoan
                - listitem [ref=e89]:
                  - link "Chính sách vận chuyển" [ref=e90] [cursor=pointer]:
                    - /url: /chinh-sach-van-chuyen
                - listitem [ref=e91]:
                  - link "Tra cứu đơn hàng" [ref=e92] [cursor=pointer]:
                    - /url: /tai-khoan/don-hang
                - listitem [ref=e93]:
                  - link "FAQ" [ref=e94] [cursor=pointer]:
                    - /url: /cau-hoi-thuong-gap
            - generic [ref=e95]:
              - heading "Sản phẩm" [level=3] [ref=e96]
              - list [ref=e97]:
                - listitem [ref=e98]:
                  - link "Danh sách sản phẩm" [ref=e99] [cursor=pointer]:
                    - /url: /san-pham
        - generic [ref=e101]:
          - paragraph [ref=e102]: Copyright © 2026 . All rights reserved
          - generic [ref=e103]: "|"
          - link "Điều khoản dịch vụ" [ref=e104] [cursor=pointer]:
            - /url: /chinh-sach-van-chuyen
          - generic [ref=e105]: "|"
          - link "Chính sách bảo mật" [ref=e106] [cursor=pointer]:
            - /url: /bao-mat-thong-tin
          - generic [ref=e107]: "|"
          - link "Quy định chung" [ref=e108] [cursor=pointer]:
            - /url: /chinh-sach-doi-tra
  - link "Tự tạo bộ đồ thờ" [ref=e110] [cursor=pointer]:
    - /url: /tuy-chinh-bo-do-tho
    - img [ref=e111]
    - generic [ref=e115]:
      - generic [ref=e116]: Chưa tìm thấy mẫu ưng ý?
      - generic [ref=e117]: Tự tạo bộ đồ thờ
  - region "Notifications alt+T"
  - button "Open Next.js Dev Tools" [ref=e123] [cursor=pointer]:
    - img [ref=e124]
  - alert [ref=e127]
```

# Test source

```ts
  1   | // Phase 7 E2E Verification Suite
  2   | // Tests: Auth, Cart, Checkout (COD+ONL), Coupon, Orders, Profile, Guards
  3   | 
  4   | const { test, expect } = require('@playwright/test');
  5   | 
  6   | const BASE_URL = 'http://localhost:3000';
  7   | const API_URL = 'http://localhost:8080/api';
  8   | 
  9   | // Test data
  10  | const testUser = {
  11  |   username: `testuser_${Date.now()}`,
  12  |   email: `test_${Date.now()}@example.com`,
  13  |   password: 'TestPass123!@#',
  14  |   phone: '0912345678',
  15  |   gender: 'MALE',
  16  |   birthYear: 1990,
  17  | };
  18  | 
  19  | const adminUser = {
  20  |   username: 'admin',
  21  |   password: 'admin123',
  22  | };
  23  | 
  24  | test.describe('Phase 7 E2E Verification', () => {
  25  |   // ============================================================================
  26  |   // 1. AUTH (BE-1) - Customer register, login, cookie refresh, logout
  27  |   // ============================================================================
  28  |   test.describe('Auth (BE-1)', () => {
  29  |     test('should register a new customer', async ({ page }) => {
  30  |       await page.goto(`${BASE_URL}/dang-ky`);
  31  | 
  32  |       // Fill registration form
  33  |       await page.fill('input[name="username"]', testUser.username);
  34  |       await page.fill('input[name="email"]', testUser.email);
  35  |       await page.fill('input[name="password"]', testUser.password);
> 36  |       await page.fill('input[name="confirmPassword"]', testUser.password);
      |                  ^ Error: page.fill: Test timeout of 30000ms exceeded.
  37  |       await page.fill('input[name="phone"]', testUser.phone);
  38  | 
  39  |       // Submit
  40  |       await page.click('button[type="submit"]');
  41  | 
  42  |       // Verify redirect to login or success message
  43  |       await page.waitForTimeout(2000);
  44  |       const url = page.url();
  45  |       expect(url).toContain('dang-nhap');
  46  |     });
  47  | 
  48  |     test('should login with username and httpOnly cookie', async ({ page }) => {
  49  |       await page.goto(`${BASE_URL}/dang-nhap`);
  50  | 
  51  |       // Fill login form
  52  |       await page.fill('input[name="username"]', testUser.username);
  53  |       await page.fill('input[name="password"]', testUser.password);
  54  | 
  55  |       // Submit
  56  |       await page.click('button[type="submit"]');
  57  | 
  58  |       // Wait for navigation to dashboard/home
  59  |       await page.waitForTimeout(2000);
  60  |       const url = page.url();
  61  | 
  62  |       // Verify login success (redirect away from login page)
  63  |       expect(url).not.toContain('dang-nhap');
  64  | 
  65  |       // Verify httpOnly cookie was set (cannot access via JS, but we can verify it's there via API)
  66  |       const authCookie = await page.context().cookies();
  67  |       const hasAuthCookie = authCookie.some(c =>
  68  |         c.name.toLowerCase().includes('auth') ||
  69  |         c.name.toLowerCase().includes('refresh') ||
  70  |         c.name.toLowerCase().includes('token')
  71  |       );
  72  |       console.log(`Auth cookie set: ${hasAuthCookie}. Cookies: ${authCookie.map(c => c.name).join(', ')}`);
  73  |     });
  74  | 
  75  |     test('should logout and clear cookie', async ({ page }) => {
  76  |       // First login
  77  |       await page.goto(`${BASE_URL}/dang-nhap`);
  78  |       await page.fill('input[name="username"]', testUser.username);
  79  |       await page.fill('input[name="password"]', testUser.password);
  80  |       await page.click('button[type="submit"]');
  81  |       await page.waitForTimeout(2000);
  82  | 
  83  |       // Find and click logout button (usually in profile/account dropdown)
  84  |       const profileButton = page.locator('[data-testid="profile-menu"], button:has-text("Tài khoản"), button:has-text("Profile")').first();
  85  |       if (await profileButton.isVisible({ timeout: 5000 }).catch(() => false)) {
  86  |         await profileButton.click();
  87  |         await page.click('text=/Đăng xuất|Logout/i');
  88  |       } else {
  89  |         // Fallback: navigate to logout endpoint if it exists
  90  |         await page.goto(`${BASE_URL}/dang-xuat`);
  91  |       }
  92  | 
  93  |       await page.waitForTimeout(2000);
  94  | 
  95  |       // Verify redirect to home or login
  96  |       const url = page.url();
  97  |       expect(url).toContain('localhost:3000');
  98  |     });
  99  | 
  100 |     test('REGRESSION GATE - Admin CMS auth should still work', async ({ page }) => {
  101 |       await page.goto(`${BASE_URL}/admin/dang-nhap`);
  102 | 
  103 |       // Admin login
  104 |       await page.fill('input[name="username"]', adminUser.username);
  105 |       await page.fill('input[name="password"]', adminUser.password);
  106 |       await page.click('button[type="submit"]');
  107 | 
  108 |       await page.waitForTimeout(2000);
  109 | 
  110 |       // Verify admin dashboard access
  111 |       const url = page.url();
  112 |       expect(url).toContain('/admin');
  113 |       expect(url).not.toContain('dang-nhap');
  114 |     });
  115 |   });
  116 | 
  117 |   // ============================================================================
  118 |   // 2. CART - Guest add, merge on login, authenticated CRUD, persistence
  119 |   // ============================================================================
  120 |   test.describe('Cart (Server-Synced)', () => {
  121 |     test('should add product to guest cart', async ({ page }) => {
  122 |       await page.goto(`${BASE_URL}/san-pham`);
  123 | 
  124 |       // Pick first product card
  125 |       const productCard = page.locator('[data-testid="product-card"], .product-card').first();
  126 |       if (await productCard.isVisible()) {
  127 |         await productCard.click();
  128 |       } else {
  129 |         // Fallback: get first product link
  130 |         await page.click('a:has-text("Bát")');
  131 |       }
  132 | 
  133 |       await page.waitForTimeout(1000);
  134 | 
  135 |       // Click add to cart
  136 |       const addButton = page.locator('button:has-text("Thêm vào giỏ"), button:has-text("Add to cart"), [data-testid="add-to-cart"]').first();
```