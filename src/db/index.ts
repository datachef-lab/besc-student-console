import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/mysql2';
import { createPool, type Pool, type PoolConnection, type RowDataPacket } from 'mysql2/promise';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Connection configuration
const dbConfig = {
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT!, 10),
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    waitForConnections: true,
    connectionLimit: 15,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
};

// Create a global pool that can be reused
let pool: Pool;
let db: ReturnType<typeof drizzle>;

// Initialize pool right away
try {
    pool = createPool(dbConfig);
    db = drizzle(pool);
    console.log('Database pool created');
} catch (error) {
    console.error('Failed to create database pool:', error);
    throw error;
}

// Simple query function that properly returns results
export async function query<T extends RowDataPacket[]>(
    sql: string,
    values?: unknown[]
): Promise<T> {
    let connection: PoolConnection | null = null;

    try {
        // Get connection from the pool
        connection = await pool.getConnection();

        // Execute the query
        const [results] = await connection.query<T>(sql, values);

        // Return just the results (not the fields info)
        return results;
    } catch (error) {
        console.error('Query execution error:', error);
        throw error;
    } finally {
        // Always release the connection back to the pool
        if (connection) connection.release();
    }
}

// Graceful shutdown handler
async function shutdownHandler() {
    if (pool) {
        console.log('🛑 Closing database pool...');
        await pool.end();
        console.log('✅ Database pool closed');
    }
}

// Register shutdown handlers
process.on('SIGINT', shutdownHandler);
process.on('SIGTERM', shutdownHandler);
process.on('beforeExit', shutdownHandler);

export { pool, db };
export default db;