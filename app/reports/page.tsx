'use client';
import { useEffect, useState } from 'react';

type Sub = {
  id:string; member_id:string;
  piano:'mensile'|'quadrimestre'|'annuale';
  frequenza:'x2'|'x3';
  inizio:string; fine:string;
  member?: { sede?: string };
};

type Price = { sede:string; tipo:'mensile'|'quadrimestre'|'annuale'; frequenza:'x2'|'x3'; valore:number };

export default function Reports() {
  const [subs,setSubs] = useState<Sub[]>([]);
  const [prices,setPrices] = useState<Price[]>([]);
  const [range,setRange] = useState<'mensile'|'quadrimestre'|'annuale'>('mensile');

  useEffect(()=>{ (async()=>{
    const s = await fetch('/api/subscriptions').then(r=>r.json());
    setSubs(s);

    const p = await fetch('/api/prices').then(r=>r.json());
    setPrices(p);
  })(); },[]);

  const total = subs.reduce((sum, s) => {
    if (s.piano !== range) return sum;
    const sede = s.member?.sede || '';
    const price = prices.find(p => p.sede===sede && p.tipo===s.piano && p.frequenza===s.frequenza);
    return sum + (price?.valore || 0);
  }, 0);

  return (
    <div>
      <h2>Report entrate</h2>
      <div className="card" style={{padding:12, marginBottom:16}}>
        <label style={{marginRight:8}}>Periodo:</label>
        <select value={range} onChange={e=>setRange(e.target.value as any)}>
          <option value="mensile">Mensile</option>
          <option value="quadrimestre">Quadrimestre</option>
          <option value="annuale">Annuale</option>
        </select>
      </div>

      <div className="card" style={{padding:16}}>
        <h3>Totale {range}: € {total.toFixed(2)}</h3>
        <small>I prezzi sono presi dalla tabella <code>prices</code> (sede + X2/X3).</small>
      </div>
    </div>
  );
}
