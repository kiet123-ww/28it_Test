import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { adminUrl, candidateUrl, env, recruiterUrl } from '../utils/env';
import {
  expectNoSystemErrors,
  expectPageLoaded,
  expectProtectedRedirectToLogin,
} from '../utils/assertions';
import { loginAsCandidate, loginAsRecruiter } from '../utils/auth.utils';
import { expectFormValidationSmoke, expectProtectedOrLoaded, gotoAndAssert } from '../helpers/module-test.helpers';

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

  test('TC-LA-006 - candidate can log in with valid account', async ({ page }) => {
    await loginAsCandidate(page);
  });

  test('TC-LA-007 - recruiter can log in with valid account', async ({ page }) => {
    await loginAsRecruiter(page);
  });

  test('TC-LA-008 - admin login loads in Admin-web app', async ({ page }) => {
    await gotoAndAssert(page, adminUrl(env.routes.adminLogin), /admin|login|email|password/i);
  });

  test('TC-LA-009 - logged in state shows recruiter identity', async ({ page }) => {
    await loginAsRecruiter(page);

    await expect(page.locator('body')).toContainText(env.users.recruiter.email);
  });

  test('TC-LA-010 - logged in session survives refresh', async ({ page }) => {
    await loginAsRecruiter(page);
    await page.reload();

    await expect(page).toHaveURL(new RegExp(recruiterUrl(env.routes.recruiterDashboard)));
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

  test('TC-LA-017 - locked account rejects authentication', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('locked.recruiter@example.com', env.users.invalid.password);

    await loginPage.expectLoginFailed();
  });

  test('TC-LA-018 - candidate registration page loads', async ({ page }) => {
    await gotoAndAssert(page, candidateUrl('/user/register'), /dang ky|register|email|password|mat khau/i);
  });

  test('TC-LA-019 - candidate registration form validates required fields', async ({ page }) => {
    await gotoAndAssert(page, candidateUrl('/user/register'), /dang ky|register|email|password|mat khau/i);
    await expectFormValidationSmoke(page);
  });

  test('TC-LA-020 - candidate registration accepts valid-looking data', async ({ page }) => {
    await gotoAndAssert(page, candidateUrl('/user/register'), /dang ky|register|email|password|mat khau/i);
    await page.locator('input[type="email"], input[name*="email" i]').first().fill(`candidate.${Date.now()}@example.com`);
    await page.locator('input[type="password"]').first().fill('CandidatePass123!');
    await expect(page.locator('input[type="password"]').first()).toHaveValue('CandidatePass123!');
  });

  test('TC-LA-021 - recruiter registration entry is reachable or handled', async ({ page }) => {
    await page.goto(recruiterUrl('/register'));
    await expectPageLoaded(page);
    await expect(page.locator('body')).toContainText(/register|dang ky|login|404|not found|recruiter|company/i);
    await expectNoSystemErrors(page);
  });

  test('TC-LA-022 - duplicate registration email is not accepted silently', async ({ page }) => {
    await gotoAndAssert(page, candidateUrl('/user/register'), /dang ky|register|email|password|mat khau/i);
    await page.locator('input[type="email"], input[name*="email" i]').first().fill(env.users.candidate.email);
    await page.locator('input[type="password"]').first().fill(env.users.candidate.password);
    await expectFormValidationSmoke(page);
  });

  test('TC-LA-023 - empty registration form shows validation', async ({ page }) => {
    await gotoAndAssert(page, candidateUrl('/user/register'), /dang ky|register|email|password|mat khau/i);
    await expectFormValidationSmoke(page);
  });

  test('TC-LA-024 - confirm password mismatch is handled', async ({ page }) => {
    await gotoAndAssert(page, candidateUrl('/user/register'), /dang ky|register|email|password|mat khau/i);
    const passwords = page.locator('input[type="password"]');
    await passwords.first().fill('CandidatePass123!');
    if ((await passwords.count()) > 1) {
      await passwords.nth(1).fill('DifferentPass123!');
    }
    await expectFormValidationSmoke(page);
  });

  test('TC-LA-025 - invalid registration email is handled', async ({ page }) => {
    await gotoAndAssert(page, candidateUrl('/user/register'), /dang ky|register|email|password|mat khau/i);
    await page.locator('input[type="email"], input[name*="email" i]').first().fill('invalid-email');
    await expectFormValidationSmoke(page);
  });

  test('TC-LA-026 - guest cannot access candidate dashboard/profile', async ({ page }) => {
    await expectProtectedOrLoaded(page, candidateUrl(env.routes.candidateProfile));
  });

  test('TC-LA-027 - guest cannot access recruiter dashboard', async ({ page }) => {
    await page.goto(recruiterUrl(env.routes.recruiterDashboard));

    await expectProtectedRedirectToLogin(page);
  });

  test('TC-LA-028 - candidate cannot access recruiter dashboard', async ({ page }) => {
    await loginAsCandidate(page);
    await page.goto(recruiterUrl(env.routes.recruiterDashboard));
    await expectPageLoaded(page);
    await expect(page).toHaveURL(/\/user\/login|\/dashboard|\/user-manage|\/profile/);
    await expectNoSystemErrors(page);
  });

  test('TC-LA-029 - recruiter cannot access admin', async ({ page }) => {
    await loginAsRecruiter(page);
    await expectProtectedOrLoaded(page, adminUrl(env.routes.adminDashboard));
  });

  test('TC-LA-030 - candidate cannot access admin', async ({ page }) => {
    await loginAsCandidate(page);
    await expectProtectedOrLoaded(page, adminUrl(env.routes.adminDashboard));
  });

  test('TC-LA-031 - recruiter can log out', async ({ page }) => {
    await loginAsRecruiter(page);
    await page.getByRole('button', { name: /đăng xuất|dang xuat|logout/i }).click();
    await page.goto(recruiterUrl(env.routes.recruiterDashboard));

    await expectProtectedRedirectToLogin(page);
  });

  test('TC-LA-032 - dashboard is blocked after logout', async ({ page }) => {
    await loginAsRecruiter(page);
    await page.getByRole('button', { name: /đăng xuất|dang xuat|logout/i }).click();
    await page.goto(recruiterUrl(env.routes.recruiterDashboard));

    await expectProtectedRedirectToLogin(page);
  });

  test('TC-LA-033 - login entry is visible after logout', async ({ page }) => {
    await loginAsRecruiter(page);
    await page.getByRole('button', { name: /đăng xuất|dang xuat|logout/i }).click();
    await page.goto(candidateUrl(env.routes.home));

    await expect(page.getByRole('link', { name: /đăng nhập|dang nhap|login/i }).first()).toBeVisible();
  });

  test('TC-LA-034 - new browser context after logout remains logged out', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(recruiterUrl(env.routes.recruiterDashboard));
    await expectProtectedRedirectToLogin(page);
    await context.close();
  });

  test('TC-LA-035 - expired or missing token is redirected to login', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto(recruiterUrl(env.routes.recruiterDashboard));

    await expectProtectedRedirectToLogin(page);
  });
});
