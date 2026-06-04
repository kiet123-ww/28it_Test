import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { env } from '../utils/env';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async gotoLoginPage() {
    await this.goto(env.routes.login);
  }

  async expectLoginPageVisible() {
    await this.expectBodyVisible();

    const body = this.page.locator('body');

    await expect(body).toContainText(/login|đăng nhập|email|password|mật khẩu/i);
  }

  async fillEmail(email: string) {
    await this.fillFirstAvailable(
      [
        'input[name="email"]',
        'input[type="email"]',
        'input[placeholder*="email" i]',
        'input[placeholder*="Email" i]',
        'input[placeholder*="tài khoản" i]',
      ],
      email
    );
  }

  async fillPassword(password: string) {
    await this.fillFirstAvailable(
      [
        'input[name="password"]',
        'input[type="password"]',
        'input[placeholder*="password" i]',
        'input[placeholder*="mật khẩu" i]',
      ],
      password
    );
  }

  async clickLoginButton() {
    await this.clickFirstAvailable([
      'button[type="submit"]',
      'button:has-text("Login")',
      'button:has-text("Đăng nhập")',
      'input[type="submit"]',
    ]);
  }

  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLoginButton();
  }

  async expectLoginFailedMessage() {
    const body = this.page.locator('body');

    await expect(body).toContainText(
      /sai|không đúng|invalid|failed|error|thất bại|email|password|mật khẩu/i
    );
  }
}