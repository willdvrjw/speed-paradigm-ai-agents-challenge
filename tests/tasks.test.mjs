import test from 'node:test';
import assert from 'node:assert/strict';
import { parseTaskInput, isTaskId } from '../lib/tasks.ts';

const valid = { title: 'Preparar entrega', description: 'Revisar evidencias', status: 'pending', priority: 'medium' };

test('normaliza un título y aplica valores iniciales seguros', () => {
  assert.deepEqual(parseTaskInput({ title: '  Mi primera tarea  ' }), {
    title: 'Mi primera tarea', description: '', status: 'pending', priority: 'medium',
  });
});

test('rechaza títulos vacíos, tipos incorrectos y longitudes excesivas', () => {
  for (const title of ['', '   ', '\n\t', 'Primera\nSegunda', 'Nulo\u0000', null, 10, {}, [], 'a'.repeat(121), '😀'.repeat(121)]) {
    assert.throws(() => parseTaskInput({ ...valid, title }), undefined, `Título inválido: ${typeof title}`);
  }
  assert.equal(parseTaskInput({ ...valid, title: 'a'.repeat(120) }).title.length, 120);
  assert.equal(Array.from(parseTaskInput({ ...valid, title: '😀'.repeat(120) }).title).length, 120);
});

test('restringe la descripción, los estados y las prioridades', () => {
  assert.equal(parseTaskInput({ ...valid, description: 'a'.repeat(500) }).description.length, 500);
  assert.equal(Array.from(parseTaskInput({ ...valid, description: '😀'.repeat(500) }).description).length, 500);
  for (const description of [null, 3, {}, [], 'a'.repeat(501), 'Nulo\u0000']) {
    assert.throws(() => parseTaskInput({ ...valid, description }));
  }
  for (const status of ['archived', '', 'DONE', null, 1, []]) {
    assert.throws(() => parseTaskInput({ ...valid, status }));
  }
  for (const priority of ['urgent', '', 'HIGH', null, 1, []]) {
    assert.throws(() => parseTaskInput({ ...valid, priority }));
  }
  for (const status of ['pending', 'in_progress', 'done']) {
    assert.equal(parseTaskInput({ ...valid, status }).status, status);
  }
  for (const priority of ['low', 'medium', 'high']) {
    assert.equal(parseTaskInput({ ...valid, priority }).priority, priority);
  }
});

test('rechaza cuerpos ajenos al contrato y no permite elegir propietario', () => {
  for (const body of [null, [], 'texto', 7, true, {}, { ...valid, owner_id: 'otro' }, { ...valid, id: 'otro' }, { ...valid, unexpected: true }]) {
    assert.throws(() => parseTaskInput(body));
  }
});

test('una edición parcial conserva solamente campos enviados y rechaza edición vacía', () => {
  assert.deepEqual(parseTaskInput({ status: 'done' }, true), { status: 'done' });
  assert.deepEqual(parseTaskInput({ title: '  Nuevo título  ', description: '' }, true), { title: 'Nuevo título', description: '' });
  assert.throws(() => parseTaskInput({}, true));
  assert.throws(() => parseTaskInput({ owner_id: 'otra-identidad' }, true));
  assert.throws(() => parseTaskInput({ priority: 'urgent' }, true));
  assert.throws(() => parseTaskInput({ title: '   ' }, true));
});

test('solo acepta identificadores UUID válidos', () => {
  assert.equal(isTaskId('0f1b2edb-470a-4354-8e2a-fc49d0e971fb'), true);
  for (const id of ['', 'otra-tarea', '../tasks', '0f1b2edb-470a-4354-8e2a-fc49d0e971fb extra', null, undefined, 3]) {
    assert.equal(isTaskId(id), false);
  }
});
