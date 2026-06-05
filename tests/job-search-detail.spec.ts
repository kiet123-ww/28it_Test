import { expect, test, type Locator, type Page } from '@playwright/test';
import { mustHaveRunner } from '../helpers/module-test.helpers';
import { jobSearchDetailCases, type ExcelTestCase } from '../test-data/excel-test-cases';
import { expectNoSystemErrors, expectPageLoaded } from '../utils/assertions';
import { candidateUrl, env } from '../utils/env';

type TestRunner = (page: Page, testCase: ExcelTestCase) => Promise<void>;

const ALL_LEVELS_LABEL = 'Tất cả cấp bậc';
const ALL_WORK_MODES_LABEL = 'Tất cả hình thức';

const keywordInput = (page: Page) => page.locator('input[name="keyword"]').first();
const searchButton = (page: Page) =>
  page.locator('button[type="submit"]').filter({ hasText: /Tìm kiếm|Tim kiem/i }).first();
const locationDropdownButton = (page: Page) => page.locator('button[aria-haspopup="listbox"]').first();
const locationSearchInput = (page: Page) => page.locator('input:not([name="keyword"])').first();
const resultHeading = (page: Page) => page.locator('h2').filter({ hasText: /việc làm|viec lam|IT/i }).first();
const jobCards = (page: Page) =>
  page
    .locator('button')
    .filter({ has: page.locator('h3') })
    .filter({ hasNot: page.locator('[aria-label]') });
const emptyState = (page: Page) => page.getByText(/Chưa tìm thấy việc làm phù hợp|Chua tim thay viec lam phu hop/i).first();
const previewApplyLink = (page: Page) => page.locator('a[href^="/job/detail/"]').first();
const paginationPrevButton = (page: Page) => page.getByRole('button', { name: /Trang trước|Trang truoc/i }).first();
const paginationNextButton = (page: Page) => page.getByRole('button', { name: /Trang sau/i }).first();
const sortSelect = (page: Page) =>
  page.locator('select').filter({ has: page.locator('option', { hasText: /Việc mới nhất|Viec moi nhat/i }) }).first();
const levelFilter = (page: Page) =>
  page.locator('select').filter({ has: page.locator('option', { hasText: /Tất cả cấp bậc|Tat ca cap bac/i }) }).first();
const workModeFilter = (page: Page) =>
  page.locator('select').filter({ has: page.locator('option', { hasText: /Tất cả hình thức|Tat ca hinh thuc/i }) }).first();
const detailTitle = (page: Page) => page.locator('h1').first();
const detailApplyButton = (page: Page) => page.locator('a, button').filter({ hasText: /Ứng tuyển|Ung tuyen/i }).first();
const detailSaveButton = (page: Page) => page.getByLabel(/Lưu công việc|Luu cong viec/i).first();
const detailCompanyLink = (page: Page) => page.locator('a[href^="/company/detail/"]').first();
const body = (page: Page) => page.locator('body');

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function pageText(page: Page) {
  return normalizeText(await body(page).innerText());
}

async function expectBodyContains(page: Page, ...fragments: string[]) {
  const text = await pageText(page);

  for (const fragment of fragments) {
    expect(text).toContain(normalizeText(fragment));
  }
}

async function firstVisibleByText(page: Page, selector: string, pattern: RegExp) {
  const locator = page.locator(selector).filter({ hasText: pattern });
  const count = await locator.count();

  for (let index = 0; index < count; index += 1) {
    const item = locator.nth(index);
    if (await item.isVisible().catch(() => false)) {
      return item;
    }
  }

  return locator.first();
}

async function gotoSearch(page: Page, query = '') {
  await page.goto(candidateUrl(`${env.routes.jobs}${query}`));
  await expectPageLoaded(page);
}

async function waitForSearchContent(page: Page) {
  await expect(resultHeading(page)).toBeVisible();
  await expect.poll(async () => (await jobCards(page).count()) + (await emptyState(page).count())).toBeGreaterThan(0);
  await expectNoSystemErrors(page);
}

