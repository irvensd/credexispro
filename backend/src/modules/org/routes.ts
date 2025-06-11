import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, AuthRequest } from '../auth/middleware';

const prisma = new PrismaClient();
const router = Router();

// Get current user's organization
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const org = await prisma.organization.findUnique({
      where: { id: req.user.orgId },
      select: { id: true, name: true, plan: true, status: true, contactEmail: true, address: true, createdAt: true, updatedAt: true },
    });
    if (!org) return res.status(404).json({ error: 'Organization not found' });
    res.json({ organization: org });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Update organization details (admin only)
router.patch('/', requireAuth, async (req: AuthRequest, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const { name, plan, status, contactEmail, address } = req.body;
  if (!name && !plan && !status && !contactEmail && !address) {
    return res.status(400).json({ error: 'Nothing to update' });
  }
  try {
    const org = await prisma.organization.update({
      where: { id: req.user.orgId },
      data: { ...(name && { name }), ...(plan && { plan }), ...(status && { status }), ...(contactEmail && { contactEmail }), ...(address && { address }) },
      select: { id: true, name: true, plan: true, status: true, contactEmail: true, address: true },
    });
    res.json({ organization: org });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router; 