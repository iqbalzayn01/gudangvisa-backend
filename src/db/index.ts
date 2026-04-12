import { ENV } from '../config/env.js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';

if (!ENV.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

// Initialize postgres.js client
// Disable prefetch as it is not supported for Supabase "Transaction" pool mode
const client = postgres(ENV.DATABASE_URL, { prepare: false });

export const db = drizzle({ client, schema });
