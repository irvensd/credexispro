import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import pool from '../../../config/db';
import logger from '../../../config/logger';

export class MFAService {
  // Generate a new MFA secret for a user
  static async generateSecret(userId: number): Promise<{ secret: string; qrCode: string }> {
    try {
      // Generate a new secret
      const secret = speakeasy.generateSecret({
        name: 'CredExis',
        length: 20
      });

      // Generate QR code
      const qrCode = await QRCode.toDataURL(secret.otpauth_url!);

      // Store the secret in the database
      await pool.query(
        'UPDATE users SET mfa_secret = $1, mfa_enabled = false, mfa_verified = false WHERE id = $2',
        [secret.base32, userId]
      );

      return {
        secret: secret.base32,
        qrCode
      };
    } catch (error) {
      logger.error('Error generating MFA secret:', error);
      throw new Error('Failed to generate MFA secret');
    }
  }

  // Verify MFA token
  static async verifyToken(userId: number, token: string): Promise<boolean> {
    try {
      // Get user's MFA secret
      const result = await pool.query(
        'SELECT mfa_secret FROM users WHERE id = $1',
        [userId]
      );

      if (!result.rows[0]?.mfa_secret) {
        throw new Error('MFA not set up for user');
      }

      // Verify the token
      const verified = speakeasy.totp.verify({
        secret: result.rows[0].mfa_secret,
        encoding: 'base32',
        token,
        window: 1 // Allow 30 seconds clock skew
      });

      if (verified) {
        // Update MFA verification status
        await pool.query(
          'UPDATE users SET mfa_verified = true WHERE id = $1',
          [userId]
        );
      }

      return verified;
    } catch (error) {
      logger.error('Error verifying MFA token:', error);
      throw new Error('Failed to verify MFA token');
    }
  }

  // Enable MFA for a user
  static async enableMFA(userId: number): Promise<void> {
    try {
      await pool.query(
        'UPDATE users SET mfa_enabled = true WHERE id = $1',
        [userId]
      );
    } catch (error) {
      logger.error('Error enabling MFA:', error);
      throw new Error('Failed to enable MFA');
    }
  }

  // Disable MFA for a user
  static async disableMFA(userId: number): Promise<void> {
    try {
      await pool.query(
        'UPDATE users SET mfa_enabled = false, mfa_verified = false, mfa_secret = NULL WHERE id = $1',
        [userId]
      );
    } catch (error) {
      logger.error('Error disabling MFA:', error);
      throw new Error('Failed to disable MFA');
    }
  }

  // Check if MFA is enabled for a user
  static async isMFAEnabled(userId: number): Promise<boolean> {
    try {
      const result = await pool.query(
        'SELECT mfa_enabled FROM users WHERE id = $1',
        [userId]
      );
      return result.rows[0]?.mfa_enabled || false;
    } catch (error) {
      logger.error('Error checking MFA status:', error);
      throw new Error('Failed to check MFA status');
    }
  }
} 