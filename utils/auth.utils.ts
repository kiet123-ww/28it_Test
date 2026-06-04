import { expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { env } from './env';
import { expectNoSystemErrors, expectPageLoaded } from './assertions';

export async function loginAsRecruiter(page: Page) {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(env.users.recruiter.email, env.users.recruiter.password);
  await expectRecruiterLoggedIn(page);
}

export async function expectRecruiterLoggedIn(page: Page) {
  await expect(page).toHaveURL(new RegExp(env.routes.recruiterDashboard));
  await expectPageLoaded(page);
  await expect(page.locator('body')).toContainText(env.users.recruiter.email);
  await expectNoSystemErrors(page);
}

export async function expectRecruiterLoggedOut(page: Page) {
  await page.goto(env.routes.recruiterDashboard);
  await expect(page).toHaveURL(/\/user\/login/);
}
