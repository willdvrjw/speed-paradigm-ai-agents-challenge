import { test, expect, type Page } from '@playwright/test';
import { randomUUID } from 'node:crypto';
import { createServerClient } from '@supabase/ssr';

async function openSpace(page: Page) {
  expect((await page.context().cookies()).length).toBe(0);
  expect((await page.goto('/'))?.status()).toBe(200);
  await expect(page.getByRole('button', { name: 'Nueva tarea', exact: true })).toBeEnabled();
}

async function seed(page: Page, input: Record<string, string>) {
  const response = await page.request.post('/api/tasks', { headers: { Origin: new URL(page.url()).origin }, data: input });
  expect(response.status()).toBe(201);
  return (await response.json()).task as { id: string; title: string };
}

async function cleanup(page: Page, ids: string[]) {
  for (const id of ids) {
    const response = await page.request.delete(`/api/tasks/${id}`, { headers: { Origin: new URL(page.url()).origin } });
    expect([200, 404]).toContain(response.status());
  }
}

test('filtros completos, búsqueda combinada, limpiar y cancelar edición conservan los datos reales', async ({ page }) => {
  const tasks: { id: string; title: string; status: string; priority: string }[] = [];
  const nonce = randomUUID().slice(0, 8);
  try {
    await openSpace(page);
    for (const status of ['pending', 'in_progress', 'done']) {
      for (const priority of ['low', 'medium', 'high']) {
        const task = await seed(page, { title: `Filtro ${status} ${priority} ${nonce}`, description: `Descripción común ${nonce}`, status, priority });
        tasks.push({ ...task, status, priority });
      }
    }
    await page.reload();
    await expect(page.getByRole('article')).toHaveCount(9);
    expect(await page.locator('.stat strong').allTextContents()).toEqual(['03', '03', '03']);
    for (const query of ['', `  DESCRIPCIÓN COMÚN ${nonce.toUpperCase()}  `]) {
      await page.getByLabel('Buscar tareas').fill(query);
      for (const status of ['all', 'pending', 'in_progress', 'done']) {
        await page.getByLabel('Estado', { exact: true }).selectOption(status);
        for (const priority of ['all', 'low', 'medium', 'high']) {
          await page.getByLabel('Prioridad', { exact: true }).selectOption(priority);
          const expected = tasks.filter((task) => (status === 'all' || task.status === status) && (priority === 'all' || task.priority === priority));
          await expect(page.getByRole('article')).toHaveCount(expected.length);
          for (const task of expected) await expect(page.getByRole('article', { name: task.title, exact: true })).toBeVisible();
        }
      }
    }
    await page.getByLabel('Buscar tareas').fill('NO EXISTE ESTE RESULTADO');
    await expect(page.getByRole('heading', { name: 'No encontramos esas tareas.' })).toBeVisible();
    await page.getByRole('button', { name: 'Limpiar filtros', exact: true }).first().click();
    await expect(page.getByLabel('Buscar tareas')).toHaveValue('');
    await expect(page.getByLabel('Estado', { exact: true })).toHaveValue('all');
    await expect(page.getByLabel('Prioridad', { exact: true })).toHaveValue('all');
    await expect(page.getByRole('article')).toHaveCount(9);
    await page.getByLabel('Buscar tareas').fill(tasks[0].title.toUpperCase());
    await expect(page.getByRole('article')).toHaveCount(1);
    await page.getByRole('button', { name: 'Limpiar filtros', exact: true }).first().click();
    const selected = tasks[0];
    await page.getByRole('button', { name: `Editar ${selected.title}`, exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'Editar tarea' });
    await dialog.getByLabel(/^Título/).fill('Edición que debe descartarse');
    await dialog.getByLabel(/^Descripción/).fill('Sin guardar');
    await dialog.getByLabel('Estado', { exact: true }).selectOption('done');
    await dialog.getByLabel('Prioridad', { exact: true }).selectOption('high');
    await dialog.getByRole('button', { name: 'Cancelar', exact: true }).click();
    await expect(dialog).not.toBeVisible();
    const read = await page.request.get(`/api/tasks/${selected.id}`);
    expect(read.status()).toBe(200);
    expect((await read.json()).task).toMatchObject({ title: selected.title, description: `Descripción común ${nonce}`, status: 'pending', priority: 'low' });
    for (const [label, status] of [['Pendiente', 'pending'], ['En curso', 'in_progress'], ['Hecha', 'done']]) {
      await page.getByRole('button', { name: `Crear tarea en ${label}`, exact: true }).click();
      const creation = page.getByRole('dialog', { name: 'Una nueva tarea' });
      await expect(creation.getByLabel('Estado', { exact: true })).toHaveValue(status);
      await creation.getByRole('button', { name: 'Cancelar', exact: true }).click();
    }
    await page.reload();
    await expect(page.getByRole('article')).toHaveCount(9);
    await expect(page.getByRole('article', { name: selected.title, exact: true })).toBeVisible();
  } finally { await cleanup(page, tasks.map((task) => task.id)); }
});

