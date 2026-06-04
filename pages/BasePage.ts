import { expect, Locator, Page } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(pathOrUrl: string) {
    await this.page.goto(pathOrUrl);
    await this.page.waitForLoadState('domcontentloaded');
  }

  locator(selectors: string[]): Locator {
    return this.page.locator(selectors.join(', ')).first();
  }

  async fill(selectors: string[], value: string) {
    const field = this.locator(selectors);
    await expect(field).toBeVisible();
    await field.fill(value);
  }

  async click(selectors: string[]) {
    const target = this.locator(selectors);
    await expect(target).toBeVisible();
    await target.click();
  }

  async fillInput(locator: Locator, value: string) {
    await expect(locator.first()).toBeVisible();
    await locator.first().fill(value);
  }

  async clickElement(locator: Locator) {
    await expect(locator.first()).toBeVisible();
    await locator.first().click();
  }

  async getByPossibleSelectors(selectors: string[]): Promise<Locator> {
    return this.locator(selectors);
  }

  async fillFirstAvailable(selectors: string[], value: string) {
    await this.fill(selectors, value);
  }

  async clickFirstAvailable(selectors: string[]) {
    await this.click(selectors);
  }

  async expectPageReady() {
    await expect(this.page.locator('body')).toBeVisible();
  }

  async expectBodyVisible() {
    await this.expectPageReady();
  }

  async expectNoCommonSystemErrors() {
    const body = this.page.locator('body');

    await expect(body).not.toContainText(/undefined|null|NaN|Internal Server Error/i);
  }
}
