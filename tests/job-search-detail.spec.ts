import { expect, test, type Locator, type Page } from '@playwright/test';
import { jobSearchDetailCases, type ExcelTestCase } from '../test-data/excel-test-cases';
import { candidateUrl, env } from '../utils/env';
import { expectNoSystemErrors, expectPageLoaded } from '../utils/assertions';

type TestRunner = (page: Page, testCase: ExcelTestCase) => Promise<void>;

const keywordInput = (page: Page) => page.locator('input[name="keyword"]').first();
const searchForm = (page: Page) => page.locator('form').first();
const searchButton = (page: Page) => searchForm(page).locator('button[type="submit"]').first();
const locationDropdownButton = (page: Page) => searchForm(page).locator('button[aria-haspopup="listbox"]').first();
const resultHeading = (page: Page) => page.locator('h2').filter({ hasText: /viec lam|IT|Developer|Frontend|Backend/i }).first();
const jobCards = (page: Page) => page.locator('button').filter({ has: page.locator('h3') });
const firstJobCard = (page: Page) => jobCards(page).first();
const detailPanel = (page: Page) => page.locator('div').filter({ has: page.locator('a[href^="/job/detail/"]') }).first();
const detailJobLink = (page: Page) => page.locator('a[href^="/job/detail/"]').first();
const body = (page: Page) => page.locator('body');

async function gotoSearch(page: Page, query = '') {
  await page.goto(candidateUrl(`${env.routes.jobs}${query}`));
  await expectPageLoaded(page);
}

async function submitKeywordSearch(page: Page, keyword: string) {
  await gotoSearch(page);
  await keywordInput(page).fill(keyword);
  await searchButton(page).click();
  await expect(page).toHaveURL(new RegExp(`/search\\?keyword=${encodeURIComponent(keyword)}`));
  await expectPageLoaded(page);
}

async function expectSearchShell(page: Page) {
  await expect(keywordInput(page)).toBeVisible();
  await expect(locationDropdownButton(page)).toBeVisible();
  await expect(searchButton(page)).toBeVisible();
  await expect(resultHeading(page)).toBeVisible();
}

async function expectResultsOrEmptyState(page: Page) {
  await expect(body(page)).toContainText(/viec lam|chua tim thay|Developer|Frontend|Backend|IT/i);
  await expectNoSystemErrors(page);
}

async function expectAtLeastOneJob(page: Page) {
  await expect(firstJobCard(page)).toBeVisible();
}

async function selectFirstJob(page: Page) {
  await expectAtLeastOneJob(page);
  await firstJobCard(page).click();
  await expect(detailJobLink(page)).toBeVisible();
}

