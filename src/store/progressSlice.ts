import { createSlice } from '@reduxjs/toolkit';
import { learnedBefore, stats, weekXp } from '../data/seed';
import type { DayXp } from '../data/types';
import { nextStreak } from '../logic/learning';
import { finishLesson } from './lessonSlice';

interface ProgressState {
  streak: number;
  bestStreak: number;
  lastActive: string | null;
  week: DayXp[];
  wordsLearned: number;
  accuracy: number;
  minutes: number;
  levelProgress: number; // % towards the next level
}

const today = () => new Date().toISOString().slice(0, 10);
const yesterday = () => new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);

const initialState: ProgressState = {
  streak: stats.streak,
  bestStreak: stats.bestStreak,
  lastActive: yesterday(),
  week: weekXp.map((d) => (d.day === 'Sun' ? { ...d, xp: 0 } : d)),
  wordsLearned: learnedBefore,
  accuracy: stats.accuracy,
  minutes: stats.minutes - 4,
  levelProgress: stats.levelProgress - 2,
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(finishLesson.fulfilled, (s, a) => {
      const r = a.payload.result;
      if (!r) return;
      const t = today();
      s.streak = nextStreak(s.streak, s.lastActive, t);
      s.bestStreak = Math.max(s.bestStreak, s.streak);
      s.lastActive = t;
      // the demo week ends today
      s.week[s.week.length - 1].xp += r.xp;
      s.wordsLearned += a.payload.learned.length * 4; // whole lesson words land in the list
      s.minutes += r.minutes;
      s.levelProgress = Math.min(100, s.levelProgress + 2);
    });
  },
});

export default progressSlice.reducer;
