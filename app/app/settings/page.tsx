'use client';
import { useEffect, useState } from 'react';

type Row = { sede:string; tipo:'mensile'|'quadrimestre'|'annuale'; frequenza:'x2'|'x3'; valore:number };

export default function Page(){
  const [rows, setRows] = useState<Row[]>([]);
  const [sedi, setSedi] = useState<string[]>([]);

  useEffect(()=>{ (async()=>{
    const data:Row[] = await fetch('/api/prices').then(r=>r.json());
    setRows(data);
    setSedi(Array.from(new Set(data.map(d=>d.sede))).filter(Boolean));
  })(); },[]);

  const pick=(s:string,t:any,f:any)=> rows.find(r=>r.sede===s && r.tipo===t && r.frequenza===f)?.valore ?? 0;

  return (
    <>
      <div className="header"><h2>Impostazioni – Prezzi</h2></div>
      {sedi.map(sede=>(
        <div key={sede} className="card" style={{marginTop:16}}>
          <h4>{sede}</h4>
          <table className="table" style={{maxWidth:640}}>
            <thead><tr><th>Periodo</th><th>X2</th><th>X3</th></tr></thead>
            <tbody>
              {['mensile','quadrimestre','annuale'].map((t:any)=>(
                <tr key={t}>
                  <td style={{textTransform:'capitalize'}}>{t}</td>
                  <td><input type="number" value={pick(sede,t,'x2')} readOnly/></td>
                  <td><input type="number" value={pick(sede,t,'x3')} readOnly/></td>
                </tr>
              ))}
            </tbody>
          </table>
          <small>Nota: la modifica prezzi via UI verrà abilitata con endpoint PUT dedicato.</small>
        </div>
      ))}
    </>
  );
}
