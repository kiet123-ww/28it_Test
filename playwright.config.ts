import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

// Đọc biến môi trường từ file .env
dotenv.config();

export default defineConfig({
  testDir: './tests',
  /* Chạy các bài test đồng thời */
  fullyParallel: true,
  /* Dừng test nếu .only được sử dụng (trong CI) */
  forbidOnly: !!process.env.CI,
  /* Retries khi fail */
  retries: process.env.CI ? 2 : 0,
  /* Số lượng workers song song */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter */
  reporter: 'html',
  /* Cấu hình chung cho mọi browser */
  use: {
    /* Base URL từ biến môi trường hoặc mặc định là localhost:3000 */
    baseURL: process.env.BASE_URL || 'http://localhost:3000',

    /* Thu thập trace khi test fail */
    trace: 'on-first-retry',
    /* Thu thập ảnh chụp màn hình khi test fail */
    screenshot: 'only-on-failure',
    /* Quay video khi test fail */
    video: 'retain-on-failure',
  },

  /* Cấu hình chạy trên các trình duyệt khác nhau */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    /* Test trên môi trường Mobile */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
});