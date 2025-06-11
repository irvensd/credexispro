import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, AuthRequest } from '../auth/middleware';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();
const router = Router();

// List API keys for org (admin only)
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  try {
    const keys = await prisma.apiKey.findMany({
      where: { organizationId: req.user.orgId },
      select: { id: true, name: true, key: true, createdAt: true, lastUsed: true, status: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ apiKeys: keys });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Create/generate API key (admin only)
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Missing key name' });
  }
  try {
    const key = 'sk_' + randomBytes(24).toString('hex');
    const apiKey = await prisma.apiKey.create({
      data: {
        name,
        key,
        organizationId: req.user.orgId,
      },
      select: { id: true, name: true, key: true, createdAt: true, status: true },
    });
    res.json({ apiKey });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Revoke API key (admin only)
router.patch('/:id/revoke', requireAuth, async (req: AuthRequest, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const { id } = req.params;
  try {
    const apiKey = await prisma.apiKey.update({
      where: { id },
      data: { status: 'revoked' },
      select: { id: true, name: true, status: true },
    });
    res.json({ apiKey });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router; 