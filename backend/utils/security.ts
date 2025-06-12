import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

// Password validation
export const validatePassword = (password: string): boolean => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChar
  );
};

// Password hashing
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

// Password verification
export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// JWT token generation
export const generateToken = (payload: any): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '15m', // 15 minutes
  });
};

// Refresh token generation
export const generateRefreshToken = (): string => {
  return uuidv4();
};

// Token verification
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Input sanitization
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove on* attributes
    .trim();
};

// XSS protection
export const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// CSRF token generation
export const generateCsrfToken = (): string => {
  return uuidv4();
};

// Rate limiting key generation
export const generateRateLimitKey = (req: any): string => {
  return `${req.ip}-${req.path}`;
};

// Session timeout check
export const isSessionExpired = (lastActivity: Date): boolean => {
  const timeout = 30 * 60 * 1000; // 30 minutes
  return Date.now() - lastActivity.getTime() > timeout;
};

// Audit logging
export const logSecurityEvent = (
  event: string,
  userId: string,
  details: any
): void => {
  console.log({
    timestamp: new Date().toISOString(),
    event,
    userId,
    details,
    ip: process.env.NODE_ENV === 'production' ? 'REDACTED' : '127.0.0.1',
  });
}; 