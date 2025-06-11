import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, AuthRequest } from '../auth/middleware';

const prisma = new PrismaClient();
const router = Router();

// Get all clients for the organization
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const clients = await prisma.client.findMany({
      where: {
        organizationId: req.user.organizationId,
      },
      include: {
        disputes: true,
      },
    });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

// Get a single client
router.get('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const client = await prisma.client.findUnique({
      where: {
        id: req.params.id,
        organizationId: req.user.organizationId,
      },
      include: {
        disputes: true,
      },
    });

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json(client);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch client' });
  }
});

// Create a new client
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    address,
    creditScore,
    goalScore,
    dateOfBirth,
    ssn,
    notes,
    monthlyFee,
    servicePlan,
  } = req.body;

  try {
    const client = await prisma.client.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        address,
        creditScore,
        goalScore,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        ssn,
        notes,
        monthlyFee,
        servicePlan,
        organizationId: req.user.organizationId,
      },
    });

    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create client' });
  }
});

// Update a client
router.put('/:id', requireAuth, async (req: AuthRequest, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    address,
    status,
    creditScore,
    goalScore,
    progress,
    nextAction,
    totalPaid,
    dateOfBirth,
    ssn,
    notes,
    monthlyFee,
    servicePlan,
  } = req.body;

  try {
    const client = await prisma.client.update({
      where: {
        id: req.params.id,
        organizationId: req.user.organizationId,
      },
      data: {
        firstName,
        lastName,
        email,
        phone,
        address,
        status,
        creditScore,
        goalScore,
        progress,
        nextAction,
        totalPaid,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        ssn,
        notes,
        monthlyFee,
        servicePlan,
      },
    });

    res.json(client);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update client' });
  }
});

// Delete a client
router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    await prisma.client.delete({
      where: {
        id: req.params.id,
        organizationId: req.user.organizationId,
      },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

export default router; 