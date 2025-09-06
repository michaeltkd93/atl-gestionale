import { NextResponse } from 'next/server';
import { createClient } from '../../../../lib/supabaseServer';

export async function GET(_: Request, { params }: { params: { id:string }}){
  const supabase = createClient();
  const { data, error } = await supabase.from('members').select('*').eq('id', params.id).maybeSingle();
  if (error || !data) return NextResponse.json({ error: error?.message || 'Not found' }, { status: 404 });

  let sedeNome = null;
  if (data?.sede){
    const { data: s2 } = await supabase.from('sedi').select('nome').eq('id', data.sede).maybeSingle();
    sedeNome = s2?.nome ?? null;
  }
  return NextResponse.json({ ...data, sedeNome });
}

export async function PUT(req: Request, { params }: { params: { id:string }}){
  const b = await req.json();
  const supabase = createClient();

  let sedeId = undefined as any;
  if (b.sede){
    const { data: s } = await supabase.from('sedi').select('id').eq('nome', b.sede).maybeSingle();
    sedeId = s?.id ?? null;
  }

  const patch:any = {
    nome: b.nome, cognome: b.cognome,
    telefono: b.telefono, email: b.email,
    genitore_nome: b.genitoreNome, genitore_telefono: b.genitoreTelefono,
    grado: b.grado, fita_numero: b.fitaNumero,
    wt_gal_numero: b.wtGalNumero, wt_gal_scadenza: b.wtGalScadenza || null
  };
  if (b.sede !== undefined) patch.sede = sedeId;

  const { data, error } = await supabase.from('members').update(patch).eq('id', params.id).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let sedeNome = null;
  if (data?.sede){
    const { data: s2 } = await supabase.from('sedi').select('nome').eq('id', data.sede).maybeSingle();
    sedeNome = s2?.nome ?? null;
  }
  return NextResponse.json({ ...data, sedeNome });
}