test('validación visual de límites y Unicode impide escrituras inválidas y guarda máximos reales', async ({ page }) => {
  const ids: string[] = [];
  let writes = 0;
  try {
    await openSpace(page);
    page.on('request', (request) => { if (new URL(request.url()).pathname === '/api/tasks' && request.method() === 'POST') writes++; });
    await page.getByRole('button', { name: 'Crear mi primera tarea', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'Una nueva tarea' });
    for (const title of ['   ', 'x'.repeat(121)]) {
      await dialog.getByLabel(/^Título/).fill(title);
      await dialog.getByRole('button', { name: 'Crear tarea', exact: true }).click();
      await expect(dialog.getByLabel(/^Título/)).toHaveAttribute('aria-invalid', 'true');
      await expect(dialog.getByLabel(/^Título/)).toBeFocused();
    }
    await dialog.getByLabel(/^Título/).fill('😀'.repeat(120));
    await dialog.getByLabel(/^Descripción/).fill('x'.repeat(501));
    await dialog.getByRole('button', { name: 'Crear tarea', exact: true }).click();
    await expect(dialog.getByLabel(/^Descripción/)).toHaveAttribute('aria-invalid', 'true');
    await expect(dialog.getByLabel(/^Descripción/)).toBeFocused();
    expect(writes).toBe(0);
    await dialog.getByLabel(/^Descripción/).fill('😀'.repeat(500));
    const created = page.waitForResponse((response) => response.url().endsWith('/api/tasks') && response.request().method() === 'POST');
    await dialog.getByRole('button', { name: 'Crear tarea', exact: true }).click();
    const response = await created;
    expect(response.status()).toBe(201);
    const task = (await response.json()).task; ids.push(task.id);
    expect(Array.from(task.title)).toHaveLength(120);
    expect(Array.from(task.description)).toHaveLength(500);
    await page.reload();
    await expect(page.getByRole('article', { name: '😀'.repeat(120), exact: true })).toBeVisible();
    expect((await (await page.request.get(`/api/tasks/${task.id}`)).json()).task.description).toBe('😀'.repeat(500));
    expect(writes).toBe(1);
  } finally { await cleanup(page, ids); }
});

