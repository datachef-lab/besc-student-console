import dotenv from 'dotenv';
import { drizzle } from "drizzle-orm/mysql2";
import { createConnection, Connection } from "mysql2/promise"; // Use promise-based MySQL

dotenv.config({ path: ".env.local" });

const url = `mysql://${process.env.DB_USER!}:${process.env.DB_PASSWORD!}@${process.env.DB_HOST!}:${process.env.DB_PORT!}/${process.env.DB_NAME!}`;
const db = drizzle(url!);

let mysqlConnection: Connection | null = null; // Store connection globally

async function connectWithRetry(): Promise<Connection> {
    if (mysqlConnection) {
        return mysqlConnection; // Reuse existing connection
    }

    const maxRetries = 5;
    let attempt = 0;

    while (attempt < maxRetries) {
        try {
            console.log(`Attempting to connect to MySQL (Try ${attempt + 1}/${maxRetries})`);
            mysqlConnection = await createConnection({
                host: process.env.DB_HOST!,
                port: parseInt(process.env.DB_PORT!, 10),
                user: process.env.DB_USER!,
                password: process.env.DB_PASSWORD!,
                database: process.env.DB_NAME!,
                connectTimeout: 10000,
            });
            console.log("Connected to MySQL successfully.");
            return mysqlConnection;
        } catch (error) {
            console.error(`MySQL connection failed: ${(error as Error).message}`);
            attempt++;
            await new Promise((resolve) => setTimeout(resolve, 2000 * attempt)); // Exponential backoff
        }
    }
    throw new Error("Failed to connect to MySQL after multiple attempts.");
}

// Initialize the persistent connection safely
const initializeConnection = async () => {
    mysqlConnection = await connectWithRetry();
};

initializeConnection().catch((error) => {
    console.error("Failed to initialize MySQL connection:", error);
});

// Exporting the connection for use in other parts of the application
export { mysqlConnection };
export default db;
