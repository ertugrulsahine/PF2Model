import type { EngineResult, ProjectModel } from '../types/project';
import { calculateCapex } from './capex';
import { buildDebtSchedule } from './debtSchedule';
import { calculateDsra } from './dsra';
import { financingFees, sizeInstruments } from './financing';
import { balanceSheet, depreciation, taxExpense, workingCapital } from './financialStatements';
import { calculateOpex } from './opex';
import { calculateRatios } from './ratios';
import { calculateRevenue } from './revenue';
import { generateTimeline } from './timeline';
import { validateProject } from './validation';
import { calculateWaterfall } from './waterfall';

export function solveProject(p: ProjectModel): EngineResult {
  const periods=generateTimeline(p.timeline); const capex=calculateCapex(p); const revenue=calculateRevenue(p,periods); const opex=calculateOpex(p,periods); const ebitda=revenue.map((r,i)=>r-opex[i]);
  let totalUses=capex.reduce((a,b)=>a+b,0), sizes:Record<string,number>={}, dsra:number[]=Array(p.timeline.periods).fill(0), debt=buildDebtSchedule(p,{}), converged=false, iterations=0;
  for(iterations=1;iterations<=50;iterations++){ sizes=sizeInstruments(p,totalUses); debt=buildDebtSchedule(p,sizes); dsra=calculateDsra(p,debt.debtService); const fees=financingFees(p,sizes); const idc=debt.interest.slice(0,p.timeline.constructionPeriods).reduce((a,b)=>a+b,0); const upfrontDsra=p.dsra.funding==='upfront'?Math.max(...dsra,0):0; const next=capex.reduce((a,b)=>a+b,0)+fees+idc+upfrontDsra; if(Math.abs(next-totalUses)<1){ totalUses=next; converged=true; break;} totalUses=(totalUses+next)/2; }
  const dep=depreciation(p,capex.reduce((a,b)=>a+b,0)); const tax=taxExpense(p,ebitda,dep,debt.interest); const wc=workingCapital(p,revenue,opex); const distributions=calculateWaterfall(ebitda,tax,wc,debt.debtService,dsra);
  const equityCum:number[]=[]; let eq=Object.entries(sizes).filter(([id])=>p.financing.find(x=>x.id===id)?.type!=='debt').reduce((a,[,b])=>a+b,0); for(let i=0;i<p.timeline.periods;i++) equityCum[i]=eq;
  const bs=balanceSheet(capex,dep,distributions,debt.closingDebt,equityCum); const sources=Object.fromEntries(Object.entries(sizes).map(([k,v])=>[p.financing.find(i=>i.id===k)?.name ?? k,v])); const uses={Capex:capex.reduce((a,b)=>a+b,0), IDC: debt.interest.slice(0,p.timeline.constructionPeriods).reduce((a,b)=>a+b,0), 'Financing fees': financingFees(p,sizes), DSRA: p.dsra.funding==='upfront'?Math.max(...dsra,0):0};
  const result: EngineResult={periods,capex,revenue,opex,ebitda,depreciation:dep,tax,workingCapital:wc,debtService:debt.debtService,dsra,cashAvailable:ebitda.map((e,i)=>e-tax[i]-wc[i]),distributions,totalUses,sources,uses,assets:bs.map(x=>x.assets),liabilitiesEquity:bs.map(x=>x.liabilitiesEquity),warnings:[],ratios:calculateRatios(ebitda,debt.debtService,totalUses,distributions),converged,iterations};
  result.warnings=validateProject(p,result); return result;
}
