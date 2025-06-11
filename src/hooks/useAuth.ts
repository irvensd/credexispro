import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../types/store';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUser,
  refreshTokenStart,
  refreshTokenSuccess,
  refreshTokenFailure,
  requestPasswordReset,
  requestPasswordResetSuccess,
  requestPasswordResetFailure,
  verifyEmailStart,
  verifyEmailSuccess,
  verifyEmailFailure,
  testUser,
  testToken,
  testRefreshToken,
} from '../store/features/authSlice';
import { API_ENDPOINTS } from '../config/constants';

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);

  const login = async (email: string, password: string) => {
    try {
      dispatch(loginStart());
      
      // For development/testing purposes
      if (email === 'test@credexis.com' && password === 'test123') {
        dispatch(loginSuccess({ user: testUser, token: testToken, refreshToken: testRefreshToken }));
        return;
      }

      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      dispatch(loginSuccess(data));
    } catch (error) {
      dispatch(loginFailure(error instanceof Error ? error.message : 'Login failed'));
      throw error;
    }
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  const updateUserProfile = (userData: RootState['auth']['user']) => {
    if (userData) {
      dispatch(updateUser(userData));
    }
  };

  const refreshToken = async () => {
    try {
      dispatch(refreshTokenStart());
      
      const response = await fetch(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: auth.refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      dispatch(refreshTokenSuccess(data));
    } catch (error) {
      dispatch(refreshTokenFailure(error instanceof Error ? error.message : 'Token refresh failed'));
      throw error;
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      dispatch(requestPasswordReset());
      
      const response = await fetch(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Password reset request failed');
      }

      dispatch(requestPasswordResetSuccess());
    } catch (error) {
      dispatch(requestPasswordResetFailure(error instanceof Error ? error.message : 'Password reset request failed'));
      throw error;
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      dispatch(loginStart());
      
      const response = await fetch(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      if (!response.ok) {
        throw new Error('Password reset failed');
      }

      const data = await response.json();
      dispatch(loginSuccess(data));
    } catch (error) {
      dispatch(loginFailure(error instanceof Error ? error.message : 'Password reset failed'));
      throw error;
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      dispatch(verifyEmailStart());
      
      const response = await fetch(API_ENDPOINTS.AUTH.VERIFY_EMAIL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error('Email verification failed');
      }

      dispatch(verifyEmailSuccess());
    } catch (error) {
      dispatch(verifyEmailFailure(error instanceof Error ? error.message : 'Email verification failed'));
      throw error;
    }
  };

  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    loading: auth.loading,
    error: auth.error,
    emailVerified: auth.emailVerified,
    passwordResetRequested: auth.passwordResetRequested,
    login,
    logout: logoutUser,
    updateUser: updateUserProfile,
    refreshToken,
    requestPasswordReset,
    resetPassword,
    verifyEmail,
  };
}; 