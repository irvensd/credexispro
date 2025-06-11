import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, AuthRequest } from '../auth/middleware';

const prisma = new PrismaClient();
const router = Router();

// List all sessions for org (admin only)
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  try {
    const sessions = await prisma.session.findMany({
      where: { organizationId: req.user.orgId },
      include: { user: { select: { id: true, name: true, email: true, status: true } } },
      orderBy: { loginAt: 'desc' },
    });
    res.json({ sessions });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// List current user's sessions
router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  try {
    const sessions = await prisma.session.findMany({
      where: { userId: req.user.userId },
      orderBy: { loginAt: 'desc' },
    });
    res.json({ sessions });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Revoke a session (admin or user can revoke their own)
router.patch('/:id/revoke', requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params;
  try {
    // Only admin or the session owner can revoke
    const session = await prisma.session.findUnique({ where: { id } });
    if (!session) return res.status(404).json({ error: 'Session not found' });
    if (req.user.role !== 'admin' && session.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const updated = await prisma.session.update({
      where: { id },
      data: { status: 'revoked' },
    });
    res.json({ session: updated });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Revoke all other sessions for the user except current
router.post('/revoke-others', requireAuth, async (req: AuthRequest, res) => {
  const sessionId = req.headers['x-session-id'];
  try {
    await prisma.session.updateMany({
      where: {
        userId: req.user.userId,
        status: 'active',
        ...(sessionId && typeof sessionId === 'string' ? { NOT: { id: sessionId } } : {}),
      },
      data: { status: 'revoked' },
    });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router; 