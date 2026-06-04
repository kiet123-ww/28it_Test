import { expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { env } from '../utils/env';
import {
  expectPageLoaded,
  expectPageNotContainSystemErrors,
} from '../utils/assertions';

export async function expectCandidateLoggedIn(page: Page) {
  // Truy cập trang cần quyền đăng nhập
  await page.goto('/user-manage/profile');

  await expectPageLoaded(page);

  // Không được bị chuyển về trang login
  await expect(page).not.toHaveURL(/user\/login/);

  // Phải ở đúng khu vực profile
  await expect(page).toHaveURL(/user-manage\/profile/);

  // Điều kiện quan trọng nhất:
  // Phải thấy email thật của candidate trong trang profile
  await expect(
    page.getByText(env.users.candidate.email)
  ).toBeVisible();

  // Kiểm tra thêm nội dung đặc trưng của profile
  await expect(
    page.getByText(/Thông tin cá nhân/i)
  ).toBeVisible();

  await expectPageNotContainSystemErrors(page);
}

export async function expectCandidateNotLoggedIn(page: Page) {
  // Thử truy cập trang cần quyền đăng nhập
  await page.goto('/user-manage/profile');

  await expectPageLoaded(page);

  // Không được thấy dữ liệu thật của candidate
  await expect(
    page.getByText(env.users.candidate.email)
  ).not.toBeVisible();

  // Không được thấy nội dung profile thật
  await expect(
    page.getByText(/Thông tin cá nhân/i)
  ).not.toBeVisible();

  await expectPageNotContainSystemErrors(page);
}

export async function loginAsCandidate(page: Page) {
  const loginPage = new LoginPage(page);

  await loginPage.gotoLoginPage();

  await loginPage.login(
    env.users.candidate.email,
    env.users.candidate.password
  );

  await expectCandidateLoggedIn(page);
}