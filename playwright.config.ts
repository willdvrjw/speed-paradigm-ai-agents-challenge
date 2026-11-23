import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 90_000,
  expect: { timeout: 15_000 },
  reporter: 'line',
  outputDir: 'test-results',
  use: {
    baseURL: process.env.TEST_BASE_URL ?? 'http://127.0.0.1:3000',
    browserName: 'chromium',
    channel: process.env.PLAYWRIGHT_CHANNEL ?? 'chrome',
    headless: true,
    viewport: { width: 1440, height: 1000 },
    locale: 'es-CO',
    timezoneId: 'America/Bogota',
    screenshot: 'only-on-failure',
    trace: 'off',
    video: 'off',
  },
});
