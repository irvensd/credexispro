import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AUTH } from '../../config/constants';
import type { User } from '../../types/store';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  emailVerified: boolean;
  passwordResetRequested: boolean;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem(AUTH.TOKEN_KEY),
  refreshToken: localStorage.getItem(AUTH.REFRESH_TOKEN_KEY),
  isAuthenticated: !!localStorage.getItem(AUTH.TOKEN_KEY),
  loading: false,
  error: null,
  emailVerified: false,
  passwordResetRequested: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string; refreshToken: string }>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.error = null;
      localStorage.setItem(AUTH.TOKEN_KEY, action.payload.token);
      localStorage.setItem(AUTH.REFRESH_TOKEN_KEY, action.payload.refreshToken);
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem(AUTH.TOKEN_KEY);
      localStorage.removeItem(AUTH.REFRESH_TOKEN_KEY);
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    refreshTokenStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    refreshTokenSuccess: (state, action: PayloadAction<{ token: string; refreshToken: string }>) => {
      state.loading = false;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.error = null;
      localStorage.setItem(AUTH.TOKEN_KEY, action.payload.token);
      localStorage.setItem(AUTH.REFRESH_TOKEN_KEY, action.payload.refreshToken);
    },
    refreshTokenFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.token = null;
      state.refreshToken = null;
      localStorage.removeItem(AUTH.TOKEN_KEY);
      localStorage.removeItem(AUTH.REFRESH_TOKEN_KEY);
    },
    requestPasswordReset: (state) => {
      state.loading = true;
      state.error = null;
    },
    requestPasswordResetSuccess: (state) => {
      state.loading = false;
      state.passwordResetRequested = true;
      state.error = null;
    },
    requestPasswordResetFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    verifyEmailStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    verifyEmailSuccess: (state) => {
      state.loading = false;
      state.emailVerified = true;
      state.error = null;
    },
    verifyEmailFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
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
} = authSlice.actions;

export default authSlice.reducer; 