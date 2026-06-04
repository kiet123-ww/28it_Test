import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { env } from '../utils/env';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto(env.routes.home);
  }

  async expectVisible() {
    await this.expectPageReady();
    await expect(this.page.locator('body')).toContainText(/28\.ITJobs|ITJobs|tuyển dụng|tuyen dung/i);
  }
}
