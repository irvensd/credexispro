import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, AuthRequest } from '../auth/middleware';

const prisma = new PrismaClient();
const router = Router();

// List all roles and their permissions for the org (admin only)
router.get('/roles', requireAuth, async (req: AuthRequest, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  try {
    const roles = await prisma.role.findMany({
      where: { organizationId: req.user.orgId },
      include: { permissions: true },
      orderBy: { name: 'asc' },
    });
    res.json({ roles });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Create a new role (admin only)
router.post('/roles', requireAuth, async (req: AuthRequest, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const { name, permissionIds } = req.body;
  if (!name || !Array.isArray(permissionIds)) {
    return res.status(400).json({ error: 'Missing name or permissionIds' });
  }
  try {
    const role = await prisma.role.create({
      data: {
        name,
        organizationId: req.user.orgId,
        permissions: { connect: permissionIds.map((id: string) => ({ id })) },
      },
      include: { permissions: true },
    });
    res.json({ role });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Update a role's name or permissions (admin only)
router.patch('/roles/:id', requireAuth, async (req: AuthRequest, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const { id } = req.params;
  const { name, permissionIds } = req.body;
  if (!name && !Array.isArray(permissionIds)) {
    return res.status(400).json({ error: 'Nothing to update' });
  }
  try {
    const role = await prisma.role.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(Array.isArray(permissionIds) && {
          permissions: { set: permissionIds.map((pid: string) => ({ id: pid })) },
        }),
      },
      include: { permissions: true },
    });
    res.json({ role });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Delete a role (admin only, cannot delete if users assigned)
router.delete('/roles/:id', requireAuth, async (req: AuthRequest, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const { id } = req.params;
  try {
    const userCount = await prisma.user.count({ where: { roleId: id } });
    if (userCount > 0) {
      return res.status(400).json({ error: 'Cannot delete role with assigned users' });
    }
    await prisma.role.delete({ where: { id } });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// List all permissions
router.get('/permissions', requireAuth, async (req: AuthRequest, res) => {
  try {
    const permissions = await prisma.permission.findMany({ orderBy: { name: 'asc' } });
    res.json({ permissions });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router; 