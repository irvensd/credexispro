import { Request, Response, NextFunction } from 'express';
import { verifyToken } from './utils';
import { MFAService } from './services/mfaService';
import logger from '../../config/logger';

// Extend Express Request type to include user
export interface AuthRequest extends Request {
  user?: {
    userId: number;
  };
}

// Authentication middleware
export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const { userId } = verifyToken(token);
    req.user = { userId };

    // Check if MFA is required
    const mfaEnabled = await MFAService.isMFAEnabled(userId);
    if (mfaEnabled) {
      const mfaVerified = req.headers['x-mfa-verified'] === 'true';
      if (!mfaVerified) {
        return res.status(403).json({ error: 'MFA verification required' });
      }
    }

    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
}; 