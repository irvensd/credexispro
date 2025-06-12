import { Router } from 'express';
import { PasswordResetService } from '../services/passwordResetService';
import logger from '../../../config/logger';

const router = Router();

/**
 * @swagger
 * /api/auth/password-reset/request:
 *   post:
 *     summary: Request password reset
 *     tags: [Password Reset]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Password reset instructions sent
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/request', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    await PasswordResetService.generateResetToken(email);
    res.json({ message: 'Password reset instructions sent to your email' });
  } catch (error) {
    logger.error('Error requesting password reset:', error);
    res.status(500).json({ error: 'Failed to request password reset' });
  }
});

/**
 * @swagger
 * /api/auth/password-reset/reset:
 *   post:
 *     summary: Reset password using token
 *     tags: [Password Reset]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/reset', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    await PasswordResetService.resetPassword(token, newPassword);
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    logger.error('Error resetting password:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

export default router; 