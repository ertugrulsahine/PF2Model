import type { Period, TimelineAssumptions } from '../types/project';
const monthsPer = { monthly: 1, quarterly: 3, semiAnnual: 6, annual: 12 } as const;
export const periodsPerYear = (f: TimelineAssumptions['frequency']) => 12 / monthsPer[f];
export function generateTimeline(t: TimelineAssumptions): Period[] {
  const start = new Date(`${t.startDate}T00:00:00Z`); const step = monthsPer[t.frequency];
  return Array.from({ length: t.periods }, (_, i) => { const s = new Date(start); s.setUTCMonth(start.getUTCMonth() + i * step); const e = new Date(s); e.setUTCMonth(s.getUTCMonth() + step); e.setUTCDate(e.getUTCDate() - 1); return { index: i, label: `${s.getUTCFullYear()}-${String(s.getUTCMonth()+1).padStart(2,'0')}`, start: s, end: e, year: s.getUTCFullYear(), isConstruction: i < t.constructionPeriods, isOperations: i >= t.constructionPeriods && i < t.constructionPeriods + t.operationsPeriods, yearFraction: step / 12 }; });
}
