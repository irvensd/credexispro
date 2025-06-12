import crypto from 'crypto';
import nodemailer from 'nodemailer';
import pool from '../../../config/db';
import logger from '../../../config/logger';
import { hashPassword } from '../utils';

export class PasswordResetService {
  private static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Generate and store a password reset token
  static async generateResetToken(email: string): Promise<void> {
    try {
      // Get user by email
      const userResult = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );

      if (!userResult.rows[0]) {
        throw new Error('User not found');
      }

      const userId = userResult.rows[0].id;

      // Generate a random token
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

      // Store the token
      await pool.query(
        'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
        [userId, token, expiresAt]
      );

      // Send reset email
      await this.sendResetEmail(email, token);
    } catch (error) {
      logger.error('Error generating reset token:', error);
      throw new Error('Failed to generate reset token');
    }
  }

  // Reset password using token
  static async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      // Get the token
      const tokenResult = await pool.query(
        'SELECT user_id, expires_at, used_at FROM password_reset_tokens WHERE token = $1',
        [token]
      );

      if (!tokenResult.rows[0]) {
        throw new Error('Invalid reset token');
      }

      const { user_id, expires_at, used_at } = tokenResult.rows[0];

      // Check if token is expired or used
      if (new Date(expires_at) < new Date() || used_at) {
        throw new Error('Reset token has expired or has already been used');
      }

      // Hash the new password
      const hashedPassword = await hashPassword(newPassword);

      // Update the password
      await pool.query(
        'UPDATE users SET password_hash = $1 WHERE id = $2',
        [hashedPassword, user_id]
      );

      // Mark token as used
      await pool.query(
        'UPDATE password_reset_tokens SET used_at = CURRENT_TIMESTAMP WHERE token = $1',
        [token]
      );
    } catch (error) {
      logger.error('Error resetting password:', error);
      throw new Error('Failed to reset password');
    }
  }

  // Send reset password email
  private static async sendResetEmail(email: string, token: string): Promise<void> {
    try {
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Reset Your Password',
        html: `
          <h1>Password Reset Request</h1>
          <p>You requested a password reset. Click the link below to reset your password:</p>
          <a href="${resetUrl}">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        `,
      });
    } catch (error) {
      logger.error('Error sending reset email:', error);
      throw new Error('Failed to send reset email');
    }
  }
} 