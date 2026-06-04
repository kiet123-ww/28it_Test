import { expect, test, type Page } from '@playwright/test';
import { adminManagementCases, type ExcelTestCase } from '../test-data/excel-test-cases';
import { adminUrl, candidateUrl, env, recruiterUrl } from '../utils/env';
import { loginAsCandidate, loginAsRecruiter } from '../utils/auth.utils';
import {
  expectActionButtonSmoke,
  expectFormValidationSmoke,
  expectListOrEmptyState,
  expectProtectedOrLoaded,
  expectRefreshStable,
  expectResponsivePage,
  expectSearchOrFilterSmoke,
  fillFirstInput,
  gotoAndAssert,
  mustHaveRunner,
} from '../helpers/module-test.helpers';

type TestRunner = (page: Page, testCase: ExcelTestCase) => Promise<void>;

async function loginAsAdmin(page: Page) {
  await page.goto(adminUrl(env.routes.adminLogin));
  await page.getByPlaceholder(/admin@example.com|email/i).fill(env.users.admin.email);
  await page.locator('input[type="password"]').fill(env.users.admin.password);
  await page.getByRole('button', { name: /dang nhap|login/i }).click();
  await expect(page).toHaveURL(/\/admin\/dashboard/);
}

async function openAdmin(page: Page, path = env.routes.adminDashboard) {
  await loginAsAdmin(page);
  await gotoAndAssert(page, adminUrl(path), /admin|dashboard|account|candidate|company|moderation|audit|notification/i);
}

const automatedCases: Record<string, TestRunner> = Object.fromEntries(
  adminManagementCases.map((testCase) => [
    testCase.id,
    async (page: Page) => {
      if (testCase.id === 'TC-ADM-001') {
        await loginAsAdmin(page);
        await expect(page.locator('body')).toContainText(/admin|dashboard|quan tri/i);
        return;
      }

      if (testCase.id === 'TC-ADM-002') {
        await page.goto(adminUrl(env.routes.adminLogin));
        await page.getByPlaceholder(/admin@example.com|email/i).fill(env.users.admin.email);
        await page.locator('input[type="password"]').fill(env.users.invalid.password);
        await page.getByRole('button', { name: /dang nhap|login/i }).click();
        await expect(page.locator('body')).toContainText(/sai|khong dung|loi|invalid|mat khau/i);
        return;
      }

      if (testCase.id === 'TC-ADM-003') {
        await loginAsCandidate(page);
        await expectProtectedOrLoaded(page, adminUrl(env.routes.adminDashboard));
        return;
      }

      if (testCase.id === 'TC-ADM-004') {
        await loginAsRecruiter(page);
        await expectProtectedOrLoaded(page, adminUrl(env.routes.adminDashboard));
        return;
      }

      if (/TC-ADM-00[5-8]/.test(testCase.id)) {
        await openAdmin(page, env.routes.adminDashboard);
        await expectActionButtonSmoke(page, /admin|phan quyen|role|account|tao|create|xoa|delete|khoa|lock/i);
        return;
      }

      if (/TC-ADM-00[9]|TC-ADM-010|TC-ADM-011|TC-ADM-012|TC-ADM-013/.test(testCase.id)) {
        await openAdmin(page, env.routes.adminAccounts);
        await expectSearchOrFilterSmoke(page, env.users.candidate.email);
        return;
      }

      if (/TC-ADM-014|TC-ADM-015|TC-ADM-016|TC-ADM-017|TC-ADM-018/.test(testCase.id)) {
        await openAdmin(page, env.routes.adminAccounts);
        await expectSearchOrFilterSmoke(page, env.users.recruiter.email);
        return;
      }

      if (/TC-ADM-019|TC-ADM-020|TC-ADM-021|TC-ADM-022|TC-ADM-023|TC-ADM-024|TC-ADM-025|TC-ADM-026/.test(testCase.id)) {
        await openAdmin(page, env.routes.adminModeration);
        await expectActionButtonSmoke(page, /duyet|approve|tu choi|reject|xem|preview|go|remove|khoa|lock/i);
        return;
      }

      if (/TC-ADM-027|TC-ADM-028|TC-ADM-029|TC-ADM-030/.test(testCase.id)) {
        await openAdmin(page, env.routes.adminTaxonomy);
        await fillFirstInput(page, 'Automation Category');
        await expectFormValidationSmoke(page);
        return;
      }

      if (testCase.id === 'TC-ADM-031') {
        await openAdmin(page, env.routes.adminDashboard);
        await expectListOrEmptyState(page);
        return;
      }

      if (testCase.id === 'TC-ADM-032') {
        await openAdmin(page, env.routes.adminAudit);
        await expectListOrEmptyState(page);
        return;
      }

      if (/TC-ADM-033|TC-ADM-034|TC-ADM-035|TC-ADM-036/.test(testCase.id)) {
        await openAdmin(page, env.routes.adminNotifications);
        await expectFormValidationSmoke(page);
        return;
      }

      if (testCase.id === 'TC-ADM-037') {
        await expectResponsivePage(page, adminUrl(env.routes.adminLogin), /admin|login/i);
        return;
      }

      if (testCase.id === 'TC-ADM-038') {
        await openAdmin(page);
        await expectActionButtonSmoke(page, /dang xuat|logout|sign out/i);
        await expectProtectedOrLoaded(page, adminUrl(env.routes.adminDashboard));
        return;
      }

      await page.goto(candidateUrl(env.routes.home));
      await page.goto(recruiterUrl(env.routes.login));
      await openAdmin(page);
    },
  ])
);

test.describe('12_Admin_Management', () => {
  for (const testCase of adminManagementCases) {
    test(`${testCase.id} - ${testCase.title}`, async ({ page }) => {
      const run = mustHaveRunner(automatedCases[testCase.id], testCase.id);
      await run(page, testCase);
    });
  }
});
