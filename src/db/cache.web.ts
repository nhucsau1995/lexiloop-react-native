import type { Word } from '../data/types';

// Web preview has no SQLite cache (expo-sqlite needs a wasm worker there); the app still runs.
export async function saveWords(_list: Word[]) {}

export async function loadWords(): Promise<Word[]> {
  return [];
}
