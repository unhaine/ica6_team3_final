require('dotenv').config({ path: '.env' });
const { PrismaClient } = require('@prisma/client');

async function main() {
    const url = process.env.DATABASE_URL;
    console.log('--- DB Check ---');
    console.log(`URL loaded: ${url ? url.replace(/:([^:@]+)@/, ':****@') : 'undefined'}`); // Mask password

    const prisma = new PrismaClient();

    try {
        console.log('Attempting to count Query...');
        await prisma.$connect();
        console.log('Connected successfully.');
        const count = await prisma.user.count();
        console.log(`User count: ${count}`);
        await prisma.$disconnect();
        process.exit(0);
    } catch (e) {
        console.error('--- CONNECTION FAILED ---');
        console.error(e.message);
        await prisma.$disconnect();
        process.exit(1);
    }
}

main();
