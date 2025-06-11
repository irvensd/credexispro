import { config } from 'dotenv';

// Load environment variables
config();

// Security configuration
export const securityConfig = {
  // JWT settings
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    accessTokenExpiry: '15m',
    refreshTokenExpiry: '7d',
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
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // requests per window
  },

  // CORS settings
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },

  // API security
  api: {
    key: process.env.API_KEY,
    allowedIPs: process.env.ALLOWED_IPS?.split(',') || [],
  },

  // File upload settings
  fileUpload: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    maxFiles: 5,
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

  // Audit logging
  audit: {
    enabled: true,
    logLevel: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    sensitiveFields: ['password', 'token', 'apiKey'],
  },
};

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET', 'API_KEY'];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(', ')}`
  );
}

// Export type for security configuration
export type SecurityConfig = typeof securityConfig; 