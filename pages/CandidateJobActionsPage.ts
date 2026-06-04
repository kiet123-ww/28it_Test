import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CandidateJobActionsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async expectVisible() {
    await this.expectPageReady();
  }
}
