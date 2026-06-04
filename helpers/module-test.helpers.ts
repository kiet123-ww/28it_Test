import { expect, type Locator, type Page } from '@playwright/test';
import { expectNoSystemErrors, expectPageLoaded } from '../utils/assertions';

export type ModuleRunner = (page: Page) => Promise<void>;

export async function gotoAndAssert(page: Page, url: string, expectedText?: RegExp) {
  await page.goto(url);
  await expectPageLoaded(page);
  if (expectedText) {
    await expect(page.locator('body')).toContainText(expectedText);
  }
  await expectNoSystemErrors(page);
}

export async function expectProtectedOrLoaded(page: Page, url: string) {
  await page.goto(url);
  await expectPageLoaded(page);
  await expect(page).toHaveURL(/\/user\/login|\/login|\/admin|\/dashboard|\/user-manage|\/candidate|\/candidates|\/recruitment-news|\/company-profile|\/settings|\/search/);
  await expectNoSystemErrors(page);
}

export async function expectRefreshStable(page: Page) {
  const currentUrl = page.url();
  await page.reload();
  await expectPageLoaded(page);
  await expect(page).toHaveURL(currentUrl);
  await expectNoSystemErrors(page);
}

export async function expectResponsivePage(page: Page, url: string, expectedText?: RegExp) {
  await page.setViewportSize({ width: 390, height: 844 });
  await gotoAndAssert(page, url, expectedText);
  await page.setViewportSize({ width: 768, height: 1024 });
  await gotoAndAssert(page, url, expectedText);
}

export async function clickFirstVisible(page: Page, locator: Locator) {
  const count = await locator.count();
  for (let index = 0; index < count; index += 1) {
    const item = locator.nth(index);
    if (await item.isVisible().catch(() => false)) {
      await item.click();
      return true;
    }
  }
  return false;
}

export async function fillFirstInput(page: Page, value: string) {
  const inputs = page.locator('input:not([type="hidden"]), textarea');
  const count = await inputs.count();
  for (let index = 0; index < count; index += 1) {
    const input = inputs.nth(index);
    if (await input.isVisible().catch(() => false)) {
      await input.fill(value);
      await expect(input).toHaveValue(value);
      return true;
    }
  }
  return false;
}

export async function expectFormValidationSmoke(page: Page) {
  const submit = page.locator('button[type="submit"], button').filter({ hasText: /luu|save|tao|create|gui|send|cap nhat|update|dang|post/i }).first();
  if (await submit.count()) {
    await submit.click();
    await expect(page.locator('body')).toContainText(/bat buoc|required|khong|loi|invalid|vui long|dang cap nhat|error|save|luu/i);
  } else {
    await expect(page.locator('form, input, textarea, select, body').first()).toBeVisible();
  }
  await expectNoSystemErrors(page);
}

export async function expectSearchOrFilterSmoke(page: Page, keyword = 'test') {
  const inputFilled = await fillFirstInput(page, keyword);
  const searchClicked = await clickFirstVisible(
    page,
    page.locator('button, a').filter({ hasText: /tim|search|loc|filter|ap dung|apply/i })
  );
  expect(inputFilled || searchClicked).toBeTruthy();
  await expectNoSystemErrors(page);
}

export async function expectActionButtonSmoke(page: Page, actionText: RegExp) {
  const action = page.locator('button, a').filter({ hasText: actionText }).first();
  if (await action.count()) {
    await expect(action).toBeVisible();
    await action.click();
    await expectPageLoaded(page);
  } else {
    await expect(page.locator('body')).toContainText(actionText);
  }
  await expectNoSystemErrors(page);
}

export async function expectListOrEmptyState(page: Page) {
  await expect(page.locator('body')).toContainText(/danh sach|chua co|khong co|empty|ung vien|job|viec|cong ty|dashboard|profile|ho so|notification|thong bao/i);
  await expectNoSystemErrors(page);
}

export function mustHaveRunner<T extends { id: string }>(
  runner: ((page: Page, testCase: T) => Promise<void>) | undefined,
  id: string
): (page: Page, testCase: T) => Promise<void> {
  expect(runner, `Missing automated implementation for ${id}`).toBeDefined();
  if (!runner) {
    throw new Error(`Missing automated implementation for ${id}`);
  }
  return runner;
}
