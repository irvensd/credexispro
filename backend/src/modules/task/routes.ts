import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, AuthRequest } from '../auth/middleware';
import { validateRequest } from '../../middleware/validateRequest';
import { z } from 'zod';

const prisma = new PrismaClient();
const router = Router();

// Define Zod schemas for task validation
const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    status: z.string().optional(),
    priority: z.string().optional(),
    type: z.string().optional(),
    dueDate: z.string().optional(),
    assigneeId: z.string().optional(),
    tags: z.array(z.string()).optional(),
    estimatedHours: z.number().optional(),
    actualHours: z.number().optional(),
    attachments: z.array(z.string()).optional(),
  }),
});

const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    status: z.string().optional(),
    priority: z.string().optional(),
    type: z.string().optional(),
    dueDate: z.string().optional(),
    assigneeId: z.string().optional(),
    tags: z.array(z.string()).optional(),
    estimatedHours: z.number().optional(),
    actualHours: z.number().optional(),
    attachments: z.array(z.string()).optional(),
  }),
  params: z.object({
    id: z.string(),
  }),
});

const taskIdSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

// Get all tasks for the organization
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        organizationId: req.user.organizationId,
      },
      include: {
        assignee: true,
        createdBy: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Get a single task
router.get('/:id', requireAuth, validateRequest(taskIdSchema), async (req: AuthRequest, res) => {
  try {
    const task = await prisma.task.findUnique({
      where: {
        id: req.params.id,
        organizationId: req.user.organizationId,
      },
      include: {
        assignee: true,
        createdBy: true,
      },
    });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// Create a new task
router.post('/', requireAuth, validateRequest(createTaskSchema), async (req: AuthRequest, res) => {
  const {
    title,
    description,
    status,
    priority,
    type,
    dueDate,
    assigneeId,
    tags,
    estimatedHours,
    actualHours,
    attachments,
  } = req.body;
  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        type,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        assigneeId,
        createdById: req.user.userId,
        organizationId: req.user.organizationId,
        tags: tags || [],
        estimatedHours,
        actualHours,
        attachments: attachments || [],
      },
      include: {
        assignee: true,
        createdBy: true,
      },
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update a task
router.put('/:id', requireAuth, validateRequest(updateTaskSchema), async (req: AuthRequest, res) => {
  const {
    title,
    description,
    status,
    priority,
    type,
    dueDate,
    assigneeId,
    tags,
    estimatedHours,
    actualHours,
    attachments,
  } = req.body;
  try {
    const task = await prisma.task.update({
      where: {
        id: req.params.id,
        organizationId: req.user.organizationId,
      },
      data: {
        title,
        description,
        status,
        priority,
        type,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        assigneeId,
        tags: tags || [],
        estimatedHours,
        actualHours,
        attachments: attachments || [],
      },
      include: {
        assignee: true,
        createdBy: true,
      },
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete a task
router.delete('/:id', requireAuth, validateRequest(taskIdSchema), async (req: AuthRequest, res) => {
  try {
    await prisma.task.delete({
      where: {
        id: req.params.id,
        organizationId: req.user.organizationId,
      },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Get tasks assigned to the current user
router.get('/assigned/me', requireAuth, async (req: AuthRequest, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        organizationId: req.user.organizationId,
        assigneeId: req.user.userId,
      },
      include: {
        assignee: true,
        createdBy: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assigned tasks' });
  }
});

export default router; 