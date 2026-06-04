import { expect, test, type Page } from '@playwright/test';
import { candidateJobActionCases, type ExcelTestCase } from '../test-data/excel-test-cases';
import { candidateUrl, env } from '../utils/env';
import { loginAsCandidate } from '../utils/auth.utils';
import {
  expectActionButtonSmoke,
  expectListOrEmptyState,
  expectProtectedOrLoaded,
  expectRefreshStable,
  gotoAndAssert,
  mustHaveRunner,
} from '../helpers/module-test.helpers';

type TestRunner = (page: Page, testCase: ExcelTestCase) => Promise<void>;

async function openSearchWithJob(page: Page) {
  await gotoAndAssert(page, candidateUrl(env.routes.jobs), /viec lam|job|search|IT/i);
  const firstDetail = page.locator('a[href^="/job/detail/"]').first();
  if (await firstDetail.count()) {
    await firstDetail.click();
    await expect(page).toHaveURL(/\/job\/detail\//);
  }
}

async function loginAndOpenList(page: Page, route: string) {
  await loginAsCandidate(page);
  await gotoAndAssert(page, candidateUrl(route), /viec|job|danh sach|chua co|da luu|ung tuyen|da xem/i);
}

const automatedCases: Record<string, TestRunner> = Object.fromEntries(
  candidateJobActionCases.map((testCase) => [
    testCase.id,
    async (page: Page) => {
      if (/TC-CJA-00[1-5]|TC-CJA-019|TC-CJA-020|TC-CJA-021|TC-CJA-022|TC-CJA-023/.test(testCase.id)) {
        if (!testCase.id.includes('002')) {
          await loginAsCandidate(page);
        }
        await openSearchWithJob(page);
        await expectActionButtonSmoke(page, /ung tuyen|apply|huy nop|da ung tuyen/i);
        return;
      }

      if (/TC-CJA-00[7-9]|TC-CJA-010|TC-CJA-024|TC-CJA-025|TC-CJA-026/.test(testCase.id)) {
        if (!testCase.id.includes('008')) {
          await loginAsCandidate(page);
        }
        await openSearchWithJob(page);
        await expectActionButtonSmoke(page, /luu|save/i);
        return;
      }

      if (/TC-CJA-006|TC-CJA-016|TC-CJA-017|TC-CJA-018|TC-CJA-029/.test(testCase.id)) {
        await loginAndOpenList(page, env.routes.candidateAppliedJobs);
        await expectListOrEmptyState(page);
        return;
      }

      if (/TC-CJA-011|TC-CJA-012/.test(testCase.id)) {
        await loginAndOpenList(page, env.routes.candidateSavedJobs);
        await expectListOrEmptyState(page);
        return;
      }

      if (/TC-CJA-013|TC-CJA-014|TC-CJA-015|TC-CJA-027|TC-CJA-028/.test(testCase.id)) {
        await loginAndOpenList(page, env.routes.candidateViewedJobs);
        await expectListOrEmptyState(page);
        return;
      }

      if (testCase.id === 'TC-CJA-030') {
        await expectProtectedOrLoaded(page, candidateUrl(env.routes.candidateAppliedJobs));
        return;
      }

      await loginAndOpenList(page, env.routes.candidateAppliedJobs);
      await expectRefreshStable(page);
    },
  ])
);

test.describe('KHANH_Candidate_Job_Actions', () => {
  for (const testCase of candidateJobActionCases) {
    test(`${testCase.id} - ${testCase.title}`, async ({ page }) => {
      const run = mustHaveRunner(automatedCases[testCase.id], testCase.id);
      await run(page, testCase);
    });
  }
});
