import { Router } from 'express';
import { EmailVerificationService } from '../services/emailVerificationService';
import logger from '../../../config/logger';

const router = Router();

/**
 * @swagger
 * /api/auth/email-verification/send:
 *   post:
 *     summary: Send email verification
 *     tags: [Email Verification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - email
 *             properties:
 *               userId:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Verification email sent
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/send', async (req, res) => {
  try {
    const { userId, email } = req.body;
    if (!userId || !email) {
      return res.status(400).json({ error: 'userId and email are required' });
    }
    await EmailVerificationService.sendVerificationEmail(userId, email);
    res.json({ message: 'Verification email sent' });
  } catch (error) {
    logger.error('Error sending verification email:', error);
    res.status(500).json({ error: 'Failed to send verification email' });
  }
});

/**
 * @swagger
 * /api/auth/email-verification/verify:
 *   post:
 *     summary: Verify email using token
 *     tags: [Email Verification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid token
 *       500:
 *         description: Server error
 */
router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }
    await EmailVerificationService.verifyEmail(token);
    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    logger.error('Error verifying email:', error);
    res.status(400).json({ error: 'Invalid or expired token' });
  }
});

export default router; 