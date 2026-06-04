import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('input[name="email"], input[type="email"]');
    this.passwordInput = page.locator('input[name="password"], input[type="password"]');
    this.loginButton = page.locator('button[type="submit"], button:has-text("Đăng nhập")');
    this.errorMessage = page.locator('.error-message, .alert-danger, [role="alert"]');
  }

  async login(email: string, pass: string) {
    await this.fillInput(this.emailInput, email);
    await this.fillInput(this.passwordInput, pass);
    await this.clickElement(this.loginButton);
  }

  async verifyErrorIsDisplayed() {
    await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
  }

  async verifySuccessNavigation(expectedUrlPart: string) {
    await this.page.waitForURL(new RegExp(expectedUrlPart), { timeout: 10000 });
    expect(this.page.url()).toContain(expectedUrlPart);
  }
}