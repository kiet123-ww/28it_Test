import { expect, test } from '@playwright/test';
import { candidateUrl } from '../utils/env';
import { expectFormValidationSmoke, gotoAndAssert } from '../helpers/module-test.helpers';

test.describe('API_Register', () => {
  test('candidate registration page validates required data', async ({ page }) => {
    await gotoAndAssert(page, candidateUrl('/user/register'), /dang ky|register|email|mat khau|password/i);
    await expectFormValidationSmoke(page);
    await expect(page.locator('body')).not.toContainText(/Internal Server Error|Unhandled Runtime Error/i);
  });
});
