import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { SettingsState, ThemeSettings, NotificationSettings } from '../../types/store';

const initialState: SettingsState = {
  theme: {
    mode: 'light',
    primaryColor: '#3B82F6',
    fontSize: 'medium',
  },
  notifications: {
    email: true,
    push: true,
    desktop: true,
    sound: true,
  },
  language: 'en',
  timezone: 'UTC',
  dateFormat: 'MM/DD/YYYY',
  loading: false,
  error: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateTheme: (state, action: PayloadAction<Partial<ThemeSettings>>) => {
      state.theme = { ...state.theme, ...action.payload };
    },
    updateNotifications: (state, action: PayloadAction<Partial<NotificationSettings>>) => {
      state.notifications = { ...state.notifications, ...action.payload };
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setTimezone: (state, action: PayloadAction<string>) => {
      state.timezone = action.payload;
    },
    setDateFormat: (state, action: PayloadAction<string>) => {
      state.dateFormat = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetSettings: (state) => {
      return { ...initialState };
    },
  },
});

export const {
  updateTheme,
  updateNotifications,
  setLanguage,
  setTimezone,
  setDateFormat,
  setLoading,
  setError,
  resetSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer; 