test('fallos controlados de crear, editar, mover y borrar conservan datos y permiten recuperación real', async ({ page }) => {
  const ids: string[] = [];
  let failure: 'POST' | 'PATCH' | 'DELETE' | undefined = 'POST';
  const title = `Errores QA ${randomUUID()}`;
  try {
    await openSpace(page);
    await page.route('**/api/tasks{,/**}', (route) => {
      if (route.request().method() === failure) return route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: 'Fallo controlado de prueba' }) });
      return route.continue();
    });
    await page.getByRole('button', { name: 'Nueva tarea', exact: true }).click();
    let dialog = page.getByRole('dialog', { name: 'Una nueva tarea' });
    await dialog.getByLabel(/^Título/).fill(title);
    await dialog.getByRole('button', { name: 'Crear tarea', exact: true }).click();
    await expect(dialog.getByRole('alert')).toContainText('Fallo controlado');
    await expect(dialog.getByLabel(/^Título/)).toHaveValue(title);
    expect((await (await page.request.get('/api/tasks')).json()).tasks).toHaveLength(0);
    failure = undefined;
    const creation = page.waitForResponse((response) => response.url().endsWith('/api/tasks') && response.request().method() === 'POST' && response.status() === 201);
    await dialog.getByRole('button', { name: 'Crear tarea', exact: true }).click();
    const id = (await (await creation).json()).task.id; ids.push(id);
    await expect(dialog).not.toBeVisible();
    let card = page.getByRole('article', { name: title, exact: true });
    failure = 'PATCH';
    await card.getByLabel(`Estado de ${title}`, { exact: true }).selectOption('done');
    await expect(page.getByRole('main').getByRole('alert')).toContainText('Fallo controlado');
    await expect(card.getByLabel(`Estado de ${title}`, { exact: true })).toHaveValue('pending');
    expect((await (await page.request.get(`/api/tasks/${id}`)).json()).task.status).toBe('pending');
    failure = undefined;
    await page.getByRole('button', { name: 'Reintentar', exact: true }).click();
    await expect(page.getByRole('main').getByRole('alert')).toHaveCount(0);
    await card.getByLabel(`Estado de ${title}`, { exact: true }).selectOption('in_progress');
    await expect(card.getByLabel(`Estado de ${title}`, { exact: true })).toHaveValue('in_progress');
    failure = 'PATCH';
    await card.getByRole('button', { name: `Editar ${title}`, exact: true }).click();
    dialog = page.getByRole('dialog', { name: 'Editar tarea' });
    await dialog.getByLabel(/^Título/).fill(`${title} guardada`);
    await dialog.getByRole('button', { name: 'Guardar cambios', exact: true }).click();
    await expect(dialog.getByRole('alert')).toContainText('Fallo controlado');
    await expect(dialog.getByLabel(/^Título/)).toHaveValue(`${title} guardada`);
    expect((await (await page.request.get(`/api/tasks/${id}`)).json()).task.title).toBe(title);
    failure = undefined;
    await dialog.getByRole('button', { name: 'Guardar cambios', exact: true }).click();
    card = page.getByRole('article', { name: `${title} guardada`, exact: true });
    await expect(card).toBeVisible();
    failure = 'DELETE';
    await card.getByRole('button', { name: `Eliminar ${title} guardada`, exact: true }).click();
    const deletion = page.getByRole('dialog', { name: '¿Eliminar esta tarea?' });
    await deletion.getByRole('button', { name: 'Eliminar tarea', exact: true }).click();
    await expect(deletion.getByRole('alert')).toContainText('Fallo controlado');
    expect((await page.request.get(`/api/tasks/${id}`)).status()).toBe(200);
    await deletion.getByRole('button', { name: 'Cancelar', exact: true }).click();
    await expect(card).toBeVisible();
    failure = undefined;
    await card.getByRole('button', { name: `Eliminar ${title} guardada`, exact: true }).click();
    await page.getByRole('dialog', { name: '¿Eliminar esta tarea?' }).getByRole('button', { name: 'Eliminar tarea', exact: true }).click();
    await expect(card).toHaveCount(0);
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Tu próximo paso empieza aquí.' })).toBeVisible();
    expect((await page.request.get(`/api/tasks/${id}`)).status()).toBe(404);
  } finally { await page.unrouteAll({ behavior: 'wait' }); await cleanup(page, ids); }
});

test('la carga espera una lectura real y anuncia estado ocupado antes de mostrar el vacío', async ({ page }) => {
  let release = () => {};
  const gate = new Promise<void>((resolve) => { release = resolve; });
  try {
    await page.route('**/api/tasks', async (route) => { if (route.request().method() === 'GET') await gate; await route.continue(); });
    await page.goto('/');
    await expect(page.getByText('Abriendo tu espacio…', { exact: false })).toBeVisible();
    await expect(page.locator('#tablero')).toHaveAttribute('aria-busy', 'true');
    await expect(page.getByRole('button', { name: 'Nueva tarea', exact: true })).toBeDisabled();
    release();
    await expect(page.getByRole('heading', { name: 'Tu próximo paso empieza aquí.' })).toBeVisible();
    await expect(page.locator('#tablero')).toHaveAttribute('aria-busy', 'false');
    await expect(page.getByRole('button', { name: 'Nueva tarea', exact: true })).toBeEnabled();
  } finally { release(); await page.unrouteAll({ behavior: 'wait' }); }
});

test('cambios simultáneos en tareas distintas llegan al servidor y persisten', async ({ page }) => {
  const ids: string[] = [];
  let release = () => {};
  try {
    await openSpace(page);
    const a = await seed(page, { title: `Concurrente A ${randomUUID()}` }); ids.push(a.id);
    const b = await seed(page, { title: `Concurrente B ${randomUUID()}` }); ids.push(b.id);
    await page.reload();
    const gate = new Promise<void>((resolve) => { release = resolve; });
    let arrived = () => {};
    const held = new Promise<void>((resolve) => { arrived = resolve; });
    await page.route(`**/api/tasks/${a.id}`, async (route) => {
      if (route.request().method() === 'PATCH') { arrived(); await gate; }
      await route.continue(); // Solo demora el envío: respuesta y persistencia reales.
    });
    const responseA = page.waitForResponse((response) => response.url().endsWith(a.id) && response.request().method() === 'PATCH');
    await page.getByLabel(`Estado de ${a.title}`, { exact: true }).selectOption('in_progress');
    await held;
    await expect(page.getByLabel(`Estado de ${a.title}`, { exact: true })).toBeDisabled();
    await expect(page.getByLabel(`Estado de ${b.title}`, { exact: true })).toBeEnabled();
    const responseB = page.waitForResponse((response) => response.url().endsWith(b.id) && response.request().method() === 'PATCH', { timeout: 4000 }).catch(() => undefined);
    await page.getByLabel(`Estado de ${b.title}`, { exact: true }).selectOption('done');
    const receivedB = await responseB;
    release();
    expect((await responseA).status()).toBe(200);
    expect(receivedB?.status(), 'B debe enviarse mientras A está pendiente').toBe(200);
    await page.reload();
    await expect(page.getByLabel(`Estado de ${a.title}`, { exact: true })).toHaveValue('in_progress');
    await expect(page.getByLabel(`Estado de ${b.title}`, { exact: true })).toHaveValue('done');
  } finally { release(); await page.unrouteAll({ behavior: 'wait' }); await cleanup(page, ids); }
});

