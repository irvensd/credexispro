// API Constants
export const API = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// Route Constants
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  CLIENTS: '/clients',
  TASKS: '/tasks',
  SETTINGS: '/settings',
  PROFILE: '/profile',
  DOCUMENTS: '/documents',
  REPORTS: '/reports',
  MARKETING: '/marketing',
  CREDIT_TOOLS: '/credit-tools',
  LETTER_TEMPLATES: '/letter-templates',
  INVOICES: '/invoices',
  // Legal routes
  PRIVACY_POLICY: '/privacy-policy',
  COOKIE_POLICY: '/cookie-policy',
  TERMS_OF_SERVICE: '/terms-of-service',
  GDPR: '/gdpr',
} as const;

// Auth Constants
export const AUTH = {
  TOKEN_KEY: 'auth_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  TOKEN_EXPIRY: 3600, // 1 hour
  REFRESH_TOKEN_EXPIRY: 604800, // 7 days
  REFRESH_TOKEN: '/api/auth/refresh-token',
} as const;

// Pagination Constants
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  MAX_PAGE_SIZE: 100,
} as const;

// Form Constants
export const FORM = {
  DEBOUNCE_DELAY: 300,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'application/pdf'],
  MAX_FILES: 5,
} as const;

// Validation Constants
export const VALIDATION = {
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL: true,
  },
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50,
    ALLOWED_CHARS: /^[a-zA-Z0-9_-]+$/,
  },
  EMAIL: {
    MAX_LENGTH: 255,
    PATTERN: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  },
} as const;

// UI Constants
export const UI = {
  TOAST_DURATION: 5000,
  MODAL_ANIMATION_DURATION: 300,
  SIDEBAR_WIDTH: 240,
  HEADER_HEIGHT: 64,
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024,
} as const;

// Feature Flags
export const FEATURES = {
  ENABLE_MFA: true,
  ENABLE_SOCIAL_LOGIN: true,
  ENABLE_FILE_UPLOAD: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_ANALYTICS: true,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Please log in to continue.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  FILE_TOO_LARGE: 'File size exceeds the maximum limit of 5MB.',
  INVALID_FILE_TYPE: 'Invalid file type. Please upload a valid file.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Successfully logged in.',
  LOGOUT: 'Successfully logged out.',
  REGISTER: 'Account created successfully.',
  UPDATE: 'Successfully updated.',
  DELETE: 'Successfully deleted.',
  UPLOAD: 'File uploaded successfully.',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'theme',
  LANGUAGE: 'language',
  RECENT_ITEMS: 'recent_items',
  USER_PREFERENCES: 'user_preferences',
} as const;

// Export all constants as a single object
export const CONSTANTS = {
  API,
  ROUTES,
  AUTH,
  PAGINATION,
  FORM,
  VALIDATION,
  UI,
  FEATURES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  STORAGE_KEYS,
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH_TOKEN: '/api/auth/refresh-token',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    VERIFY_EMAIL: '/api/auth/verify-email',
  },
  USERS: {
    BASE: '/api/users',
    PROFILE: '/api/users/profile',
    SETTINGS: '/api/users/settings',
  },
  CLIENTS: {
    BASE: '/api/clients',
    IMPORT: '/api/clients/import',
    EXPORT: '/api/clients/export',
  },
  TASKS: {
    BASE: '/api/tasks',
    LIST: '/api/tasks',
    CREATE: '/api/tasks',
    UPDATE: '/api/tasks',
    DELETE: '/api/tasks',
    BULK: '/api/tasks/bulk',
    TEMPLATES: '/api/tasks/templates',
  },
  DOCUMENTS: {
    BASE: '/api/documents',
    UPLOAD: '/api/documents/upload',
  },
  REPORTS: {
    BASE: '/api/reports',
    GENERATE: '/api/reports/generate',
  },
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MANAGER: 'manager',
} as const;

export const TOKEN_EXPIRY = {
  ACCESS: '15m',
  REFRESH: '7d',
} as const; 