import { expect, test, type Page } from '@playwright/test';
import { recruiterDashboardCases, type ExcelTestCase } from '../test-data/excel-test-cases';
import { env, recruiterUrl } from '../utils/env';
import { loginAsRecruiter } from '../utils/auth.utils';
import {
  expectActionButtonSmoke,
  expectListOrEmptyState,
  expectProtectedOrLoaded,
  expectRefreshStable,
  expectResponsivePage,
  gotoAndAssert,
  mustHaveRunner,
} from '../helpers/module-test.helpers';

type TestRunner = (page: Page, testCase: ExcelTestCase) => Promise<void>;

async function openDashboard(page: Page) {
  await loginAsRecruiter(page);
  await gotoAndAssert(page, recruiterUrl(env.routes.recruiterDashboard), /dashboard|thong ke|job|ung vien|recruiter|company/i);
}

const shortcuts: Record<string, string> = {
  'TC-RDB-009': env.routes.companyProfile,
  'TC-RDB-010': env.routes.jobManagement,
  'TC-RDB-011': env.routes.jobCreate,
  'TC-RDB-012': env.routes.applicationManagement,
};

const automatedCases: Record<string, TestRunner> = Object.fromEntries(
  recruiterDashboardCases.map((testCase) => [
    testCase.id,
    async (page: Page) => {
      if (testCase.id === 'TC-RDB-001' || /TC-RDB-00[4-8]|TC-RDB-013/.test(testCase.id)) {
        await openDashboard(page);
        await expectListOrEmptyState(page);
        return;
      }

      if (testCase.id === 'TC-RDB-002' || testCase.id === 'TC-RDB-003') {
        await expectProtectedOrLoaded(page, recruiterUrl(env.routes.recruiterDashboard));
        return;
      }

      if (shortcuts[testCase.id]) {
        await loginAsRecruiter(page);
        await gotoAndAssert(page, recruiterUrl(shortcuts[testCase.id]), /company|job|tin|ung vien|candidate|tao|create|profile/i);
        return;
      }

      if (testCase.id === 'TC-RDB-014') {
        await openDashboard(page);
        await expectRefreshStable(page);
        return;
      }

      if (testCase.id === 'TC-RDB-015') {
        await loginAsRecruiter(page);
        await expectResponsivePage(page, recruiterUrl(env.routes.recruiterDashboard), /dashboard|job|ung vien|company/i);
        return;
      }

      await openDashboard(page);
      await expectActionButtonSmoke(page, /xem|view|tao|create|quan ly|manage|job/i);
    },
  ])
);

test.describe('TAM_08_Recruiter_Dashboard', () => {
  for (const testCase of recruiterDashboardCases) {
    test(`${testCase.id} - ${testCase.title}`, async ({ page }) => {
      const run = mustHaveRunner(automatedCases[testCase.id], testCase.id);
      await run(page, testCase);
    });
  }
});
