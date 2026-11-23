import test from 'node:test';
import assert from 'node:assert/strict';
import { isSameOrigin } from '../lib/security.ts';

function request(origin, headers = {}, url = 'https://foco.example/api/tasks') {
  return new Request(url, { method: 'POST', headers: { ...(origin === undefined ? {} : { Origin: origin }), ...headers } });
}

test('permite el origen exacto de la solicitud', () => {
  assert.equal(isSameOrigin(request('https://foco.example')), true);
  assert.equal(isSameOrigin(request('http://localhost:3000', {}, 'http://localhost:3000/api/session')), true);
});

test('rechaza origen ausente, null, malformado o ajeno', () => {
  for (const origin of [undefined, 'null', '', 'https://evil.example', 'https://foco.example.evil.example', 'http://foco.example', 'https://foco.example:444', 'https://foco.example/path']) {
    assert.equal(isSameOrigin(request(origin)), false, `Origen inesperadamente aceptado: ${origin}`);
  }
});

test('no confía en cabeceras reenviadas elegidas por el atacante', () => {
  assert.equal(isSameOrigin(request('https://evil.example', { 'X-Forwarded-Host': 'evil.example', 'X-Forwarded-Proto': 'https', Host: 'evil.example' })), false);
  assert.equal(isSameOrigin(request(undefined, { Referer: 'https://foco.example/' })), false);
});
