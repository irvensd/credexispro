import { configureStore } from '@reduxjs/toolkit';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import authReducer from './slices/authSlice';
import taskReducer from './features/taskSlice';
import settingsReducer from './features/settingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
    settings: settingsReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 