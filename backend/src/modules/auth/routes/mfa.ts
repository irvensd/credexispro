import { Router } from 'express';
import { MFAService } from '../services/mfaService';
import { authenticate } from '../middleware';
import logger from '../../../config/logger';

const router = Router();

/**
 * @swagger
 * /api/auth/mfa/setup:
 *   post:
 *     summary: Setup MFA for user
 *     tags: [MFA]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: MFA setup successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 secret:
 *                   type: string
 *                 qrCode:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/setup', authenticate, async (req, res) => {
  try {
    const { userId } = req.user!;
    const { secret, qrCode } = await MFAService.generateSecret(userId);
    res.json({ secret, qrCode });
  } catch (error) {
    logger.error('Error setting up MFA:', error);
    res.status(500).json({ error: 'Failed to setup MFA' });
  }
});

/**
 * @swagger
 * /api/auth/mfa/verify:
 *   post:
 *     summary: Verify and enable MFA
 *     tags: [MFA]
 *     security:
 *       - bearerAuth: []
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
 *         description: MFA verified and enabled
 *       400:
 *         description: Invalid token
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/verify', authenticate, async (req, res) => {
  try {
    const { userId } = req.user!;
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    const verified = await MFAService.verifyToken(userId, token);
    if (!verified) {
      return res.status(400).json({ error: 'Invalid token' });
    }

    await MFAService.enableMFA(userId);
    res.json({ message: 'MFA enabled successfully' });
  } catch (error) {
    logger.error('Error verifying MFA:', error);
    res.status(500).json({ error: 'Failed to verify MFA' });
  }
});

/**
 * @swagger
 * /api/auth/mfa/disable:
 *   post:
 *     summary: Disable MFA
 *     tags: [MFA]
 *     security:
 *       - bearerAuth: []
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
 *         description: MFA disabled successfully
 *       400:
 *         description: Invalid token
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/disable', authenticate, async (req, res) => {
  try {
    const { userId } = req.user!;
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    const verified = await MFAService.verifyToken(userId, token);
    if (!verified) {
      return res.status(400).json({ error: 'Invalid token' });
    }

    await MFAService.disableMFA(userId);
    res.json({ message: 'MFA disabled successfully' });
  } catch (error) {
    logger.error('Error disabling MFA:', error);
    res.status(500).json({ error: 'Failed to disable MFA' });
  }
});

/**
 * @swagger
 * /api/auth/mfa/status:
 *   get:
 *     summary: Check MFA status
 *     tags: [MFA]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: MFA status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mfaEnabled:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/status', authenticate, async (req, res) => {
  try {
    const { userId } = req.user!;
    const isEnabled = await MFAService.isMFAEnabled(userId);
    res.json({ mfaEnabled: isEnabled });
  } catch (error) {
    logger.error('Error checking MFA status:', error);
    res.status(500).json({ error: 'Failed to check MFA status' });
  }
});

export default router; 