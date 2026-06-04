import { expect, Locator, Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string) {
    await this.page.goto(path);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getByPossibleSelectors(selectors: string[]): Promise<Locator> {
    for (const selector of selectors) {
      const locator = this.page.locator(selector).first();

      if (await locator.count()) {
        return locator;
      }
    }

    return this.page.locator(selectors[0]).first();
  }

  async fillFirstAvailable(selectors: string[], value: string) {
    const locator = await this.getByPossibleSelectors(selectors);
    await expect(locator).toBeVisible();
    await locator.fill(value);
  }

  async clickFirstAvailable(selectors: string[]) {
    const locator = await this.getByPossibleSelectors(selectors);
    await expect(locator).toBeVisible();
    await locator.click();
  }

  async expectBodyVisible() {
    await expect(this.page.locator('body')).toBeVisible();
  }

  async expectNoCommonSystemErrors() {
    const body = this.page.locator('body');

    await expect(body).not.toContainText('undefined');
    await expect(body).not.toContainText('null');
    await expect(body).not.toContainText('NaN');
    await expect(body).not.toContainText('Internal Server Error');
  }
}