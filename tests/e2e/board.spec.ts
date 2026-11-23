import { test, expect, type Page } from '@playwright/test';
import { randomUUID } from 'node:crypto';

async function noHorizontalOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
}

test('visitante sin sesión Vercel completa el tablero real en escritorio y móvil', async ({ page, context }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.name));
  const title = `Entrega QA ${randomUUID().slice(0, 8)}`;
  const editedTitle = `${title} revisada`;
  let createdId: string | undefined;
  try {
    expect((await context.cookies()).length).toBe(0);
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { name: 'Haz espacio para lo importante.' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Nueva tarea', exact: true })).toBeEnabled();
    await expect(page.getByRole('heading', { name: 'Tu próximo paso empieza aquí.' })).toBeVisible();
    await expect(page.getByRole('button', { name: /iniciar sesión|log in|sign in/i })).toHaveCount(0);
    await noHorizontalOverflow(page);
    await page.screenshot({ path: testInfo.outputPath('desktop-empty.png'), fullPage: true });

    await page.getByRole('button', { name: 'Nueva tarea', exact: true }).focus();
    await page.keyboard.press('Enter');
    let dialog = page.getByRole('dialog', { name: 'Una nueva tarea' });
    await expect(dialog).toBeVisible();
    expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Nueva tarea', exact: true })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(dialog).toBeVisible();
    expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
    if (!await dialog.getByLabel(/^Título/).evaluate((element) => element === document.activeElement)) await page.keyboard.press('Tab');
    await expect(dialog.getByLabel(/^Título/)).toBeFocused();
    await dialog.getByRole('button', { name: 'Crear tarea', exact: true }).click();
    await expect(dialog.getByLabel(/^Título/)).toHaveAttribute('aria-invalid', 'true');
    await expect(dialog.getByRole('alert')).toBeVisible();
    await dialog.getByLabel(/^Título/).fill(title);
    await dialog.getByLabel(/^Descripción/).fill('Verificar persistencia y navegación por teclado.');
    await dialog.getByLabel('Prioridad', { exact: true }).selectOption('high');
    const creation = page.waitForResponse((result) => result.url().endsWith('/api/tasks') && result.request().method() === 'POST');
    await dialog.getByRole('button', { name: 'Crear tarea', exact: true }).click();
    const creationResponse = await creation;
    expect(creationResponse.status()).toBe(201);
    const created = await creationResponse.json();
    createdId = created.task.id;
    await expect(dialog).not.toBeVisible();
    let card = page.getByRole('article', { name: title, exact: true });
    await expect(card).toBeVisible();
    await page.reload();
    await expect(card).toBeVisible();

    const stateResponse = page.waitForResponse((result) => result.url().endsWith(`/api/tasks/${createdId}`) && result.request().method() === 'PATCH');
    await card.getByLabel(`Estado de ${title}`, { exact: true }).selectOption('in_progress');
    expect((await stateResponse).status()).toBe(200);
    await expect(card.getByLabel(`Estado de ${title}`, { exact: true })).toHaveValue('in_progress');
    await page.getByLabel('Buscar tareas').fill(title.slice(-8));
    await page.getByLabel('Estado', { exact: true }).selectOption('in_progress');
    await page.getByLabel('Prioridad', { exact: true }).selectOption('high');
    await expect(card).toBeVisible();
    await page.getByLabel('Prioridad', { exact: true }).selectOption('low');
    await expect(page.getByRole('heading', { name: 'No encontramos esas tareas.' })).toBeVisible();
    await page.getByRole('button', { name: 'Limpiar filtros', exact: true }).first().click();
    await expect(card).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath('desktop-task.png'), fullPage: true });

    await page.setViewportSize({ width: 390, height: 844 });
    await noHorizontalOverflow(page);
    await card.getByRole('button', { name: `Editar ${title}`, exact: true }).click();
    dialog = page.getByRole('dialog', { name: 'Editar tarea' });
    await expect(dialog).toBeVisible();
    await dialog.getByLabel(/^Título/).fill(editedTitle);
    await dialog.getByLabel('Estado', { exact: true }).selectOption('done');
    await dialog.getByLabel('Prioridad', { exact: true }).selectOption('low');
    await dialog.getByRole('button', { name: 'Guardar cambios', exact: true }).click();
    card = page.getByRole('article', { name: editedTitle, exact: true });
    await expect(card).toBeVisible();
    await page.reload();
    await expect(card).toBeVisible();
    await expect(card.getByLabel(`Estado de ${editedTitle}`, { exact: true })).toHaveValue('done');
    await expect(card.getByText('Prioridad baja', { exact: true })).toBeVisible();
    await noHorizontalOverflow(page);
    await page.screenshot({ path: testInfo.outputPath('mobile-task.png'), fullPage: true });

    await card.getByRole('button', { name: `Eliminar ${editedTitle}`, exact: true }).click();
    const confirmation = page.getByRole('dialog', { name: '¿Eliminar esta tarea?' });
    await expect(confirmation).toBeVisible();
    expect(await confirmation.evaluate((element) => element.contains(document.activeElement))).toBe(true);
    expect(await confirmation.getByRole('button', { name: 'Eliminar tarea', exact: true }).evaluate((element) => element === document.activeElement)).toBe(false);
    if (!await confirmation.getByRole('button', { name: 'Cancelar', exact: true }).evaluate((element) => element === document.activeElement)) await page.keyboard.press('Tab');
    await expect(confirmation.getByRole('button', { name: 'Cancelar', exact: true })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(card).toBeVisible();
    await card.getByRole('button', { name: `Eliminar ${editedTitle}`, exact: true }).click();
    await page.getByRole('dialog', { name: '¿Eliminar esta tarea?' }).getByRole('button', { name: 'Eliminar tarea', exact: true }).click();
    await expect(card).not.toBeVisible();
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Tu próximo paso empieza aquí.' })).toBeVisible();
    await noHorizontalOverflow(page);
    expect(errors).toEqual([]);
    const cookies = await context.cookies();
    expect(cookies.some((cookie) => cookie.name.startsWith('sb-') && cookie.httpOnly)).toBe(true);
    expect(await page.evaluate(() => Object.keys(localStorage).some((name) => /supabase|auth-token|access_token|refresh_token/.test(name)))).toBe(false);
  } finally {
    if (createdId) {
      await page.request.delete(`/api/tasks/${createdId}`, { headers: { Origin: new URL(page.url()).origin } }).catch(() => {});
    }
  }
});

test('un fallo controlado de conexión se anuncia y permite reintentar', async ({ page }) => {
  await page.route('**/api/session', (route) => route.abort('failed'));
  await page.goto('/');
  await expect(page.getByRole('main').getByRole('alert')).toContainText('No pudimos conectar');
  await expect(page.getByRole('button', { name: 'Nueva tarea', exact: true })).toBeDisabled();
  await page.unroute('**/api/session');
  await page.getByRole('button', { name: 'Reintentar', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Nueva tarea', exact: true })).toBeEnabled();
  await expect(page.getByRole('heading', { name: 'Tu próximo paso empieza aquí.' })).toBeVisible();
});
