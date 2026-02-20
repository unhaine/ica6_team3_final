

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { Pool } from 'pg';

async function main() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error('No DATABASE_URL found');
        return;
    }

    // Mask password for logging
    const masked = connectionString.replace(/:([^:@]+)@/, ':****@');
    console.log('Connecting to:', masked);

    const pool = new Pool({ connectionString });
    const client = await pool.connect();

    try {
        const res = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
    `);
        console.log('Tables (pg):', res.rows.map(r => r.table_name));

        // Check RecipeIngredient specifically
        const ri = await client.query(`SELECT count(*) FROM "RecipeIngredient"`);
        console.log('RecipeIngredient count:', ri.rows[0]);

    } catch (e) {
        console.error('PG Query failed:', e);
    } finally {
        client.release();
        await pool.end();
    }
}

main();
