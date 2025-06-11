import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, AuthRequest } from '../auth/middleware';
import { upload, handleFileUploadError, cleanupFile } from './middleware';
import path from 'path';

const prisma = new PrismaClient();
const router = Router();

// Extend AuthRequest to include file property
interface FileAuthRequest extends AuthRequest {
  file?: Express.Multer.File;
}

// Upload a file
router.post('/upload', requireAuth, upload.single('file'), handleFileUploadError, async (req: FileAuthRequest, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  try {
    const file = await prisma.file.create({
      data: {
        name: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        mimeType: req.file.mimetype,
        userId: req.user.userId,
        organizationId: req.user.orgId,
      },
    });

    // Get all users in the organization
    const orgUsers = await prisma.user.findMany({
      where: { organizationId: req.user.orgId },
    });

    // Create notifications for all users except the uploader
    await Promise.all(
      orgUsers
        .filter((user: { id: string }) => user.id !== req.user.userId)
        .map((user: { id: string }) =>
          prisma.notification.create({
            data: {
              userId: user.id,
              organizationId: req.user.orgId,
              type: 'file_upload',
              message: `${req.user.email} uploaded a new file: ${file.name}`,
            },
          })
        )
    );

    res.json({ file });
  } catch (err) {
    // Clean up the uploaded file if database operation fails
    if (req.file) {
      await cleanupFile(req.file.path);
    }
    res.status(500).json({ error: (err as Error).message });
  }
});

// List files for the current user's org
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const files = await prisma.file.findMany({
      where: { organizationId: req.user.orgId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    res.json({ files });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Get file details
router.get('/:id', requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params;
  try {
    const file = await prisma.file.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    if (!file) return res.status(404).json({ error: 'File not found' });
    if (file.organizationId !== req.user.orgId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    res.json({ file });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Download file
router.get('/:id/download', requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params;
  try {
    const file = await prisma.file.findUnique({ where: { id } });
    if (!file) return res.status(404).json({ error: 'File not found' });
    if (file.organizationId !== req.user.orgId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    res.download(file.path, file.name);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Delete a file
router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params;
  try {
    const file = await prisma.file.findUnique({ where: { id } });
    if (!file) return res.status(404).json({ error: 'File not found' });
    if (file.organizationId !== req.user.orgId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    // Delete file from disk
    await cleanupFile(file.path);
    
    // Delete record from DB
    await prisma.file.delete({ where: { id } });
    
    // Notify users about file deletion
    const orgUsers = await prisma.user.findMany({
      where: { organizationId: req.user.orgId },
    });
    
    await Promise.all(
      orgUsers
        .filter((user: { id: string }) => user.id !== req.user.userId)
        .map((user: { id: string }) =>
          prisma.notification.create({
            data: {
              userId: user.id,
              organizationId: req.user.orgId,
              type: 'file_deleted',
              message: `${req.user.email} deleted file: ${file.name}`,
            },
          })
        )
    );
    
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router; 