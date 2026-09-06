import { createClient } from '@supabase/supabase-js';
import { env } from './env';

// Privileged client — ONLY for server-side DB/Storage operations
export const supabase = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  }
);

// Separate client for Supabase Auth operations
export const supabaseAuth = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  }
);