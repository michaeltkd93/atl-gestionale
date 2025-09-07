'use client';
import { useEffect, useState } from 'react';
type Sub = { piano:'mensile'|'quadrimestre'|'annuale'; frequenza:'x2'|'x3'; member?:{ sedeNome?:string } };
type Price = { sede:string; tipo:'mensile'|'quadrimestre'|'annuale'; frequenza:'x2'|'x3'; valore:number };
type Sede = { id:string; nome:string };
export default function Reports() {
  const [subs,setSubs] = useState<Sub[]>([]);
  const [prices,setPrices] = useState<Price[]>([]);
  const [sedi,setSedi] = useState<Sede[]>([]);
  const [range,setRange] = useState<'mensile'|'quadrimestre'|'annuale'>('mensile');
  const [sedeFiltro,setSedeFiltro] = useState<string>('Tutte');
  useEffect(()=>{ (async()=>{ setSubs(await fetch('/api/subscriptions').then(r=>r.json())); setPrices(await fetch('/api/prices').then(r=>r.json())); setSedi(await fetch('/api/sedi').then(r=>r.json())); })(); },[]);
  const total = subs.reduce((sum, s) => {
    if (s.piano !== range) return sum;
    const sede = s.member?.sedeNome || '';
    if (sedeFiltro !== 'Tutte' && sede !== sedeFiltro) return sum;
    const p = prices.find(pr => pr.sede===sede && pr.tipo===s.piano && pr.frequenza===s.frequenza);
    return sum + (p?.valore || 0);
  }, 0);
  return (<div>
    <div className="card" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
      <div><label>Periodo</label><select value={range} onChange={e=>setRange(e.target.value as any)}><option value="mensile">Mensile</option><option value="quadrimestre">Quadrimestre</option><option value="annuale">Annuale</option></select></div>
      <div><label>Sede</label><select value={sedeFiltro} onChange={e=>setSedeFiltro(e.target.value)}><option>Tutte</option>{sedi.map(s=><option key={s.id}>{s.nome}</option>)}</select></div>
    </div>
    <div className="card"><h3>Totale {range} ({sedeFiltro}): € {total.toFixed(2)}</h3><small>Listini da DB per sede e X2/X3.</small></div>
  </div>);
}
