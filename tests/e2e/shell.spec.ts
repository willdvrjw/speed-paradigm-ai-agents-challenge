import { test, expect } from '@playwright/test';

test('el documento y el estado de error son accesibles en escritorio y móvil', async ({ page }, testInfo) => {
  await page.route('**/api/session', (route) => route.abort('failed'));
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.getByRole('main')).toHaveCount(1);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('importante.');
  await expect(page.getByRole('main').getByRole('alert')).toContainText('No pudimos conectar');
  await expect(page.getByRole('button', { name: 'Reintentar', exact: true })).toBeEnabled();
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Ir al tablero', exact: true });
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
  expect(await skip.evaluate((element) => getComputedStyle(element).outlineStyle)).not.toBe('none');
  await page.screenshot({ path: testInfo.outputPath('desktop-error.png'), fullPage: true });
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await expect(page.getByRole('button', { name: 'Reintentar', exact: true })).toBeVisible();
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: testInfo.outputPath('mobile-error.png'), fullPage: true });
});
