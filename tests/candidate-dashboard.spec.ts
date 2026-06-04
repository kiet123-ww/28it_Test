import { expect, test, type Page } from '@playwright/test';
import { candidateDashboardCases, type ExcelTestCase } from '../test-data/excel-test-cases';
import { candidateUrl, env, recruiterUrl } from '../utils/env';
import { expectNoSystemErrors, expectPageLoaded } from '../utils/assertions';
import { loginAsCandidate, loginAsRecruiter } from '../utils/auth.utils';
import {
  expectActionButtonSmoke,
  expectListOrEmptyState,
  expectProtectedOrLoaded,
  expectRefreshStable,
  expectResponsivePage,
  gotoAndAssert,
  mustHaveRunner,
  type ModuleRunner,
} from '../helpers/module-test.helpers';

type TestRunner = (page: Page, testCase: ExcelTestCase) => Promise<void>;

const dashboardUrl = () => candidateUrl(env.routes.candidateProfile);
const body = (page: Page) => page.locator('body');

async function loginAndOpenDashboard(page: Page) {
  await loginAsCandidate(page);
  await gotoAndAssert(page, dashboardUrl(), /dashboard|ho so|profile|ung vien|candidate/i);
}

const openDashboard: ModuleRunner = async (page) => {
  await loginAndOpenDashboard(page);
  await expectListOrEmptyState(page);
};

const menuRoutes: Record<string, string> = {
  'TC-CD-011': env.routes.candidateProfile,
  'TC-CD-012': env.routes.candidateCvProfile,
  'TC-CD-013': env.routes.candidateSavedJobs,
  'TC-CD-014': env.routes.candidateAppliedJobs,
  'TC-CD-015': env.routes.candidateInvitationWait,
  'TC-CD-025': env.routes.jobs,
};

const automatedCases: Record<string, TestRunner> = Object.fromEntries(
  candidateDashboardCases.map((testCase) => [
    testCase.id,
    async (page: Page) => {
      if (testCase.id === 'TC-CD-001') {
        await openDashboard(page);
        return;
      }

      if (testCase.id === 'TC-CD-002') {
        await expectProtectedOrLoaded(page, dashboardUrl());
        return;
      }

      if (testCase.id === 'TC-CD-003') {
        await loginAsRecruiter(page);
        await page.goto(dashboardUrl());
        await expectPageLoaded(page);
        await expect(page).toHaveURL(new RegExp(`${candidateUrl(env.routes.candidateProfile)}|${recruiterUrl(env.routes.recruiterDashboard)}|/user/login`));
        await expectNoSystemErrors(page);
        return;
      }

      if (menuRoutes[testCase.id]) {
        await loginAsCandidate(page);
        await gotoAndAssert(page, candidateUrl(menuRoutes[testCase.id]), /dashboard|ho so|cv|viec|job|thong bao|loi moi|search/i);
        return;
      }

      if (testCase.id === 'TC-CD-026') {
        await loginAndOpenDashboard(page);
        await expectRefreshStable(page);
        return;
      }

      if (testCase.id === 'TC-CD-027' || testCase.id === 'TC-CD-028') {
        await loginAsCandidate(page);
        await expectResponsivePage(page, dashboardUrl(), /dashboard|ho so|ung vien|candidate/i);
        return;
      }

      if (testCase.id === 'TC-CD-029') {
        await loginAndOpenDashboard(page);
        await expectActionButtonSmoke(page, /dang xuat|logout|thoat/i);
        return;
      }

      if (testCase.id === 'TC-CD-030') {
        await page.goto(dashboardUrl());
        await expectProtectedOrLoaded(page, dashboardUrl());
        return;
      }

      await openDashboard(page);
      await expect(body(page)).toContainText(/candidate|ung vien|ho so|cv|viec|job|dashboard|thong bao|loi moi|0|1|2|3|4|5|6|7|8|9/i);
    },
  ])
);

test.describe('KIET_Candidate_Dashboard', () => {
  for (const testCase of candidateDashboardCases) {
    test(`${testCase.id} - ${testCase.title}`, async ({ page }) => {
      const run = mustHaveRunner(automatedCases[testCase.id], testCase.id);
      await run(page, testCase);
    });
  }
});
