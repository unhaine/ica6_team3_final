const { Client } = require('pg');

async function run() {
    const client = new Client({
        connectionString: 'postgresql://postgres:postgres@localhost:5432/refrigerai'
    });
    try {
        await client.connect();
        const res = await client.query('SELECT rcp_sno, ckg_nm, rcp_img_url FROM "Recipe" LIMIT 10');
        console.log('--- Recipes in DB ---');
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (e) {
        console.error('Error:', e.message);
    } finally {
        await client.end();
    }
}
run();
