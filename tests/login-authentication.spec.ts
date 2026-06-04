import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { env } from '../utils/env';
import {
  expectNoSystemErrors,
  expectPageLoaded,
  expectProtectedRedirectToLogin,
} from '../utils/assertions';
import { loginAsRecruiter } from '../utils/auth.utils';

test.describe('KIET_Login_Authentication', () => {
  test('TC-LA-001 - login page loads successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await expectPageLoaded(page);
    await expectNoSystemErrors(page);
  });

  test('TC-LA-002 - login form shows required controls', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.expectLoaded();
    await expectNoSystemErrors(page);
  });

  test('TC-LA-003 - email field accepts input', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.fillEmail('user@example.com');

    await expect(loginPage.emailInput()).toHaveValue('user@example.com');
  });

  test('TC-LA-004 - password field masks typed value', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.fillPassword('123456');

    await expect(loginPage.passwordInput()).toHaveAttribute('type', 'password');
    await expect(loginPage.passwordInput()).toHaveValue('123456');
  });

  test('TC-LA-005 - contact/register link does not open 404', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await page.getByRole('link').filter({ hasText: /liên hệ|lien he|đăng ký|dang ky/i }).first().click();

    await expectNoSystemErrors(page);
  });

  test.fixme('TC-LA-006 - candidate login is not exposed in recruitment-client');

  test('TC-LA-007 - recruiter can log in with valid account', async ({ page }) => {
    await loginAsRecruiter(page);
  });

  test.fixme('TC-LA-008 - admin login belongs to the separate Admin-web app');

  test('TC-LA-009 - logged in state shows recruiter identity', async ({ page }) => {
    await loginAsRecruiter(page);

    await expect(page.locator('body')).toContainText(env.users.recruiter.email);
  });

  test('TC-LA-010 - logged in session survives refresh', async ({ page }) => {
    await loginAsRecruiter(page);
    await page.reload();

    await expect(page).toHaveURL(new RegExp(env.routes.recruiterDashboard));
    await expect(page.locator('body')).toContainText(env.users.recruiter.email);
  });

  test('TC-LA-011 - wrong password is rejected', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(env.users.recruiter.email, 'wrong-password');

    await loginPage.expectLoginFailed();
  });

  test('TC-LA-012 - unknown email is rejected', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(env.users.invalid.email, env.users.invalid.password);

    await loginPage.expectLoginFailed();
  });

  test('TC-LA-013 - empty login form shows validation errors', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.submit();

    await loginPage.expectValidationError(/email|mật khẩu|mat khau|password/i);
  });

  test('TC-LA-014 - missing email shows validation error', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.fillPassword('123456');
    await loginPage.submit();

    await loginPage.expectValidationError(/email/i);
  });

  test('TC-LA-015 - missing password shows validation error', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.fillEmail('user@example.com');
    await loginPage.submit();

    await loginPage.expectValidationError(/mật khẩu|mat khau|password/i);
  });

  test('TC-LA-016 - invalid email format shows validation error', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('abc123', '123456');

    await loginPage.expectValidationError(/email/i);
  });

  test.fixme('TC-LA-017 - locked recruiter account test data is not available');
  test.fixme('TC-LA-018 - registration page is not exposed in recruitment-client');
  test.fixme('TC-LA-019 - registration page is not exposed in recruitment-client');
  test.fixme('TC-LA-020 - candidate registration belongs to another app/module');
  test.fixme('TC-LA-021 - recruiter self-registration is not implemented in this app');
  test.fixme('TC-LA-022 - duplicate registration requires registration API/page');
  test.fixme('TC-LA-023 - registration validation requires registration page');
  test.fixme('TC-LA-024 - registration validation requires registration page');
  test.fixme('TC-LA-025 - registration validation requires registration page');
  test.fixme('TC-LA-026 - candidate dashboard route is not in recruitment-client');

  test('TC-LA-027 - guest cannot access recruiter dashboard', async ({ page }) => {
    await page.goto(env.routes.recruiterDashboard);

    await expectProtectedRedirectToLogin(page);
  });

  test.fixme('TC-LA-028 - candidate role login is not available in recruitment-client');
  test.fixme('TC-LA-029 - admin app URL and account need separate setup');
  test.fixme('TC-LA-030 - candidate role login is not available in recruitment-client');

  test('TC-LA-031 - recruiter can log out', async ({ page }) => {
    await loginAsRecruiter(page);
    await page.getByRole('button', { name: /đăng xuất|dang xuat|logout/i }).click();

    await expect(page).toHaveURL(/\/user\/login|\/$/);
  });

  test('TC-LA-032 - dashboard is blocked after logout', async ({ page }) => {
    await loginAsRecruiter(page);
    await page.getByRole('button', { name: /đăng xuất|dang xuat|logout/i }).click();
    await page.goto(env.routes.recruiterDashboard);

    await expectProtectedRedirectToLogin(page);
  });

  test('TC-LA-033 - login entry is visible after logout', async ({ page }) => {
    await loginAsRecruiter(page);
    await page.getByRole('button', { name: /đăng xuất|dang xuat|logout/i }).click();
    await page.goto(env.routes.home);

    await expect(page.getByRole('link', { name: /đăng nhập|dang nhap|login/i })).toBeVisible();
  });

  test('TC-LA-034 - new browser context after logout remains logged out', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(env.routes.recruiterDashboard);
    await expectProtectedRedirectToLogin(page);
    await context.close();
  });

  test.fixme('TC-LA-035 - token expiry needs a controllable expired-token fixture');
});
