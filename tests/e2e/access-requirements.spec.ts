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

test('sesión aparentemente creada sin cookie retenida explica cómo recuperarla sin nuevas altas automáticas', async ({ page }) => {
  let sessions = 0;
  let reads = 0;
  await page.route('**/api/session', (route) => { sessions++; return route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }); });
  await page.route('**/api/tasks', (route) => { reads++; return route.fulfill({ status: 401, contentType: 'application/json', body: '{"error":"Sesión no retenida"}' }); });
  await page.goto('/');
  await expect(page.getByRole('main').getByRole('alert')).toContainText('No pudimos conservar tu sesión');
  await expect(page.getByRole('main').getByRole('alert')).toContainText('Permite las cookies');
  await expect(page.getByRole('button', { name: 'Nueva tarea', exact: true })).toBeDisabled();
  expect(sessions).toBe(1);
  expect(reads).toBe(1);
});

test('rechazo de sesión conserva el error original y no continúa hacia tareas', async ({ page }) => {
  let sessions = 0;
  let reads = 0;
  await page.route('**/api/session', (route) => { sessions++; return route.fulfill({ status: 401, contentType: 'application/json', body: '{"error":"Conserva tu espacio original"}' }); });
  await page.route('**/api/tasks', (route) => { reads++; return route.abort(); });
  await page.goto('/');
  await expect(page.getByRole('main').getByRole('alert')).toContainText('Conserva tu espacio original');
  expect(sessions).toBe(1);
  expect(reads).toBe(0);
  await page.getByRole('button', { name: 'Reintentar', exact: true }).click();
  await expect(page.getByRole('main').getByRole('alert')).toContainText('Conserva tu espacio original');
  expect(sessions).toBe(2);
  expect(reads).toBe(0);
});
