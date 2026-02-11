const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://refrigerai:refrigerai123@127.0.0.1:5434/refrigerai?schema=public',
});

async function main() {
    console.log('Connecting with pg...');
    try {
        await client.connect();
        console.log('Connected successfully!');
        const res = await client.query('SELECT NOW()');
        console.log('Query result:', res.rows[0]);
        await client.end();
    } catch (err) {
        console.error('Connection error:', err);
        process.exit(1);
    }
}

main();
