import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let isDemoMode = false;

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'hacknect',
    password: process.env.DB_PASSWORD || 'postgres',
    port: Number(process.env.DB_PORT) || 5432,
});

// Test connection and set demo mode if it fails
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});

export const checkConnection = async () => {
    try {
        const client = await pool.connect();
        client.release();
        return true;
    } catch (err) {
        console.error('Database connection failed. Switching to DEMO MODE (In-memory).');
        isDemoMode = true;
        return false;
    }
};

export const getIsDemoMode = () => isDemoMode;

export const query = (text: string, params?: any[]) => {
    if (isDemoMode) {
        console.warn('Query skipped (Demo Mode):', text);
        return { rows: [] };
    }
    return pool.query(text, params);
};

export default pool;