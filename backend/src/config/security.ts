import { config } from 'dotenv';
import path from 'path';

// Load environment variables
config({ path: path.join(__dirname, '../../.env') });

// Security configuration
export const securityConfig = {
  // JWT settings
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret-key',
    refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d',
  },

  // Password settings
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxAge: 90, // days
  },

  // Session settings
  session: {
    timeout: 30 * 60 * 1000, // 30 minutes
    maxConcurrent: 3,
  },

  // Rate limiting
  rateLimit: {
    windowMs: Number(process.env.API_RATE_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: Number(process.env.API_RATE_LIMIT) || 100, // requests per window
  },

  // CORS settings
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },

  // File upload settings
  fileUpload: {
    maxSize: Number(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    maxFiles: 5,
    uploadDir: process.env.UPLOAD_DIR || './uploads',
  },

  // Security headers
  headers: {
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  },

  // Feature flags
  features: {
    enableMfa: process.env.ENABLE_MFA === 'true',
    enableSocialLogin: process.env.ENABLE_SOCIAL_LOGIN === 'true',
    enableFileUpload: process.env.ENABLE_FILE_UPLOAD === 'true',
    enableNotifications: process.env.ENABLE_NOTIFICATIONS === 'true',
    enableAnalytics: process.env.ENABLE_ANALYTICS === 'true',
  },
};

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET', 'DATABASE_URL'];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(', ')}`
  );
}

// Export type for security configuration
export type SecurityConfig = typeof securityConfig; 