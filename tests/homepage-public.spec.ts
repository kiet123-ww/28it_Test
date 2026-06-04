import { expect, test } from '@playwright/test';
import { env } from '../utils/env';
import { expectNoSystemErrors, expectPageLoaded } from '../utils/assertions';

test.describe('Homepage_Public', () => {
  test('TC-HP-001 - home page loads successfully', async ({ page }) => {
    await page.goto(env.routes.home);

    await expectPageLoaded(page);
    await expectNoSystemErrors(page);
  });

  test('TC-HP-002 - home page exposes login navigation', async ({ page }) => {
    await page.goto(env.routes.home);

    await expect(page.getByRole('link', { name: /đăng nhập|dang nhap|login/i })).toBeVisible();
  });

  test.fixme('TC-HP-003..TC-HP-035 - add detailed homepage assertions from Excel sheet');
});
