import { test, type Page } from '@playwright/test';
import { invitationNotificationCases, type ExcelTestCase } from '../test-data/excel-test-cases';
import { candidateUrl, env } from '../utils/env';
import { loginAsCandidate } from '../utils/auth.utils';
import {
  expectActionButtonSmoke,
  expectListOrEmptyState,
  expectProtectedOrLoaded,
  expectRefreshStable,
  expectResponsivePage,
  expectSearchOrFilterSmoke,
  gotoAndAssert,
  mustHaveRunner,
} from '../helpers/module-test.helpers';

type TestRunner = (page: Page, testCase: ExcelTestCase) => Promise<void>;

async function openInvitation(page: Page, route = env.routes.candidateInvitationWait) {
  await loginAsCandidate(page);
  await gotoAndAssert(page, candidateUrl(route), /loi moi|invitation|viec|job|chua co|danh sach/i);
}

async function openSettings(page: Page) {
  await loginAsCandidate(page);
  await gotoAndAssert(page, candidateUrl(env.routes.candidateSettings), /thong bao|notification|loi moi|cai dat|setting/i);
}

const automatedCases: Record<string, TestRunner> = Object.fromEntries(
  invitationNotificationCases.map((testCase) => [
    testCase.id,
    async (page: Page) => {
      if (/TC-INV-00[1-8]|TC-INV-017|TC-INV-018/.test(testCase.id)) {
        await openInvitation(page);
        await expectActionButtonSmoke(page, /dong y|chap nhan|tu choi|xem|chi tiet|accepted|reject|loi moi|job/i);
        return;
      }

      if (/TC-INV-009|TC-INV-010|TC-INV-011|TC-INV-019|TC-INV-021|TC-INV-022/.test(testCase.id)) {
        await openSettings(page);
        await expectActionButtonSmoke(page, /bat|tat|toggle|nhan|khong nhan|thong bao|email|sms/i);
        return;
      }

      if (/TC-INV-012|TC-INV-013|TC-INV-014|TC-INV-023|TC-INV-024/.test(testCase.id)) {
        await openSettings(page);
        await expectSearchOrFilterSmoke(page, 'company');
        return;
      }

      if (testCase.id === 'TC-INV-015' || testCase.id === 'TC-INV-025') {
        await loginAsCandidate(page);
        await expectResponsivePage(page, candidateUrl(env.routes.candidateInvitationWait), /loi moi|invitation|job|viec/i);
        return;
      }

      if (testCase.id === 'TC-INV-016') {
        await expectProtectedOrLoaded(page, candidateUrl(env.routes.candidateInvitationWait));
        return;
      }

      if (testCase.id === 'TC-INV-020') {
        await openInvitation(page);
        await expectSearchOrFilterSmoke(page, 'developer');
        return;
      }

      await openInvitation(page);
      await expectListOrEmptyState(page);
      await expectRefreshStable(page);
    },
  ])
);

test.describe('KHANH_Invitation_Notification', () => {
  for (const testCase of invitationNotificationCases) {
    test(`${testCase.id} - ${testCase.title}`, async ({ page }) => {
      const run = mustHaveRunner(automatedCases[testCase.id], testCase.id);
      await run(page, testCase);
    });
  }
});
