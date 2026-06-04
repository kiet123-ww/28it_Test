import { expect, Page } from '@playwright/test';

export class CandidateDashboardPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/candidate/dashboard');
  }

  async expectDashboardVisible() {
    await expect(this.page).toHaveURL(/candidate|dashboard/);
  }
}