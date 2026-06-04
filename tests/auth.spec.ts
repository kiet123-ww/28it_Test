import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';

test.describe('Authentication Module (EP & BVA)', () => {

  test.describe('Login (EPBVA-001)', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
      loginPage = new LoginPage(page);
      await loginPage.navigateTo('/login');
    });

    test('TC-LOGIN-01: Đăng nhập thành công với tài khoản ứng viên hợp lệ (Active)', async () => {
      await loginPage.login('candidate_active@example.com', 'ValidPass123!');
      await loginPage.verifySuccessNavigation('/dashboard');
    });

    test('TC-LOGIN-02: Đăng nhập thất bại do sai mật khẩu', async () => {
      await loginPage.login('candidate_active@example.com', 'WrongPass123!');
      await loginPage.verifyErrorIsDisplayed();
    });

    test('TC-LOGIN-03: Đăng nhập thất bại do tài khoản bị khóa (Locked)', async () => {
      await loginPage.login('candidate_locked@example.com', 'ValidPass123!');
      await loginPage.verifyErrorIsDisplayed();
    });
  });

  test.describe('Register (EPBVA-002)', () => {
    let registerPage: RegisterPage;

    test.beforeEach(async ({ page }) => {
      registerPage = new RegisterPage(page);
      await registerPage.navigateTo('/register');
    });

    test('TC-REG-01: Đăng ký thành công với thông tin hợp lệ', async () => {
      const randomEmail = `newuser${Date.now()}@example.com`;
      await registerPage.register('Nguyen Van A', randomEmail, 'StrongPass123!', 'StrongPass123!');
      await registerPage.verifySuccess();
    });

    test('TC-REG-02: Đăng ký thất bại khi email đã tồn tại', async () => {
      await registerPage.register('Nguyen Van A', 'candidate_active@example.com', 'StrongPass123!', 'StrongPass123!');
      await registerPage.verifyError();
    });

    test('TC-REG-03: Đăng ký thất bại khi mật khẩu quá yếu (không đủ điều kiện)', async () => {
      await registerPage.register('Nguyen Van A', 'testweak@example.com', '123', '123');
      await registerPage.verifyError();
    });
  });

});
