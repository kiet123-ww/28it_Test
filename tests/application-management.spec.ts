import { test } from '@playwright/test';
import { env } from '../utils/env';
import { expectNoSystemErrors, expectPageLoaded } from '../utils/assertions';
import { loginAsRecruiter } from '../utils/auth.utils';

test.describe('11_Application_Management', () => {
  test('TC-APP-001 - recruiter can open application/candidate management page', async ({ page }) => {
    await loginAsRecruiter(page);
    await page.goto(env.routes.applicationManagement);

    await expectPageLoaded(page);
    await expectNoSystemErrors(page);
  });

  test.fixme('TC-APP-002..TC-APP-025 - add application list/detail/filter/status assertions from Excel sheet');
});
