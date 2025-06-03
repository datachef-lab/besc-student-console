import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config({ path: ".env.local" });

const url = process.env.DATABASE_URL!;
console.log("url:", url);

export default defineConfig({
    out: './drizzle',
    schema: './src/db/schema.ts',
    dialect: 'postgresql',
    dbCredentials: { url },
    strict: false,
    verbose: true,
});
