import { expect, Page } from '@playwright/test';
import { CandidateLoginPage } from '../pages/CandidateLoginPage';
import { LoginPage } from '../pages/LoginPage';
import { candidateUrl, env, recruiterUrl } from './env';
import { expectNoSystemErrors, expectPageLoaded } from './assertions';

export async function loginAsRecruiter(page: Page) {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(env.users.recruiter.email, env.users.recruiter.password);
  await expectRecruiterLoggedIn(page);
}

export async function expectRecruiterLoggedIn(page: Page) {
  await expect(page).toHaveURL(new RegExp(recruiterUrl(env.routes.recruiterDashboard)));
  await expectPageLoaded(page);
  await expect(page.locator('body')).toContainText(env.users.recruiter.email);
  await expectNoSystemErrors(page);
}

export async function expectRecruiterLoggedOut(page: Page) {
  await page.goto(recruiterUrl(env.routes.recruiterDashboard));
  await expect(page).toHaveURL(/\/user\/login/);
}

export async function loginAsCandidate(page: Page) {
  const loginPage = new CandidateLoginPage(page);

  await loginPage.goto();
  await loginPage.login(env.users.candidate.email, env.users.candidate.password);
  await expectCandidateLoggedIn(page);
}

export async function expectCandidateLoggedIn(page: Page) {
  await expectPageLoaded(page);
  await expect(page.locator('body')).toContainText(/Candidate Test|Ứng viên|Ung vien/i);
  await expectNoSystemErrors(page);
}
