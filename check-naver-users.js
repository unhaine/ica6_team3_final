const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function run() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL
    });

    try {
        await client.connect();
        const res = await client.query(`
            SELECT u.id, u.name, u.email, u."updatedAt", a.provider 
            FROM "User" u
            JOIN "Account" a ON u.id = a."userId"
            WHERE a.provider = 'naver'
            ORDER BY u."updatedAt" DESC
            LIMIT 5
        `);

        console.log('--- Naver Users in DB ---');
        res.rows.forEach(row => {
            console.log(JSON.stringify(row, null, 2));
        });
    } catch (e) {
        console.error('Connection Error:', e.message);
    } finally {
        await client.end();
    }
}
run();
