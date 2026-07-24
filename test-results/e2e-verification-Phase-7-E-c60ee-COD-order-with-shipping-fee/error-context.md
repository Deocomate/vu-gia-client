# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e-verification.spec.js >> Phase 7 E2E Verification >> Checkout COD (BE-2 Shipping) >> should place COD order with shipping fee
- Location: e2e-verification.spec.js:195:5

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

# Page snapshot

```yaml
- generic [ref=e2]: Internal Server Error
```

# Test source

```ts
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
  252 |       const orders = page.locator('[data-testid="order-item"], .order-item');
  253 |       const orderCount = await orders.count();
  254 |       console.log(`Orders found: ${orderCount}`);
> 255 |       expect(orderCount).toBeGreaterThan(0);
      |                          ^ Error: expect(received).toBeGreaterThan(expected)
  256 |     });
  257 |   });
  258 | 
  259 |   // ============================================================================
  260 |   // 4. CHECKOUT ONL - Place order, render VietQR, webhook to PAID
  261 |   // ============================================================================
  262 |   test.describe('Checkout ONL (VietQR + Webhook)', () => {
  263 |     test('should place ONL order and render VietQR', async ({ page }) => {
  264 |       await page.goto(`${BASE_URL}/thanh-toan`);
  265 |       await page.waitForTimeout(1500);
  266 | 
  267 |       // Fill form (reuse previous form logic)
  268 |       const nameField = page.locator('input[name="name"], input[name="fullName"], input[placeholder*="Họ tên"]').first();
  269 |       if (await nameField.isVisible({ timeout: 1000 }).catch(() => false)) {
  270 |         await nameField.fill('Test Customer ONL');
  271 |       }
  272 | 
  273 |       const phoneField = page.locator('input[name="phone"], input[placeholder*="Số điện thoại"]').first();
  274 |       if (await phoneField.isVisible({ timeout: 1000 }).catch(() => false)) {
  275 |         await phoneField.fill(testUser.phone);
  276 |       }
  277 | 
  278 |       const addressField = page.locator('input[name="address"], textarea[name="address"], input[placeholder*="Địa chỉ"]').first();
  279 |       if (await addressField.isVisible({ timeout: 1000 }).catch(() => false)) {
  280 |         await addressField.fill('456 ONL Test Street, ONL City');
  281 |       }
  282 | 
  283 |       // Select ONL payment
  284 |       const onlOption = page.locator('input[value="ONL"], label:has-text("ONL"), label:has-text("Chuyển khoản"), label:has-text("Ngân hàng"), label:has-text("VietQR")').first();
  285 |       if (await onlOption.isVisible({ timeout: 1000 }).catch(() => false)) {
  286 |         await onlOption.click();
  287 |         await page.waitForTimeout(500);
  288 |       }
  289 | 
  290 |       // Submit
  291 |       const submitBtn = page.locator('button:has-text("Đặt hàng"), button:has-text("Place Order"), button:has-text("Xác nhận")').first();
  292 |       if (await submitBtn.isVisible()) {
  293 |         await submitBtn.click();
  294 |         await page.waitForTimeout(2000);
  295 |       }
  296 | 
  297 |       // Verify VietQR or payment page renders
  298 |       const qrCode = page.locator('img[src*="qr"], img[src*="vietnam"], [data-testid="qr-code"], canvas').first();
  299 |       const qrVisible = await qrCode.isVisible({ timeout: 3000 }).catch(() => false);
  300 |       console.log(`VietQR visible: ${qrVisible}`);
  301 | 
  302 |       // Extract order ID from URL or page
  303 |       const orderIdMatch = page.url().match(/\/don-hang\/([^\/]+)/);
  304 |       const orderId = orderIdMatch ? orderIdMatch[1] : null;
  305 |       console.log(`Order ID detected: ${orderId}`);
  306 |     });
  307 |   });
  308 | 
  309 |   // ============================================================================
  310 |   // 5. COUPON - Valid code, invalid code, preview
  311 |   // ============================================================================
  312 |   test.describe('Coupon Validation', () => {
  313 |     test('should validate coupon in cart', async ({ page }) => {
  314 |       await page.goto(`${BASE_URL}/gio-hang`);
  315 |       await page.waitForTimeout(1500);
  316 | 
  317 |       // Look for coupon input
  318 |       const couponInput = page.locator('input[name="coupon"], input[placeholder*="Mã giảm giá"], input[placeholder*="Coupon"]').first();
  319 |       if (await couponInput.isVisible({ timeout: 2000 }).catch(() => false)) {
  320 |         // Try valid coupon
  321 |         await couponInput.fill('VUGIA10');
  322 | 
  323 |         // Apply coupon
  324 |         const applyBtn = page.locator('button:has-text("Áp dụng"), button:has-text("Apply"), button:has-text("Dùng")').first();
  325 |         if (await applyBtn.isVisible()) {
  326 |           await applyBtn.click();
  327 |           await page.waitForTimeout(1500);
  328 |         }
  329 | 
  330 |         // Verify discount applied (check total changed, or success message)
  331 |         const discountText = page.locator('text=/Giảm|Discount|Tiết kiệm/').first();
  332 |         const isVisible = await discountText.isVisible({ timeout: 2000 }).catch(() => false);
  333 |         console.log(`Discount text visible: ${isVisible}`);
  334 |       }
  335 |     });
  336 | 
  337 |     test('should reject invalid coupon code', async ({ page }) => {
  338 |       await page.goto(`${BASE_URL}/gio-hang`);
  339 |       await page.waitForTimeout(1500);
  340 | 
  341 |       const couponInput = page.locator('input[name="coupon"], input[placeholder*="Mã giảm giá"]').first();
  342 |       if (await couponInput.isVisible({ timeout: 2000 }).catch(() => false)) {
  343 |         await couponInput.fill('INVALID123XYZ');
  344 | 
  345 |         const applyBtn = page.locator('button:has-text("Áp dụng"), button:has-text("Apply")').first();
  346 |         if (await applyBtn.isVisible()) {
  347 |           await applyBtn.click();
  348 |           await page.waitForTimeout(1500);
  349 |         }
  350 | 
  351 |         // Verify error message
  352 |         const errorText = page.locator('text=/không hợp lệ|invalid|không tìm thấy/i').first();
  353 |         const isVisible = await errorText.isVisible({ timeout: 2000 }).catch(() => false);
  354 |         console.log(`Error message visible: ${isVisible}`);
  355 |       }
```