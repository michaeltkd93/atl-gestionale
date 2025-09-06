'use client';
import { useEffect, useState } from 'react';
import { listMembers, addMember, hasValidCertificate } from '../../lib/demo';

export default function Page() {
  const [members, setMembers] = useState<any[]>([]);
  const [form, setForm] = useState({nome:'', cognome:'', sede:'Rozzano'});
  const today = new Date().toISOString().slice(0,10);

  useEffect(() => { setMembers(listMembers()); }, []);
  const onSubmit=(e:any)=>{ e.preventDefault(); addMember(form); setMembers(listMembers()); setForm({nome:'',cognome:'',sede:'Rozzano'}); };

  return (
    <>
      <div className="header"><h2>Atleti</h2></div>
      <div className="card">
        <form onSubmit={onSubmit} style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr auto',gap:12}}>
          <input placeholder="Nome" value={form.nome} onChange={e=>setForm({...form, nome:e.target.value})} required/>
          <input placeholder="Cognome" value={form.cognome} onChange={e=>setForm({...form, cognome:e.target.value})} required/>
          <select value={form.sede} onChange={e=>setForm({...form, sede:e.target.value})}><option>Rozzano</option><option>Novara</option></select>
          <button className="primary">Aggiungi</button>
        </form>
      </div>
      <div className="card">
        <table className="table">
          <thead><tr><th>Nome</th><th>Cognome</th><th>Sede</th><th>Stato</th></tr></thead>
          <tbody>{members.map((m,i)=>{
            const ok = hasValidCertificate(m.id, today);
            return (<tr key={i} className={ok?'':'blocked'}>
              <td>{m.nome}</td><td>{m.cognome}</td><td>{m.sede}</td>
              <td>{ok ? 'OK' : 'BLOCCATO (certificato scaduto/mancante)'}</td>
            </tr>);
          })}</tbody>
        </table>
      </div>
    </>
  );
}
