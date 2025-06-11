import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, AuthRequest } from '../auth/middleware';

const prisma = new PrismaClient();
const router = Router();

// List users in org (admin only)
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  try {
    const users = await prisma.user.findMany({
      where: { organizationId: req.user.orgId },
      select: { id: true, name: true, email: true, role: true, status: true, createdAt: true, updatedAt: true },
      orderBy: { createdAt: 'asc' },
    });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Update user role or status (admin only)
router.patch('/:id', requireAuth, async (req: AuthRequest, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const { id } = req.params;
  const { role, status } = req.body;
  if (!role && !status) {
    return res.status(400).json({ error: 'Nothing to update' });
  }
  try {
    const user = await prisma.user.update({
      where: { id },
      data: { ...(role && { role }), ...(status && { status }) },
      select: { id: true, name: true, email: true, role: true, status: true },
    });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Delete user (admin only)
router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const { id } = req.params;
  try {
    await prisma.user.delete({ where: { id } });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router; 