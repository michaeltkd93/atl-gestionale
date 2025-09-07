export function addMonthsKeepDay(dateISO: string, months: number): string {
  const [y,m,d] = dateISO.split('-').map(n=>parseInt(n,10));
  const base = new Date(Date.UTC(y, m-1, d));
  const targetMonth = base.getUTCMonth() + months;
  const target = new Date(Date.UTC(base.getUTCFullYear(), targetMonth, 1));
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth()+1, 0)).getUTCDate();
  const day = Math.min(d, lastDay);
  const out = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth(), day));
  return out.toISOString().slice(0,10);
}
export function calcEndDate(startISO: string, piano: 'mensile'|'quadrimestre'|'annuale'): string {
  if (!startISO) return '';
  if (piano === 'mensile') return addMonthsKeepDay(startISO, 1);
  if (piano === 'quadrimestre') return addMonthsKeepDay(startISO, 4);
  const start = new Date(startISO + 'T00:00:00Z');
  const target = new Date(Date.UTC(start.getUTCFullYear(), 6, 30));
  if (start.getTime() > target.getTime()) target.setUTCFullYear(target.getUTCFullYear() + 1);
  return target.toISOString().slice(0,10);
}
