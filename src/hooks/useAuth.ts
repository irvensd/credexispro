import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { cache } from '../utils/cache';
import { logger } from '../utils/logger';
import { monitoring } from '../utils/monitoring';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/slices/authSlice';
import type { User } from '../types/store';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData extends LoginCredentials {
  name: string;
}

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_REFRESH_TOKEN_KEY = 'auth_refresh_token';
const AUTH_USER_KEY = 'auth_user';

export const useAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const loadStoredAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      const user = await cache.get<User>(AUTH_USER_KEY);

      if (token && user) {
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('Failed to load stored auth', new Error(errorMessage), { action: 'loadStoredAuth' });
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Failed to load authentication state',
      });
    }
  }, []);

  useEffect(() => {
    loadStoredAuth();
  }, [loadStoredAuth]);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      // Only allow test login in development
      if (
        process.env.NODE_ENV === 'development' &&
        credentials.email === 'test@credexis.com' &&
        credentials.password === 'test123'
      ) {
        const user = {
          id: '1',
          email: 'test@credexis.com',
          name: 'Test User',
          role: 'admin' as const,
          emailVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem(AUTH_TOKEN_KEY, 'test-token');
        localStorage.setItem(AUTH_REFRESH_TOKEN_KEY, 'test-refresh-token');
        await cache.set(AUTH_USER_KEY, user);

        // Update Redux state
        dispatch(loginSuccess({
          user,
          token: 'test-token',
          refreshToken: 'test-refresh-token',
        }));

        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        monitoring.recordInteraction({
          type: 'login',
          target: 'auth',
          timestamp: Date.now(),
          metadata: { userId: user.id },
        });

        navigate('/dashboard');
        return;
      }

      try {
        const response = await api.post<{ token: string; refreshToken: string; user: User }>(
          '/auth/login',
          credentials
        );

        const { token, refreshToken, user } = response.data;

        localStorage.setItem(AUTH_TOKEN_KEY, token);
        localStorage.setItem(AUTH_REFRESH_TOKEN_KEY, refreshToken);
        await cache.set(AUTH_USER_KEY, user);

        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        monitoring.recordInteraction({
          type: 'login',
          target: 'auth',
          timestamp: Date.now(),
          metadata: { userId: user.id },
        });

        navigate('/dashboard');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Login failed';
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));

        monitoring.reportError({
          error: error instanceof Error ? error : new Error(errorMessage),
          context: { action: 'login' },
        });

        logger.error('Login failed', new Error(errorMessage), { action: 'login' });
      }
    },
    [navigate, dispatch]
  );

  const register = useCallback(
    async (data: RegisterData) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await api.post<{ token: string; refreshToken: string; user: User }>(
          '/auth/register',
          data
        );

        const { token, refreshToken, user } = response.data;

        localStorage.setItem(AUTH_TOKEN_KEY, token);
        localStorage.setItem(AUTH_REFRESH_TOKEN_KEY, refreshToken);
        await cache.set(AUTH_USER_KEY, user);

        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        monitoring.recordInteraction({
          type: 'register',
          target: 'auth',
          timestamp: Date.now(),
          metadata: { userId: user.id },
        });

        navigate('/dashboard');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Registration failed';
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));

        monitoring.reportError({
          error: error instanceof Error ? error : new Error(errorMessage),
          context: { action: 'register' },
        });

        logger.error('Registration failed', new Error(errorMessage), { action: 'register' });
      }
    },
    [navigate]
  );

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout', {});
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('Logout request failed', new Error(errorMessage), { action: 'logout' });
    } finally {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY);
      await cache.delete(AUTH_USER_KEY);

      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });

      monitoring.recordInteraction({
        type: 'logout',
        target: 'auth',
        timestamp: Date.now(),
      });

      navigate('/login');
    }
  }, [navigate]);

  const refreshToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem(AUTH_REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post<{ token: string; user: User }>('/auth/refresh', {
        refreshToken,
      });

      const { token, user } = response.data;

      localStorage.setItem(AUTH_TOKEN_KEY, token);
      await cache.set(AUTH_USER_KEY, user);

      setState((prev) => ({
        ...prev,
        user,
        isAuthenticated: true,
      }));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('Token refresh failed', new Error(errorMessage), { action: 'refreshToken' });
      await logout();
    }
  }, [logout]);

  // Add a flag to indicate if test login is available
  const isTestLoginAvailable = process.env.NODE_ENV === 'development';

  return {
    ...state,
    login,
    register,
    logout,
    refreshToken,
    isTestLoginAvailable,
  };
}; 