import { test, expect } from '@playwright/test';
import { BasePage } from '../pages/BasePage';

test.describe('Job Search Detail Module', () => {

  test.beforeEach(async ({ page }) => {
    const basePage = new BasePage(page);
    await basePage.navigateTo('/jobs');
  });

  test('TC-JOB-01: Tìm kiếm việc làm theo từ khóa hợp lệ', async ({ page }) => {
    await page.fill('input[placeholder*="Tìm kiếm"]', 'Frontend');
    await page.click('button:has-text("Tìm kiếm")');
    await expect(page.locator('.job-card')).not.toHaveCount(0);
  });

  test('TC-JOB-02: Tìm kiếm việc làm không có kết quả', async ({ page }) => {
    await page.fill('input[placeholder*="Tìm kiếm"]', 'KhongCoJobNaoNhuTheNay123');
    await page.click('button:has-text("Tìm kiếm")');
    await expect(page.locator('text="Không tìm thấy"')).toBeVisible();
  });

  test('TC-JOB-03: Xem chi tiết một việc làm (Job Detail)', async ({ page }) => {
    await page.fill('input[placeholder*="Tìm kiếm"]', 'Frontend');
    await page.click('button:has-text("Tìm kiếm")');
    
    const firstJobCard = page.locator('.job-card').first();
    await firstJobCard.click();

    await expect(page).toHaveURL(/.*\/jobs\/\d+|.*\/jobs\/[a-zA-Z0-9-]+/);
    await expect(page.locator('button:has-text("Ứng tuyển")')).toBeVisible();
  });
});
