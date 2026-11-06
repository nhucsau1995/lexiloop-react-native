export type Level = 'beginner' | 'intermediate' | 'advanced';
export type Mastery = 'new' | 'learning' | 'mastered';

export interface User {
  id: string;
  name: string;
  email: string;
  level: Level;
  dailyGoal: number;
  joined: string; // ISO date
  guest: boolean;
}

export interface Word {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  meaning: string;
  short: string; // short gloss for lists
  example: string;
  mastery: Mastery;
  image?: string; // key into data/images.ts
}

export interface QuizQuestion {
  wordId: string;
  prompt: string;
  options: string[];
  answer: number;
}

export type LessonStep = { kind: 'word'; wordId: string } | { kind: 'quiz'; quiz: QuizQuestion };

export interface Lesson {
  id: string;
  title: string;
  totalWords: number;
  doneWords: number;
  // answers and minutes from earlier sessions of this lesson
  priorCorrect: number;
  priorAnswered: number;
  priorMinutes: number;
  image: string;
  steps: LessonStep[];
}

export interface DayXp {
  day: string; // Mon..Sun
  xp: number;
}
