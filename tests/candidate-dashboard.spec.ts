import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Candidate Dashboard Module', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateTo('/login');
    // Login to access dashboard
    await loginPage.login('candidate_active@example.com', 'ValidPass123!');
    await loginPage.verifySuccessNavigation('/dashboard');
  });

  test('TC-DASH-01: Hiển thị đúng thông tin hồ sơ của ứng viên', async ({ page }) => {
    await expect(page.locator('h1, h2:has-text("Hồ sơ của tôi")')).toBeVisible();
    await expect(page.locator('text=candidate_active@example.com')).toBeVisible();
  });

  test('TC-DASH-02: Cập nhật thông tin cá nhân hợp lệ', async ({ page }) => {
    await page.click('button:has-text("Chỉnh sửa")');
    await page.fill('input[name="phone"]', '0123456789');
    await page.click('button:has-text("Lưu")');
    await expect(page.locator('.success-message, text="Cập nhật thành công"')).toBeVisible();
  });

  test('TC-DASH-03: Xem danh sách việc làm đã ứng tuyển', async ({ page }) => {
    await page.click('a:has-text("Việc làm đã ứng tuyển")');
    await expect(page.locator('.job-list, .applications')).toBeVisible();
  });
});
