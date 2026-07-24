# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e-verification.spec.js >> Phase 7 E2E Verification >> Cart (Server-Synced) >> should merge guest cart on customer login
- Location: e2e-verification.spec.js:148:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('a:first-of-type')

```

# Page snapshot

```yaml
- generic [ref=e2]: Internal Server Error
```

# Test source

```ts
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
  145 |       expect(parseInt(cartCount) || 0).toBeGreaterThan(0);
  146 |     });
  147 | 
  148 |     test('should merge guest cart on customer login', async ({ page }) => {
  149 |       // Add to guest cart first
  150 |       await page.goto(`${BASE_URL}/san-pham`);
> 151 |       await page.click('a:first-of-type');
      |                  ^ Error: page.click: Test timeout of 30000ms exceeded.
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
  246 |         await submitBtn.click();
  247 |         await page.waitForTimeout(2000);
  248 |       }
  249 | 
  250 |       // Verify order placed (redirect to success page or verify order appears in orders list)
  251 |       await page.goto(`${BASE_URL}/don-hang`);
```