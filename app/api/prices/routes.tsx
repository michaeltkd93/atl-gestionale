import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabaseServer';

export async function GET() {
  const supabase = createClient();
  // restituisco nome sede invece dell'id
  const { data: raw, error } = await supabase
    .from('prices')
    .select('valore, tipo, frequenza, sede:sedi(nome)');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const mapped = (raw||[]).map((r:any)=>({
    sede: r.sede?.nome || '',
    tipo: r.tipo,
    frequenza: r.frequenza,
    valore: Number(r.valore)
  }));

  return NextResponse.json(mapped);
}
