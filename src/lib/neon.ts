import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

// Use dev database if NODE_ENV is development and DATABASE_URL_DEV exists
const databaseUrl = process.env.NODE_ENV === 'development' && process.env.DATABASE_URL_DEV
  ? process.env.DATABASE_URL_DEV
  : process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set');
}

const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle(pool);
