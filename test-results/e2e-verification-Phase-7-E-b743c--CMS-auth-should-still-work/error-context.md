# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e-verification.spec.js >> Phase 7 E2E Verification >> Auth (BE-1) >> REGRESSION GATE - Admin CMS auth should still work
- Location: e2e-verification.spec.js:100:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[name="username"]')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - heading "404" [level=1] [ref=e4]
    - heading "This page could not be found." [level=2] [ref=e6]
  - button "Open Next.js Dev Tools" [ref=e12] [cursor=pointer]:
    - img [ref=e13]
  - alert [ref=e16]
```

# Test source

```ts
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
  36  |       await page.fill('input[name="confirmPassword"]', testUser.password);
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
> 104 |       await page.fill('input[name="username"]', adminUser.username);
      |                  ^ Error: page.fill: Test timeout of 30000ms exceeded.
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
```