import { defineConfig, devices } from '@playwright/test';

const accessSmoke = process.env.PLAYWRIGHT_ACCESS_SMOKE === '1';

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: accessSmoke ? '**/access-smoke.spec.ts' : '**/*.spec.ts',
  testIgnore: accessSmoke ? [] : ['**/access-smoke.spec.ts'],
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 90_000,
  expect: { timeout: 15_000 },
  reporter: 'line',
  outputDir: 'test-results',
  projects: accessSmoke ? [
    { name: 'chrome-desktop', use: { browserName: 'chromium', channel: 'chrome', locale: 'en-US', timezoneId: 'UTC' } },
    { name: 'edge-desktop', use: { browserName: 'chromium', channel: 'msedge', locale: 'es-ES', timezoneId: 'Europe/Madrid' } },
    { name: 'firefox-desktop', use: { browserName: 'firefox', locale: 'fr-FR', timezoneId: 'Europe/Paris' } },
    { name: 'webkit-mobile', use: { ...devices['iPhone 13'], browserName: 'webkit', locale: 'ja-JP', timezoneId: 'Asia/Tokyo' } },
  ] : undefined,
  use: {
    baseURL: process.env.TEST_BASE_URL ?? 'http://localhost:3000',
    browserName: 'chromium',
    channel: accessSmoke ? undefined : process.env.PLAYWRIGHT_CHANNEL ?? 'chrome',
    headless: true,
    viewport: { width: 1440, height: 1000 },
    locale: 'es-CO',
    timezoneId: 'America/Bogota',
    screenshot: 'only-on-failure',
    trace: 'off',
    video: 'off',
  },
});
