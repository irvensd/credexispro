import { v4 as uuidv4 } from 'uuid';
import pool from '../../../config/db';
import { sendEmail } from '../../../utils/email';
import logger from '../../../config/logger';

export class EmailVerificationService {
  static async sendVerificationEmail(userId: number, email: string): Promise<void> {
    try {
      // Generate verification token
      const token = uuidv4();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Store token in database
      await pool.query(
        'INSERT INTO email_verification_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
        [userId, token, expiresAt]
      );

      // Send verification email
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
      await sendEmail({
        to: email,
        subject: 'Verify your email',
        html: `
          <h1>Email Verification</h1>
          <p>Please click the link below to verify your email address:</p>
          <a href="${verificationUrl}">${verificationUrl}</a>
          <p>This link will expire in 24 hours.</p>
        `
      });
    } catch (error) {
      logger.error('Error in sendVerificationEmail:', error);
      throw new Error('Failed to send verification email');
    }
  }

  static async verifyEmail(token: string): Promise<void> {
    try {
      // Find token in database
      const result = await pool.query(
        'SELECT user_id FROM email_verification_tokens WHERE token = $1 AND expires_at > NOW() AND used = false',
        [token]
      );

      if (result.rows.length === 0) {
        throw new Error('Invalid or expired token');
      }

      const { user_id } = result.rows[0];

      // Mark token as used
      await pool.query(
        'UPDATE email_verification_tokens SET used = true WHERE token = $1',
        [token]
      );

      // Update user's email verification status
      await pool.query(
        'UPDATE users SET email_verified = true WHERE id = $1',
        [user_id]
      );
    } catch (error) {
      logger.error('Error in verifyEmail:', error);
      throw new Error('Failed to verify email');
    }
  }
} 