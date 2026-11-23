import { test, expect } from '@playwright/test';
import { randomUUID } from 'node:crypto';

test('acceso público con sesión automática y tarea persistente propia', async ({ page, context, browser, baseURL }, testInfo) => {
  if (!baseURL) throw new Error('Define TEST_BASE_URL para comprobar un sitio real.');
  const origin = new URL(baseURL).origin;
  const title = `Acceso ${testInfo.project.name} ${randomUUID().slice(0, 8)}`;
  const externalOrigins = new Set<string>();
  const pageErrors: string[] = [];
  let taskId: string | undefined;
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (/^https?:$/.test(url.protocol) && url.origin !== origin) externalOrigins.add(url.origin);
  });
  page.on('pageerror', (error) => pageErrors.push(error.name));
  try {
    expect((await context.cookies()).length).toBe(0);
    const session = page.waitForResponse((response) => response.url() === `${origin}/api/session` && response.request().method() === 'POST');
    const mainResponse = await page.goto('/');
    expect(mainResponse?.status()).toBe(200);
    expect((await session).status()).toBe(200);
    await expect(page.getByRole('button', { name: 'Nueva tarea', exact: true })).toBeEnabled();
    await expect(page.getByRole('button', { name: /iniciar sesión|log in|sign in/i })).toHaveCount(0);
    const authCookies = (await context.cookies()).filter((cookie) => cookie.name.startsWith('sb-'));
    expect(authCookies.length).toBeGreaterThan(0);
    expect(authCookies.every((cookie) => cookie.httpOnly && cookie.sameSite === 'Lax' && cookie.domain === new URL(baseURL).hostname)).toBe(true);
    if (origin.startsWith('https://')) expect(authCookies.every((cookie) => cookie.secure)).toBe(true);

    await page.getByRole('button', { name: 'Nueva tarea', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'Una nueva tarea' });
    await dialog.getByLabel(/^Título/).fill(title);
    const creation = page.waitForResponse((response) => response.url() === `${origin}/api/tasks` && response.request().method() === 'POST');
    await dialog.getByRole('button', { name: 'Crear tarea', exact: true }).click();
    const response = await creation;
    expect(response.status()).toBe(201);
    taskId = (await response.json()).task.id;
    const card = page.getByRole('article', { name: title, exact: true });
    await expect(card).toBeVisible();
    await page.reload();
    await expect(card).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath('access-task.png'), fullPage: true });
    await card.getByRole('button', { name: `Eliminar ${title}`, exact: true }).click();
    await page.getByRole('dialog', { name: '¿Eliminar esta tarea?' }).getByRole('button', { name: 'Eliminar tarea', exact: true }).click();
    await expect(card).not.toBeVisible();
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Tu próximo paso empieza aquí.' })).toBeVisible();
    expect((await page.request.get(`/api/tasks/${taskId}`)).status()).toBe(404);
    expect([...externalOrigins]).toEqual([]);
    expect(pageErrors).toEqual([]);
    await testInfo.attach('access-evidence', {
      body: JSON.stringify({ project: testInfo.project.name, browserVersion: browser.version(), locale: testInfo.project.use.locale, timezone: testInfo.project.use.timezoneId, initialCookies: 0, firstPartyPrivateCookies: true, externalClientOrigins: [...externalOrigins] }),
      contentType: 'application/json',
    });
  } finally {
    if (taskId) await page.request.delete(`/api/tasks/${taskId}`, { headers: { Origin: origin } }).catch(() => {});
  }
});
