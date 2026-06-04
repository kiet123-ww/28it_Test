import { test, type Page } from '@playwright/test';
import { recruiterJobManagementCases, type ExcelTestCase } from '../test-data/excel-test-cases';
import { env, recruiterUrl } from '../utils/env';
import { loginAsRecruiter } from '../utils/auth.utils';
import {
  expectActionButtonSmoke,
  expectFormValidationSmoke,
  expectListOrEmptyState,
  expectRefreshStable,
  expectResponsivePage,
  expectSearchOrFilterSmoke,
  fillFirstInput,
  gotoAndAssert,
  mustHaveRunner,
} from '../helpers/module-test.helpers';

type TestRunner = (page: Page, testCase: ExcelTestCase) => Promise<void>;

async function openJobList(page: Page) {
  await loginAsRecruiter(page);
  await gotoAndAssert(page, recruiterUrl(env.routes.jobManagement), /job|tin|tuyen dung|recruitment|danh sach/i);
}

async function openJobCreate(page: Page) {
  await loginAsRecruiter(page);
  await gotoAndAssert(page, recruiterUrl(env.routes.jobCreate), /tao|create|job|tin|tuyen dung/i);
}

const automatedCases: Record<string, TestRunner> = Object.fromEntries(
  recruiterJobManagementCases.map((testCase) => [
    testCase.id,
    async (page: Page) => {
      if (/TC-JMG-00[1-6]|TC-JMG-013|TC-JMG-020|TC-JMG-024/.test(testCase.id)) {
        await openJobList(page);
        await expectListOrEmptyState(page);
        return;
      }

      if (/TC-JMG-00[3-5]/.test(testCase.id)) {
        await openJobList(page);
        await expectSearchOrFilterSmoke(page, 'Developer');
        return;
      }

      if (/TC-JMG-00[7-9]|TC-JMG-010|TC-JMG-011|TC-JMG-012|TC-JMG-016/.test(testCase.id)) {
        await openJobCreate(page);
        await fillFirstInput(page, testCase.id === 'TC-JMG-011' ? '-1' : 'Automation Job');
        await expectFormValidationSmoke(page);
        return;
      }

      if (/TC-JMG-014|TC-JMG-015|TC-JMG-017|TC-JMG-018|TC-JMG-019|TC-JMG-021|TC-JMG-022/.test(testCase.id)) {
        await openJobList(page);
        await expectActionButtonSmoke(page, /sua|edit|dong|close|tam dung|pause|mo lai|cancel|huy|xem|view/i);
        return;
      }

      if (testCase.id === 'TC-JMG-023') {
        await loginAsRecruiter(page);
        await expectResponsivePage(page, recruiterUrl(env.routes.jobCreate), /tao|create|job|tin/i);
        return;
      }

      await openJobList(page);
      await expectRefreshStable(page);
    },
  ])
);

test.describe('TAM_10_Job_Management', () => {
  for (const testCase of recruiterJobManagementCases) {
    test(`${testCase.id} - ${testCase.title}`, async ({ page }) => {
      const run = mustHaveRunner(automatedCases[testCase.id], testCase.id);
      await run(page, testCase);
    });
  }
});
