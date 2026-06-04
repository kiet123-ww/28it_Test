import { test, type Page } from '@playwright/test';
import { applicationManagementCases, type ExcelTestCase } from '../test-data/excel-test-cases';
import { env, recruiterUrl } from '../utils/env';
import { loginAsRecruiter } from '../utils/auth.utils';
import {
  expectActionButtonSmoke,
  expectFormValidationSmoke,
  expectListOrEmptyState,
  expectRefreshStable,
  expectResponsivePage,
  expectSearchOrFilterSmoke,
  gotoAndAssert,
  mustHaveRunner,
} from '../helpers/module-test.helpers';

type TestRunner = (page: Page, testCase: ExcelTestCase) => Promise<void>;

async function openApplications(page: Page) {
  await loginAsRecruiter(page);
  await gotoAndAssert(page, recruiterUrl(env.routes.applicationManagement), /ung vien|candidate|cv|application|ho so|danh sach/i);
}

const automatedCases: Record<string, TestRunner> = Object.fromEntries(
  applicationManagementCases.map((testCase) => [
    testCase.id,
    async (page: Page) => {
      if (/TC-APP-00[1-5]|TC-APP-017|TC-APP-018/.test(testCase.id)) {
        await openApplications(page);
        await expectListOrEmptyState(page);
        return;
      }

      if (/TC-APP-00[6-9]/.test(testCase.id)) {
        await openApplications(page);
        await expectSearchOrFilterSmoke(page, 'candidate');
        return;
      }

      if (/TC-APP-01[0-6]|TC-APP-019|TC-APP-020|TC-APP-021|TC-APP-022/.test(testCase.id)) {
        await openApplications(page);
        await expectActionButtonSmoke(page, /xem|view|cv|chap nhan|accept|tu choi|reject|ghi chu|note|moi|invite|gui|send/i);
        return;
      }

      if (testCase.id === 'TC-APP-023') {
        await openApplications(page);
        await expectRefreshStable(page);
        return;
      }

      if (testCase.id === 'TC-APP-024') {
        await loginAsRecruiter(page);
        await expectResponsivePage(page, recruiterUrl(env.routes.applicationManagement), /ung vien|candidate|cv|application/i);
        return;
      }

      await openApplications(page);
      await expectFormValidationSmoke(page);
    },
  ])
);

test.describe('11_Application_Management', () => {
  for (const testCase of applicationManagementCases) {
    test(`${testCase.id} - ${testCase.title}`, async ({ page }) => {
      const run = mustHaveRunner(automatedCases[testCase.id], testCase.id);
      await run(page, testCase);
    });
  }
});
