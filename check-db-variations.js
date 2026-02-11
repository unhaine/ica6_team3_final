const { PrismaClient } = require('@prisma/client');

const configs = [
    { name: 'Raw Password, IP', url: 'postgresql://refrigerai:refrigerai123!@127.0.0.1:5432/refrigerai?schema=public' },
    { name: 'Encoded Password, IP', url: 'postgresql://refrigerai:refrigerai123%21@127.0.0.1:5432/refrigerai?schema=public' },
    { name: 'Raw Password, Localhost', url: 'postgresql://refrigerai:refrigerai123!@localhost:5432/refrigerai?schema=public' },
    { name: 'Encoded Password, Localhost', url: 'postgresql://refrigerai:refrigerai123%21@localhost:5432/refrigerai?schema=public' },
];

async function testConnection(config) {
    console.log(`Testing: ${config.name}`);
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: config.url,
            },
        },
    });

    try {
        const userCount = await prisma.user.count();
        console.log(`SUCCESS: ${config.name} (Count: ${userCount})`);
        return true;
    } catch (e) {
        console.log(`FAILED: ${config.name}`);
        console.log(`Error: ${e.message}`);
        return false;
    } finally {
        await prisma.$disconnect();
    }
}

async function main() {
    for (const config of configs) {
        const success = await testConnection(config);
        if (success) {
            console.log(`\nFound working configuration: ${config.name}`);
            console.log(`URL: ${config.url}`);
            break;
        }
    }
}

main();
