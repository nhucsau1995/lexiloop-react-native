import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import lesson from './lessonSlice';
import progress from './progressSlice';
import session from './sessionSlice';
import words from './wordsSlice';

export const store = configureStore({ reducer: { session, lesson, words, progress } });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