async function expectSearchShell(page: Page) {
  await expect(keywordInput(page)).toBeVisible();
  await expect(locationDropdownButton(page)).toBeVisible();
  await expect(searchButton(page)).toBeVisible();
  await expect(resultHeading(page)).toBeVisible();
  await expect(sortSelect(page)).toBeVisible();
  await expect(levelFilter(page)).toBeVisible();
  await expect(workModeFilter(page)).toBeVisible();
}

async function submitSearch(page: Page, options?: { keyword?: string; locationKeyword?: string; locationLabel?: RegExp }) {
  const keyword = options?.keyword ?? '';

  if (keyword) {
    await keywordInput(page).fill(keyword);
  } else {
    await keywordInput(page).fill('');
  }

  if (options?.locationLabel) {
    await locationDropdownButton(page).click();
    await expect(locationSearchInput(page)).toBeVisible();

    if (options.locationKeyword) {
      await locationSearchInput(page).fill(options.locationKeyword);
    }

    const option = page.getByRole('button', { name: options.locationLabel }).first();
    await expect(option).toBeVisible();
    await option.click();
  }

  await searchButton(page).click();
  await expect(page).toHaveURL(/\/search/);
  await expectPageLoaded(page);
  await waitForSearchContent(page);
}

async function openLocationDropdown(page: Page) {
  await locationDropdownButton(page).click();
  await expect(locationSearchInput(page)).toBeVisible();
}

async function selectFilterOption(select: Locator, optionText: string) {
  await expect(select).toBeVisible();
  await select.selectOption({ label: optionText });
}

async function selectFirstJobCard(page: Page) {
  await expect.poll(async () => await jobCards(page).count()).toBeGreaterThan(0);
  const firstCard = jobCards(page).first();
  await expect(firstCard).toBeVisible();
  await firstCard.click();
  await expect(previewApplyLink(page)).toBeVisible();
}

