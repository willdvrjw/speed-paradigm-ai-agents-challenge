import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_PUBLISHABLE_KEY;
const options = { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } };

test('Supabase sin identidad: el rol anon no tiene lectura pública de tareas', { skip: (!url || !key) && 'PENDIENTE: configurar Supabase real', timeout: 30000 }, async () => {
  const anonymous = createClient(url, key, options);
  const result = await anonymous.from('tasks').select('id').limit(1);
  assert.equal(result.error?.code, '42501', 'La tabla debe denegar SELECT al rol anon por permisos');
  assert.equal((result.data ?? []).length, 0);
});

test('Supabase real: RLS y restricciones resisten acceso directo sin servidor de aplicación', { skip: (!url || !key) && 'PENDIENTE: configurar Supabase real', timeout: 120000 }, async (t) => {
  const a = createClient(url, key, options);
  const b = createClient(url, key, options);
  const anonymous = createClient(url, key, options);
  let owner;
  let id;
  try {
    await t.test('dos identidades anónimas emitidas por Supabase', async () => {
      const signA = await a.auth.signInAnonymously();
      const signB = await b.auth.signInAnonymously();
      assert.equal(Boolean(signA.error), false, 'Supabase debe permitir Auth anónimo A');
      assert.equal(Boolean(signB.error), false, 'Supabase debe permitir Auth anónimo B');
      owner = signA.data.user.id;
      assert.notEqual(owner, signB.data.user.id);
    });
    if (!owner) return;

    await t.test('propietario puede crear y consultar su fila', async () => {
      const result = await a.from('tasks').insert({ owner_id: owner, title: `RLS QA ${randomUUID()}`, description: '', status: 'pending', priority: 'medium' }).select().single();
      assert.equal(Boolean(result.error), false, 'INSERT propio debe funcionar');
      id = result.data.id;
      const read = await a.from('tasks').select('id').eq('id', id);
      assert.equal(read.data?.length, 1);
    });
    if (!id) return;

    await t.test('B y el rol anon no pueden leer la fila conocida de A', async () => {
      for (const client of [b, anonymous]) {
        const result = await client.from('tasks').select('id').eq('id', id);
        assert.equal((result.data ?? []).length, 0, 'No debe filtrarse una fila ajena');
      }
    });

    await t.test('B no puede actualizar ni borrar la fila conocida de A', async () => {
      const update = await b.from('tasks').update({ title: 'Ataque directo' }).eq('id', id).select('id');
      assert.equal((update.data ?? []).length, 0, 'UPDATE ajeno debe afectar cero filas');
      const deletion = await b.from('tasks').delete().eq('id', id).select('id');
      assert.equal((deletion.data ?? []).length, 0, 'DELETE ajeno debe afectar cero filas');
      const read = await a.from('tasks').select('id,title').eq('id', id).single();
      assert.equal(Boolean(read.error), false);
      assert.notEqual(read.data.title, 'Ataque directo');
    });

    await t.test('INSERT y reasignación de propietario son denegados', async () => {
      const noIdentity = await anonymous.from('tasks').insert({ owner_id: owner, title: 'Sin identidad', description: '', status: 'pending', priority: 'medium' }).select('id');
      assert.ok(noIdentity.error, 'El rol anon no debe poder insertar tareas');
      const forged = await b.from('tasks').insert({ owner_id: owner, title: 'Propietario falsificado', description: '', status: 'pending', priority: 'medium' }).select('id');
      assert.ok(forged.error, 'WITH CHECK debe rechazar INSERT como otro propietario');
      const bUser = await b.auth.getUser();
      const transfer = await a.from('tasks').update({ owner_id: bUser.data.user.id }).eq('id', id).select('id');
      assert.ok(transfer.error, 'Los permisos de columnas y la política deben impedir transferir la propiedad');
    });

    await t.test('la base de datos rechaza valores inválidos aun sin validación de Next.js', async () => {
      for (const values of [{ title: '' }, { title: '   ' }, { title: '\n\t' }, { title: 'x'.repeat(121) }, { description: 'x'.repeat(501) }, { status: 'invalid' }, { priority: 'urgent' }]) {
        const result = await a.from('tasks').update(values).eq('id', id).select('id');
        assert.ok(result.error, 'La restricción SQL debe denegar el valor inválido');
      }
      const read = await a.from('tasks').select('id').eq('id', id).single();
      assert.equal(Boolean(read.error), false, 'Las escrituras inválidas no deben borrar la fila');
    });
  } finally {
    if (id) await a.from('tasks').delete().eq('id', id);
    await Promise.all([a.auth.signOut(), b.auth.signOut()]);
  }
});
