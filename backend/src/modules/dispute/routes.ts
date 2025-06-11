import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, AuthRequest } from '../auth/middleware';

const prisma = new PrismaClient();
const router = Router();

// Get all disputes for the organization
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const disputes = await prisma.dispute.findMany({
      where: {
        organizationId: req.user.organizationId,
      },
      include: {
        client: true,
      },
    });
    res.json(disputes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch disputes' });
  }
});

// Get a single dispute
router.get('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const dispute = await prisma.dispute.findUnique({
      where: {
        id: req.params.id,
        organizationId: req.user.organizationId,
      },
      include: {
        client: true,
      },
    });

    if (!dispute) {
      return res.status(404).json({ error: 'Dispute not found' });
    }

    res.json(dispute);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dispute' });
  }
});

// Create a new dispute
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  const {
    clientId,
    type,
    creditor,
    bureau,
    priority,
    notes,
    disputeReason,
    nextAction,
  } = req.body;

  try {
    // Verify client belongs to organization
    const client = await prisma.client.findFirst({
      where: {
        id: clientId,
        organizationId: req.user.organizationId,
      },
    });

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const dispute = await prisma.dispute.create({
      data: {
        clientId,
        type,
        creditor,
        bureau,
        priority,
        notes,
        disputeReason,
        nextAction,
        organizationId: req.user.organizationId,
      },
      include: {
        client: true,
      },
    });

    res.status(201).json(dispute);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create dispute' });
  }
});

// Update a dispute
router.put('/:id', requireAuth, async (req: AuthRequest, res) => {
  const {
    type,
    creditor,
    bureau,
    status,
    priority,
    notes,
    creditImpact,
    disputeReason,
    nextAction,
  } = req.body;

  try {
    const dispute = await prisma.dispute.update({
      where: {
        id: req.params.id,
        organizationId: req.user.organizationId,
      },
      data: {
        type,
        creditor,
        bureau,
        status,
        priority,
        notes,
        creditImpact,
        disputeReason,
        nextAction,
        lastUpdated: new Date(),
        submitted: status === 'Submitted' ? new Date() : undefined,
      },
      include: {
        client: true,
      },
    });

    res.json(dispute);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update dispute' });
  }
});

// Delete a dispute
router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    await prisma.dispute.delete({
      where: {
        id: req.params.id,
        organizationId: req.user.organizationId,
      },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete dispute' });
  }
});

// Get disputes for a specific client
router.get('/client/:clientId', requireAuth, async (req: AuthRequest, res) => {
  try {
    const disputes = await prisma.dispute.findMany({
      where: {
        clientId: req.params.clientId,
        organizationId: req.user.organizationId,
      },
      include: {
        client: true,
      },
    });
    res.json(disputes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch client disputes' });
  }
});

export default router; 