import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, AuthRequest } from '../auth/middleware';
import { hashPassword } from '../auth/hash';
import { signJwt } from '../auth/jwt';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();
const router = Router();

// Create/send invite (admin only)
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  const { email, role } = req.body;
  const orgId = req.user.orgId;
  if (!email || !role) {
    return res.status(400).json({ error: 'Missing email or role' });
  }
  // Only admin can invite
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }
    // Create invite
    const token = randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const invite = await prisma.invite.create({
      data: {
        email,
        role,
        token,
        organizationId: orgId,
        expiresAt,
      },
    });
    res.json({ invite });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// List invites for org (admin only)
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  const orgId = req.user.orgId;
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  try {
    const invites = await prisma.invite.findMany({
      where: { organizationId: orgId, status: 'pending' },
      select: { id: true, email: true, role: true, token: true, sentAt: true, expiresAt: true, status: true },
      orderBy: { sentAt: 'desc' },
    });
    res.json({ invites });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Accept invite (public)
router.post('/accept', async (req, res) => {
  const { token, name, password } = req.body;
  if (!token || !name || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const invite = await prisma.invite.findUnique({ where: { token } });
    if (!invite || invite.status !== 'pending' || (invite.expiresAt && invite.expiresAt < new Date())) {
      return res.status(400).json({ error: 'Invalid or expired invite' });
    }
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email: invite.email } });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }
    // Create user
    const hashed = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email: invite.email,
        password: hashed,
        organizationId: invite.organizationId,
        role: invite.role,
      },
    });
    // Mark invite as accepted
    await prisma.invite.update({
      where: { token },
      data: { status: 'accepted', acceptedAt: new Date() },
    });
    const jwt = signJwt({ userId: user.id, orgId: user.organizationId, role: user.role });
    res.json({ token: jwt, user: { id: user.id, name: user.name, email: user.email, role: user.role, organizationId: user.organizationId } });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router; 