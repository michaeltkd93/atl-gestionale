import { createClient as createSupabase } from '@supabase/supabase-js';

export function createClient() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!; // server-only
  return createSupabase(url, key, { auth: { persistSession: false } });
}
