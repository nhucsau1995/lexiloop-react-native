// Minimal Node.js REST backend for LexiLoop (no dependencies). Same contract as
// src/api/client.ts. Run: npm run api, then start the app with EXPO_PUBLIC_API_URL=http://<ip>:4000
import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { lesson, words } from './data.mjs';

export function createApp() {
  const users = new Map(); // token -> user
  const results = [];

  const send = (res, code, body) => {
    res.writeHead(code, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(body));
  };
  const readBody = (req) =>
    new Promise((resolve) => {
      let raw = '';
      req.on('data', (c) => (raw += c));
      req.on('end', () => {
        try { resolve(raw ? JSON.parse(raw) : {}); } catch { resolve(null); }
      });
    });
  const auth = (req) => users.get((req.headers.authorization ?? '').replace('Bearer ', ''));

  return createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const key = `${req.method} ${url.pathname}`;
    const body = ['POST', 'PATCH'].includes(req.method) ? await readBody(req) : {};
    if (body === null) return send(res, 400, { error: 'invalid JSON' });

    if (key === 'POST /auth/register') {
      const { name, email, password } = body;
      if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email ?? '') || (password ?? '').length < 8) {
        return send(res, 422, { error: 'name, valid email and an 8+ character password are required' });
      }
      const token = randomUUID();
      const user = { id: randomUUID(), name, email: email.toLowerCase(), level: 'intermediate', dailyGoal: 10, joined: new Date().toISOString().slice(0, 10), guest: false };
      users.set(token, user);
      return send(res, 201, { token, user });
    }
    if (key === 'POST /auth/guest') {
      const token = randomUUID();
      const user = { id: 'guest', name: 'Guest', email: '', level: 'intermediate', dailyGoal: 10, joined: new Date().toISOString().slice(0, 10), guest: true };
      users.set(token, user);
      return send(res, 201, { token, user });
    }
    const user = auth(req);
    if (!user) return send(res, 401, { error: 'unauthorized' });
    if (key === 'PATCH /me') {
      for (const k of ['name', 'level', 'dailyGoal']) if (body[k] !== undefined) user[k] = body[k];
      return send(res, 200, user);
    }
    if (key === 'GET /lessons/today') return send(res, 200, lesson);
    if (key === 'GET /words') return send(res, 200, words);
    const m = url.pathname.match(/^\/lessons\/([\w-]+)\/results$/);
    if (req.method === 'POST' && m) {
      results.push({ userId: user.id, lessonId: m[1], ...body, at: Date.now() });
      return send(res, 201, { ok: true });
    }
    return send(res, 404, { error: 'not found' });
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.env.PORT ?? 4000);
  createApp().listen(port, () => console.log(`LexiLoop API on http://localhost:${port}`));
}
