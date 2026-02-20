
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

async function main() {
    console.log('Connecting directly...');
    try {
        const tables = await prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `;
        console.log('Tables (Direct):', tables);
    } catch (e) {
        console.error('Direct connection failed:', e);
    }
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
