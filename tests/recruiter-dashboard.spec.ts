import { expect, test } from '@playwright/test';
import { env } from '../utils/env';
import { expectNoSystemErrors, expectPageLoaded, expectProtectedRedirectToLogin } from '../utils/assertions';
import { loginAsRecruiter } from '../utils/auth.utils';

test.describe('TAM_08_Recruiter_Dashboard', () => {
  test('TC-RDB-001 - recruiter can access dashboard after login', async ({ page }) => {
    await loginAsRecruiter(page);

    await expect(page).toHaveURL(new RegExp(env.routes.recruiterDashboard));
    await expectNoSystemErrors(page);
  });

  test('TC-RDB-002 - guest cannot access recruiter dashboard', async ({ page }) => {
    await page.goto(env.routes.recruiterDashboard);

    await expectProtectedRedirectToLogin(page);
  });

  test('TC-RDB-004 - dashboard page loads main content', async ({ page }) => {
    await loginAsRecruiter(page);

    await expectPageLoaded(page);
    await expect(page.locator('body')).toContainText(env.users.recruiter.email);
  });

  test.fixme('TC-RDB-003, TC-RDB-005..TC-RDB-030 - add role/metric/shortcut assertions from Excel sheet');
});
