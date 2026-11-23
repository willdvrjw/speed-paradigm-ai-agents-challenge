import { test, expect } from '@playwright/test';

test.describe('cuando JavaScript está desactivado', () => {
  test.use({ javaScriptEnabled: false });
  test('muestra una explicación y una acción para volver a abrir Foco', async ({ page, context }) => {
    expect((await context.cookies()).length).toBe(0);
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { name: 'Activa JavaScript para usar Foco', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: /volver a cargar/i })).toBeVisible();
    await expect(page.getByText('Abriendo tu espacio…', { exact: true })).toHaveCount(0);
    await expect(page.getByText('Preparando tu espacio', { exact: true })).toHaveCount(0);
  });
});

test('explica cookies desactivadas sin intentar crear sesiones', async ({ page, context }) => {
  expect((await context.cookies()).length).toBe(0);
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'cookieEnabled', { configurable: true, get: () => false });
  });
  let privateRequests = 0;
  page.on('request', (request) => {
    if (/\/api\/(session|tasks)(?:\/|$)/.test(new URL(request.url()).pathname)) privateRequests += 1;
  });
  await page.goto('/');
  await expect(page.getByRole('main').getByRole('alert')).toContainText(/cookies/i);
  await expect(page.getByRole('button', { name: 'Nueva tarea', exact: true })).toBeDisabled();
  expect(privateRequests).toBe(0);
  await page.getByRole('button', { name: 'Reintentar', exact: true }).click();
  await expect(page.getByRole('main').getByRole('alert')).toContainText(/cookies/i);
  expect(privateRequests).toBe(0);
});
