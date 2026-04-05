import { ENV } from '../config/env.js';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.js';

if (!ENV.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

// Initialize PostgreSQL connection pool
const pool = new Pool({ connectionString: ENV.DATABASE_URL });

// Log when first connection pool
pool.on('connect', () => {
  console.log('Database connected successfully');
});

// log when an error occurs
pool.on('error', (err) => {
  console.error('Database connection error:', err);
});

export const db = drizzle({ client: pool, schema });
