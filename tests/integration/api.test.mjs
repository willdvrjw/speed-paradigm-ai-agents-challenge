import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

const base = process.env.TEST_BASE_URL?.replace(/\/$/, '');

class Visitor {
  cookies = new Map();
  async request(method, path, body, origin = base) {
    const headers = { Accept: 'application/json' };
    if (origin !== undefined && origin !== false) headers.Origin = origin;
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    if (this.cookies.size) headers.Cookie = [...this.cookies].map(([key, value]) => `${key}=${value}`).join('; ');
    const response = await fetch(`${base}${path}`, {
      method, headers, body: body === undefined ? undefined : JSON.stringify(body), redirect: 'manual', signal: AbortSignal.timeout(30000),
    });
    for (const cookie of response.headers.getSetCookie()) {
      const pair = cookie.split(';')[0];
      const equals = pair.indexOf('=');
      const name = pair.slice(0, equals);
      const value = pair.slice(equals + 1);
      if (/max-age=0(?:;|$)/i.test(cookie) || !value) this.cookies.delete(name);
      else this.cookies.set(name, value);
    }
    return response;
  }
}

function privateResponse(response) {
  assert.match(response.headers.get('cache-control') ?? '', /no-store/i, 'La respuesta privada debe prohibir caché');
}

async function expectStatus(response, status) {
  assert.equal(response.status, status, `HTTP inesperado ${response.status}; esperado ${status}`);
  privateResponse(response);
  return response.json();
}

test('API sin sesión: deniega acceso, comprueba Origin y rechaza JSON inválido', { skip: !base && 'PENDIENTE: definir TEST_BASE_URL', timeout: 60000 }, async () => {
  const stranger = new Visitor();
  await expectStatus(await stranger.request('GET', '/api/tasks'), 401);
  await expectStatus(await stranger.request('POST', '/api/tasks', { title: 'Sin sesión' }), 401);
  for (const origin of [false, 'null', 'https://evil.example']) {
    await expectStatus(await stranger.request('POST', '/api/session', {}, origin), 403);
  }
  assert.equal(stranger.cookies.size, 0, 'No debe crearse una sesión al rechazar Origin');
  const malformed = await fetch(`${base}/api/tasks`, { method: 'POST', headers: { Origin: base, 'Content-Type': 'application/json' }, body: '{"title":', redirect: 'manual' });
  await expectStatus(malformed, 400);
  const oversized = await fetch(`${base}/api/tasks`, { method: 'POST', headers: { Origin: base, 'Content-Type': 'application/json' }, body: JSON.stringify({ title: 'x'.repeat(9000) }), redirect: 'manual' });
  await expectStatus(oversized, 413);
});

