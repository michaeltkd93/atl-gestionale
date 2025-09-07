import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabaseServer';
export async function GET(){
  const supabase = createClient();
  const { data, error } = await supabase.from('sedi').select('id,nome').order('nome');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}
