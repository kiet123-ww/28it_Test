import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

const baseURL = process.env.BASE_URL || 'http://localhost:3000';

export default defineConfig({
  testDir: './tests',

  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },

  fullyParallel: false,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : 1,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],

  use: {
    baseURL,

    headless: true,

    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    actionTimeout: 10_000,
    navigationTimeout: 20_000,
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],

  webServer:
    process.env.PW_START_APP === '1'
      ? [
          {
            command: 'npm run dev',
            cwd: 'D:/Fullstack/Project-CNPM/recruitment-backend',
            url: `${process.env.API_URL || 'http://localhost:5000'}/health`,
            reuseExistingServer: true,
            timeout: 120_000,
          },
          {
            command: 'npm run dev',
            cwd: 'D:/Fullstack/Project-CNPM/recruitment-client',
            url: baseURL,
            reuseExistingServer: true,
            timeout: 120_000,
            env: {
              NEXT_PUBLIC_API_URL: process.env.API_URL || 'http://localhost:5000',
            },
          },
        ]
      : undefined,
});
