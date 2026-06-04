import { expect, test, type Page } from '@playwright/test';
import { candidateProfileCvCases, type ExcelTestCase } from '../test-data/excel-test-cases';
import { candidateUrl, env } from '../utils/env';
import { loginAsCandidate } from '../utils/auth.utils';
import {
  expectActionButtonSmoke,
  expectFormValidationSmoke,
  expectListOrEmptyState,
  expectRefreshStable,
  expectResponsivePage,
  fillFirstInput,
  gotoAndAssert,
  mustHaveRunner,
} from '../helpers/module-test.helpers';

type TestRunner = (page: Page, testCase: ExcelTestCase) => Promise<void>;

async function openProfile(page: Page) {
  await loginAsCandidate(page);
  await gotoAndAssert(page, candidateUrl(env.routes.candidateCvProfile), /ho so|cv|profile|ung vien|candidate/i);
}

async function openSettings(page: Page) {
  await loginAsCandidate(page);
  await gotoAndAssert(page, candidateUrl(env.routes.candidateCvSetting), /cv|setting|cai dat|ho so/i);
}

const automatedCases: Record<string, TestRunner> = Object.fromEntries(
  candidateProfileCvCases.map((testCase) => [
    testCase.id,
    async (page: Page) => {
      if (/TC-CPR-00[1-7]/.test(testCase.id)) {
        await openProfile(page);
        await fillFirstInput(page, testCase.id.includes('003') ? 'abc123' : 'Automation Candidate');
        await expectFormValidationSmoke(page);
        return;
      }

      if (/TC-CPR-00[8-9]|TC-CPR-010|TC-CPR-011|TC-CPR-012/.test(testCase.id)) {
        await openProfile(page);
        await expectListOrEmptyState(page);
        return;
      }

      if (/TC-CPR-01[3-9]|TC-CPR-02[0-4]/.test(testCase.id)) {
        await openSettings(page);
        await expectActionButtonSmoke(page, /them|add|sua|edit|xoa|delete|luu|save|cv|upload|tai/i);
        return;
      }

      if (testCase.id === 'TC-CPR-025') {
        await openProfile(page);
        await expectRefreshStable(page);
        return;
      }

      if (/TC-CPR-02[6-9]|TC-CPR-03[0-5]/.test(testCase.id)) {
        await openProfile(page);
        await expectFormValidationSmoke(page);
        return;
      }

      if (testCase.id === 'TC-CPR-036' || testCase.id === 'TC-CPR-037') {
        await loginAsCandidate(page);
        await expectResponsivePage(page, candidateUrl(env.routes.candidateCvProfile), /ho so|cv|profile/i);
        return;
      }

      await openProfile(page);
      await expect(page.locator('body')).toContainText(/ho so|cv|profile|ung vien|candidate|luu|them|sua/i);
    },
  ])
);

test.describe('KHANH_Candidate_Profile_CV', () => {
  for (const testCase of candidateProfileCvCases) {
    test(`${testCase.id} - ${testCase.title}`, async ({ page }) => {
      const run = mustHaveRunner(automatedCases[testCase.id], testCase.id);
      await run(page, testCase);
    });
  }
});
