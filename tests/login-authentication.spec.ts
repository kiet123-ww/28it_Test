import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { env } from '../utils/env';
import { expectPageNotContainSystemErrors } from '../utils/assertions';

test.describe('Login Authentication', () => {
  test('TC-LA-001 - Trang đăng nhập hiển thị đúng', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.gotoLoginPage();

    await loginPage.expectLoginPageVisible();
    await expectPageNotContainSystemErrors(page);
  });

  test('TC-LA-002 - Không cho đăng nhập khi email/password sai', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.gotoLoginPage();

    await loginPage.login(env.users.invalid.email, env.users.invalid.password);

    await loginPage.expectLoginFailedMessage();
    await expectPageNotContainSystemErrors(page);
  });

  test('TC-LA-003 - Validate email không hợp lệ', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.gotoLoginPage();

    await loginPage.fillEmail('wrong-email');
    await loginPage.fillPassword('123456');
    await loginPage.clickLoginButton();

    const emailInput = page
      .locator('input[type="email"], input[name="email"]')
      .first();

    if (await emailInput.count()) {
      const validationMessage = await emailInput.evaluate(
        (input: HTMLInputElement) => input.validationMessage
      );

      expect(validationMessage.length).toBeGreaterThan(0);
    }

    await expectPageNotContainSystemErrors(page);
  });

    test('TC-LA-004 - Đăng nhập candidate bằng tài khoản hợp lệ', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.gotoLoginPage();

        await loginPage.login(
            env.users.candidate.email,
            env.users.candidate.password
        );

        await page.waitForLoadState('domcontentloaded');

        await page.goto('/user-manage/profile');

        // Không được bị kẹt ở màn hình kiểm tra phiên
        await expect(
            page.getByText(/Đang kiểm tra phiên đăng nhập/i)
        ).not.toBeVisible();

        // Không được bị đá về login
        await expect(page).not.toHaveURL(/user\/login/);

        // Phải ở trang profile
        await expect(page).toHaveURL(/user-manage\/profile/);

        // Phải thấy dữ liệu thật của tài khoản đã đăng nhập
        await expect(page.getByText(env.users.candidate.email)).toBeVisible();

        await expectPageNotContainSystemErrors(page);
    });
});