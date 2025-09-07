'use client';
import { useEffect, useState } from 'react';
type Member = { id:string; nome:string; cognome:string };
type Sub = { member_id:string; fine:string };
type Cert = { member_id:string; scadenza:string };
export default function Page(){
  const [rows,setRows] = useState<any[]>([]);
  useEffect(()=>{(async()=>{
    const members:Member[] = await fetch('/api/members').then(r=>r.json());
    const subs:Sub[] = await fetch('/api/subscriptions').then(r=>r.json());
    const certs:Cert[] = await fetch('/api/certificates').then(r=>r.json());
    const today = new Date().toISOString().slice(0,10);
    const subMap = new Map<string,string>(); const certMap = new Map<string,string>();
    for (const s of subs){ const p=subMap.get(s.member_id); if(!p||s.fine>p) subMap.set(s.member_id, s.fine); }
    for (const c of certs){ const p=certMap.get(c.member_id); if(!p||c.scadenza>p) certMap.set(c.member_id, c.scadenza); }
    const rows:any[]=[];
    for (const m of members){
      const end = subMap.get(m.id); const cend = certMap.get(m.id);
      rows.push({ nome:`${m.nome} ${m.cognome}`, sub:end?end:'-', cert:cend?cend:'-' });
    }
    setRows(rows);
  })();},[]);
  return (<div className="card"><h2>Dashboard</h2>
    <table className="table"><thead><tr><th>Atleta</th><th>Abb. fino al</th><th>Cert. fino al</th></tr></thead>
    <tbody>{rows.map((r,i)=>(<tr key={i}><td>{r.nome}</td><td>{r.sub}</td><td>{r.cert}</td></tr>))}</tbody></table></div>);
}
