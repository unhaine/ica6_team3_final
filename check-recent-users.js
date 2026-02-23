require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        orderBy: { updatedAt: 'desc' },
        take: 5,
        select: {
            id: true,
            name: true,
            email: true,
            updatedAt: true,
            accounts: {
                select: {
                    provider: true
                }
            }
        }
    });

    console.log('--- Recent Users ---');
    users.forEach(u => {
        console.log(`ID: ${u.id}`);
        console.log(`Name: ${u.name}`);
        console.log(`Email: ${u.email}`);
        console.log(`Provider: ${u.accounts.map(a => a.provider).join(', ')}`);
        console.log(`Updated: ${u.updatedAt}`);
        console.log('-------------------');
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
