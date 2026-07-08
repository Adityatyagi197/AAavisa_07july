const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with 6 roles...');
  
  const salt = await bcrypt.genSalt(10);
  const defaultPassword = await bcrypt.hash('password123', salt);

  const usersToCreate = [
    {
      fullName: 'John SuperAdmin',
      email: 'superadmin@aaaconsultancy.com',
      password: defaultPassword,
      role: 'super_admin'
    },
    {
      fullName: 'Sarah Admin',
      email: 'admin@aaaconsultancy.com',
      password: defaultPassword,
      role: 'admin'
    },
    {
      fullName: 'David Consultant',
      email: 'agent@aaaconsultancy.com',
      password: defaultPassword,
      role: 'consultant'
    },
    {
      fullName: 'Emily Finance',
      email: 'finance@aaaconsultancy.com',
      password: defaultPassword,
      role: 'finance'
    },
    {
      fullName: 'Mark Operations',
      email: 'operations@aaaconsultancy.com',
      password: defaultPassword,
      role: 'operations'
    },
    {
      fullName: 'Jessica Marketing',
      email: 'marketing@aaaconsultancy.com',
      password: defaultPassword,
      role: 'marketing'
    }
  ];

  for (const user of usersToCreate) {
    const exists = await prisma.user.findUnique({ where: { email: user.email } });
    if (!exists) {
      await prisma.user.create({ data: user });
      console.log(`Created user: ${user.email} with role: ${user.role}`);
    } else {
      await prisma.user.update({
        where: { email: user.email },
        data: { password: user.password, role: user.role }
      });
      console.log(`Updated user password & role for: ${user.email}`);
    }
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
