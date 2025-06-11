import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function logAuditEvent({
  eventType,
  resource,
  resourceId,
  organizationId,
  actorId,
  actorEmail,
  ip,
  details,
}: {
  eventType: string;
  resource: string;
  resourceId?: string;
  organizationId?: string;
  actorId?: string;
  actorEmail?: string;
  ip?: string;
  details?: string;
}) {
  await prisma.auditLog.create({
    data: {
      eventType,
      resource,
      resourceId,
      organizationId,
      actorId,
      actorEmail,
      ip,
      details,
    },
  });
} 