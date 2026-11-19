import { defineConfig } from '@playwright/test';
import { API_URL } from './fixtures/api';

// Frontend dev server (Angular CLI default port).
const WEB_URL = process.env.E2E_WEB_URL ?? 'http://localhost:4200';

export default defineConfig({
  testDir: './tests',
  globalSetup: './global-setup.ts',
  // The tests share one database (reset once in globalSetup), so they run one at a time.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: WEB_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop-chromium', use: { browserName: 'chromium', viewport: { width: 1280, height: 800 } } },
    {
      name: 'mobile-chromium',
      use: { browserName: 'chromium', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
    },
  ],
  webServer: [
    {
      // Backend against sidequest_test: migrate + seed from scratch, then start (the test router is mounted).
      command: 'npm run db:reset && npx tsx src/server.ts',
      cwd: '../backend',
      env: { NODE_ENV: 'test' },
      url: `${API_URL}/api/v1/health`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: 'npm start',
      cwd: '../frontend',
      url: WEB_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
    },
  ],
});
