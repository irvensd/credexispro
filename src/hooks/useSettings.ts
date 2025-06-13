import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import {
  updateTheme,
  updateNotifications,
  updateLanguage,
  setLoading,
  setError,
} from '../store/slices/settingsSlice';

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

  return {
    settings,
    updateThemeSettings,
    updateNotificationSettings,
  };
}; 