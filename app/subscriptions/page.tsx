
'use client';
import { useEffect, useState } from 'react';
import { listMembers, addSubscription, listSubscriptions, hasValidCertificate } from '../lib/demo';
import { calcEndDate } from '../lib/dates';

export default function Page() {
  const [members, setMembers] = useState<any[]>([]);
  const [subs, setSubs] = useState<any[]>([]);
  const [form, setForm] = useState({memberId:'', piano:'mensile', start:''});
  const [error, setError] = useState('');

  useEffect(()=>{ setMembers(listMembers()); setSubs(listSubscriptions()); }, []);

  const onSubmit=(e:any)=>{
    e.preventDefault();
    if(!hasValidCertificate(form.memberId, form.start)){
      setError('Certificato scaduto o mancante: impossibile creare/rinnovare abbonamento.');
      return;
    }
    const end = calcEndDate(form.start, form.piano);
    addSubscription({...form, end});
    setSubs(listSubscriptions());
    setError('');
  };

  return (
    <>
      <div className="header"><h2>Abbonamenti</h2></div>
      <div className="card">
        <form onSubmit={onSubmit} style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr auto',gap:12}}>
          <select value={form.memberId} onChange={e=>setForm({...form, memberId:e.target.value})} required>
            <option value="">Seleziona atleta…</option>
            {members.map((m:any,idx:number)=>(<option key={idx} value={m.id}>{m.nome} {m.cognome}</option>))}
          </select>
          <select value={form.piano} onChange={e=>setForm({...form, piano:e.target.value})}>
            <option value="mensile">Mensile</option>
            <option value="quadrimestre">Quadrimestre</option>
            <option value="annuale">Annuale (fino al 30/07)</option>
          </select>
          <input type="date" value={form.start} onChange={e=>setForm({...form, start:e.target.value})} required/>
          <button className="primary">Crea/Rinnova</button>
        </form>
        {error && <p className="error" role="alert">{error}</p>}
      </div>
      <div className="card">
        <table className="table"><thead><tr><th>Atleta</th><th>Piano</th><th>Inizio</th><th>Fine</th></tr></thead>
          <tbody>{subs.map((s:any,i:number)=>(<tr key={i}><td>{s.memberName}</td><td>{s.piano}</td><td>{s.start}</td><td>{s.end}</td></tr>))}</tbody>
        </table>
      </div>
    </>
  );
}
