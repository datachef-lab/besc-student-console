import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config({ path: ".env.local" });

const url = `mysql://${process.env.DB_USER!}:${process.env.DB_PASSWORD!}@${process.env.DB_HOST!}:${process.env.DB_PORT!}/${process.env.DB_NAME!}`;

export default defineConfig({
    out: './drizzle',
    schema: './src/db/schema.ts',
    dialect: 'mysql',
    dbCredentials: { url },
    strict: false,
    verbose: true,
});
