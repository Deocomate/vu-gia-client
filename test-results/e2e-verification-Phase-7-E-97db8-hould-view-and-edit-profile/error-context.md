# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e-verification.spec.js >> Phase 7 E2E Verification >> Profile >> should view and edit profile
- Location: e2e-verification.spec.js:424:5

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
```

# Page snapshot

```yaml
- generic [ref=e2]: Internal Server Error
```

# Test source

```ts
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
  356 |     });
  357 |   });
  358 | 
  359 |   // ============================================================================
  360 |   // 6. ORDERS - List, detail, cancel eligible order
  361 |   // ============================================================================
  362 |   test.describe('Orders & Cancel (BE-3)', () => {
  363 |     test('should view orders list with filters', async ({ page }) => {
  364 |       await page.goto(`${BASE_URL}/don-hang`);
  365 |       await page.waitForTimeout(1500);
  366 | 
  367 |       const orders = page.locator('[data-testid="order-item"], .order-item, tr:has([data-testid="order-row"])');
  368 |       const count = await orders.count();
  369 |       console.log(`Orders displayed: ${count}`);
  370 |       expect(count).toBeGreaterThanOrEqual(0);
  371 | 
  372 |       // Check for filters
  373 |       const statusFilter = page.locator('select[name="status"], input[name="status"], [data-testid="status-filter"]').first();
  374 |       if (await statusFilter.isVisible({ timeout: 1000 }).catch(() => false)) {
  375 |         console.log('Status filter available');
  376 |       }
  377 |     });
  378 | 
  379 |     test('should view order detail and verify cancellation option for eligible orders', async ({ page }) => {
  380 |       await page.goto(`${BASE_URL}/don-hang`);
  381 |       await page.waitForTimeout(1500);
  382 | 
  383 |       // Click first order
  384 |       const firstOrder = page.locator('[data-testid="order-item"], .order-item, a:has-text("Xem chi tiết")').first();
  385 |       if (await firstOrder.isVisible()) {
  386 |         await firstOrder.click();
  387 |         await page.waitForTimeout(2000);
  388 |       } else {
  389 |         // Fallback: navigate to order detail if ID is known
  390 |         await page.goto(`${BASE_URL}/don-hang/1`).catch(() => {});
  391 |         await page.waitForTimeout(1500);
  392 |       }
  393 | 
  394 |       // Look for cancel button (only for eligible statuses)
  395 |       const cancelBtn = page.locator('button:has-text("Hủy"), button:has-text("Cancel"), [data-testid="cancel-order"]').first();
  396 |       if (await cancelBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
  397 |         console.log('Cancel button found - order is in eligible status for cancellation');
  398 | 
  399 |         // Click cancel
  400 |         await cancelBtn.click();
  401 |         await page.waitForTimeout(1500);
  402 | 
  403 |         // Confirm cancellation in dialog if present
  404 |         const confirmBtn = page.locator('button:has-text("Xác nhận"), button:has-text("OK"), button:has-text("Confirm")').first();
  405 |         if (await confirmBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
  406 |           await confirmBtn.click();
  407 |           await page.waitForTimeout(1500);
  408 |         }
  409 | 
  410 |         // Verify status changed to CANCELLED
  411 |         const status = page.locator('[data-testid="order-status"], .order-status, text=/Đã hủy|CANCELLED/').first();
  412 |         const isCancelled = await status.isVisible({ timeout: 2000 }).catch(() => false);
  413 |         console.log(`Order cancelled: ${isCancelled}`);
  414 |       } else {
  415 |         console.log('Order not eligible for cancellation (may be already shipped or completed)');
  416 |       }
  417 |     });
  418 |   });
  419 | 
  420 |   // ============================================================================
  421 |   // 7. PROFILE - View, change password, read-only fields
  422 |   // ============================================================================
  423 |   test.describe('Profile', () => {
  424 |     test('should view and edit profile', async ({ page }) => {
  425 |       await page.goto(`${BASE_URL}/tai-khoan`);
  426 |       await page.waitForTimeout(1500);
  427 | 
  428 |       // Verify profile fields are visible
  429 |       const nameField = page.locator('input[name="name"], input[name="fullName"], input[placeholder*="Họ tên"]').first();
  430 |       const emailField = page.locator('input[name="email"], input[placeholder*="Email"]').first();
  431 | 
> 432 |       expect(await nameField.isVisible({ timeout: 1000 }).catch(() => false)).toBeTruthy();
      |                                                                               ^ Error: expect(received).toBeTruthy()
  433 |       expect(await emailField.isVisible({ timeout: 1000 }).catch(() => false)).toBeTruthy();
  434 | 
  435 |       // Verify email is read-only
  436 |       const emailReadonly = await emailField.evaluate((el) => el.readOnly || el.disabled).catch(() => false);
  437 |       console.log(`Email field is read-only: ${emailReadonly}`);
  438 |     });
  439 | 
  440 |     test('should change password with correct old password', async ({ page }) => {
  441 |       await page.goto(`${BASE_URL}/tai-khoan`);
  442 |       await page.waitForTimeout(1500);
  443 | 
  444 |       // Look for change password section/button
  445 |       const changePassBtn = page.locator('button:has-text("Đổi mật khẩu"), button:has-text("Change password"), a:has-text("Đổi mật khẩu")').first();
  446 |       if (await changePassBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
  447 |         await changePassBtn.click();
  448 |         await page.waitForTimeout(1000);
  449 |       }
  450 | 
  451 |       // Fill password fields
  452 |       const oldPassField = page.locator('input[name="oldPassword"], input[type="password"]:first-of-type').first();
  453 |       const newPassField = page.locator('input[name="newPassword"], input[placeholder*="Mật khẩu mới"]').first();
  454 |       const confirmPassField = page.locator('input[name="confirmPassword"], input[placeholder*="Xác nhận"]').first();
  455 | 
  456 |       if (await oldPassField.isVisible({ timeout: 1000 }).catch(() => false)) {
  457 |         const newPass = `NewPass${Date.now()}!`;
  458 |         await oldPassField.fill(testUser.password);
  459 |         await newPassField.fill(newPass);
  460 |         await confirmPassField.fill(newPass);
  461 | 
  462 |         // Submit
  463 |         const submitBtn = page.locator('button[type="submit"], button:has-text("Lưu"), button:has-text("Cập nhật")').first();
  464 |         if (await submitBtn.isVisible()) {
  465 |           await submitBtn.click();
  466 |           await page.waitForTimeout(1500);
  467 |         }
  468 | 
  469 |         // Verify success (logout and re-login with new password)
  470 |         console.log('Password change submitted');
  471 |       }
  472 |     });
  473 | 
  474 |     test('should reject wrong old password', async ({ page }) => {
  475 |       await page.goto(`${BASE_URL}/tai-khoan`);
  476 |       await page.waitForTimeout(1500);
  477 | 
  478 |       const changePassBtn = page.locator('button:has-text("Đổi mật khẩu"), button:has-text("Change password")').first();
  479 |       if (await changePassBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
  480 |         await changePassBtn.click();
  481 |         await page.waitForTimeout(1000);
  482 |       }
  483 | 
  484 |       const oldPassField = page.locator('input[name="oldPassword"], input[type="password"]:first-of-type').first();
  485 |       if (await oldPassField.isVisible({ timeout: 1000 }).catch(() => false)) {
  486 |         await oldPassField.fill('WrongPassword123!');
  487 |         await page.locator('input[name="newPassword"]').fill('NewPass123!');
  488 | 
  489 |         const submitBtn = page.locator('button[type="submit"]').first();
  490 |         if (await submitBtn.isVisible()) {
  491 |           await submitBtn.click();
  492 |           await page.waitForTimeout(1500);
  493 |         }
  494 | 
  495 |         // Verify error (should get 4004 or "wrong password" message)
  496 |         const errorMsg = page.locator('text=/sai|wrong|không đúng/i').first();
  497 |         const hasError = await errorMsg.isVisible({ timeout: 2000 }).catch(() => false);
  498 |         console.log(`Error shown for wrong password: ${hasError}`);
  499 |       }
  500 |     });
  501 |   });
  502 | 
  503 |   // ============================================================================
  504 |   // 8. ROUTE GUARDS - Logged-out access to protected routes
  505 |   // ============================================================================
  506 |   test.describe('Route Guards', () => {
  507 |     test('should redirect logged-out user from (user) routes with ?next=', async ({ page, context }) => {
  508 |       // Clear auth cookies to simulate logged-out state
  509 |       const cookies = await context.cookies();
  510 |       const authCookies = cookies.filter(c =>
  511 |         c.name.toLowerCase().includes('auth') ||
  512 |         c.name.toLowerCase().includes('token') ||
  513 |         c.name.toLowerCase().includes('refresh')
  514 |       );
  515 | 
  516 |       if (authCookies.length > 0) {
  517 |         await context.clearCookies({ name: authCookies[0].name });
  518 |       }
  519 | 
  520 |       // Try to access protected route
  521 |       await page.goto(`${BASE_URL}/tai-khoan`);
  522 |       await page.waitForTimeout(1500);
  523 | 
  524 |       // Should redirect to login with ?next= parameter
  525 |       const url = page.url();
  526 |       const hasNextParam = url.includes('?next=') || url.includes('next=');
  527 |       console.log(`Redirect has next parameter: ${hasNextParam}`);
  528 |       expect(url).toContain('dang-nhap');
  529 |     });
  530 | 
  531 |     test('should redirect logged-out user from checkout', async ({ page, context }) => {
  532 |       // Clear auth
```