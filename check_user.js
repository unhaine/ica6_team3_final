
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = 'ultrasaram@gmail.com';
  console.log(`Checking user with email: ${email}`);
  
  const user = await prisma.user.findFirst({
    where: { email: email },
    include: { accounts: true }
  });

  if (user) {
    console.log('User found:', JSON.stringify(user, null, 2));
  } else {
    console.log('User NOT found in database.');
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
