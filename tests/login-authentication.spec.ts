import { test, expect } from '@playwright/test';

test.describe('Login Authentication', () => {
  test('TC-LA-001 - Login page should load successfully', async ({ page }) => {
    await page.goto('/login');

    await expect(page).toHaveURL(/login|dang-nhap/);
  });
});