async function openFirstJobDetail(page: Page, preferredKeyword = env.search.keyword) {
  const candidateKeywords = Array.from(new Set([preferredKeyword, 'Developer', 'Frontend', 'Backend'].filter(Boolean)));

  for (const keyword of candidateKeywords) {
    await gotoSearch(page, `?keyword=${encodeURIComponent(keyword)}`);
    await waitForSearchContent(page);

    if ((await jobCards(page).count()) === 0) {
      continue;
    }

    await selectFirstJobCard(page);

    const selectedTitle = (await jobCards(page).first().locator('h3').textContent())?.trim() || '';
    await previewApplyLink(page).click();
    await expect(page).toHaveURL(/\/job\/detail\//);
    await expectPageLoaded(page);
    await expect(detailTitle(page)).toBeVisible();

    if (selectedTitle) {
      await expect(detailTitle(page)).toContainText(new RegExp(escapeRegExp(selectedTitle), 'i'));
    }

    await expectNoSystemErrors(page);
    return;
  }

  throw new Error(`Could not find any searchable job detail for keywords: ${candidateKeywords.join(', ')}`);
}

async function expectResultsOrEmpty(page: Page) {
  await waitForSearchContent(page);
  expect((await jobCards(page).count()) > 0 || (await emptyState(page).count()) > 0).toBeTruthy();
}

async function expectAtLeastOneJob(page: Page) {
  await waitForSearchContent(page);
  await expect.poll(async () => await jobCards(page).count()).toBeGreaterThan(0);
}

async function getVisibleJobCardTexts(page: Page) {
  const count = await jobCards(page).count();
  const values: string[] = [];

  for (let index = 0; index < count; index += 1) {
    const text = normalizeText((await jobCards(page).nth(index).innerText()).trim());
    if (text) {
      values.push(text);
    }
  }

  return values;
}

const automatedCases: Record<string, TestRunner> = {
  'TC-JSD-001': async (page) => {
    await gotoSearch(page);
    await expectSearchShell(page);
    await waitForSearchContent(page);
  },

  'TC-JSD-002': async (page) => {
    await gotoSearch(page);
    await expectSearchShell(page);
    await expectResultsOrEmpty(page);
  },

  'TC-JSD-003': async (page) => {
    await gotoSearch(page);
    await expect(keywordInput(page)).toHaveAttribute('placeholder', /kỹ năng|ky nang|chức vụ|chuc vu|công ty|cong ty/i);
    await keywordInput(page).fill(env.search.keyword);
    await expect(keywordInput(page)).toHaveValue(env.search.keyword);
  },

  'TC-JSD-004': async (page) => {
    await gotoSearch(page);
    await openLocationDropdown(page);
    await expect(locationSearchInput(page)).toBeEditable();
    await expectBodyContains(page, 'Tat ca thanh pho');
  },

  'TC-JSD-005': async (page) => {
    await gotoSearch(page);
    await expect(levelFilter(page)).toBeVisible();
    await expect(workModeFilter(page)).toBeVisible();
    await expect(levelFilter(page)).toContainText(/Intern|Fresher|Junior|Middle|Senior/i);
    await expect(workModeFilter(page)).toContainText(/Hybrid|Remote|Tại văn phòng|Tai van phong/i);
  },

  'TC-JSD-006': async (page) => {
    await gotoSearch(page);
    await submitSearch(page, { keyword: env.search.keyword });
    await expect(page).toHaveURL(new RegExp(`keyword=${escapeRegExp(encodeURIComponent(env.search.keyword))}`));
    await expectResultsOrEmpty(page);
  },

  'TC-JSD-007': async (page) => {
    const keyword = 'Lập trình viên';
    await gotoSearch(page);
    await submitSearch(page, { keyword });
    await expect(keywordInput(page)).toHaveValue(keyword);
    await expectResultsOrEmpty(page);
  },

  'TC-JSD-008': async (page) => {
    const keyword = 'lap trinh vien';
    await gotoSearch(page);
    await submitSearch(page, { keyword });
    await expect(keywordInput(page)).toHaveValue(keyword);
    await expectResultsOrEmpty(page);
  },

  'TC-JSD-009': async (page) => {
    await gotoSearch(page);
    await submitSearch(page, { locationKeyword: 'Ha', locationLabel: /ha noi|hà nội/i });
    await expect(page).toHaveURL(/location=/);
    await expect(locationDropdownButton(page)).toContainText(/ha noi|hà nội/i);
    await expectResultsOrEmpty(page);
  },

  'TC-JSD-010': async (page) => {
    await gotoSearch(page);
    await submitSearch(page, {
      keyword: 'Frontend',
      locationKeyword: 'Ha',
      locationLabel: /ha noi|hà nội/i,
    });
    await expect(page).toHaveURL(/keyword=Frontend/);
    await expect(page).toHaveURL(/location=/);
    await expect(keywordInput(page)).toHaveValue('Frontend');
    await expectResultsOrEmpty(page);
  },

  'TC-JSD-011': async (page) => {
    await gotoSearch(page);
    await submitSearch(page, { keyword: '' });
    await expect(keywordInput(page)).toHaveValue('');
    await expectResultsOrEmpty(page);
  },

  'TC-JSD-012': async (page) => {
    await gotoSearch(page);
    await submitSearch(page, { keyword: 'abcxyzkhongcojob' });
    await expect(emptyState(page)).toBeVisible();
    await expectNoSystemErrors(page);
  },

  'TC-JSD-013': async (page) => {
    await gotoSearch(page);
    await submitSearch(page, { locationKeyword: 'Ha', locationLabel: /ha noi|hà nội/i });
    await expect(locationDropdownButton(page)).toContainText(/ha noi|hà nội/i);
    await expectResultsOrEmpty(page);
  },

  'TC-JSD-014': async (page) => {
    await gotoSearch(page);
    await submitSearch(page, { keyword: 'ReactJS' });
    await expect(keywordInput(page)).toHaveValue('ReactJS');
    await expectResultsOrEmpty(page);
  },

  'TC-JSD-015': async (page) => {
    await gotoSearch(page);
    await submitSearch(page, { keyword: 'Software' });
    await expect(keywordInput(page)).toHaveValue('Software');
    await expectResultsOrEmpty(page);
  },

  'TC-JSD-016': async (page) => {
    await gotoSearch(page);
    const statusSelect = page
      .locator('select')
      .filter({ has: page.locator('option', { hasText: /Đang tuyển|Dang tuyen|Open/i }) })
      .first();

    if (await statusSelect.count()) {
      await statusSelect.selectOption({ index: 1 });
    }

    await expectResultsOrEmpty(page);
  },

  'TC-JSD-017': async (page) => {
    await gotoSearch(page);
    await submitSearch(page, { keyword: 'Backend', locationKeyword: 'Ho', locationLabel: /ho chi minh|hồ chí minh/i });
    await selectFilterOption(levelFilter(page), 'Junior');
    await selectFilterOption(workModeFilter(page), 'Hybrid');
    await expectResultsOrEmpty(page);
  },

  'TC-JSD-018': async (page) => {
    await gotoSearch(page);
    await submitSearch(page, { keyword: 'Backend' });
    await selectFilterOption(levelFilter(page), 'Senior');
    await selectFilterOption(workModeFilter(page), 'Hybrid');

    const clearKeywordButton = page.getByLabel(/Xóa từ khóa|Xoa tu khoa/i).first();
    if (await clearKeywordButton.count()) {
      await clearKeywordButton.click();
    } else {
      await keywordInput(page).fill('');
    }

    await selectFilterOption(levelFilter(page), ALL_LEVELS_LABEL);
    await selectFilterOption(workModeFilter(page), ALL_WORK_MODES_LABEL);

    await expect(keywordInput(page)).toHaveValue('');
    await expect(levelFilter(page)).toHaveValue(ALL_LEVELS_LABEL);
    await expect(workModeFilter(page)).toHaveValue(ALL_WORK_MODES_LABEL);
    await expectResultsOrEmpty(page);
  },

  'TC-JSD-019': async (page) => {
    await gotoSearch(page);
    await submitSearch(page, { keyword: env.search.keyword });
    await expectAtLeastOneJob(page);
  },

  'TC-JSD-020': async (page) => {
    await gotoSearch(page, `?keyword=${encodeURIComponent(env.search.keyword)}`);
    await expectAtLeastOneJob(page);
    const firstCard = jobCards(page).first();
    await expect(firstCard.locator('h3')).toBeVisible();
    await expect(firstCard).toContainText(/Hybrid|Remote|Tại văn phòng|Tai van phong|Intern|Fresher|Junior|Middle|Senior/i);
    await expect(firstCard).not.toContainText(/undefined|null|NaN/i);
  },

  'TC-JSD-021': async (page) => {
    await gotoSearch(page, `?keyword=${encodeURIComponent(env.search.keyword)}`);
    await expectAtLeastOneJob(page);
    const cardTexts = await getVisibleJobCardTexts(page);
    expect(new Set(cardTexts).size).toBe(cardTexts.length);
  },

  'TC-JSD-022': async (page) => {
    await gotoSearch(page);
    await submitSearch(page, { keyword: 'abcxyzkhongcojob' });
    await expect(emptyState(page)).toBeVisible();
    await expectBodyContains(page, 'Chua tim thay viec lam phu hop');
  },

  'TC-JSD-023': async (page) => {
    await gotoSearch(page, `?keyword=${encodeURIComponent(env.search.keyword)}`);
    await expectAtLeastOneJob(page);

    if (await paginationNextButton(page).isVisible().catch(() => false)) {
      const firstPageCards = await getVisibleJobCardTexts(page);
      await paginationNextButton(page).click();
      await expect(paginationPrevButton(page)).toBeEnabled();
      await expectResultsOrEmpty(page);
      const nextPageCards = await getVisibleJobCardTexts(page);
      expect(nextPageCards.length > 0 || (await emptyState(page).count()) > 0).toBeTruthy();
      if (firstPageCards.length > 0 && nextPageCards.length > 0) {
        expect(firstPageCards.join('|')).not.toBe(nextPageCards.join('|'));
      }
      return;
    }

    await expect(jobCards(page).first()).toBeVisible();
  },

  'TC-JSD-024': async (page) => {
    await gotoSearch(page);
    await submitSearch(page, {
      keyword: 'Developer',
      locationKeyword: 'Ha',
      locationLabel: /ha noi|hà nội/i,
    });

    if (await paginationNextButton(page).isVisible().catch(() => false)) {
      await paginationNextButton(page).click();
      await expectResultsOrEmpty(page);
    }

    await expect(keywordInput(page)).toHaveValue('Developer');
    await expect(locationDropdownButton(page)).toContainText(/ha noi|hà nội/i);
  },

  'TC-JSD-025': async (page) => {
    await openFirstJobDetail(page);
    await expect(page).toHaveURL(/\/job\/detail\//);
    await expect(detailTitle(page)).toBeVisible();
  },

  'TC-JSD-026': async (page) => {
    await openFirstJobDetail(page);
    await expect(detailTitle(page)).toBeVisible();
    await expectBodyContains(page, 'Ky nang');
    await expectBodyContains(page, 'Linh vuc');
  },

  'TC-JSD-027': async (page) => {
    await openFirstJobDetail(page);
    await expectBodyContains(page, 'Mo ta cong viec');
    await expect(body(page)).not.toContainText(/undefined|null|NaN/i);
  },

  'TC-JSD-028': async (page) => {
    await openFirstJobDetail(page);
    await expectBodyContains(page, 'Yeu cau cong viec');
    await expect(body(page)).not.toContainText(/undefined|null|NaN/i);
  },

  'TC-JSD-029': async (page) => {
    await openFirstJobDetail(page);
    await expect(detailCompanyLink(page)).toBeVisible();
    await expectBodyContains(page, 'Company profile');
  },

  'TC-JSD-030': async (page) => {
    await gotoSearch(page, '?keyword=Developer');
    await waitForSearchContent(page);
    await selectFirstJobCard(page);
    await previewApplyLink(page).click();
    await expect(page).toHaveURL(/\/job\/detail\//);
    await page.goBack();
    await expect(page).toHaveURL(/\/search\?keyword=Developer/);
    await expect(keywordInput(page)).toHaveValue('Developer');
    await waitForSearchContent(page);
  },

  'TC-JSD-031': async (page) => {
    await openFirstJobDetail(page);
    await expect(await firstVisibleByText(page, 'a, button', /Ứng tuyển|Ung tuyen/i)).toBeVisible();
  },

  'TC-JSD-032': async (page) => {
    await openFirstJobDetail(page);
    await (await firstVisibleByText(page, 'a, button', /Ứng tuyển|Ung tuyen/i)).click();
    await expect(page).toHaveURL(/\/user\/login/);
    await expectPageLoaded(page);
  },

  'TC-JSD-033': async (page) => {
    await openFirstJobDetail(page);
    await expect(detailSaveButton(page)).toBeVisible();

    if (await detailSaveButton(page).isEnabled()) {
      await detailSaveButton(page).click();
      await expect(page).toHaveURL(/\/user\/login|\/job\/detail\//);
      return;
    }

    await expect(detailSaveButton(page)).toBeDisabled();
  },

  'TC-JSD-034': async (page) => {
    await openFirstJobDetail(page);
    await expect(detailCompanyLink(page)).toBeVisible();
    await detailCompanyLink(page).click();
    await expect(page).toHaveURL(/\/company\/detail\//);
    await expectPageLoaded(page);
    await expectNoSystemErrors(page);
  },

  'TC-JSD-035': async (page) => {
    await page.goto(candidateUrl('/job/detail/not-existing-job-id-for-test'));
    await expectPageLoaded(page);
    await expectBodyContains(page, 'Ma tin tuyen dung khong hop le');
    await expect(body(page)).not.toContainText(/Internal Server Error|Unhandled Runtime Error/i);
  },
};

test.describe('KIET_Job_Search_Detail', () => {
  for (const testCase of jobSearchDetailCases) {
    test(`${testCase.id} - ${testCase.title}`, async ({ page }) => {
      const run = mustHaveRunner(automatedCases[testCase.id], testCase.id);
      await run(page, testCase);
    });
  }
});
