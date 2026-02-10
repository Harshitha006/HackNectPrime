import pool from './database';
import fs from 'fs';
import path from 'path';

async function initDb() {
    try {
        const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
        await pool.query(schema);
        console.log('Database schema initialized');
    } catch (error) {
        console.error('Failed to initialize database:', error);
    }
}

if (require.main === module) {
    initDb();
}

export { initDb };
