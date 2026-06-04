import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { env } from '../utils/env';

export class AdminPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async gotoLogin() {
    await super.goto(env.routes.adminLogin);
  }

  async expectVisible() {
    await this.expectPageReady();
  }
}
