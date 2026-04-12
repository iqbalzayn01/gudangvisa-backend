import { createClient } from '@supabase/supabase-js';
import { ENV } from './env.js';

/**
 * Supabase client initialized with the service role key.
 * Used server-side for Storage operations (signed URLs, file verification).
 * NEVER expose the service role key to the client.
 */
export const supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_KEY);

/**
 * Supabase Storage bucket name for document uploads.
 */
export const BUCKET_NAME = 'gudangvisa-bucket';
