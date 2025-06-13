import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SettingsState } from '../../types/store';

const initialState: SettingsState = {
  theme: 'light',
  language: 'en',
  notifications: true,
  loading: false,
  error: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    updateLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    updateNotifications: (state, action: PayloadAction<boolean>) => {
      state.notifications = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  updateTheme,
  updateLanguage,
  updateNotifications,
  setLoading,
  setError,
} = settingsSlice.actions;

export default settingsSlice.reducer; 