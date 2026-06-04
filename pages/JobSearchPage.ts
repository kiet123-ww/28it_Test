import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { env } from '../utils/env';

export class JobSearchPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async gotoJobSearchPage() {
    await this.goto(env.routes.jobs);
  }

  async expectJobSearchPageVisible() {
    await this.expectBodyVisible();

    const body = this.page.locator('body');

    await expect(body).toContainText(/job|việc làm|tuyển dụng|search|tìm kiếm/i);
  }

  async fillKeyword(keyword: string) {
    await this.fillFirstAvailable(
      [
        'input[name="keyword"]',
        'input[name="search"]',
        'input[placeholder*="keyword" i]',
        'input[placeholder*="search" i]',
        'input[placeholder*="tìm" i]',
        'input[placeholder*="công việc" i]',
        'input[type="search"]',
        'input[type="text"]',
      ],
      keyword
    );
  }

  async fillLocation(location: string) {
    const possibleLocationInputs = [
      'input[name="location"]',
      'input[placeholder*="location" i]',
      'input[placeholder*="địa điểm" i]',
      'input[placeholder*="thành phố" i]',
      'input[placeholder*="city" i]',
    ];

    const matchedInputCount = await this.page.locator(possibleLocationInputs.join(',')).count();

    if (matchedInputCount > 0) {
      await this.fillFirstAvailable(possibleLocationInputs, location);
    }
  }

  async clickSearchButton() {
    const possibleButtons = [
      'button[type="submit"]',
      'button:has-text("Search")',
      'button:has-text("Tìm kiếm")',
      'button:has-text("Tìm")',
    ];

    const matchedButtonCount = await this.page.locator(possibleButtons.join(',')).count();

    if (matchedButtonCount > 0) {
      await this.clickFirstAvailable(possibleButtons);
    } else {
      await this.page.keyboard.press('Enter');
    }
  }

  async searchJob(keyword: string, location?: string) {
    await this.fillKeyword(keyword);

    if (location) {
      await this.fillLocation(location);
    }

    await this.clickSearchButton();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectSearchResultVisible() {
    const body = this.page.locator('body');

    await expect(body).toContainText(/job|việc làm|developer|tuyển dụng|ứng tuyển|company|công ty/i);
  }

  async openFirstJobDetailIfExists() {
    const possibleJobCards = [
      'a:has-text("Developer")',
      'a:has-text("Chi tiết")',
      'a:has-text("Xem chi tiết")',
      'a[href*="job"]',
      'a[href*="jobs"]',
    ];

    const links = this.page.locator(possibleJobCards.join(','));

    if ((await links.count()) === 0) {
      return false;
    }

    await links.first().click();
    await this.page.waitForLoadState('domcontentloaded');

    return true;
  }

  async expectJobDetailVisible() {
    const body = this.page.locator('body');

    await expect(body).toContainText(/mô tả|description|yêu cầu|requirement|ứng tuyển|apply|salary|lương/i);
  }
}