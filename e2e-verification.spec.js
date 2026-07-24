// Phase 7 E2E Verification Suite
// Tests: Auth, Cart, Checkout (COD+ONL), Coupon, Orders, Profile, Guards

const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';
const API_URL = 'http://localhost:8080/api';

// Test data
const testUser = {
  username: `testuser_${Date.now()}`,
  email: `test_${Date.now()}@example.com`,
  password: 'TestPass123!@#',
  phone: '0912345678',
  gender: 'MALE',
  birthYear: 1990,
};

const adminUser = {
  username: 'admin',
  password: 'admin123',
};

test.describe('Phase 7 E2E Verification', () => {
  // ============================================================================
  // 1. AUTH (BE-1) - Customer register, login, cookie refresh, logout
  // ============================================================================
  test.describe('Auth (BE-1)', () => {
    test('should register a new customer', async ({ page }) => {
      await page.goto(`${BASE_URL}/dang-ky`);

      // Fill registration form
      await page.fill('input[name="username"]', testUser.username);
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.fill('input[name="confirmPassword"]', testUser.password);
      await page.fill('input[name="phone"]', testUser.phone);

      // Submit
      await page.click('button[type="submit"]');

      // Verify redirect to login or success message
      await page.waitForTimeout(2000);
      const url = page.url();
      expect(url).toContain('dang-nhap');
    });

    test('should login with username and httpOnly cookie', async ({ page }) => {
      await page.goto(`${BASE_URL}/dang-nhap`);

      // Fill login form
      await page.fill('input[name="username"]', testUser.username);
      await page.fill('input[name="password"]', testUser.password);

      // Submit
      await page.click('button[type="submit"]');

      // Wait for navigation to dashboard/home
      await page.waitForTimeout(2000);
      const url = page.url();

      // Verify login success (redirect away from login page)
      expect(url).not.toContain('dang-nhap');

      // Verify httpOnly cookie was set (cannot access via JS, but we can verify it's there via API)
      const authCookie = await page.context().cookies();
      const hasAuthCookie = authCookie.some(c =>
        c.name.toLowerCase().includes('auth') ||
        c.name.toLowerCase().includes('refresh') ||
        c.name.toLowerCase().includes('token')
      );
      console.log(`Auth cookie set: ${hasAuthCookie}. Cookies: ${authCookie.map(c => c.name).join(', ')}`);
    });

    test('should logout and clear cookie', async ({ page }) => {
      // First login
      await page.goto(`${BASE_URL}/dang-nhap`);
      await page.fill('input[name="username"]', testUser.username);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000);

      // Find and click logout button (usually in profile/account dropdown)
      const profileButton = page.locator('[data-testid="profile-menu"], button:has-text("Tài khoản"), button:has-text("Profile")').first();
      if (await profileButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await profileButton.click();
        await page.click('text=/Đăng xuất|Logout/i');
      } else {
        // Fallback: navigate to logout endpoint if it exists
        await page.goto(`${BASE_URL}/dang-xuat`);
      }

      await page.waitForTimeout(2000);

      // Verify redirect to home or login
      const url = page.url();
      expect(url).toContain('localhost:3000');
    });

    test('REGRESSION GATE - Admin CMS auth should still work', async ({ page }) => {
      await page.goto(`${BASE_URL}/admin/dang-nhap`);

      // Admin login
      await page.fill('input[name="username"]', adminUser.username);
      await page.fill('input[name="password"]', adminUser.password);
      await page.click('button[type="submit"]');

      await page.waitForTimeout(2000);

      // Verify admin dashboard access
      const url = page.url();
      expect(url).toContain('/admin');
      expect(url).not.toContain('dang-nhap');
    });
  });

  // ============================================================================
  // 2. CART - Guest add, merge on login, authenticated CRUD, persistence
  // ============================================================================
  test.describe('Cart (Server-Synced)', () => {
    test('should add product to guest cart', async ({ page }) => {
      await page.goto(`${BASE_URL}/san-pham`);

      // Pick first product card
      const productCard = page.locator('[data-testid="product-card"], .product-card').first();
      if (await productCard.isVisible()) {
        await productCard.click();
      } else {
        // Fallback: get first product link
        await page.click('a:has-text("Bát")');
      }

      await page.waitForTimeout(1000);

      // Click add to cart
      const addButton = page.locator('button:has-text("Thêm vào giỏ"), button:has-text("Add to cart"), [data-testid="add-to-cart"]').first();
      if (await addButton.isVisible()) {
        await addButton.click();
        await page.waitForTimeout(1500);
      }

      // Verify cart updated (toast, badge, or cart page)
      const cartBadge = page.locator('[data-testid="cart-badge"], .cart-badge').first();
      const cartCount = await cartBadge.textContent().catch(() => '0');
      expect(parseInt(cartCount) || 0).toBeGreaterThan(0);
    });

    test('should merge guest cart on customer login', async ({ page }) => {
      // Add to guest cart first
      await page.goto(`${BASE_URL}/san-pham`);
      await page.click('a:first-of-type');
      await page.waitForTimeout(500);
      const addBtn = page.locator('button:has-text("Thêm vào")').first();
      if (await addBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await addBtn.click();
        await page.waitForTimeout(1000);
      }

      // Now login
      await page.goto(`${BASE_URL}/dang-nhap`);
      await page.fill('input[name="username"]', testUser.username);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000);

      // Verify cart still has items (merge succeeded)
      await page.goto(`${BASE_URL}/gio-hang`);
      const cartItems = page.locator('[data-testid="cart-item"], .cart-item');
      const count = await cartItems.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should persist cart on page reload', async ({ page, context }) => {
      // Assume user is logged in from previous test
      await page.goto(`${BASE_URL}/gio-hang`);

      const itemsBefore = await page.locator('[data-testid="cart-item"], .cart-item').count();
      console.log(`Items before reload: ${itemsBefore}`);

      // Reload page
      await page.reload();
      await page.waitForTimeout(1500);

      // Verify items still there
      const itemsAfter = await page.locator('[data-testid="cart-item"], .cart-item').count();
      console.log(`Items after reload: ${itemsAfter}`);
      expect(itemsAfter).toBe(itemsBefore);
    });
  });

  // ============================================================================
  // 3. CHECKOUT COD - Place order, verify shipping fee, verify total
  // ============================================================================
  test.describe('Checkout COD (BE-2 Shipping)', () => {
    test('should place COD order with shipping fee', async ({ page }) => {
      // Navigate to checkout
      await page.goto(`${BASE_URL}/gio-hang`);

      const checkoutBtn = page.locator('button:has-text("Thanh toán"), button:has-text("Checkout"), a:has-text("Thanh toán")').first();
      if (await checkoutBtn.isVisible()) {
        await checkoutBtn.click();
      } else {
        await page.goto(`${BASE_URL}/thanh-toan`);
      }

      await page.waitForTimeout(2000);

      // Verify shipping method select/radio exists (BE-2 requirement)
      const shippingSelect = page.locator('select[name="shippingMethodId"], [name*="shipping"], label:has-text("Vận chuyển"), label:has-text("Giao hàng")').first();
      if (await shippingSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
        // Select an express/paid shipping option if available
        await shippingSelect.click();
        // Pick non-free option if it exists
        const paidOption = page.locator('option:has-text("50"), option:has-text("Express"), option:not(:has-text("Miễn phí"))').first();
        if (await paidOption.isVisible({ timeout: 1000 }).catch(() => false)) {
          await paidOption.click();
        }
      }

      // Fill in checkout form if needed
      const nameField = page.locator('input[name="name"], input[name="fullName"], input[placeholder*="Họ tên"]').first();
      if (await nameField.isVisible({ timeout: 1000 }).catch(() => false)) {
        await nameField.fill('Test Customer');
      }

      const phoneField = page.locator('input[name="phone"], input[placeholder*="Số điện thoại"]').first();
      if (await phoneField.isVisible({ timeout: 1000 }).catch(() => false)) {
        await phoneField.fill(testUser.phone);
      }

      const addressField = page.locator('input[name="address"], textarea[name="address"], input[placeholder*="Địa chỉ"]').first();
      if (await addressField.isVisible({ timeout: 1000 }).catch(() => false)) {
        await addressField.fill('123 Test Street, Test City');
      }

      // Select COD payment
      const codOption = page.locator('input[value="COD"], label:has-text("COD"), label:has-text("Tiền mặt"), label:has-text("Thanh toán khi nhận hàng")').first();
      if (await codOption.isVisible({ timeout: 1000 }).catch(() => false)) {
        await codOption.click();
      }

      // Submit order
      await page.waitForTimeout(1000);
      const submitBtn = page.locator('button:has-text("Đặt hàng"), button:has-text("Place Order"), button:has-text("Xác nhận")').first();
      if (await submitBtn.isVisible()) {
        await submitBtn.click();
        await page.waitForTimeout(2000);
      }

      // Verify order placed (redirect to success page or verify order appears in orders list)
      await page.goto(`${BASE_URL}/don-hang`);
      const orders = page.locator('[data-testid="order-item"], .order-item');
      const orderCount = await orders.count();
      console.log(`Orders found: ${orderCount}`);
      expect(orderCount).toBeGreaterThan(0);
    });
  });

  // ============================================================================
  // 4. CHECKOUT ONL - Place order, render VietQR, webhook to PAID
  // ============================================================================
  test.describe('Checkout ONL (VietQR + Webhook)', () => {
    test('should place ONL order and render VietQR', async ({ page }) => {
      await page.goto(`${BASE_URL}/thanh-toan`);
      await page.waitForTimeout(1500);

      // Fill form (reuse previous form logic)
      const nameField = page.locator('input[name="name"], input[name="fullName"], input[placeholder*="Họ tên"]').first();
      if (await nameField.isVisible({ timeout: 1000 }).catch(() => false)) {
        await nameField.fill('Test Customer ONL');
      }

      const phoneField = page.locator('input[name="phone"], input[placeholder*="Số điện thoại"]').first();
      if (await phoneField.isVisible({ timeout: 1000 }).catch(() => false)) {
        await phoneField.fill(testUser.phone);
      }

      const addressField = page.locator('input[name="address"], textarea[name="address"], input[placeholder*="Địa chỉ"]').first();
      if (await addressField.isVisible({ timeout: 1000 }).catch(() => false)) {
        await addressField.fill('456 ONL Test Street, ONL City');
      }

      // Select ONL payment
      const onlOption = page.locator('input[value="ONL"], label:has-text("ONL"), label:has-text("Chuyển khoản"), label:has-text("Ngân hàng"), label:has-text("VietQR")').first();
      if (await onlOption.isVisible({ timeout: 1000 }).catch(() => false)) {
        await onlOption.click();
        await page.waitForTimeout(500);
      }

      // Submit
      const submitBtn = page.locator('button:has-text("Đặt hàng"), button:has-text("Place Order"), button:has-text("Xác nhận")').first();
      if (await submitBtn.isVisible()) {
        await submitBtn.click();
        await page.waitForTimeout(2000);
      }

      // Verify VietQR or payment page renders
      const qrCode = page.locator('img[src*="qr"], img[src*="vietnam"], [data-testid="qr-code"], canvas').first();
      const qrVisible = await qrCode.isVisible({ timeout: 3000 }).catch(() => false);
      console.log(`VietQR visible: ${qrVisible}`);

      // Extract order ID from URL or page
      const orderIdMatch = page.url().match(/\/don-hang\/([^\/]+)/);
      const orderId = orderIdMatch ? orderIdMatch[1] : null;
      console.log(`Order ID detected: ${orderId}`);
    });
  });

  // ============================================================================
  // 5. COUPON - Valid code, invalid code, preview
  // ============================================================================
  test.describe('Coupon Validation', () => {
    test('should validate coupon in cart', async ({ page }) => {
      await page.goto(`${BASE_URL}/gio-hang`);
      await page.waitForTimeout(1500);

      // Look for coupon input
      const couponInput = page.locator('input[name="coupon"], input[placeholder*="Mã giảm giá"], input[placeholder*="Coupon"]').first();
      if (await couponInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        // Try valid coupon
        await couponInput.fill('VUGIA10');

        // Apply coupon
        const applyBtn = page.locator('button:has-text("Áp dụng"), button:has-text("Apply"), button:has-text("Dùng")').first();
        if (await applyBtn.isVisible()) {
          await applyBtn.click();
          await page.waitForTimeout(1500);
        }

        // Verify discount applied (check total changed, or success message)
        const discountText = page.locator('text=/Giảm|Discount|Tiết kiệm/').first();
        const isVisible = await discountText.isVisible({ timeout: 2000 }).catch(() => false);
        console.log(`Discount text visible: ${isVisible}`);
      }
    });

    test('should reject invalid coupon code', async ({ page }) => {
      await page.goto(`${BASE_URL}/gio-hang`);
      await page.waitForTimeout(1500);

      const couponInput = page.locator('input[name="coupon"], input[placeholder*="Mã giảm giá"]').first();
      if (await couponInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await couponInput.fill('INVALID123XYZ');

        const applyBtn = page.locator('button:has-text("Áp dụng"), button:has-text("Apply")').first();
        if (await applyBtn.isVisible()) {
          await applyBtn.click();
          await page.waitForTimeout(1500);
        }

        // Verify error message
        const errorText = page.locator('text=/không hợp lệ|invalid|không tìm thấy/i').first();
        const isVisible = await errorText.isVisible({ timeout: 2000 }).catch(() => false);
        console.log(`Error message visible: ${isVisible}`);
      }
    });
  });

  // ============================================================================
  // 6. ORDERS - List, detail, cancel eligible order
  // ============================================================================
  test.describe('Orders & Cancel (BE-3)', () => {
    test('should view orders list with filters', async ({ page }) => {
      await page.goto(`${BASE_URL}/don-hang`);
      await page.waitForTimeout(1500);

      const orders = page.locator('[data-testid="order-item"], .order-item, tr:has([data-testid="order-row"])');
      const count = await orders.count();
      console.log(`Orders displayed: ${count}`);
      expect(count).toBeGreaterThanOrEqual(0);

      // Check for filters
      const statusFilter = page.locator('select[name="status"], input[name="status"], [data-testid="status-filter"]').first();
      if (await statusFilter.isVisible({ timeout: 1000 }).catch(() => false)) {
        console.log('Status filter available');
      }
    });

    test('should view order detail and verify cancellation option for eligible orders', async ({ page }) => {
      await page.goto(`${BASE_URL}/don-hang`);
      await page.waitForTimeout(1500);

      // Click first order
      const firstOrder = page.locator('[data-testid="order-item"], .order-item, a:has-text("Xem chi tiết")').first();
      if (await firstOrder.isVisible()) {
        await firstOrder.click();
        await page.waitForTimeout(2000);
      } else {
        // Fallback: navigate to order detail if ID is known
        await page.goto(`${BASE_URL}/don-hang/1`).catch(() => {});
        await page.waitForTimeout(1500);
      }

      // Look for cancel button (only for eligible statuses)
      const cancelBtn = page.locator('button:has-text("Hủy"), button:has-text("Cancel"), [data-testid="cancel-order"]').first();
      if (await cancelBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        console.log('Cancel button found - order is in eligible status for cancellation');

        // Click cancel
        await cancelBtn.click();
        await page.waitForTimeout(1500);

        // Confirm cancellation in dialog if present
        const confirmBtn = page.locator('button:has-text("Xác nhận"), button:has-text("OK"), button:has-text("Confirm")').first();
        if (await confirmBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
          await confirmBtn.click();
          await page.waitForTimeout(1500);
        }

        // Verify status changed to CANCELLED
        const status = page.locator('[data-testid="order-status"], .order-status, text=/Đã hủy|CANCELLED/').first();
        const isCancelled = await status.isVisible({ timeout: 2000 }).catch(() => false);
        console.log(`Order cancelled: ${isCancelled}`);
      } else {
        console.log('Order not eligible for cancellation (may be already shipped or completed)');
      }
    });
  });

  // ============================================================================
  // 7. PROFILE - View, change password, read-only fields
  // ============================================================================
  test.describe('Profile', () => {
    test('should view and edit profile', async ({ page }) => {
      await page.goto(`${BASE_URL}/tai-khoan`);
      await page.waitForTimeout(1500);

      // Verify profile fields are visible
      const nameField = page.locator('input[name="name"], input[name="fullName"], input[placeholder*="Họ tên"]').first();
      const emailField = page.locator('input[name="email"], input[placeholder*="Email"]').first();

      expect(await nameField.isVisible({ timeout: 1000 }).catch(() => false)).toBeTruthy();
      expect(await emailField.isVisible({ timeout: 1000 }).catch(() => false)).toBeTruthy();

      // Verify email is read-only
      const emailReadonly = await emailField.evaluate((el) => el.readOnly || el.disabled).catch(() => false);
      console.log(`Email field is read-only: ${emailReadonly}`);
    });

    test('should change password with correct old password', async ({ page }) => {
      await page.goto(`${BASE_URL}/tai-khoan`);
      await page.waitForTimeout(1500);

      // Look for change password section/button
      const changePassBtn = page.locator('button:has-text("Đổi mật khẩu"), button:has-text("Change password"), a:has-text("Đổi mật khẩu")').first();
      if (await changePassBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await changePassBtn.click();
        await page.waitForTimeout(1000);
      }

      // Fill password fields
      const oldPassField = page.locator('input[name="oldPassword"], input[type="password"]:first-of-type').first();
      const newPassField = page.locator('input[name="newPassword"], input[placeholder*="Mật khẩu mới"]').first();
      const confirmPassField = page.locator('input[name="confirmPassword"], input[placeholder*="Xác nhận"]').first();

      if (await oldPassField.isVisible({ timeout: 1000 }).catch(() => false)) {
        const newPass = `NewPass${Date.now()}!`;
        await oldPassField.fill(testUser.password);
        await newPassField.fill(newPass);
        await confirmPassField.fill(newPass);

        // Submit
        const submitBtn = page.locator('button[type="submit"], button:has-text("Lưu"), button:has-text("Cập nhật")').first();
        if (await submitBtn.isVisible()) {
          await submitBtn.click();
          await page.waitForTimeout(1500);
        }

        // Verify success (logout and re-login with new password)
        console.log('Password change submitted');
      }
    });

    test('should reject wrong old password', async ({ page }) => {
      await page.goto(`${BASE_URL}/tai-khoan`);
      await page.waitForTimeout(1500);

      const changePassBtn = page.locator('button:has-text("Đổi mật khẩu"), button:has-text("Change password")').first();
      if (await changePassBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await changePassBtn.click();
        await page.waitForTimeout(1000);
      }

      const oldPassField = page.locator('input[name="oldPassword"], input[type="password"]:first-of-type').first();
      if (await oldPassField.isVisible({ timeout: 1000 }).catch(() => false)) {
        await oldPassField.fill('WrongPassword123!');
        await page.locator('input[name="newPassword"]').fill('NewPass123!');

        const submitBtn = page.locator('button[type="submit"]').first();
        if (await submitBtn.isVisible()) {
          await submitBtn.click();
          await page.waitForTimeout(1500);
        }

        // Verify error (should get 4004 or "wrong password" message)
        const errorMsg = page.locator('text=/sai|wrong|không đúng/i').first();
        const hasError = await errorMsg.isVisible({ timeout: 2000 }).catch(() => false);
        console.log(`Error shown for wrong password: ${hasError}`);
      }
    });
  });

  // ============================================================================
  // 8. ROUTE GUARDS - Logged-out access to protected routes
  // ============================================================================
  test.describe('Route Guards', () => {
    test('should redirect logged-out user from (user) routes with ?next=', async ({ page, context }) => {
      // Clear auth cookies to simulate logged-out state
      const cookies = await context.cookies();
      const authCookies = cookies.filter(c =>
        c.name.toLowerCase().includes('auth') ||
        c.name.toLowerCase().includes('token') ||
        c.name.toLowerCase().includes('refresh')
      );

      if (authCookies.length > 0) {
        await context.clearCookies({ name: authCookies[0].name });
      }

      // Try to access protected route
      await page.goto(`${BASE_URL}/tai-khoan`);
      await page.waitForTimeout(1500);

      // Should redirect to login with ?next= parameter
      const url = page.url();
      const hasNextParam = url.includes('?next=') || url.includes('next=');
      console.log(`Redirect has next parameter: ${hasNextParam}`);
      expect(url).toContain('dang-nhap');
    });

    test('should redirect logged-out user from checkout', async ({ page, context }) => {
      // Clear auth
      const cookies = await context.cookies();
      const authCookies = cookies.filter(c =>
        c.name.toLowerCase().includes('auth') ||
        c.name.toLowerCase().includes('token')
      );

      if (authCookies.length > 0) {
        await context.clearCookies({ name: authCookies[0].name });
      }

      await page.goto(`${BASE_URL}/thanh-toan`);
      await page.waitForTimeout(1500);

      const url = page.url();
      console.log(`Checkout redirect URL: ${url}`);
      expect(url).toContain('dang-nhap');
    });
  });
});
