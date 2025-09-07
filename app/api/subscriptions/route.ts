import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabaseServer';
export async function GET(){
  const supabase = createClient();
  const { data: subs, error } = await supabase.from('subscriptions').select('*').order('inizio',{ascending:false});
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const memberIds = Array.from(new Set((subs||[]).map((s:any)=>s.member_id).filter(Boolean)));
  let members:any[] = [];
  if (memberIds.length){
    const { data: m } = await supabase.from('members').select('*').in('id', memberIds);
    members = m || [];
  }
  const sedeIds = Array.from(new Set(members.map((m:any)=>m.sede).filter(Boolean)));
  let sediMap = new Map<string,string>();
  if (sedeIds.length){
    const { data: se } = await supabase.from('sedi').select('id,nome').in('id', sedeIds);
    sediMap = new Map((se||[]).map((s:any)=>[s.id, s.nome]));
  }
  const membersMap = new Map(members.map((m:any)=>[m.id, { id:m.id, nome:m.nome, cognome:m.cognome, sedeNome: (m.sede ? (sediMap.get(m.sede) || null) : null) }]));
  const enriched = (subs||[]).map((s:any)=> ({ ...s, member: membersMap.get(s.member_id) || null }));
  return NextResponse.json(enriched);
}
export async function POST(req: Request){
  const { memberId, piano, frequenza, inizio, fine } = await req.json();
  const supabase = createClient();
  const { error } = await supabase.from('subscriptions').insert({ member_id: memberId, piano, frequenza, inizio, fine });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
