import dotenv from 'dotenv';
import { drizzle } from "drizzle-orm/mysql2";
import { createConnection } from "mysql2/promise"; // For MySQL

dotenv.config({ path: ".env.local" });

const url = `mysql://${process.env.DB_USER!}:${process.env.DB_PASSWORD!}@${process.env.DB_HOST!}:${process.env.DB_PORT!}/${process.env.DB_NAME!}`;

const db = drizzle(url!);

export const mysqlConnection = await createConnection({
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT!, 10),
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
});

export default db;

