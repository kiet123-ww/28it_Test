import { expect, Page } from '@playwright/test';

export async function expectPageLoaded(page: Page) {
  await page.waitForLoadState('domcontentloaded');
}

export async function expectUrlContains(page: Page, text: string) {
  await expect(page).toHaveURL(new RegExp(text));
}

export async function expectPageNotContainSystemErrors(page: Page) {
  const body = page.locator('body');

  await expect(body).not.toContainText('undefined');
  await expect(body).not.toContainText('null');
  await expect(body).not.toContainText('NaN');
  await expect(body).not.toContainText('Internal Server Error');
}