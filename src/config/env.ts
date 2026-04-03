import dotenv from 'dotenv';

dotenv.config({ quiet: true });

export const ENV = {
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET:
    (process.env.JWT_SECRET as string) || 'default-super-secret-key-for-dev',
  NODE_ENV: process.env.NODE_ENV || 'development',
};

if (!ENV.DATABASE_URL) throw new Error('DATABASE_URL is missing');
