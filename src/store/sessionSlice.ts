import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { api, type RegisterInput } from '../api/client';
import type { Level, User } from '../data/types';

interface SessionState {
  user: User | null;
  status: 'idle' | 'loading' | 'error';
  error: string | null;
  // chosen during onboarding, before or after the account exists
  level: Level;
  dailyGoal: number;
  soundEffects: boolean;
}

const initialState: SessionState = { user: null, status: 'idle', error: null, level: 'intermediate', dailyGoal: 10, soundEffects: true };

export const register = createAsyncThunk('session/register', (input: RegisterInput) => api.register(input));
export const continueAsGuest = createAsyncThunk('session/guest', () => api.guest());
export const saveLevel = createAsyncThunk('session/saveLevel', (p: { level: Level; dailyGoal: number }) => api.updateProfile(p));

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setLevel(state, a: PayloadAction<Level>) {
      state.level = a.payload;
    },
    setDailyGoal(state, a: PayloadAction<number>) {
      state.dailyGoal = a.payload;
    },
    toggleSound(state) {
      state.soundEffects = !state.soundEffects;
    },
    logout() {
      return initialState;
    },
  },
  extraReducers: (b) => {
    for (const t of [register, continueAsGuest]) {
      b.addCase(t.pending, (s) => {
        s.status = 'loading';
        s.error = null;
      });
      b.addCase(t.fulfilled, (s, a) => {
        s.status = 'idle';
        s.user = a.payload;
      });
      b.addCase(t.rejected, (s, a) => {
        s.status = 'error';
        s.error = a.error.message ?? 'Something went wrong';
      });
    }
    b.addCase(saveLevel.fulfilled, (s, a) => {
      s.user = a.payload;
      s.level = a.payload.level;
      s.dailyGoal = a.payload.dailyGoal;
    });
  },
});

export const { setLevel, setDailyGoal, toggleSound, logout } = sessionSlice.actions;
export default sessionSlice.reducer;
