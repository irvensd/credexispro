import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from './jwt';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
  user?: any;
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }
  const token = auth.replace('Bearer ', '');
  try {
    const payload = verifyJwt(token);
    req.user = payload;
    // Update lastActive for session if x-session-id is present
    const sessionId = req.headers['x-session-id'];
    let userId: string | undefined;
    if (typeof payload === 'object' && 'userId' in payload) {
      userId = (payload as any).userId;
    }
    if (sessionId && typeof sessionId === 'string' && userId) {
      await prisma.session.updateMany({
        where: { id: sessionId, userId, status: 'active' },
        data: { lastActive: new Date() },
      });
    }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
} 