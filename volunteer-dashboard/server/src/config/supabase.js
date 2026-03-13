import { createClient } from '@supabase/supabase-js';

const url = (process.env.SUPABASE_URL || '').trim();
const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '').trim();

if (!url || !key) {
  throw new Error(
    'Supabase is not configured (set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY)'
  );
}

export const supabase = createClient(url, key, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
