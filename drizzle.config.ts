import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config({ path: ".env.local" });

const url = process.env.DATABASE_URL;
if (!url) {
    throw new Error('DATABASE_URL environment variable is not set');
}

export default defineConfig({
    out: './drizzle',
    schema: './src/db/schema.ts',
    dialect: 'postgresql',
    dbCredentials: { url },
    strict: false,
    verbose: true,
});
