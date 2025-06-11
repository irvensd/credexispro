import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, AuthRequest } from '../auth/middleware';

const prisma = new PrismaClient();
const router = Router();

// List audit logs for org (admin only)
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const { eventType, actorEmail, resource, dateFrom, dateTo } = req.query;
  try {
    const logs = await prisma.auditLog.findMany({
      where: {
        organizationId: req.user.orgId,
        ...(eventType ? { eventType: String(eventType) } : {}),
        ...(actorEmail ? { actorEmail: String(actorEmail) } : {}),
        ...(resource ? { resource: String(resource) } : {}),
        ...(dateFrom || dateTo
          ? {
              timestamp: {
                ...(dateFrom ? { gte: new Date(String(dateFrom)) } : {}),
                ...(dateTo ? { lte: new Date(String(dateTo)) } : {}),
              },
            }
          : {}),
      },
      orderBy: { timestamp: 'desc' },
      take: 100,
    });
    res.json({ logs });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router; 