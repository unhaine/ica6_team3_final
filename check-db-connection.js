require('dotenv').config({ path: '.env' });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Connecting to database...');
        // Attempt a simple query
        const userCount = await prisma.user.count();
        console.log(`Connection successful! Total users: ${userCount}`);
    } catch (e) {
        if (e instanceof Error) {
            console.error('Database connection failed:');
            console.error(e.message); // Print only the message
            if (e.code) console.error(`Error Code: ${e.code}`);
        } else {
            console.error('Database connection failed with unknown error:', e);
        }
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