test('colección de 1005 filas reales se lista completa y encuentra la última mediante filtros', async ({ page, context, baseURL }) => {
  test.skip(process.env.TEST_LARGE_COLLECTION !== '1', 'Activar TEST_LARGE_COLLECTION=1 para la regresión acotada de volumen');
  test.setTimeout(120000);
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  expect(Boolean(url && key), 'Requiere URL y clave publicable real mediante entorno local').toBe(true);
  const jar = new Map<string, string>();
  const client = createServerClient(url!, key!, {
    auth: { autoRefreshToken: false, detectSessionInUrl: false },
    cookies: { getAll: () => [...jar].map(([name, value]) => ({ name, value })), setAll: (cookies) => { for (const cookie of cookies) jar.set(cookie.name, cookie.value); } },
  });
  let owner: string | undefined;
  const prefix = `Volumen QA ${randomUUID().slice(0, 8)}`;
  let lastPageTask: { id: string; title: string } | undefined;
  try {
    const signed = await client.auth.signInAnonymously();
    expect(Boolean(signed.error), 'Alta anónima real de la identidad de volumen').toBe(false);
    owner = signed.data.user!.id;
    const rows = Array.from({ length: 1005 }, (_, index) => ({
      owner_id: owner,
      title: `${prefix} ${String(index).padStart(4, '0')}`,
      description: '', status: 'pending', priority: 'medium',
    }));
    // Un solo INSERT comparte created_at: comprueba también el desempate por UUID.
    const insertion = await client.from('tasks').insert(rows);
    expect(Boolean(insertion.error), 'INSERT bulk de 1005 filas propias').toBe(false);
    const count = await client.from('tasks').select('id', { count: 'exact', head: true }).eq('owner_id', owner);
    expect(count.count).toBe(1005);
    const last = await client.from('tasks').select('id,title').eq('owner_id', owner).order('id').limit(1).single();
    expect(Boolean(last.error)).toBe(false);
    lastPageTask = last.data!;
    const marked = await client.from('tasks').update({ description: 'Marcador última página', status: 'done', priority: 'high' }).eq('id', lastPageTask.id);
    expect(Boolean(marked.error)).toBe(false);
    await context.addCookies([...jar].map(([name, value]) => ({ name, value, url: baseURL!, httpOnly: true, secure: new URL(baseURL!).protocol === 'https:', sameSite: 'Lax' as const })));
    const response = await page.request.get('/api/tasks');
    expect(response.status()).toBe(200);
    const tasks = (await response.json()).tasks as { id: string }[];
    expect(tasks.length, 'La colección no debe truncarse al máximo predeterminado de Supabase').toBe(1005);
    expect(new Set(tasks.map((task) => task.id)).size).toBe(1005);
    expect(tasks.some((task) => task.id === lastPageTask!.id)).toBe(true);
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Nueva tarea', exact: true })).toBeEnabled();
    await page.getByLabel('Buscar tareas').fill('  MARCADOR ÚLTIMA PÁGINA  ');
    await page.getByLabel('Estado', { exact: true }).selectOption('done');
    await page.getByLabel('Prioridad', { exact: true }).selectOption('high');
    await expect(page.getByRole('article')).toHaveCount(1);
    await expect(page.getByRole('article', { name: lastPageTask.title, exact: true })).toBeVisible();
  } finally {
    if (owner) {
      const result = await client.from('tasks').delete().eq('owner_id', owner);
      expect(Boolean(result.error), 'La limpieza solo elimina las filas del nuevo propietario').toBe(false);
      const remaining = await client.from('tasks').select('id', { count: 'exact', head: true }).eq('owner_id', owner);
      expect(remaining.count, 'Cero tareas sintéticas de volumen restantes').toBe(0);
    }
    await client.auth.signOut();
  }
});
