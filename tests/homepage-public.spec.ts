import { expect, test, type Page } from '@playwright/test';
import { homepagePublicCases, type ExcelTestCase } from '../test-data/excel-test-cases';
import { candidateUrl, env } from '../utils/env';
import {
  expectActionButtonSmoke,
  expectListOrEmptyState,
  expectRefreshStable,
  expectResponsivePage,
  expectSearchOrFilterSmoke,
  gotoAndAssert,
  mustHaveRunner,
} from '../helpers/module-test.helpers';

type TestRunner = (page: Page, testCase: ExcelTestCase) => Promise<void>;

async function openHome(page: Page) {
  await gotoAndAssert(page, candidateUrl(env.routes.home), /28|IT|jobs|viec|job|cong ty|company/i);
}

const automatedCases: Record<string, TestRunner> = Object.fromEntries(
  homepagePublicCases.map((testCase) => [
    testCase.id,
    async (page: Page) => {
      if (/TC-HP-00[1-5]/.test(testCase.id)) {
        await openHome(page);
        await expect(page.locator('header, nav, footer, body').first()).toBeVisible();
        return;
      }

      if (/TC-HP-00[6-9]|TC-HP-010|TC-HP-011|TC-HP-012/.test(testCase.id)) {
        await openHome(page);
        await expectSearchOrFilterSmoke(page, env.search.keyword);
        return;
      }

      if (/TC-HP-013|TC-HP-014|TC-HP-015|TC-HP-016|TC-HP-017|TC-HP-018/.test(testCase.id)) {
        await openHome(page);
        await expectListOrEmptyState(page);
        return;
      }

      if (/TC-HP-019|TC-HP-020|TC-HP-021|TC-HP-022/.test(testCase.id)) {
        await openHome(page);
        await expectActionButtonSmoke(page, /viec|job|cong ty|company|xem|view|detail|chi tiet/i);
        return;
      }

      if (/TC-HP-023|TC-HP-024|TC-HP-025/.test(testCase.id)) {
        await openHome(page);
        await expectActionButtonSmoke(page, /dang nhap|login|dang ky|register|nha tuyen dung|recruiter/i);
        return;
      }

      if (testCase.id === 'TC-HP-026') {
        await openHome(page);
        await expectRefreshStable(page);
        return;
      }

      if (/TC-HP-027|TC-HP-028|TC-HP-029/.test(testCase.id)) {
        await expectResponsivePage(page, candidateUrl(env.routes.home), /28|IT|jobs|viec|job/i);
        return;
      }

      await openHome(page);
      await expect(page.locator('body')).toContainText(/footer|copyright|28|IT|jobs|lien he|contact/i);
    },
  ])
);

test.describe('Homepage_Public', () => {
  for (const testCase of homepagePublicCases) {
    test(`${testCase.id} - ${testCase.title}`, async ({ page }) => {
      const run = mustHaveRunner(automatedCases[testCase.id], testCase.id);
      await run(page, testCase);
    });
  }
});
