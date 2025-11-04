import { PrismaClient, Role, Condition } from '@prisma/client';
import { hash } from 'bcrypt';
import * as config from '../config/settings.development.json';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding the database');
  const password = await hash('changeme', 10);

  // create all user upserts in parallel to avoid awaiting inside a loop
  const userUpserts = config.defaultAccounts.map((account) => {
    const role = (account.role as Role) || Role.USER;
    console.log(`  Creating user: ${account.email} with role: ${role}`);
    return prisma.user.upsert({
      where: { email: account.email },
      update: {},
      create: {
        email: account.email,
        password,
        role,
      },
    });
  });
  await Promise.all(userUpserts);

  for (const [index, data] of config.defaultData.entries()) {
    const condition = (data.condition as Condition) || Condition.good;
    console.log(`  Adding stuff: ${JSON.stringify(data)}`);
    // eslint-disable-next-line no-await-in-loop
    await prisma.stuff.upsert({
      where: { id: index + 1 },
      update: {
        name: data.name,
        quantity: data.quantity,
        owner: data.owner,
        condition,
      },
      create: {
        name: data.name,
        quantity: data.quantity,
        owner: data.owner,
        condition,
      },
    });
  }
  const contacts = config.defaultContacts ?? [];
  for (const [index, contact] of contacts.entries()) {
    console.log(`  Adding contact: ${contact.firstName} ${contact.lastName}`);
    // eslint-disable-next-line no-await-in-loop
    await (prisma as any).contact.upsert({
      where: { id: index + 1 },
      update: {
        firstName: contact.firstName,
        lastName: contact.lastName,
        address: contact.address,
        image: contact.image,
        description: contact.description,
        owner: contact.owner,
      },
      create: {
        firstName: contact.firstName,
        lastName: contact.lastName,
        address: contact.address,
        image: contact.image,
        description: contact.description,
        owner: contact.owner,
      },
    });
  }
}
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
