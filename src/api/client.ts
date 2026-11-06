import { demoUser, todayLesson, words } from '../data/seed';
import type { Lesson, Level, User, Word } from '../data/types';

// REST API contract of the Node.js backend in server/. The app talks to it through this
// interface; without EXPO_PUBLIC_API_URL it uses an in-app mock with the same responses, so the
// demo runs with no backend.
export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LessonResult {
  lessonId: string;
  correct: number;
  answered: number;
  wordIds: string[];
}

export interface Api {
  register(input: RegisterInput): Promise<User>;
  guest(): Promise<User>;
  updateProfile(patch: Partial<Pick<User, 'level' | 'dailyGoal' | 'name'>>): Promise<User>;
  todayLesson(): Promise<Lesson>;
  words(): Promise<Word[]>;
  submitLesson(result: LessonResult): Promise<{ ok: true }>;
}

class HttpApi implements Api {
  private token: string | null = null;
  constructor(private base: string) {}

  private async req<T>(path: string, init: RequestInit = {}): Promise<T> {
    const res = await fetch(`${this.base}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}) },
    });
    if (!res.ok) throw new Error(`${init.method ?? 'GET'} ${path} failed: ${res.status}`);
    return (await res.json()) as T;
  }

  async register(input: RegisterInput) {
    const r = await this.req<{ token: string; user: User }>('/auth/register', { method: 'POST', body: JSON.stringify(input) });
    this.token = r.token;
    return r.user;
  }
  async guest() {
    const r = await this.req<{ token: string; user: User }>('/auth/guest', { method: 'POST' });
    this.token = r.token;
    return r.user;
  }
  updateProfile(patch: Partial<Pick<User, 'level' | 'dailyGoal' | 'name'>>) {
    return this.req<User>('/me', { method: 'PATCH', body: JSON.stringify(patch) });
  }
  todayLesson() {
    return this.req<Lesson>('/lessons/today');
  }
  words() {
    return this.req<Word[]>('/words');
  }
  submitLesson(result: LessonResult) {
    return this.req<{ ok: true }>(`/lessons/${result.lessonId}/results`, { method: 'POST', body: JSON.stringify(result) });
  }
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

class MockApi implements Api {
  private user: User = demoUser;
  async register(input: RegisterInput) {
    await wait(350);
    this.user = { ...demoUser, name: input.name.trim(), email: input.email.trim().toLowerCase(), joined: new Date().toISOString().slice(0, 10) };
    return this.user;
  }
  async guest() {
    await wait(200);
    this.user = { ...demoUser, id: 'guest', name: 'Guest', email: '', guest: true };
    return this.user;
  }
  async updateProfile(patch: Partial<Pick<User, 'level' | 'dailyGoal' | 'name'>>) {
    this.user = { ...this.user, ...patch } as User & { level: Level };
    return this.user;
  }
  async todayLesson() {
    await wait(150);
    return todayLesson;
  }
  async words() {
    await wait(150);
    return words;
  }
  async submitLesson() {
    await wait(150);
    return { ok: true as const };
  }
}

const base = process.env.EXPO_PUBLIC_API_URL;
export const api: Api = base ? new HttpApi(base) : new MockApi();
export const apiMode = base ? 'http' : 'mock';
