import { test } from '@playwright/test';
import { JobSearchPage } from '../pages/JobSearchPage';
import { env } from '../utils/env';
import { expectPageNotContainSystemErrors } from '../utils/assertions';

test.describe('Job Search Detail', () => {
  test('TC-JSD-001 - Trang tìm kiếm việc làm hiển thị đúng', async ({ page }) => {
    const jobSearchPage = new JobSearchPage(page);

    await jobSearchPage.gotoJobSearchPage();

    await jobSearchPage.expectJobSearchPageVisible();
    await expectPageNotContainSystemErrors(page);
  });

  test('TC-JSD-002 - Tìm kiếm việc làm bằng keyword hợp lệ', async ({ page }) => {
    const jobSearchPage = new JobSearchPage(page);

    await jobSearchPage.gotoJobSearchPage();

    await jobSearchPage.searchJob(env.search.keyword);

    await jobSearchPage.expectSearchResultVisible();
    await expectPageNotContainSystemErrors(page);
  });

  test('TC-JSD-003 - Tìm kiếm việc làm theo keyword và địa điểm', async ({ page }) => {
    const jobSearchPage = new JobSearchPage(page);

    await jobSearchPage.gotoJobSearchPage();

    await jobSearchPage.searchJob(env.search.keyword, env.search.location);

    await jobSearchPage.expectSearchResultVisible();
    await expectPageNotContainSystemErrors(page);
  });

  test('TC-JSD-004 - Mở chi tiết việc làm đầu tiên nếu có kết quả', async ({ page }) => {
    const jobSearchPage = new JobSearchPage(page);

    await jobSearchPage.gotoJobSearchPage();

    await jobSearchPage.searchJob(env.search.keyword);

    const opened = await jobSearchPage.openFirstJobDetailIfExists();

    if (opened) {
      await jobSearchPage.expectJobDetailVisible();
    }

    await expectPageNotContainSystemErrors(page);
  });
});