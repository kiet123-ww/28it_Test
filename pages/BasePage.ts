import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(url: string) {
    await this.page.goto(url);
  }

  async waitForElement(selector: string | Locator) {
    if (typeof selector === 'string') {
      await this.page.waitForSelector(selector);
    } else {
      await selector.waitFor();
    }
  }

  async fillInput(selector: string | Locator, text: string) {
    if (typeof selector === 'string') {
      await this.page.fill(selector, text);
    } else {
      await selector.fill(text);
    }
  }

  async clickElement(selector: string | Locator) {
    if (typeof selector === 'string') {
      await this.page.click(selector);
    } else {
      await selector.click();
    }
  }
}
