'use client';
import { useEffect, useState } from 'react';

type Member = { id:string; nome:string; cognome:string };
type Cert = { id:string; member_id:string; emissione:string; scadenza:string; memberName?:string };

export default function Page(){
  const [members, setMembers] = useState<Member[]>([]);
  const [certs, setCerts] = useState<Cert[]>([]);
  const [form, setForm] = useState({ memberId:'', emissione:'', scadenza:'' });

  useEffect(()=>{ (async()=>{
    setMembers(await fetch('/api/members').then(r=>r.json()));
    setCerts(await fetch('/api/certificates').then(r=>r.json()));
  })(); },[]);

  const onSubmit=async (e:any)=>{
    e.preventDefault();
    await fetch('/api/certificates', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) });
    setCerts(await fetch('/api/certificates').then(r=>r.json()));
  };

  return (
    <>
      <div className="header"><h2>Certificati Medici</h2></div>
      <div className="card">
        <form onSubmit={onSubmit} style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr auto',gap:12}}>
          <select value={form.memberId} onChange={e=>setForm({...form, memberId:e.target.value})} required>
            <option value="">Seleziona atleta…</option>
            {members.map((m:any)=>(<option key={m.id} value={m.id}>{m.nome} {m.cognome}</option>))}
          </select>
          <input type="date" value={form.emissione} onChange={e=>setForm({...form, emissione:e.target.value})} required/>
          <input type="date" value={form.scadenza} onChange={e=>setForm({...form, scadenza:e.target.value})} required/>
          <button className="primary">Salva</button>
        </form>
      </div>
      <div className="card">
        <table className="table"><thead><tr><th>Atleta</th><th>Emissione</th><th>Scadenza</th></tr></thead>
          <tbody>{certs.map((c:any,i:number)=>(<tr key={i}><td>{c.memberName||''}</td><td>{c.emissione}</td><td>{c.scadenza}</td></tr>))}</tbody>
        </table>
      </div>
    </>
  );
}
