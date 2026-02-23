const { Client } = require('pg');

async function testConn(port, user, password, database) {
    console.log(`Testing Connection to port ${port}, database ${database}, user ${user}...`);
    const client = new Client({
        host: 'localhost',
        port: port,
        user: user,
        password: password,
        database: database,
    });
    try {
        await client.connect();
        console.log(`Success: Connected to ${port}/${database}`);
        const res = await client.query('SELECT count(*) FROM "Recipe"');
        console.log(`Recipe count: ${res.rows[0].count}`);
    } catch (e) {
        console.log(`Error on ${port}/${database}: ${e.message}`);
    } finally {
        await client.end();
    }
}

async function run() {
    await testConn(5432, 'refrigerai', 'refrigerai123!', 'refrigerai');
    await testConn(5434, 'refrigerai', 'refrigerai123!', 'refrigerai');
    await testConn(5432, 'postgres', 'postgres', 'refrigerai');
    await testConn(5434, 'postgres', 'postgres', 'refrigerai');
}
run();
