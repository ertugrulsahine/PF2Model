import type { ProjectModel } from '../types/project';
export function sizeInstruments(p: ProjectModel, totalUses: number): Record<string, number> { const enabled=p.financing.filter(i=>i.enabled); const pct=enabled.reduce((a,i)=>a+i.sizingPct,0)||1; return Object.fromEntries(enabled.map(i=>[i.id,totalUses*i.sizingPct/pct])); }
export function financingFees(p: ProjectModel, sizes: Record<string, number>): number { return p.financing.reduce((a,i)=>a+(sizes[i.id]||0)*(i.upfrontFeePct+i.commitmentFeePct),0); }
