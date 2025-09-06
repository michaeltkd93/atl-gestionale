
'use client';
import { useEffect, useState } from 'react';
import { getDemoStats, listExpirations } from '../lib/demo';

export default function Page(){
  const [stats,setStats]=useState<any>(null);
  const [rows,setRows]=useState<any[]>([]);
  useEffect(()=>{ setStats(getDemoStats()); setRows(listExpirations()); },[]);
  return (<>
    <div className="header">
      <h2>Scadenze imminenti</h2>
      <div>
        <span className="badge">Abbonamenti: {stats?.subsSoon||0}</span>{' '}
        <span className="badge">Certificati: {stats?.certSoon||0}</span>
      </div>
    </div>
    <div className="card">
      <table className="table">
        <thead><tr><th>Nome</th><th>Tipo</th><th>Scadenza</th></tr></thead>
        <tbody>{rows.map((r,i)=>(<tr key={i}><td>{r.nome}</td><td>{r.tipo}</td><td>{r.scadenza}</td></tr>))}</tbody>
      </table>
    </div>
  </>);
}
