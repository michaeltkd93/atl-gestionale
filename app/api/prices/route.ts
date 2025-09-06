import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabaseServer';

export async function GET(){
  const supabase = createClient();
  const { data: rows, error } = await supabase.from('prices').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(rows || []);
}
