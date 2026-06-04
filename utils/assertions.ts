import { expect, Page } from '@playwright/test';

export async function expectPageLoaded(page: Page) {
  await page.waitForLoadState('domcontentloaded');
  await expect(page.locator('body')).toBeVisible();
}

export async function expectNoSystemErrors(page: Page) {
  const body = page.locator('body');

  await expect(body).not.toContainText(/undefined|null|NaN/i);
  await expect(body).not.toContainText(
    /Internal Server Error|Application error|Something went wrong|Unhandled Runtime Error|404|500/i
  );
}

export const expectPageNotContainSystemErrors = expectNoSystemErrors;

export async function expectProtectedRedirectToLogin(page: Page) {
  await expect(page).toHaveURL(/\/user\/login/);
}
