import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { api } from '../api/client';
import { loadWords as loadCached, saveWords } from '../db/cache';
import type { Word } from '../data/types';
import { nextMastery, type WordFilter } from '../logic/learning';
import { finishLesson } from './lessonSlice';

interface WordsState {
  list: Word[];
  filter: WordFilter;
  query: string;
  source: 'none' | 'api' | 'cache';
}

const initialState: WordsState = { list: [], filter: 'all', query: '', source: 'none' };

// API first; on failure fall back to the SQLite cache. A successful fetch refreshes the cache.
export const fetchWords = createAsyncThunk('words/fetch', async () => {
  try {
    const list = await api.words();
    saveWords(list);
    return { list, source: 'api' as const };
  } catch {
    return { list: await loadCached(), source: 'cache' as const };
  }
});

const wordsSlice = createSlice({
  name: 'words',
  initialState,
  reducers: {
    setFilter(s, a: PayloadAction<WordFilter>) {
      s.filter = a.payload;
    },
    setQuery(s, a: PayloadAction<string>) {
      s.query = a.payload;
    },
    answered(s, a: PayloadAction<{ wordId: string; correct: boolean }>) {
      const w = s.list.find((x) => x.id === a.payload.wordId);
      if (w) w.mastery = nextMastery(w.mastery, a.payload.correct);
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchWords.fulfilled, (s, a) => {
      s.list = a.payload.list;
      s.source = a.payload.source;
    });
    // words met in a finished lesson move one mastery step up
    b.addCase(finishLesson.fulfilled, (s, a) => {
      for (const id of a.payload.learned) {
        const w = s.list.find((x) => x.id === id);
        if (w) w.mastery = nextMastery(w.mastery, true);
      }
    });
  },
});

export const { setFilter, setQuery, answered } = wordsSlice.actions;
export default wordsSlice.reducer;