test('API real: sesión, CRUD persistente, validación y dos visitantes aislados', { skip: !base && 'PENDIENTE: definir TEST_BASE_URL para ejecutar contra la aplicación real', timeout: 180000 }, async (t) => {
  const a = new Visitor();
  const b = new Visitor();
  const stranger = new Visitor();
  const created = [];
  const title = `QA ${randomUUID()}`;
  let id;
  try {
    await t.test('sesión anónima no expone tokens y sus cookies son privadas', async () => {
      for (const visitor of [a, b]) {
        const response = await visitor.request('POST', '/api/session', {});
        const cookies = response.headers.getSetCookie();
        const data = await expectStatus(response, 200);
        assert.equal(JSON.stringify(data) === JSON.stringify({ ok: true }), true, 'La sesión solo devuelve confirmación pública');
        assert.ok(cookies.length > 0, 'Debe recibirse una cookie de sesión');
        for (const cookie of cookies) {
          assert.match(cookie, /;\s*HttpOnly(?:;|$)/i, 'La sesión requiere HttpOnly');
          assert.match(cookie, /;\s*SameSite=Lax(?:;|$)/i, 'La sesión requiere SameSite=Lax');
          if (new URL(base).protocol === 'https:') assert.match(cookie, /;\s*Secure(?:;|$)/i, 'La sesión de producción requiere Secure');
        }
      }
      const existingCookies = a.cookies.size;
      await expectStatus(await a.request('POST', '/api/session', {}), 200);
      assert.ok(a.cookies.size >= existingCookies, 'Reanudar conserva la sesión existente');
    });

    await t.test('crear y volver a consultar conserva el registro real', async () => {
      const { task } = await expectStatus(await a.request('POST', '/api/tasks', { title, description: 'Revisión independiente', status: 'pending', priority: 'high' }), 201);
      assert.ok(task?.id, 'La API devuelve el identificador de la tarea creada');
      id = task.id;
      created.push([a, id]);
      const { tasks } = await expectStatus(await a.request('GET', '/api/tasks'), 200);
      assert.ok(tasks.some((item) => item.id === id && item.title === title));
      const read = await expectStatus(await a.request('GET', `/api/tasks/${id}`), 200);
      assert.equal(read.task.title, title);
    });
    if (!id) return;

    await t.test('otro visitante no puede listar, leer, editar o borrar la tarea ajena', async () => {
      const { tasks } = await expectStatus(await b.request('GET', '/api/tasks'), 200);
      assert.equal(tasks.some((task) => task.id === id), false);
      await expectStatus(await b.request('GET', `/api/tasks/${id}`), 404);
      await expectStatus(await b.request('PATCH', `/api/tasks/${id}`, { title: 'Ataque' }), 404);
      await expectStatus(await b.request('DELETE', `/api/tasks/${id}`), 404);
      await expectStatus(await stranger.request('GET', `/api/tasks/${id}`), 401);
      await expectStatus(await stranger.request('PATCH', `/api/tasks/${id}`, { title: 'Sin sesión' }), 401);
      await expectStatus(await stranger.request('DELETE', `/api/tasks/${id}`), 401);
      const read = await expectStatus(await a.request('GET', `/api/tasks/${id}`), 200);
      assert.equal(read.task.title, title);
    });

    await t.test('entradas inválidas no alteran los datos ni permiten elegir owner_id', async () => {
      for (const body of [{ title: '   ' }, { title: 'x'.repeat(121) }, { title: 'válida', status: 'invalid' }, { title: 'válida', priority: 'urgent' }, { title: 'válida', description: 'x'.repeat(501) }, { title: 'válida', owner_id: randomUUID() }, null, []]) {
        await expectStatus(await a.request('POST', '/api/tasks', body), 400);
      }
      for (const body of [{}, { title: '' }, { owner_id: randomUUID() }, { priority: 'urgent' }]) {
        await expectStatus(await a.request('PATCH', `/api/tasks/${id}`, body), 400);
      }
      await expectStatus(await a.request('GET', '/api/tasks/not-a-uuid'), 400);
      const read = await expectStatus(await a.request('GET', `/api/tasks/${id}`), 200);
      assert.equal(read.task.title, title);
    });

    await t.test('un origen ajeno no puede modificar o borrar con una cookie válida', async () => {
      await expectStatus(await a.request('POST', '/api/tasks', { title: 'Ataque CSRF' }, 'https://evil.example'), 403);
      await expectStatus(await a.request('PATCH', `/api/tasks/${id}`, { title: 'Ataque CSRF' }, 'null'), 403);
      await expectStatus(await a.request('DELETE', `/api/tasks/${id}`, undefined, false), 403);
      const read = await expectStatus(await a.request('GET', `/api/tasks/${id}`), 200);
      assert.equal(read.task.title, title);
    });

    await t.test('editar y cambiar estado persiste; borrar elimina el registro', async () => {
      const { task } = await expectStatus(await a.request('PATCH', `/api/tasks/${id}`, { title: `${title} editada`, status: 'done', priority: 'low' }), 200);
      assert.equal(task.id, id);
      const read = await expectStatus(await a.request('GET', `/api/tasks/${id}`), 200);
      assert.equal(read.task.title, `${title} editada`);
      assert.equal(read.task.status, 'done');
      assert.equal(read.task.priority, 'low');
      await expectStatus(await a.request('DELETE', `/api/tasks/${id}`), 200);
      await expectStatus(await a.request('GET', `/api/tasks/${id}`), 404);
      const { tasks } = await expectStatus(await a.request('GET', '/api/tasks'), 200);
      assert.equal(tasks.some((task) => task.id === id), false);
    });
  } finally {
    for (const [visitor, taskId] of created) await visitor.request('DELETE', `/api/tasks/${taskId}`).catch(() => {});
  }
});
