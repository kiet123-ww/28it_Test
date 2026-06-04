import { expect, Page } from '@playwright/test';

export class JobSearchPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/jobs');
  }

  async search(keyword: string) {
    await this.page.getByPlaceholder(/search|tìm kiếm|keyword|việc làm/i).fill(keyword);
    await this.page.getByRole('button', { name: /search|tìm kiếm/i }).click();
  }

  async expectSearchPageVisible() {
    await expect(this.page).toHaveURL(/job|jobs|search|viec-lam/);
  }
}