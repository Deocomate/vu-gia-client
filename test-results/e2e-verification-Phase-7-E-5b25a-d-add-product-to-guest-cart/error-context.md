# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e-verification.spec.js >> Phase 7 E2E Verification >> Cart (Server-Synced) >> should add product to guest cart
- Location: e2e-verification.spec.js:121:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
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
      - generic [ref=e23]:
        - generic [ref=e24]:
          - generic [ref=e25]: Trang chủ / Sản phẩm / Sản phẩm
          - paragraph [ref=e26]: Sản phẩm không khả dụng.
        - heading "Mô tả sản phẩm" [level=2] [ref=e28]
      - generic [ref=e29]:
        - generic [ref=e31]:
          - img "Slide 1" [ref=e32]
          - button [ref=e33] [cursor=pointer]:
            - img [ref=e34]
          - button [ref=e36] [cursor=pointer]:
            - img [ref=e37]
          - generic [ref=e39]:
            - button [ref=e40] [cursor=pointer]
            - button [ref=e41] [cursor=pointer]
            - button [ref=e42] [cursor=pointer]
            - button [ref=e43] [cursor=pointer]
            - button [ref=e44] [cursor=pointer]
        - generic [ref=e45]:
          - heading "Công năng sản phẩm" [level=2] [ref=e46]
          - table [ref=e48]:
            - rowgroup [ref=e49]:
              - row "STT Tên vật phẩm Số lượng ĐVT Công dụng" [ref=e50]:
                - columnheader "STT" [ref=e51]
                - columnheader "Tên vật phẩm" [ref=e52]
                - columnheader "Số lượng" [ref=e53]
                - columnheader "ĐVT" [ref=e54]
                - columnheader "Công dụng" [ref=e55]
            - rowgroup [ref=e56]:
              - row "1 Bát hương 3 Chiếc Dùng cắm hương, thờ Thần linh - Gia tiên" [ref=e57]:
                - cell "1" [ref=e58]
                - cell "Bát hương" [ref=e59]
                - cell "3" [ref=e60]
                - cell "Chiếc" [ref=e61]
                - cell "Dùng cắm hương, thờ Thần linh - Gia tiên" [ref=e62]
              - row "Bát thờ 10 Chiếc Dùng dâng cơm trắng và lễ vật" [ref=e63]:
                - cell [ref=e64]
                - cell "Bát thờ" [ref=e65]
                - cell "10" [ref=e66]
                - cell "Chiếc" [ref=e67]
                - cell "Dùng dâng cơm trắng và lễ vật" [ref=e68]
              - row "3 Chóe thờ 3 Chiếc Dùng đựng gạo, muối và nước" [ref=e69]:
                - cell "3" [ref=e70]
                - cell "Chóe thờ" [ref=e71]
                - cell "3" [ref=e72]
                - cell "Chiếc" [ref=e73]
                - cell "Dùng đựng gạo, muối và nước" [ref=e74]
              - row "Bát sâm 1 - 2 Chiếc Dùng dâng nước, trà hoặc sâm" [ref=e75]:
                - cell [ref=e76]
                - cell "Bát sâm" [ref=e77]
                - cell "1 - 2" [ref=e78]
                - cell "Chiếc" [ref=e79]
                - cell "Dùng dâng nước, trà hoặc sâm" [ref=e80]
              - row "5 Bộ kỷ chén 3 hoặc 5 Chén Dùng đựng nước sạch hoặc rượu" [ref=e81]:
                - cell "5" [ref=e82]
                - cell "Bộ kỷ chén" [ref=e83]
                - cell "3 hoặc 5" [ref=e84]
                - cell "Chén" [ref=e85]
                - cell "Dùng đựng nước sạch hoặc rượu" [ref=e86]
              - row "6 Nậm rượu 1 - 2 Chiếc Dùng đựng và dâng rượu cúng" [ref=e87]:
                - cell "6" [ref=e88]
                - cell "Nậm rượu" [ref=e89]
                - cell "1 - 2" [ref=e90]
                - cell "Chiếc" [ref=e91]
                - cell "Dùng đựng và dâng rượu cúng" [ref=e92]
              - row "7 Bộ ấm chén thờ (1 ấm - 5 chén) 1 - 2 Bộ Dùng pha và dâng trà lên bàn thờ" [ref=e93]:
                - cell "7" [ref=e94]
                - cell "Bộ ấm chén thờ (1 ấm - 5 chén)" [ref=e95]
                - cell "1 - 2" [ref=e96]
                - cell "Bộ" [ref=e97]
                - cell "Dùng pha và dâng trà lên bàn thờ" [ref=e98]
              - row "8 Ống cắm hương 1 Chiếc Dùng cắm nhang chưa sử dụng" [ref=e99]:
                - cell "8" [ref=e100]
                - cell "Ống cắm hương" [ref=e101]
                - cell "1" [ref=e102]
                - cell "Chiếc" [ref=e103]
                - cell "Dùng cắm nhang chưa sử dụng" [ref=e104]
              - row "9 Mâm bồng 3 Chiếc Dùng bày hoa quả và lễ vật • Thông thường 1 chiếc to dùng để bày mâm ngũ quả vào ngày lễ • Ngày thường có thể bày 1 mâm bồng bé ở giữa hoặc vào giỗ lễ bày 2 mâm bé hai bên" [ref=e105]:
                - cell "9" [ref=e106]
                - cell "Mâm bồng" [ref=e107]
                - cell "3" [ref=e108]
                - cell "Chiếc" [ref=e109]
                - cell "Dùng bày hoa quả và lễ vật • Thông thường 1 chiếc to dùng để bày mâm ngũ quả vào ngày lễ • Ngày thường có thể bày 1 mâm bồng bé ở giữa hoặc vào giỗ lễ bày 2 mâm bé hai bên" [ref=e110]:
                  - generic [ref=e111]:
                    - generic [ref=e112]: Dùng bày hoa quả và lễ vật
                    - generic [ref=e113]:
                      - generic [ref=e114]: •
                      - generic [ref=e115]: Thông thường 1 chiếc to dùng để bày mâm ngũ quả vào ngày lễ
                    - generic [ref=e116]:
                      - generic [ref=e117]: •
                      - generic [ref=e118]: Ngày thường có thể bày 1 mâm bồng bé ở giữa hoặc vào giỗ lễ bày 2 mâm bé hai bên
              - row "10 Lọ hoa 2 Chiếc Dùng cắm hoa trang trí bàn thờ" [ref=e119]:
                - cell "10" [ref=e120]
                - cell "Lọ hoa" [ref=e121]
                - cell "2" [ref=e122]
                - cell "Chiếc" [ref=e123]
                - cell "Dùng cắm hoa trang trí bàn thờ" [ref=e124]
              - row "11 Đèn thờ 2 Chiếc Dùng thắp sáng và tạo sự trang nghiêm" [ref=e125]:
                - cell "11" [ref=e126]
                - cell "Đèn thờ" [ref=e127]
                - cell "2" [ref=e128]
                - cell "Chiếc" [ref=e129]
                - cell "Dùng thắp sáng và tạo sự trang nghiêm" [ref=e130]
              - row "12 Chân nến 2 Chiếc Dùng thắp sáng và tạo sự trang nghiêm" [ref=e131]:
                - cell "12" [ref=e132]
                - cell "Chân nến" [ref=e133]
                - cell "2" [ref=e134]
                - cell "Chiếc" [ref=e135]
                - cell "Dùng thắp sáng và tạo sự trang nghiêm" [ref=e136]
  - contentinfo [ref=e137]:
    - generic [ref=e139]:
      - generic [ref=e140]:
        - link "Gốm Sứ Vũ Gia" [ref=e141] [cursor=pointer]:
          - /url: /
          - img "Gốm Sứ Vũ Gia" [ref=e142]
        - generic [ref=e143]:
          - generic [ref=e144]: Thanh hai
          - generic [ref=e145]: CO., LTD
        - list [ref=e146]:
          - listitem [ref=e147]:
            - img "Location" [ref=e148]
            - generic [ref=e149]: 18 Giang Cao, Bát Tràng
          - listitem [ref=e150]:
            - img "Email" [ref=e151]
            - generic [ref=e152]: gomvugia@gmail.com
          - listitem [ref=e153]:
            - img "Phone" [ref=e154]
            - generic [ref=e155]: 091 7777 247
      - generic [ref=e156]:
        - generic [ref=e157]:
          - generic [ref=e158]:
            - heading "Để lại thông tin tư vấn" [level=3] [ref=e159]
            - generic [ref=e160]:
              - textbox "Email của bạn" [ref=e161]
              - button "Gửi" [ref=e162]
            - img "Đã thông báo Bộ Công Thương" [ref=e164]
          - generic [ref=e165]:
            - generic [ref=e166]:
              - heading "Tổng quan" [level=3] [ref=e167]
              - list [ref=e168]:
                - listitem [ref=e169]:
                  - link "Về chúng tôi" [ref=e170] [cursor=pointer]:
                    - /url: /ve-chung-toi
                - listitem [ref=e171]:
                  - link "Nhà xưởng" [ref=e172] [cursor=pointer]:
                    - /url: /nha-xuong
                - listitem [ref=e173]:
                  - link "Thưởng lãm" [ref=e174] [cursor=pointer]:
                    - /url: /thu-vien-hinh-anh
                - listitem [ref=e175]:
                  - link "Liên hệ" [ref=e176] [cursor=pointer]:
                    - /url: /lien-he
            - generic [ref=e177]:
              - heading "Dịch vụ" [level=3] [ref=e178]
              - list [ref=e179]:
                - listitem [ref=e180]:
                  - link "Tài khoản" [ref=e181] [cursor=pointer]:
                    - /url: /tai-khoan
                - listitem [ref=e182]:
                  - link "Chính sách vận chuyển" [ref=e183] [cursor=pointer]:
                    - /url: /chinh-sach-van-chuyen
                - listitem [ref=e184]:
                  - link "Tra cứu đơn hàng" [ref=e185] [cursor=pointer]:
                    - /url: /tai-khoan/don-hang
                - listitem [ref=e186]:
                  - link "FAQ" [ref=e187] [cursor=pointer]:
                    - /url: /cau-hoi-thuong-gap
            - generic [ref=e188]:
              - heading "Sản phẩm" [level=3] [ref=e189]
              - list [ref=e190]:
                - listitem [ref=e191]:
                  - link "Men lam" [ref=e192] [cursor=pointer]:
                    - /url: /san-pham?category=men-lam
                - listitem [ref=e193]:
                  - link "Men rạn" [ref=e194] [cursor=pointer]:
                    - /url: /san-pham?category=men-ran
                - listitem [ref=e195]:
                  - link "Men lam vẽ vàng" [ref=e196] [cursor=pointer]:
                    - /url: /san-pham?category=men-lam-ve-vang
                - listitem [ref=e197]:
                  - link "Men rạn dát vàng" [ref=e198] [cursor=pointer]:
                    - /url: /san-pham?category=men-ran-dat-vang
        - generic [ref=e200]:
          - paragraph [ref=e201]: Copyright © 2026 . All rights reserved
          - generic [ref=e202]: "|"
          - link "Điều khoản dịch vụ" [ref=e203] [cursor=pointer]:
            - /url: /chinh-sach-van-chuyen
          - generic [ref=e204]: "|"
          - link "Chính sách bảo mật" [ref=e205] [cursor=pointer]:
            - /url: /bao-mat-thong-tin
          - generic [ref=e206]: "|"
          - link "Quy định chung" [ref=e207] [cursor=pointer]:
            - /url: /chinh-sach-doi-tra
  - link "Tự tạo bộ đồ thờ" [ref=e209] [cursor=pointer]:
    - /url: /tuy-chinh-bo-do-tho
    - img [ref=e210]
    - generic [ref=e214]:
      - generic [ref=e215]: Chưa tìm thấy mẫu ưng ý?
      - generic [ref=e216]: Tự tạo bộ đồ thờ
  - region "Notifications alt+T"
  - generic [ref=e221] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=e222]:
      - img [ref=e223]
    - generic [ref=e226]:
      - button "Open issues overlay" [ref=e227]:
        - generic [ref=e228]:
          - generic [ref=e229]: "0"
          - generic [ref=e230]: "1"
        - generic [ref=e231]: Issue
      - button "Collapse issues badge" [ref=e232]:
        - img [ref=e233]
  - alert [ref=e235]: Sản phẩm không tồn tại | Gốm Sứ Vũ Gia
