
export function calcEndDate(startISO: string, piano: string): string {
  const start = new Date(startISO + 'T00:00:00');
  if (piano === 'annuale') {
    const year = start.getMonth() >= 7 ? start.getFullYear()+1 : start.getFullYear();
    return `${year}-07-30`;
  }
  const monthsToAdd = piano === 'quadrimestre' ? 4 : 1;
  const d = new Date(start);
  const targetMonth = d.getMonth() + monthsToAdd;
  const target = new Date(d.getFullYear(), targetMonth, d.getDate());
  if (target.getMonth() !== (targetMonth % 12 + 12)%12) {
    const lastDay = new Date(target.getFullYear(), target.getMonth(), 0);
    return lastDay.toISOString().slice(0,10);
  }
  return target.toISOString().slice(0,10);
}
