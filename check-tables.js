const { Client } = require('pg');
const connectionString = "postgresql://refrigerai:refrigerai123!@localhost:5433/refrigerai";

async function main() {
    const client = new Client({ connectionString });
    await client.connect();
    const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log('TABLES_START');
    console.log(JSON.stringify(res.rows.map(r => r.table_name)));
    console.log('TABLES_END');
    await client.end();
}
main().catch(console.error);
