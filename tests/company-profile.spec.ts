import { test } from '@playwright/test';
import { env } from '../utils/env';
import { expectNoSystemErrors, expectPageLoaded } from '../utils/assertions';
import { loginAsRecruiter } from '../utils/auth.utils';

test.describe('TAM_09_Company_Profile', () => {
  test('TC-COM-001 - recruiter can open own company profile', async ({ page }) => {
    await loginAsRecruiter(page);
    await page.goto(env.routes.companyProfile);

    await expectPageLoaded(page);
    await expectNoSystemErrors(page);
  });

  test.fixme('TC-COM-002..TC-COM-030 - add edit/save/validation assertions with rollback-safe test data');
});
