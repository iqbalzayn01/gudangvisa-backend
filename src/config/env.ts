import dotenv from 'dotenv';

dotenv.config({ quiet: true });

export const ENV = {
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET:
    (process.env.JWT_SECRET as string) || 'default-super-secret-key-for-dev',
  NODE_ENV: process.env.NODE_ENV || 'development',
  SUPABASE_URL: process.env.SUPABASE_URL as string,
  SUPABASE_KEY: process.env.SUPABASE_KEY as string,
};

if (!ENV.DATABASE_URL) throw new Error('DATABASE_URL is missing');
if (!ENV.SUPABASE_URL) throw new Error('SUPABASE_URL is missing');
if (!ENV.SUPABASE_KEY) throw new Error('SUPABASE_KEY is missing');
