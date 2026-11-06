import type { Mastery, Word } from '../data/types.ts';

// Pure learning rules, shared by the Redux slices and unit-tested with node --test.

export const XP_PER_CORRECT = 10;
export const XP_LESSON_BONUS = 20;

export type WordFilter = 'all' | 'learning' | 'mastered';

/** XP for a finished lesson: 10 per correct answer + a completion bonus. */
export function lessonXp(correct: number, total: number): number {
  if (total <= 0) return 0;
  const c = Math.max(0, Math.min(correct, total));
  return c * XP_PER_CORRECT + XP_LESSON_BONUS;
}

/** Accuracy in whole percent, 0 when nothing was answered. */
export function accuracy(correct: number, answered: number): number {
  if (answered <= 0) return 0;
  return Math.round((Math.min(correct, answered) / answered) * 100);
}

/** Mastery after an answer: right answers move a word up, a wrong one moves it back to learning. */
export function nextMastery(current: Mastery, correct: boolean): Mastery {
  if (!correct) return current === 'new' ? 'new' : 'learning';
  return current === 'new' ? 'learning' : 'mastered';
}

/** Streak after finishing a lesson today, given the last active ISO day. */
export function nextStreak(streak: number, lastActive: string | null, today: string): number {
  if (lastActive === today) return Math.max(streak, 1);
  if (lastActive && dayDiff(lastActive, today) === 1) return streak + 1;
  return 1;
}

function dayDiff(a: string, b: string): number {
  return Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000);
}

export function filterWords(list: Word[], filter: WordFilter, query: string): Word[] {
  const q = query.trim().toLowerCase();
  return list.filter((w) => {
    if (filter === 'learning' && w.mastery === 'mastered') return false;
    if (filter === 'mastered' && w.mastery !== 'mastered') return false;
    return !q || w.word.toLowerCase().includes(q) || w.short.toLowerCase().includes(q);
  });
}

export function masteryCounts(list: Word[], extraMastered = 0, extraLearning = 0) {
  const mastered = list.filter((w) => w.mastery === 'mastered').length + extraMastered;
  const learning = list.length - (mastered - extraMastered) + extraLearning;
  const total = mastered + learning;
  return { mastered, learning, total, percent: total ? Math.round((mastered / total) * 100) : 0 };
}

export function validateSignUp(name: string, email: string, password: string): Record<string, string> {
  const errors: Record<string, string> = {};
  if (name.trim().length < 2) errors.name = 'Enter your name';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = 'Enter a valid email';
  if (password.length < 8) errors.password = 'At least 8 characters';
  return errors;
}
