'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
const GRADES = ['Bianca','Mezza gialla','Gialla','Mezza verde','Verde','Mezza blu','Blu','Mezza rossa','Rossa','Mezza nera','Nera'];
export default function Page(){
  const router = useRouter();
  const [members, setMembers] = useState<any[]>([]);
  const [form, setForm] = useState<any>({ nome:'', cognome:'', sede:'Rozzano', telefono:'', email:'', genitoreNome:'', genitoreTelefono:'', grado:'Bianca', fitaNumero:'', wtGalNumero:'', wtGalScadenza:'' });
  useEffect(()=>{ (async()=> setMembers(await fetch('/api/members').then(r=>r.json()))() },[]);
  const onSubmit=async (e:any)=>{
    e.preventDefault();
    const res = await fetch('/api/members', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) });
    const saved = await res.json();
    setMembers(await fetch('/api/members').then(r=>r.json()));
    if (saved?.id) router.push(`/members/${saved.id}`);
  };
  return (<>
    <div className="card">
      <form onSubmit={onSubmit} style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:10}}>
        <input placeholder="Nome" value={form.nome} onChange={e=>setForm({...form, nome:e.target.value})} required/>
        <input placeholder="Cognome" value={form.cognome} onChange={e=>setForm({...form, cognome:e.target.value})} required/>
        <select value={form.sede} onChange={e=>setForm({...form, sede:e.target.value})}><option>Rozzano</option><option>Novara</option></select>
        <input placeholder="Telefono" value={form.telefono} onChange={e=>setForm({...form, telefono:e.target.value})}/>
        <input placeholder="Email" type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
        <select value={form.grado} onChange={e=>setForm({...form, grado:e.target.value})}>{GRADES.map(g=><option key={g}>{g}</option>)}</select>
        <input placeholder="Genitore (se minore)" value={form.genitoreNome} onChange={e=>setForm({...form, genitoreNome:e.target.value})}/>
        <input placeholder="Tel. genitore" value={form.genitoreTelefono} onChange={e=>setForm({...form, genitoreTelefono:e.target.value})}/>
        <input placeholder="Tesseramento FITA" value={form.fitaNumero} onChange={e=>setForm({...form, fitaNumero:e.target.value})}/>
        <input placeholder="WT GAL n°" value={form.wtGalNumero} onChange={e=>setForm({...form, wtGalNumero:e.target.value})}/>
        <label>Scadenza GAL <input type="date" value={form.wtGalScadenza} onChange={e=>setForm({...form, wtGalScadenza:e.target.value})}/></label>
        <button className="primary" style={{gridColumn:'span 6'}}>Aggiungi atleta</button>
      </form>
    </div>
    <div className="card"><table className="table"><thead><tr><th>Atleta</th><th>Sede</th><th>Grado</th><th>FITA</th><th>WT GAL</th><th>Scadenza GAL</th><th></th></tr></thead>
      <tbody>{members.map((m:any,i:number)=>(<tr key={i}><td>{m.nome} {m.cognome}</td><td>{m.sedeNome||'-'}</td><td>{m.grado||'-'}</td><td>{m.fita_numero||'-'}</td><td>{m.wt_gal_numero||'-'}</td><td>{m.wt_gal_scadenza||'-'}</td><td><Link href={`/members/${m.id}`}>Scheda</Link></td></tr>))}</tbody></table></div>
  </>);
}
