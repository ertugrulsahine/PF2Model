import type { ProjectModel } from '../types/project';
import { periodsPerYear } from './timeline';
export function calculateDsra(p: ProjectModel, debtService: number[]): number[] { if(!p.dsra.enabled) return debtService.map(()=>0); const forward=Math.ceil(p.dsra.monthsForwardDebtService/(12/periodsPerYear(p.timeline.frequency))); return debtService.map((_,i)=>debtService.slice(i+1,i+1+forward).reduce((a,b)=>a+b,0)); }
