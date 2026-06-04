import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class RegisterPage extends BasePage {
  readonly fullNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly registerButton: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    // Lưu ý: Các selector này được dự đoán dựa trên chuẩn Next.js, có thể cần điều chỉnh khi chạy thực tế
    this.fullNameInput = page.locator('input[name="fullName"], input[name="name"]');
    this.emailInput = page.locator('input[name="email"], input[type="email"]');
    this.passwordInput = page.locator('input[name="password"], input[type="password"]');
    this.confirmPasswordInput = page.locator('input[name="confirmPassword"]');
    this.registerButton = page.locator('button[type="submit"], button:has-text("Đăng ký")');
    this.errorMessage = page.locator('.error-message, .text-red-500, [role="alert"]');
    this.successMessage = page.locator('.success-message, .text-green-500');
  }

  async register(fullName: string, email: string, pass: string, confirmPass?: string) {
    await this.fillInput(this.fullNameInput, fullName);
    await this.fillInput(this.emailInput, email);
    await this.fillInput(this.passwordInput, pass);
    if (confirmPass) {
      await this.fillInput(this.confirmPasswordInput, confirmPass);
    }
    await this.clickElement(this.registerButton);
  }

  async verifyError(text?: string) {
    await expect(this.errorMessage.first()).toBeVisible({ timeout: 5000 });
    if (text) {
      await expect(this.errorMessage.first()).toContainText(text);
    }
  }

  async verifySuccess(text?: string) {
    await expect(this.successMessage.first()).toBeVisible({ timeout: 5000 });
    if (text) {
      await expect(this.successMessage.first()).toContainText(text);
    }
  }
}
