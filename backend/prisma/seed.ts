import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const permissions = [
  { name: 'viewUsers', description: 'View users' },
  { name: 'editUsers', description: 'Edit users' },
  { name: 'deleteUsers', description: 'Delete users' },
  { name: 'manageOrgs', description: 'Manage organizations' },
  { name: 'viewBilling', description: 'View billing' },
  { name: 'manageInvites', description: 'Manage invites' },
  { name: 'viewAudit', description: 'View audit logs' },
  { name: 'manageRoles', description: 'Manage roles' },
];

async function main() {
  // Seed permissions
  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: perm,
    });
  }

  // For each org, seed roles
  const orgs = await prisma.organization.findMany();
  const allPerms = await prisma.permission.findMany();

  for (const org of orgs) {
    // Admin: all permissions
    const adminRole = await prisma.role.upsert({
      where: { name_organizationId: { name: 'Admin', organizationId: org.id } },
      update: {},
      create: {
        name: 'Admin',
        organizationId: org.id,
        permissions: { connect: allPerms.map(p => ({ id: p.id })) },
      },
    });
    // Member: some permissions
    const memberPerms = allPerms.filter(p => ['viewUsers', 'manageInvites'].includes(p.name));
    await prisma.role.upsert({
      where: { name_organizationId: { name: 'Member', organizationId: org.id } },
      update: {},
      create: {
        name: 'Member',
        organizationId: org.id,
        permissions: { connect: memberPerms.map(p => ({ id: p.id })) },
      },
    });
    // Viewer: view only
    const viewerPerms = allPerms.filter(p => p.name === 'viewUsers');
    await prisma.role.upsert({
      where: { name_organizationId: { name: 'Viewer', organizationId: org.id } },
      update: {},
      create: {
        name: 'Viewer',
        organizationId: org.id,
        permissions: { connect: viewerPerms.map(p => ({ id: p.id })) },
      },
    });
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 