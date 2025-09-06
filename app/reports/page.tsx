'use client';
import { useEffect, useState } from 'react';
import { listSubscriptions } from '../../lib/demo';

export default function Page(){
  const [subs, setSubs] = useState<any[]>([]);
  useEffect(()=>{ setSubs(listSubscriptions()); },[]);
  const csv = ()=>{
    const header='Atleta,Piano,Inizio,Fine\n';
    const lines=subs.map(s=>`${s.memberName},${s.piano},${s.start},${s.end}`).join('\n');
    const blob=new Blob([header+lines],{type:'text/csv'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a'); a.href=url; a.download='report-abbonamenti.csv'; a.click();
  };
  return (
    <>
      <div className="header"><h2>Report</h2><button className="primary" onClick={csv}>Esporta CSV</button></div>
      <div className="card"><p>Report demo. La versione con DB includerà filtri avanzati e PDF.</p></div>
    </>
  );
}
