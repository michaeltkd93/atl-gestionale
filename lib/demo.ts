
type Member = { id: string, nome: string, cognome: string, sede: string };
type Subscription = { memberId: string, memberName: string, piano: string, start: string, end: string };
type Certificate = { memberId: string, memberName: string, emissione: string, scadenza: string, tipo: string };

const key = (k:string)=>`atl_demo_${k}`;

function read<T>(k:string, def:T): T {
  if (typeof window === 'undefined') return def;
  const v = window.localStorage.getItem(key(k));
  return v ? JSON.parse(v) as T : def;
}
function write<T>(k:string, v:T){ if (typeof window !== 'undefined') window.localStorage.setItem(key(k), JSON.stringify(v)); }

export function listMembers(): Member[] { return read<Member[]>('members', []); }
export function addMember(m: Partial<Member>){
  const arr = listMembers();
  const id = Math.random().toString(36).slice(2);
  arr.push({ id, nome: m.nome||'', cognome: m.cognome||'', sede: m.sede||'Rozzano' });
  write('members', arr);
}

export function listSubscriptions(): Subscription[] { return read<Subscription[]>('subs', []); }
export function addSubscription(s: any){
  const members = listMembers();
  const m = members.find(mm => mm.id === s.memberId);
  const arr = listSubscriptions();
  arr.push({ memberId: s.memberId, memberName: m ? `${m.nome} ${m.cognome}` : 'Sconosciuto', piano: s.piano, start: s.start, end: s.end });
  write('subs', arr);
}

export function listCertificates(): Certificate[] { return read<Certificate[]>('certs', []); }
export function addCertificate(c: any){
  const members = listMembers();
  const m = members.find(mm => mm.id === c.memberId);
  const arr = listCertificates();
  arr.push({ memberId: c.memberId, memberName: m ? `${m.nome} ${m.cognome}` : 'Sconosciuto', emissione: c.emissione, scadenza: c.scadenza, tipo: c.tipo });
  write('certs', arr);
}

export function hasValidCertificate(memberId: string, onISO: string){
  const on = new Date(onISO + 'T00:00:00').getTime();
  const certs = listCertificates().filter(c=>c.memberId === memberId);
  if(certs.length === 0) return false;
  const last = certs.sort((a,b)=> (a.scadenza > b.scadenza ? 1 : -1)).slice(-1)[0];
  return new Date(last.scadenza + 'T00:00:00').getTime() >= on;
}

export function getDemoStats(){
  const subs = listSubscriptions();
  const certs = listCertificates();
  const soon = (dateISO:string)=>{
    const d = new Date(dateISO + 'T00:00:00').getTime();
    const now = new Date().getTime();
    const diff = (d - now) / (1000*60*60*24);
    return diff <= 30 && diff >= 0;
  };
  const subsSoon = subs.filter(s=>soon(s.end)).length;
  const certSoon = certs.filter(c=>soon(c.scadenza)).length;
  return { subsSoon, certSoon };
}

export function listExpirations(){
  const subs = listSubscriptions().map(s=>({nome:s.memberName,tipo:'Abbonamento',scadenza:s.end}));
  const certs = listCertificates().map(c=>({nome:c.memberName,tipo:'Certificato',scadenza:c.scadenza}));
  return [...subs, ...certs].slice(-10);
}
