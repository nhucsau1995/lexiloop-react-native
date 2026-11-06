import * as SQLite from 'expo-sqlite';
import type { Word } from '../data/types';

// Offline word cache in SQLite: the Words tab still works without a network. Failures are
// logged and ignored so the cache can never block the UI.
let db: SQLite.SQLiteDatabase | null = null;

async function open() {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('lexiloop.db');
  await db.execAsync(
    'CREATE TABLE IF NOT EXISTS words (id TEXT PRIMARY KEY NOT NULL, json TEXT NOT NULL, mastery TEXT NOT NULL, updated_at INTEGER NOT NULL);',
  );
  return db;
}

export async function saveWords(list: Word[]) {
  try {
    const d = await open();
    const now = Date.now();
    await d.withTransactionAsync(async () => {
      for (const w of list) {
        await d.runAsync('INSERT OR REPLACE INTO words (id, json, mastery, updated_at) VALUES (?, ?, ?, ?)', w.id, JSON.stringify(w), w.mastery, now);
      }
    });
  } catch (e) {
    console.warn('word cache write failed', e);
  }
}

export async function loadWords(): Promise<Word[]> {
  try {
    const d = await open();
    const rows = await d.getAllAsync<{ json: string }>('SELECT json FROM words ORDER BY rowid');
    return rows.map((r) => JSON.parse(r.json) as Word);
  } catch (e) {
    console.warn('word cache read failed', e);
    return [];
  }
}
