import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createApp } from './index.mjs';

let base;
const server = createApp();
before(() => new Promise((r) => server.listen(0, () => { base = `http://127.0.0.1:${server.address().port}`; r(); })));
after(() => server.close());

const call = (path, method = 'GET', body, token) =>
  fetch(base + path, { method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: body && JSON.stringify(body) });

test('register validates input', async () => {
  const r = await call('/auth/register', 'POST', { name: 'M', email: 'bad', password: 'x' });
  assert.equal(r.status, 422);
});

test('register, read lesson and words, post a result', async () => {
  const r = await call('/auth/register', 'POST', { name: 'Maya Chen', email: 'Maya.Chen@mail.com', password: 'longenough' });
  assert.equal(r.status, 201);
  const { token, user } = await r.json();
  assert.equal(user.email, 'maya.chen@mail.com');
  assert.equal((await call('/lessons/today', 'GET', null, token)).status, 200);
  assert.ok((await (await call('/words', 'GET', null, token)).json()).length > 0);
  const p = await call('/me', 'PATCH', { dailyGoal: 15 }, token);
  assert.equal((await p.json()).dailyGoal, 15);
  assert.equal((await call('/lessons/travel/results', 'POST', { correct: 1, answered: 1 }, token)).status, 201);
});

test('protected routes need a token', async () => {
  assert.equal((await call('/words')).status, 401);
});