```

# Test source

```ts
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
  137 |       if (await addButton.isVisible()) {
  138 |         await addButton.click();
  139 |         await page.waitForTimeout(1500);
  140 |       }
  141 | 
  142 |       // Verify cart updated (toast, badge, or cart page)
  143 |       const cartBadge = page.locator('[data-testid="cart-badge"], .cart-badge').first();
  144 |       const cartCount = await cartBadge.textContent().catch(() => '0');
> 145 |       expect(parseInt(cartCount) || 0).toBeGreaterThan(0);
      |                                        ^ Error: expect(received).toBeGreaterThan(expected)
  146 |     });
  147 | 
  148 |     test('should merge guest cart on customer login', async ({ page }) => {
  149 |       // Add to guest cart first
  150 |       await page.goto(`${BASE_URL}/san-pham`);
  151 |       await page.click('a:first-of-type');
  152 |       await page.waitForTimeout(500);
  153 |       const addBtn = page.locator('button:has-text("Thêm vào")').first();
  154 |       if (await addBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
  155 |         await addBtn.click();
  156 |         await page.waitForTimeout(1000);
  157 |       }
  158 | 
  159 |       // Now login
  160 |       await page.goto(`${BASE_URL}/dang-nhap`);
  161 |       await page.fill('input[name="username"]', testUser.username);
  162 |       await page.fill('input[name="password"]', testUser.password);
  163 |       await page.click('button[type="submit"]');
  164 |       await page.waitForTimeout(2000);
  165 | 
  166 |       // Verify cart still has items (merge succeeded)
  167 |       await page.goto(`${BASE_URL}/gio-hang`);
  168 |       const cartItems = page.locator('[data-testid="cart-item"], .cart-item');
  169 |       const count = await cartItems.count();
  170 |       expect(count).toBeGreaterThan(0);
  171 |     });
  172 | 
  173 |     test('should persist cart on page reload', async ({ page, context }) => {
  174 |       // Assume user is logged in from previous test
  175 |       await page.goto(`${BASE_URL}/gio-hang`);
  176 | 
  177 |       const itemsBefore = await page.locator('[data-testid="cart-item"], .cart-item').count();
  178 |       console.log(`Items before reload: ${itemsBefore}`);
  179 | 
  180 |       // Reload page
  181 |       await page.reload();
  182 |       await page.waitForTimeout(1500);
  183 | 
  184 |       // Verify items still there
  185 |       const itemsAfter = await page.locator('[data-testid="cart-item"], .cart-item').count();
  186 |       console.log(`Items after reload: ${itemsAfter}`);
  187 |       expect(itemsAfter).toBe(itemsBefore);
  188 |     });
  189 |   });
  190 | 
  191 |   // ============================================================================
  192 |   // 3. CHECKOUT COD - Place order, verify shipping fee, verify total
  193 |   // ============================================================================
  194 |   test.describe('Checkout COD (BE-2 Shipping)', () => {
  195 |     test('should place COD order with shipping fee', async ({ page }) => {
  196 |       // Navigate to checkout
  197 |       await page.goto(`${BASE_URL}/gio-hang`);
  198 | 
  199 |       const checkoutBtn = page.locator('button:has-text("Thanh toán"), button:has-text("Checkout"), a:has-text("Thanh toán")').first();
  200 |       if (await checkoutBtn.isVisible()) {
  201 |         await checkoutBtn.click();
  202 |       } else {
  203 |         await page.goto(`${BASE_URL}/thanh-toan`);
  204 |       }
  205 | 
  206 |       await page.waitForTimeout(2000);
  207 | 
  208 |       // Verify shipping method select/radio exists (BE-2 requirement)
  209 |       const shippingSelect = page.locator('select[name="shippingMethodId"], [name*="shipping"], label:has-text("Vận chuyển"), label:has-text("Giao hàng")').first();
  210 |       if (await shippingSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
  211 |         // Select an express/paid shipping option if available
  212 |         await shippingSelect.click();
  213 |         // Pick non-free option if it exists
  214 |         const paidOption = page.locator('option:has-text("50"), option:has-text("Express"), option:not(:has-text("Miễn phí"))').first();
  215 |         if (await paidOption.isVisible({ timeout: 1000 }).catch(() => false)) {
  216 |           await paidOption.click();
  217 |         }
  218 |       }
  219 | 
  220 |       // Fill in checkout form if needed
  221 |       const nameField = page.locator('input[name="name"], input[name="fullName"], input[placeholder*="Họ tên"]').first();
  222 |       if (await nameField.isVisible({ timeout: 1000 }).catch(() => false)) {
  223 |         await nameField.fill('Test Customer');
  224 |       }
  225 | 
  226 |       const phoneField = page.locator('input[name="phone"], input[placeholder*="Số điện thoại"]').first();
  227 |       if (await phoneField.isVisible({ timeout: 1000 }).catch(() => false)) {
  228 |         await phoneField.fill(testUser.phone);
  229 |       }
  230 | 
  231 |       const addressField = page.locator('input[name="address"], textarea[name="address"], input[placeholder*="Địa chỉ"]').first();
  232 |       if (await addressField.isVisible({ timeout: 1000 }).catch(() => false)) {
  233 |         await addressField.fill('123 Test Street, Test City');
  234 |       }
  235 | 
  236 |       // Select COD payment
  237 |       const codOption = page.locator('input[value="COD"], label:has-text("COD"), label:has-text("Tiền mặt"), label:has-text("Thanh toán khi nhận hàng")').first();
  238 |       if (await codOption.isVisible({ timeout: 1000 }).catch(() => false)) {
  239 |         await codOption.click();
  240 |       }
  241 | 
  242 |       // Submit order
  243 |       await page.waitForTimeout(1000);
  244 |       const submitBtn = page.locator('button:has-text("Đặt hàng"), button:has-text("Place Order"), button:has-text("Xác nhận")').first();
  245 |       if (await submitBtn.isVisible()) {
```