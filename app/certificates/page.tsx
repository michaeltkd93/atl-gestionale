
'use client';
import { useEffect, useState } from 'react';
import { listMembers, addCertificate, listCertificates } from '../lib/demo';

export default function Page(){
  const [members, setMembers] = useState<any[]>([]);
  const [certs, setCerts] = useState<any[]>([]);
  const [form, setForm] = useState({memberId:'', emissione:'', scadenza:'', tipo:'non agonistico'});
  useEffect(()=>{ setMembers(listMembers()); setCerts(listCertificates()); }, []);
  const onSubmit=(e:any)=>{ e.preventDefault(); addCertificate(form); setCerts(listCertificates()); };

  return (
    <>
      <div className="header"><h2>Certificati Medici</h2></div>
      <div className="card">
        <form onSubmit={onSubmit} style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr auto',gap:12}}>
          <select value={form.memberId} onChange={e=>setForm({...form, memberId:e.target.value})} required>
            <option value="">Seleziona atleta…</option>
            {members.map((m:any,idx:number)=>(<option key={idx} value={m.id}>{m.nome} {m.cognome}</option>))}
          </select>
          <select value={form.tipo} onChange={e=>setForm({...form, tipo:e.target.value})}>
            <option>non agonistico</option><option>agonistico</option>
          </select>
          <input type="date" value={form.emissione} onChange={e=>setForm({...form, emissione:e.target.value})} required/>
          <input type="date" value={form.scadenza} onChange={e=>setForm({...form, scadenza:e.target.value})} required/>
          <button className="primary">Salva</button>
        </form>
      </div>
      <div className="card">
        <table className="table"><thead><tr><th>Atleta</th><th>Tipo</th><th>Emissione</th><th>Scadenza</th></tr></thead>
          <tbody>{certs.map((c:any,i:number)=>(<tr key={i}><td>{c.memberName}</td><td>{c.tipo}</td><td>{c.emissione}</td><td>{c.scadenza}</td></tr>))}</tbody>
        </table>
      </div>
    </>
  );
}