async function openFirstJobDetail(page: Page) {
  await gotoSearch(page);
  await selectFirstJob(page);
  await detailJobLink(page).click();
  await expect(page).toHaveURL(/\/job\/detail\//);
  await expectPageLoaded(page);
}

async function selectFilterByText(page: Page, text: RegExp) {
  const select = page.locator('select').filter({ hasText: text }).first();
  await expect(select).toBeVisible();
  const value = await select.locator('option').filter({ hasText: text }).first().getAttribute('value');
  await select.selectOption(value || { label: text.source });
}

async function expectVisibleText(locator: Locator, text: RegExp) {
  await expect(locator).toContainText(text);
}

const automatedCases: Record<string, TestRunner> = {
  'TC-JSD-001': async (page) => {
    await gotoSearch(page);
    await expectSearchShell(page);
    await expectNoSystemErrors(page);
  },

  'TC-JSD-002': async (page) => {
    await gotoSearch(page);
    await expectSearchShell(page);
    await expectResultsOrEmptyState(page);
  },

  'TC-JSD-003': async (page) => {
    await gotoSearch(page);
    await expect(keywordInput(page)).toBeVisible();
    await keywordInput(page).fill(env.search.keyword);
    await expect(keywordInput(page)).toHaveValue(env.search.keyword);
  },

  'TC-JSD-004': async (page) => {
    await gotoSearch(page);
    await locationDropdownButton(page).click();
    await expect(searchForm(page).locator('input').filter({ hasText: /^$/ }).last()).toBeVisible();
    await expect(body(page)).toContainText(/tat ca|thanh pho|ha noi|ho chi minh|tim kiem/i);
  },

  'TC-JSD-005': async (page) => {
    await gotoSearch(page);
    await expect(page.locator('select').filter({ hasText: /Intern|Fresher|Junior|Senior/i }).first()).toBeVisible();
    await expect(page.locator('select').filter({ hasText: /Hybrid|Remote|Lam tu xa|Tai van phong/i }).first()).toBeVisible();
  },

  'TC-JSD-006': async (page) => {
    await submitKeywordSearch(page, env.search.keyword);
    await expectResultsOrEmptyState(page);
  },

  'TC-JSD-007': async (page) => {
    await submitKeywordSearch(page, 'Lập trình viên');
    await expect(keywordInput(page)).toHaveValue('Lập trình viên');
    await expectResultsOrEmptyState(page);
  },

  'TC-JSD-008': async (page) => {
    await submitKeywordSearch(page, 'lap trinh vien');
    await expect(keywordInput(page)).toHaveValue('lap trinh vien');
    await expectResultsOrEmptyState(page);
  },

  'TC-JSD-009': async (page) => {
    await gotoSearch(page);
    await locationDropdownButton(page).click();
    const hanoiOption = page.getByRole('button', { name: /ha noi|hà nội/i }).first();
    if (await hanoiOption.count()) {
      await hanoiOption.click();
      await searchButton(page).click();
      await expect(page).toHaveURL(/location=/);
    }
    await expectResultsOrEmptyState(page);
  },

  'TC-JSD-010': async (page) => {
    await gotoSearch(page);
    await keywordInput(page).fill('Frontend');
    await locationDropdownButton(page).click();
    const hanoiOption = page.getByRole('button', { name: /ha noi|hà nội/i }).first();
    if (await hanoiOption.count()) {
      await hanoiOption.click();
    }
    await searchButton(page).click();
    await expect(page).toHaveURL(/keyword=Frontend/);
    await expectResultsOrEmptyState(page);
  },

  'TC-JSD-011': async (page) => {
    await gotoSearch(page);
    await keywordInput(page).fill('');
    await searchButton(page).click();
    await expect(page).toHaveURL(/\/search/);
    await expectResultsOrEmptyState(page);
  },

  'TC-JSD-012': async (page) => {
    await submitKeywordSearch(page, 'abcxyzkhongcojob');
    await expect(body(page)).toContainText(/chua tim thay|0 viec lam|abcxyzkhongcojob/i);
    await expectNoSystemErrors(page);
  },

  'TC-JSD-013': async (page) => {
    await gotoSearch(page);
    await locationDropdownButton(page).click();
    const locationOption = page.getByRole('button', { name: /ha noi|hà nội|ho chi minh|hồ chí minh/i }).first();
    if (await locationOption.count()) {
      await locationOption.click();
      await searchButton(page).click();
      await expect(page).toHaveURL(/location=/);
    }
    await expectResultsOrEmptyState(page);
  },

  'TC-JSD-014': async (page) => {
    await submitKeywordSearch(page, 'React');
    await expectResultsOrEmptyState(page);
  },

  'TC-JSD-015': async (page) => {
    await submitKeywordSearch(page, 'Software');
    await expectResultsOrEmptyState(page);
  },

  'TC-JSD-016': async (page) => {
    await gotoSearch(page);
    await expect(resultHeading(page)).toBeVisible();
    await expectNoSystemErrors(page);
  },

  'TC-JSD-017': async (page) => {
    await submitKeywordSearch(page, 'Backend');
    await selectFilterByText(page, /Senior|Middle|Junior/i);
    await selectFilterByText(page, /Hybrid|Remote|Tai van phong|Lam tu xa/i);
    await expectResultsOrEmptyState(page);
  },

  'TC-JSD-018': async (page) => {
    await submitKeywordSearch(page, 'Backend');
    await keywordInput(page).fill('');
    await searchButton(page).click();
    await expect(page).toHaveURL(/\/search/);
    await expectResultsOrEmptyState(page);
  },

  'TC-JSD-019': async (page) => {
    await submitKeywordSearch(page, env.search.keyword);
    await expectAtLeastOneJob(page);
    await expectNoSystemErrors(page);
  },

  'TC-JSD-020': async (page) => {
    await gotoSearch(page);
    await expectAtLeastOneJob(page);
    await expectVisibleText(firstJobCard(page), /Developer|Engineer|Intern|Fresher|Junior|Senior|Hybrid|Remote|IT|VND|USD/i);
    await expectNoSystemErrors(page);
  },

  'TC-JSD-021': async (page) => {
    await gotoSearch(page);
    const titles = await jobCards(page).locator('h3').allTextContents();
    const normalizedTitles = titles.map((title) => title.trim()).filter(Boolean);
    expect(new Set(normalizedTitles).size).toBe(normalizedTitles.length);
  },

  'TC-JSD-022': async (page) => {
    await submitKeywordSearch(page, 'abcxyzkhongcojob');
    await expect(body(page)).toContainText(/chua tim thay|0 viec lam/i);
  },

  'TC-JSD-023': async (page) => {
    await gotoSearch(page);
    const nextPageButton = page.getByRole('button', { name: /›|trang sau|next/i }).first();
    if (await nextPageButton.count()) {
      await nextPageButton.click();
      await expectResultsOrEmptyState(page);
      return;
    }
    await expect(firstJobCard(page).or(body(page).filter({ hasText: /chua tim thay/i }))).toBeVisible();
  },

  'TC-JSD-024': async (page) => {
    await submitKeywordSearch(page, 'Developer');
    const nextPageButton = page.getByRole('button', { name: /›|trang sau|next/i }).first();
    if (await nextPageButton.count()) {
      await nextPageButton.click();
    }
    await expect(keywordInput(page)).toHaveValue('Developer');
  },

  'TC-JSD-025': async (page) => {
    await openFirstJobDetail(page);
    await expect(body(page)).toContainText(/ung tuyen|cong ty|ky nang|viec lam/i);
    await expectNoSystemErrors(page);
  },

  'TC-JSD-026': async (page) => {
    await openFirstJobDetail(page);
    await expect(body(page)).toContainText(/cong ty|dia diem|ky nang|lam viec|Developer|Engineer|IT/i);
    await expectNoSystemErrors(page);
  },

  'TC-JSD-027': async (page) => {
    await openFirstJobDetail(page);
    await expect(body(page)).toContainText(/mo ta|description|dang cap nhat|viec/i);
  },

  'TC-JSD-028': async (page) => {
    await openFirstJobDetail(page);
    await expect(body(page)).toContainText(/yeu cau|requirement|ky nang|kinh nghiem|dang cap nhat/i);
  },

  'TC-JSD-029': async (page) => {
    await openFirstJobDetail(page);
    await expect(body(page)).toContainText(/cong ty|company|mo hinh|linh vuc|quoc gia|quy mo/i);
  },

  'TC-JSD-030': async (page) => {
    await gotoSearch(page, '?keyword=Developer');
    await selectFirstJob(page);
    await detailJobLink(page).click();
    await expect(page).toHaveURL(/\/job\/detail\//);
    await page.goBack();
    await expect(page).toHaveURL(/\/search/);
    await expect(keywordInput(page)).toHaveValue('Developer');
  },

  'TC-JSD-031': async (page) => {
    await openFirstJobDetail(page);
    await expect(page.locator('a, button').filter({ hasText: /ung tuyen|apply/i }).first()).toBeVisible();
  },

  'TC-JSD-032': async (page) => {
    await openFirstJobDetail(page);
    await page.locator('a, button').filter({ hasText: /ung tuyen|apply/i }).first().click();
    await expect(page).toHaveURL(/\/user\/login|\/job\/detail\//);
  },

  'TC-JSD-033': async (page) => {
    await openFirstJobDetail(page);
    const saveButton = page.locator('a, button').filter({ hasText: /luu|save/i }).first();
    if (await saveButton.count()) {
      await saveButton.click();
      await expect(page).toHaveURL(/\/user\/login|\/job\/detail\//);
      return;
    }
    await expect(page.getByLabel(/luu cong viec|save/i).first()).toBeVisible();
  },

  'TC-JSD-034': async (page) => {
    await openFirstJobDetail(page);
    const companyLink = page.locator('a[href^="/company/detail/"]').first();
    await expect(companyLink).toBeVisible();
    await companyLink.click();
    await expect(page).toHaveURL(/\/company\/detail\//);
    await expectNoSystemErrors(page);
  },

  'TC-JSD-035': async (page) => {
    await page.goto(candidateUrl('/job/detail/not-existing-job-id-for-test'));
    await expectPageLoaded(page);
    await expect(body(page)).toContainText(/khong|not found|404|loi|dang tai|khong the|error/i);
    await expect(body(page)).not.toContainText(/Internal Server Error|Unhandled Runtime Error/i);
  },
};

test.describe('KIET_Job_Search_Detail', () => {
  for (const testCase of jobSearchDetailCases) {
    test(`${testCase.id} - ${testCase.title}`, async ({ page }) => {
      const run = automatedCases[testCase.id];
      expect(run, `Missing automated implementation for ${testCase.id}`).toBeDefined();
      await run(page, testCase);
    });
  }
});
