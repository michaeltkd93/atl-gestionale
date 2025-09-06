import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabaseServer';

export async function GET() {
  const supabase = createClient();
  const { data: subs, error } = await supabase
    .from('subscriptions')
    .select('*, member:members(id,nome,cognome,sede)')
    .order('inizio', { ascending:false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(subs ?? []);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { memberId, piano, frequenza, inizio, fine } = body;

  const supabase = createClient();

  // Inserisci senza vincoli certificato
  const { error } = await supabase.from('subscriptions').insert({
    member_id: memberId,
    piano,
    frequenza,
    inizio,
    fine
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok:true });
}
