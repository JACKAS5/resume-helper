import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import jobsReducer         from './slices/jobsSlice';
import resumesReducer      from './slices/resumesSlice';
import coverLettersReducer from './slices/coverLettersSlice';
import applicationsReducer from './slices/applicationsSlice';

export const store = configureStore({
  reducer: {
    jobs:         jobsReducer,
    resumes:      resumesReducer,
    coverLetters: coverLettersReducer,
    applications: applicationsReducer,
  },
});

export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch          = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
