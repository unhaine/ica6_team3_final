const { Client } = require('pg');

async function run() {
    const config = {
        host: 'localhost',
        port: 5434,
        user: 'refrigerai',
        password: 'refrigerai123!',
        database: 'postgres'
    };

    const client = new Client(config);
    try {
        await client.connect();
        const resDB = await client.query('SELECT datname FROM pg_database');
        console.log('Databases on 5434:', resDB.rows.map(r => r.datname));

        if (resDB.rows.some(r => r.datname === 'refrigerai')) {
            const clientDB = new Client({ ...config, database: 'refrigerai' });
            await clientDB.connect();
            const resTables = await clientDB.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
            console.log('Tables in refrigerai:', resTables.rows.map(r => r.table_name));
            await clientDB.end();
        }
    } catch (e) {
        console.error('Audit Error:', e.message);
    } finally {
        await client.end();
    }
}
run();
