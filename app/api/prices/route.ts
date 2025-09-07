import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabaseServer';
export async function GET(){
  const supabase = createClient();
  const { data: rows, error } = await supabase.from('prices').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const sedeIds = Array.from(new Set((rows||[]).map((r:any)=>r.sede).filter(Boolean)));
  let sediMap = new Map<string,string>();
  if (sedeIds.length){
    const { data: se } = await supabase.from('sedi').select('id,nome').in('id', sedeIds);
    sediMap = new Map((se||[]).map((s:any)=>[s.id, s.nome]));
  }
  const mapped = (rows||[]).map((r:any)=> ({ sede: r.sede ? (sediMap.get(r.sede) || '') : '', tipo: r.tipo, frequenza: r.frequenza, valore: Number(r.valore) }));
  return NextResponse.json(mapped);
}
