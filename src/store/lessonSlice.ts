import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { api } from '../api/client';
import type { Lesson } from '../data/types';
import { accuracy, lessonXp } from '../logic/learning';

export interface LessonResultView {
  xp: number;
  accuracy: number;
  minutes: number;
  words: number;
}

interface LessonState {
  lesson: Lesson | null;
  step: number;
  selected: number | null; // quiz option picked on the current step
  correct: number;
  answered: number;
  learned: string[]; // word ids met in this session
  startedAt: number | null;
  result: LessonResultView | null;
}

const initialState: LessonState = { lesson: null, step: 0, selected: null, correct: 0, answered: 0, learned: [], startedAt: null, result: null };

export const fetchLesson = createAsyncThunk('lesson/fetch', () => api.todayLesson());

/** Totals for the whole lesson: earlier sessions + this one. */
export function summarize(s: Pick<LessonState, 'lesson' | 'correct' | 'answered' | 'startedAt'>, now: number): LessonResultView | null {
  const l = s.lesson;
  if (!l) return null;
  const correct = l.priorCorrect + s.correct;
  const answered = l.priorAnswered + s.answered;
  const sessionMin = s.startedAt ? Math.max(1, Math.ceil((now - s.startedAt) / 60_000)) : 1;
  return { xp: lessonXp(correct, l.totalWords), accuracy: accuracy(correct, answered), minutes: l.priorMinutes + sessionMin, words: l.totalWords };
}

export const finishLesson = createAsyncThunk('lesson/finish', async (_: void, { getState }) => {
  const s = (getState() as { lesson: LessonState }).lesson;
  const result = summarize(s, Date.now());
  if (s.lesson) await api.submitLesson({ lessonId: s.lesson.id, correct: s.correct, answered: s.answered, wordIds: s.learned });
  return { result, learned: s.learned };
});

const lessonSlice = createSlice({
  name: 'lesson',
  initialState,
  reducers: {
    start(s) {
      Object.assign(s, { step: 0, selected: null, correct: 0, answered: 0, learned: [], result: null, startedAt: Date.now() });
    },
    next(s) {
      const cur = s.lesson?.steps[s.step];
      if (cur?.kind === 'word' && !s.learned.includes(cur.wordId)) s.learned.push(cur.wordId);
      s.selected = null;
      s.step += 1;
    },
    pick(s, a: PayloadAction<number>) {
      const cur = s.lesson?.steps[s.step];
      if (cur?.kind !== 'quiz' || s.selected !== null) return;
      s.selected = a.payload;
      s.answered += 1;
      if (a.payload === cur.quiz.answer) s.correct += 1;
      if (!s.learned.includes(cur.quiz.wordId)) s.learned.push(cur.quiz.wordId);
    },
    retry(s) {
      s.selected = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchLesson.fulfilled, (s, a) => {
      s.lesson = a.payload;
    });
    b.addCase(finishLesson.fulfilled, (s, a) => {
      s.result = a.payload.result;
      if (s.lesson) s.lesson = { ...s.lesson, doneWords: s.lesson.totalWords };
    });
  },
});

export const { start, next, pick, retry } = lessonSlice.actions;
export default lessonSlice.reducer;
