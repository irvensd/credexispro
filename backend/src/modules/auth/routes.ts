import { Router } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { hashPassword, verifyPassword } from './hash';
import { signJwt } from './jwt';
import { requireAuth, AuthRequest } from './middleware';

const prisma = new PrismaClient();
const router = Router();

// Signup route
router.post('/signup', async (req, res) => {
  const { name, email, password, organizationId, role } = req.body;
  if (!name || !email || !password || !organizationId || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email already in use' });
    }
    const hashed = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        organizationId,
        role,
      },
    });
    const token = signJwt({ userId: user.id, orgId: user.organizationId, role: user.role });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, organizationId: user.organizationId } });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = signJwt({ userId: user.id, orgId: user.organizationId, role: user.role });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, organizationId: user.organizationId } });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Register Organization + Admin User
router.post('/register-org', async (req, res) => {
  const { orgName, plan, adminName, adminEmail, adminPassword } = req.body;
  if (!orgName || !plan || !adminName || !adminEmail || !adminPassword) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    // Check if org or user already exists
    const existingOrg = await prisma.organization.findFirst({ where: { name: orgName } });
    if (existingOrg) {
      return res.status(409).json({ error: 'Organization already exists' });
    }
    const existingUser = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already in use' });
    }
    // Create org and admin user in a transaction
    const hashed = await hashPassword(adminPassword);
    const orgAndUser = await prisma.$transaction(async (tx: PrismaClient) => {
      const org = await tx.organization.create({
        data: {
          name: orgName,
          plan,
          status: 'active',
        },
      });
      const user = await tx.user.create({
        data: {
          name: adminName,
          email: adminEmail,
          password: hashed,
          organizationId: org.id,
          role: 'admin',
        },
      });
      return { org, user };
    });
    const token = signJwt({ userId: orgAndUser.user.id, orgId: orgAndUser.org.id, role: 'admin' });
    res.json({
      token,
      user: {
        id: orgAndUser.user.id,
        name: orgAndUser.user.name,
        email: orgAndUser.user.email,
        role: orgAndUser.user.role,
        organizationId: orgAndUser.org.id,
      },
      organization: {
        id: orgAndUser.org.id,
        name: orgAndUser.org.name,
        plan: orgAndUser.org.plan,
        status: orgAndUser.org.status,
      },
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Get current user info
router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, name: true, email: true, role: true, organizationId: true, status: true }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router; 