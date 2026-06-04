import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

const baseURL = process.env.BASE_URL || 'http://localhost:3000';
const candidateBaseURL = process.env.CANDIDATE_BASE_URL || baseURL;
const recruiterBaseURL = process.env.RECRUITER_BASE_URL || 'http://localhost:3001';
const candidateApiURL = process.env.CANDIDATE_API_URL || 'http://localhost:4000';
const recruiterApiURL = process.env.RECRUITER_API_URL || process.env.API_URL || 'http://localhost:5000';
const adminBaseURL = process.env.ADMIN_BASE_URL || 'http://localhost:3003';
const adminApiURL = process.env.ADMIN_API_URL || 'http://localhost:4100';

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
            command: 'yarn start',
            cwd: 'D:/Fullstack/Project-CNPM/my-backend',
            url: `${candidateApiURL}/auth/csrf`,
            reuseExistingServer: true,
            timeout: 120_000,
            env: {
              PORT: new URL(candidateApiURL).port || '4000',
              FRONTEND_ORIGIN: candidateBaseURL,
            },
          },
          {
            command: `npx next dev --webpack -p ${new URL(candidateBaseURL).port || '3002'}`,
            cwd: 'D:/Fullstack/Project-CNPM/my-fronted',
            url: candidateBaseURL,
            reuseExistingServer: true,
            timeout: 120_000,
            env: {
              NEXT_PUBLIC_API_URL: candidateApiURL,
              NEXT_PUBLIC_RECRUITMENT_API_URL: recruiterApiURL,
            },
          },
          {
            command: 'npm run dev',
            cwd: 'D:/Fullstack/Project-CNPM/recruitment-backend',
            url: `${recruiterApiURL}/health`,
            reuseExistingServer: true,
            timeout: 120_000,
            env: {
              PORT: new URL(recruiterApiURL).port || '5000',
              FRONTEND_ORIGIN: recruiterBaseURL,
              CLIENT_URL: recruiterBaseURL,
            },
          },
          {
            command: `npx next dev -p ${new URL(recruiterBaseURL).port || '3001'}`,
            cwd: 'D:/Fullstack/Project-CNPM/recruitment-client',
            url: recruiterBaseURL,
            reuseExistingServer: true,
            timeout: 120_000,
            env: {
              NEXT_PUBLIC_API_URL: recruiterApiURL,
            },
          },
          {
            command: 'npm run dev',
            cwd: 'D:/Fullstack/Project-CNPM/Admin-web-backend',
            url: `${adminApiURL}/api/admin/auth/check`,
            reuseExistingServer: true,
            timeout: 120_000,
            env: {
              PORT: new URL(adminApiURL).port || '4100',
              FRONTEND_ORIGIN: adminBaseURL,
            },
          },
          {
            command: `npx next dev --webpack -p ${new URL(adminBaseURL).port || '3003'}`,
            cwd: 'D:/Fullstack/Project-CNPM/Admin-web',
            url: adminBaseURL,
            reuseExistingServer: true,
            timeout: 120_000,
            env: {
              ADMIN_ENTRY_SLUG: 'admin',
              NEXT_PUBLIC_ADMIN_API_URL: adminApiURL,
              NEXT_PUBLIC_RECRUITMENT_API_URL: recruiterApiURL,
              NEXT_PUBLIC_PUBLIC_SITE_ORIGIN: candidateBaseURL,
            },
          },
        ]
      : undefined,
});
