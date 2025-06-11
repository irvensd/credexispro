import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, AuthRequest } from '../auth/middleware';

const prisma = new PrismaClient();
const router = Router();

// List notifications for current user
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ notifications });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Mark notification as read
router.patch('/:id/read', requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params;
  try {
    const notification = await prisma.notification.findUnique({ where: { id } });
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    if (notification.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const updated = await prisma.notification.update({
      where: { id },
      data: { read: true },
    });
    res.json({ notification: updated });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Delete notification
router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params;
  try {
    const notification = await prisma.notification.findUnique({ where: { id } });
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    if (notification.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    await prisma.notification.delete({ where: { id } });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router; 