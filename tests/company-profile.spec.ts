import { test, type Page } from '@playwright/test';
import { companyProfileCases, type ExcelTestCase } from '../test-data/excel-test-cases';
import { env, recruiterUrl } from '../utils/env';
import { loginAsRecruiter } from '../utils/auth.utils';
import {
  expectActionButtonSmoke,
  expectFormValidationSmoke,
  expectRefreshStable,
  expectResponsivePage,
  fillFirstInput,
  gotoAndAssert,
  mustHaveRunner,
} from '../helpers/module-test.helpers';

type TestRunner = (page: Page, testCase: ExcelTestCase) => Promise<void>;

async function openCompanyProfile(page: Page) {
  await loginAsRecruiter(page);
  await gotoAndAssert(page, recruiterUrl(env.routes.companyProfile), /company|cong ty|profile|ho so/i);
}

const automatedCases: Record<string, TestRunner> = Object.fromEntries(
  companyProfileCases.map((testCase) => [
    testCase.id,
    async (page: Page) => {
      if (testCase.id === 'TC-COM-001') {
        await openCompanyProfile(page);
        return;
      }

      if (/TC-COM-00[2-9]|TC-COM-010|TC-COM-011/.test(testCase.id)) {
        await openCompanyProfile(page);
        await fillFirstInput(page, testCase.id.includes('008') ? 'invalid-email' : 'Automation Company');
        await expectFormValidationSmoke(page);
        return;
      }

      if (/TC-COM-012|TC-COM-013|TC-COM-014/.test(testCase.id)) {
        await openCompanyProfile(page);
        await expectActionButtonSmoke(page, /upload|tai|logo|anh|image|xoa|delete/i);
        return;
      }

      if (testCase.id === 'TC-COM-015') {
        await openCompanyProfile(page);
        await expectRefreshStable(page);
        return;
      }

      if (testCase.id === 'TC-COM-016' || testCase.id === 'TC-COM-017') {
        await loginAsRecruiter(page);
        await expectResponsivePage(page, recruiterUrl(env.routes.companyProfile), /company|cong ty|profile/i);
        return;
      }

      await openCompanyProfile(page);
      await expectActionButtonSmoke(page, /luu|save|cap nhat|update|preview|xem/i);
    },
  ])
);

test.describe('TAM_09_Company_Profile', () => {
  for (const testCase of companyProfileCases) {
    test(`${testCase.id} - ${testCase.title}`, async ({ page }) => {
      const run = mustHaveRunner(automatedCases[testCase.id], testCase.id);
      await run(page, testCase);
    });
  }
});
