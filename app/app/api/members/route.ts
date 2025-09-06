import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabaseServer';

export async function GET(){
  const supabase = createClient();
  const { data: sedi } = await supabase.from('sedi').select('id,nome');
  const mapSedi = new Map((sedi||[]).map((s:any)=>[s.id, s.nome]));
  const { data, error } = await supabase.from('members').select('*').order('created_at',{ascending:true});
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const mapped = (data||[]).map((m:any)=>({ ...m, sedeNome: m.sede ? (mapSedi.get(m.sede) || null) : null }));
  return NextResponse.json(mapped);
}

export async function POST(req: Request){
  const b = await req.json();
  const supabase = createClient();

  let sedeId = null;
  if (b.sede){
    const { data: s } = await supabase.from('sedi').select('id').eq('nome', b.sede).maybeSingle();
    sedeId = s?.id ?? null;
  }

  const { data, error } = await supabase.from('members').insert({
    nome: b.nome, cognome: b.cognome, sede: sedeId,
    telefono: b.telefono, email: b.email,
    genitore_nome: b.genitoreNome, genitore_telefono: b.genitoreTelefono,
    grado: b.grado || 'Bianca',
    fita_numero: b.fitaNumero, wt_gal_numero: b.wtGalNumero, wt_gal_scadenza: b.wtGalScadenza || null
  }).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let sedeNome = null;
  if (data?.sede){
    const { data: s2 } = await supabase.from('sedi').select('nome').eq('id', data.sede).maybeSingle();
    sedeNome = s2?.nome ?? null;
  }
  return NextResponse.json({ ...data, sedeNome });
}
