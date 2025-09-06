'use client';
import { useEffect, useState } from 'react';

type Sub = { piano:'mensile'|'quadrimestre'|'annuale'; frequenza:'x2'|'x3'; member?:{ sedeNome?:string } };
type Price = { sede:string; tipo:'mensile'|'quadrimestre'|'annuale'; frequenza:'x2'|'x3'; valore:number };

export default function Reports() {
  const [subs,setSubs] = useState<Sub[]>([]);
  const [prices,setPrices] = useState<Price[]>([]);
  const [range,setRange] = useState<'mensile'|'quadrimestre'|'annuale'>('mensile');

  useEffect(()=>{ (async()=>{
    setSubs(await fetch('/api/subscriptions').then(r=>r.json()));
    setPrices(await fetch('/api/prices').then(r=>r.json()));
  })(); },[]);

  const total = subs.reduce((sum, s) => {
    if (s.piano !== range) return sum;
    const sede = s.member?.sedeNome || '';
    const p = prices.find(pr => pr.sede===sede && pr.tipo===s.piano && pr.frequenza===s.frequenza);
    return sum + (p?.valore || 0);
  }, 0);

  return (
    <div>
      <h2>Report entrate</h2>
      <div className="card" style={{padding:12, marginBottom:16}}>
        <label>Periodo: </label>
        <select value={range} onChange={e=>setRange(e.target.value as any)} style={{marginLeft:8}}>
          <option value="mensile">Mensile</option>
          <option value="quadrimestre">Quadrimestre</option>
          <option value="annuale">Annuale</option>
        </select>
      </div>
      <div className="card" style={{padding:16}}>
        <h3>Totale {range}: € {total.toFixed(2)}</h3>
        <small>Basato sui listini per sede (X2/X3) letti dal DB.</small>
      </div>
    </div>
  );
}
