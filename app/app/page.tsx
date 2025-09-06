'use client';
import { useEffect, useState } from 'react';

type Member = { id:string; nome:string; cognome:string };
type Sub = { member_id:string; fine:string };
type Cert = { member_id:string; scadenza:string };

export default function Page(){
  const [rows,setRows] = useState<any[]>([]);
  const [stats,setStats] = useState<any>({ subs:{attivi:0,in_scadenza:0,scaduti:0}, cert:{validi:0,in_scadenza:0,scaduti:0} });

  useEffect(()=>{
    (async ()=>{
      const members:Member[] = await fetch('/api/members').then(r=>r.json());
      const subs:Sub[] = await fetch('/api/subscriptions').then(r=>r.json());
      const certs:Cert[] = await fetch('/api/certificates').then(r=>r.json());

      const today = new Date().toISOString().slice(0,10);
      const subMap = new Map<string, string>();
      const certMap = new Map<string, string>();

      for (const s of subs){
        const prev = subMap.get(s.member_id);
        if (!prev || s.fine > prev) subMap.set(s.member_id, s.fine);
      }
      for (const c of certs){
        const prev = certMap.get(c.member_id);
        if (!prev || c.scadenza > prev) certMap.set(c.member_id, c.scadenza);
      }

      let subsAgg = { attivi:0, in_scadenza:0, scaduti:0 };
      let certAgg = { validi:0, in_scadenza:0, scaduti:0 };

      const rowData:any[] = [];
      for (const m of members){
        let s = 'scaduto';
        const end = subMap.get(m.id);
        if (end){
          const diff = (new Date(end+'T00:00:00').getTime() - new Date(today+'T00:00:00').getTime())/(1000*60*60*24);
          if (diff < 0) s = 'scaduto';
          else if (diff <= 15) s = 'in_scadenza';
          else s = 'attivo';
        }
        (subsAgg as any)[s] += 1;

        let cstat = 'scaduto';
        const cend = certMap.get(m.id);
        if (cend){
          const diffc = (new Date(cend+'T00:00:00').getTime() - new Date(today+'T00:00:00').getTime())/(1000*60*60*24);
          if (diffc < 0) cstat = 'scaduto';
          else if (diffc <= 30) cstat = 'in_scadenza';
          else cstat = 'valido';
        }
        (certAgg as any)[cstat==='valido'?'validi':cstat] += 1;

        rowData.push({ nome:`${m.nome} ${m.cognome}`, sub:s, cert:cstat });
      }

      setRows(rowData);
      setStats({ subs: subsAgg, cert: certAgg });
    })();
  },[]);

  const chip = (label:string, n:number)=> <span className="badge">{label}: {n}</span>;

  return (<>
    <div className="header">
      <h2>Dashboard</h2>
      <div style={{display:'grid',gap:6}}>
        <div>
          {chip('Abb. attivi', stats.subs.attivi)}{' '}
          {chip('Abb. in scadenza (≤15g)', stats.subs.in_scadenza)}{' '}
          {chip('Abb. scaduti', stats.subs.scaduti)}
        </div>
        <div>
          {chip('Cert. validi', stats.cert.validi)}{' '}
          {chip('Cert. in scadenza (≤30g)', stats.cert.in_scadenza)}{' '}
          {chip('Cert. scaduti', stats.cert.scaduti)}
        </div>
      </div>
    </div>

    <div className="card">
      <table className="table">
        <thead><tr><th>Atleta</th><th>Abbonamento</th><th>Certificato</th></tr></thead>
        <tbody>{rows.map((r,i)=>(<tr key={i}><td>{r.nome}</td><td>{r.sub}</td><td>{r.cert}</td></tr>))}</tbody>
      </table>
    </div>
  </>);
}
