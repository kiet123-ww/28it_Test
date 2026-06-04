import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { env } from '../utils/env';

const emailSelectors = [
  'input[name="email"]',
  'input[type="email"]',
  'input[placeholder="Email"]',
];

const passwordSelectors = [
  'input[name="password"]',
  'input[type="password"]',
];

const submitSelectors = [
  'button[type="submit"]',
  'input[type="submit"]',
];

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto(env.routes.login);
  }

  emailInput() {
    return this.locator(emailSelectors);
  }

  passwordInput() {
    return this.locator(passwordSelectors);
  }

  submitButton() {
    return this.locator(submitSelectors);
  }

  async expectLoaded() {
    await this.expectPageReady();
    await expect(this.emailInput()).toBeVisible();
    await expect(this.passwordInput()).toBeVisible();
    await expect(this.submitButton()).toBeVisible();
  }

  async fillEmail(email: string) {
    await this.fill(emailSelectors, email);
  }

  async fillPassword(password: string) {
    await this.fill(passwordSelectors, password);
  }

  async submit() {
    await this.click(submitSelectors);
  }

  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.submit();
  }

  async expectValidationError(pattern: RegExp) {
    await expect(this.page.locator('body')).toContainText(pattern);
  }

  async expectLoginFailed() {
    await expect(this.page.locator('body')).toContainText(
      /sai|không|khong|thất bại|that bai|invalid|error|khóa|khoa|tài khoản|tai khoan|mật khẩu|mat khau/i
    );
    await expect(this.page).toHaveURL(/\/user\/login/);
  }
}
