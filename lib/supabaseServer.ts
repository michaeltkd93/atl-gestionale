import { createClient as createSupabase } from '@supabase/supabase-js';
export function createClient() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !key) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  return createSupabase(url, key, { auth: { persistSession: false } });
}
