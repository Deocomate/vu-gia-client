# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e-verification.spec.js >> Phase 7 E2E Verification >> Route Guards >> should redirect logged-out user from checkout
- Location: e2e-verification.spec.js:531:5

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "dang-nhap"
Received string:    "http://localhost:3000/thanh-toan"
```

# Page snapshot

```yaml
- generic [ref=e2]: Internal Server Error
```

# Test source

```ts
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
  533 |       const cookies = await context.cookies();
  534 |       const authCookies = cookies.filter(c =>
  535 |         c.name.toLowerCase().includes('auth') ||
  536 |         c.name.toLowerCase().includes('token')
  537 |       );
  538 | 
  539 |       if (authCookies.length > 0) {
  540 |         await context.clearCookies({ name: authCookies[0].name });
  541 |       }
  542 | 
  543 |       await page.goto(`${BASE_URL}/thanh-toan`);
  544 |       await page.waitForTimeout(1500);
  545 | 
  546 |       const url = page.url();
  547 |       console.log(`Checkout redirect URL: ${url}`);
> 548 |       expect(url).toContain('dang-nhap');
      |                   ^ Error: expect(received).toContain(expected) // indexOf
  549 |     });
  550 |   });
  551 | });
  552 | 
```