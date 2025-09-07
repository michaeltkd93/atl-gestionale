import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabaseServer';
export async function GET(){
  const supabase = createClient();
  const { data: certs, error } = await supabase.from('certificates').select('*').order('emissione',{ascending:false});
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const memberIds = Array.from(new Set((certs||[]).map((c:any)=>c.member_id).filter(Boolean)));
  let membersMap = new Map<string, any>();
  if (memberIds.length){
    const { data: m } = await supabase.from('members').select('id,nome,cognome').in('id', memberIds);
    membersMap = new Map((m||[]).map((x:any)=>[x.id, x]));
  }
  const mapped = (certs||[]).map((c:any)=> ({ ...c, memberName: membersMap.get(c.member_id) ? `${membersMap.get(c.member_id).nome} ${membersMap.get(c.member_id).cognome}` : '' }));
  return NextResponse.json(mapped);
}
export async function POST(req: Request){
  const b = await req.json();
  const supabase = createClient();
  const { error } = await supabase.from('certificates').insert({ member_id: b.memberId, emissione: b.emissione, scadenza: b.scadenza });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
