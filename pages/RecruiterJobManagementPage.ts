import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { env } from '../utils/env';

export class RecruiterJobManagementPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto(env.routes.jobManagement);
  }

  async expectVisible() {
    await this.expectPageReady();
  }
}
