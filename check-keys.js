const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
console.log('PRISMA_KEYS_START');
console.log(JSON.stringify(Object.keys(prisma).filter(k => !k.startsWith('_'))));
console.log('PRISMA_KEYS_END');
process.exit(0);
