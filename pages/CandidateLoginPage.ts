import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { candidateUrl, env } from '../utils/env';

const emailSelectors = ['#email', 'input[name="email"]', 'input[type="email"]'];
const passwordSelectors = ['#password', 'input[name="password"]', 'input[type="password"]'];
const submitSelectors = ['#loginForm button[type="submit"]', 'button[type="submit"]'];

export class CandidateLoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto(candidateUrl(env.routes.candidateLogin));
  }

  emailInput() {
    return this.locator(emailSelectors);
  }

  passwordInput() {
    return this.locator(passwordSelectors);
  }

  async expectLoaded() {
    await this.expectPageReady();
    await expect(this.emailInput()).toBeVisible();
    await expect(this.passwordInput()).toBeVisible();
    await expect(this.locator(submitSelectors)).toBeVisible();
  }

  async login(email: string, password: string) {
    await this.fill(emailSelectors, email);
    await this.fill(passwordSelectors, password);
    await this.click(submitSelectors);
  }
}
