import pool from '../../../config/db';
import { hashPassword, comparePassword, generateToken, generateRefreshToken, verifyRefreshToken } from '../utils';
import { MFAService } from './mfaService';
import { EmailVerificationService } from './emailVerificationService';
import logger from '../../../config/logger';

interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export class AuthService {
  // Register a new user
  static async register(data: RegisterData) {
    try {
      const { email, password, firstName, lastName } = data;

      // Check if user already exists
      const existingUser = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );

      if (existingUser.rows[0]) {
        throw new Error('User already exists');
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      const result = await pool.query(
        'INSERT INTO users (email, password_hash, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id, email, first_name, last_name, role, email_verified',
        [email, hashedPassword, firstName, lastName]
      );
      const user = result.rows[0];

      // Send verification email
      await EmailVerificationService.sendVerificationEmail(user.id, user.email);

      return user;
    } catch (error) {
      logger.error('Error registering user:', error);
      throw error;
    }
  }

  // Login user
  static async login(email: string, password: string) {
    try {
      // Get user
      const result = await pool.query(
        'SELECT id, email, password_hash, first_name, last_name, role, mfa_enabled, email_verified FROM users WHERE email = $1',
        [email]
      );

      const user = result.rows[0];
      if (!user) {
        throw new Error('User not found');
      }

      // Verify password
      const isValid = await comparePassword(password, user.password_hash);
      if (!isValid) {
        throw new Error('Invalid password');
      }

      // Restrict login if email is not verified
      if (!user.email_verified) {
        throw new Error('Email not verified. Please check your inbox.');
      }

      // Generate tokens
      const accessToken = generateToken(user.id);
      const refreshToken = generateRefreshToken(user.id);

      // Remove sensitive data
      delete user.password_hash;

      return {
        user,
        accessToken,
        refreshToken,
        requiresMFA: user.mfa_enabled
      };
    } catch (error) {
      logger.error('Error logging in:', error);
      throw error;
    }
  }

  // Refresh access token
  static async refreshToken(refreshToken: string) {
    try {
      const { userId } = verifyRefreshToken(refreshToken);

      // Generate new tokens
      const accessToken = generateToken(userId);
      const newRefreshToken = generateRefreshToken(userId);

      return {
        accessToken,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      logger.error('Error refreshing token:', error);
      throw error;
    }
  }

  // Logout user
  static async logout(userId: number) {
    try {
      // In a real application, you might want to invalidate the refresh token
      // or add it to a blacklist. For now, we'll just return success.
      return true;
    } catch (error) {
      logger.error('Error logging out:', error);
      throw error;
    }
  }

  // Get current user
  static async getCurrentUser(userId: number) {
    try {
      const result = await pool.query(
        'SELECT id, email, first_name, last_name, role, mfa_enabled, email_verified FROM users WHERE id = $1',
        [userId]
      );

      if (!result.rows[0]) {
        throw new Error('User not found');
      }

      return result.rows[0];
    } catch (error) {
      logger.error('Error getting current user:', error);
      throw error;
    }
  }
} 