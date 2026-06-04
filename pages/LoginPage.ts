import { expect, Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.page.getByRole('textbox').first().fill(email);
    await this.page.getByLabel(/password|mật khẩu/i).fill(password);
    await this.page.getByRole('button', { name: /login|đăng nhập/i }).click();
  }

  async expectLoginPageVisible() {
    await expect(
      this.page.getByRole('button', { name: /login|đăng nhập/i })
    ).toBeVisible();
  }
}