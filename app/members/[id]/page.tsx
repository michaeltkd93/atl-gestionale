'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
const GRADES = ['Bianca','Mezza gialla','Gialla','Mezza verde','Verde','Mezza blu','Blu','Mezza rossa','Rossa','Mezza nera','Nera'];
export default function Page(){
  const { id } = useParams() as { id:string };
  const [m, setM] = useState<any>(null);
  useEffect(()=>{ (async()=> setM(await fetch(`/api/members/${id}`).then(r=>r.json()))(); },[id]);
  if(!m || m.error) return <div className="card">Atleta non trovato. <Link href="/members">← Torna</Link></div>;
  const save=async ()=>{
    const patch = { nome:m.nome,cognome:m.cognome,sede:m.sedeNome,telefono:m.telefono,email:m.email,genitoreNome:m.genitore_nome||m.genitoreNome,genitoreTelefono:m.genitore_telefono||m.genitoreTelefono,grado:m.grado,fitaNumero:m.fita_numero||m.fitaNumero,wtGalNumero:m.wt_gal_numero||m.wtGalNumero,wtGalScadenza:m.wt_gal_scadenza||m.wtGalScadenza };
    await fetch(`/api/members/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(patch) });
    alert('Scheda aggiornata');
  };
  return (<>
    <div className="card" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
      <label>Nome <input value={m.nome||''} onChange={e=>setM({...m, nome:e.target.value})}/></label>
      <label>Cognome <input value={m.cognome||''} onChange={e=>setM({...m, cognome:e.target.value})}/></label>
      <label>Sede <select value={m.sedeNome || 'Rozzano'} onChange={e=>setM({...m, sedeNome:e.target.value})}><option>Rozzano</option><option>Novara</option></select></label>
      <label>Telefono <input value={m.telefono||''} onChange={e=>setM({...m, telefono:e.target.value})}/></label>
      <label>Email <input type="email" value={m.email||''} onChange={e=>setM({...m, email:e.target.value})}/></label>
      <label>Grado <select value={m.grado||'Bianca'} onChange={e=>setM({...m, grado:e.target.value})}>{GRADES.map(g=><option key={g}>{g}</option>)}</select></label>
      <label>Genitore <input value={m.genitore_nome||m.genitoreNome||''} onChange={e=>setM({...m, genitore_nome:e.target.value})}/></label>
      <label>Tel. genitore <input value={m.genitore_telefono||m.genitoreTelefono||''} onChange={e=>setM({...m, genitore_telefono:e.target.value})}/></label>
      <label>Tesseramento FITA <input value={m.fita_numero||m.fitaNumero||''} onChange={e=>setM({...m, fita_numero:e.target.value})}/></label>
      <label>WT GAL n° <input value={m.wt_gal_numero||m.wtGalNumero||''} onChange={e=>setM({...m, wt_gal_numero:e.target.value})}/></label>
      <label>Scadenza GAL <input type="date" value={(m.wt_gal_scadenza||'').slice(0,10)} onChange={e=>setM({...m, wt_gal_scadenza:e.target.value})}/></label>
    </div>
    <div className="card" style={{display:'flex',justifyContent:'flex-end'}}><button className="primary" onClick={save}>Salva</button></div>
  </>);
}
