'use client';
import { useEffect, useState } from 'react';
import { calcEndDate } from '../../lib/dates';

type Member = { id:string; nome:string; cognome:string; sedeNome?:string };
type Sub = { id:string; member_id:string; piano:'mensile'|'quadrimestre'|'annuale'; frequenza:'x2'|'x3'; inizio:string; fine:string; member?:Member };

export default function Page() {
  const [members,setMembers] = useState<Member[]>([]);
  const [subs,setSubs] = useState<Sub[]>([]);
  const [form,setForm] = useState<{memberId:string; piano:'mensile'|'quadrimestre'|'annuale'; frequenza:'x2'|'x3'; inizio:string;}>({
    memberId:'', piano:'mensile', frequenza:'x2', inizio:''
  });

  useEffect(()=>{ (async()=>{
    setMembers(await fetch('/api/members').then(r=>r.json()));
    setSubs(await fetch('/api/subscriptions').then(r=>r.json()));
  })(); },[]);

  const onSubmit = async (e:any)=>{
    e.preventDefault();
    if(!form.memberId || !form.inizio) return;
    const fine = calcEndDate(form.inizio, form.piano);
    await fetch('/api/subscriptions', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ memberId: form.memberId, piano: form.piano, frequenza: form.frequenza, inizio: form.inizio, fine })
    });
    setSubs(await fetch('/api/subscriptions').then(r=>r.json()));
  };

  return (
    <div>
      <h2>Abbonamenti</h2>
      <div className="card" style={{padding:12, marginBottom:16}}>
        <form onSubmit={onSubmit} style={{display:'grid', gap:8, gridTemplateColumns:'2fr 1fr 1fr 1fr auto'}}>
          <select value={form.memberId} onChange={e=>setForm(f=>({...f, memberId:e.target.value}))}>
            <option value="">Seleziona atleta…</option>
            {members.map(m=><option key={m.id} value={m.id}>{m.nome} {m.cognome} {m.sedeNome?`(${m.sedeNome})`:''}</option>)}
          </select>
          <select value={form.piano} onChange={e=>setForm(f=>({...f, piano:e.target.value as any}))}>
            <option value="mensile">Mensile</option>
            <option value="quadrimestre">Quadrimestre</option>
            <option value="annuale">Annuale</option>
          </select>
          <select value={form.frequenza} onChange={e=>setForm(f=>({...f, frequenza:e.target.value as any}))}>
            <option value="x2">X2 (2 sed./sett.)</option>
            <option value="x3">X3 (3 sed./sett.)</option>
          </select>
          <input type="date" value={form.inizio} onChange={e=>setForm(f=>({...f, inizio:e.target.value}))}/>
          <button type="submit">Crea/Rinnova</button>
        </form>
      </div>

      <table className="table">
        <thead><tr><th>Atleta</th><th>Piano</th><th>Freq</th><th>Inizio</th><th>Fine</th></tr></thead>
        <tbody>
          {subs.map(s=>(<tr key={s.id}>
            <td>{s.member?.nome} {s.member?.cognome}</td>
            <td>{s.piano}</td>
            <td>{s.frequenza.toUpperCase()}</td>
            <td>{s.inizio}</td>
            <td>{s.fine}</td>
          </tr>))}
        </tbody>
      </table>
    </div>
  );
}
