import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../types/store';
import {
  updateTheme,
  updateNotifications,
  setLanguage,
  setTimezone,
  setDateFormat,
  setLoading,
  setError,
  resetSettings,
} from '../store/features/settingsSlice';

export const useSettings = () => {
  const dispatch = useDispatch();
  const settings = useSelector((state: RootState) => state.settings);

  const updateThemeSettings = async (themeData: Partial<RootState['settings']['theme']>) => {
    try {
      dispatch(setLoading(true));
      // TODO: Replace with actual API call
      const response = await fetch('/api/settings/theme', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(themeData),
      });
      if (!response.ok) {
        throw new Error('Failed to update theme settings');
      }
      dispatch(updateTheme(themeData));
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to update theme settings'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const updateNotificationSettings = async (notificationData: Partial<RootState['settings']['notifications']>) => {
    try {
      dispatch(setLoading(true));
      // TODO: Replace with actual API call
      const response = await fetch('/api/settings/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData),
      });
      if (!response.ok) {
        throw new Error('Failed to update notification settings');
      }
      dispatch(updateNotifications(notificationData));
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to update notification settings'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const updateLanguage = async (language: string) => {
    try {
      dispatch(setLoading(true));
      // TODO: Replace with actual API call
      const response = await fetch('/api/settings/language', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ language }),
      });
      if (!response.ok) {
        throw new Error('Failed to update language');
      }
      dispatch(setLanguage(language));
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to update language'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const updateTimezone = async (timezone: string) => {
    try {
      dispatch(setLoading(true));
      // TODO: Replace with actual API call
      const response = await fetch('/api/settings/timezone', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ timezone }),
      });
      if (!response.ok) {
        throw new Error('Failed to update timezone');
      }
      dispatch(setTimezone(timezone));
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to update timezone'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const updateDateFormat = async (dateFormat: string) => {
    try {
      dispatch(setLoading(true));
      // TODO: Replace with actual API call
      const response = await fetch('/api/settings/date-format', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dateFormat }),
      });
      if (!response.ok) {
        throw new Error('Failed to update date format');
      }
      dispatch(setDateFormat(dateFormat));
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to update date format'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const resetAllSettings = async () => {
    try {
      dispatch(setLoading(true));
      // TODO: Replace with actual API call
      const response = await fetch('/api/settings/reset', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to reset settings');
      }
      dispatch(resetSettings());
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to reset settings'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    theme: settings.theme,
    notifications: settings.notifications,
    language: settings.language,
    timezone: settings.timezone,
    dateFormat: settings.dateFormat,
    loading: settings.loading,
    error: settings.error,
    updateTheme: updateThemeSettings,
    updateNotifications: updateNotificationSettings,
    updateLanguage,
    updateTimezone,
    updateDateFormat,
    resetSettings: resetAllSettings,
  };
}; 