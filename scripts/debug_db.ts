
import prisma from '../lib/prisma';

async function main() {
    const tables = await prisma.$queryRaw`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
  `;
    console.log('Tables:', tables);
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
