import type { ProjectModel } from '../types/project';

export const sampleProject: ProjectModel = {
  project: { name: 'Anatolia Solar PF', sponsor: 'PF2 Sponsors', currency: 'USD', version: 'PF2Model v1.0.0' },
  timeline: { startDate: '2026-01-01', periods: 96, frequency: 'monthly', constructionPeriods: 12, operationsPeriods: 84 },
  capex: { hardCosts: 120_000_000, softCosts: 12_000_000, contingencyPct: 0.08, spendCurve: [0.04,0.05,0.07,0.08,0.1,0.12,0.12,0.12,0.1,0.08,0.07,0.05] },
  revenue: { capacity: 220_000, volumeUnit: 'MWh', price: 72, priceEscalation: 0.025, availability: 0.985, degradation: 0.004, merchantUpsidePct: 0.06 },
  opex: { fixed: 3_200_000, variablePerUnit: 5.5, escalation: 0.03, majorMaintenance: 1_400_000, majorMaintenanceEvery: 36 },
  tax: { corporateTaxRate: 0.25, vatRate: 0.18, lossCarryForwardYears: 5 },
  depreciation: { method: 'straightLine', usefulLifeYears: 20, residualValuePct: 0.05 },
  workingCapital: { receivableDays: 45, payableDays: 30, inventoryDays: 10 },
  financing: [
    { id: 'senior', name: 'Senior Debt', type: 'debt', enabled: true, sizingPct: 0.65, interestRate: 0.075, upfrontFeePct: 0.018, commitmentFeePct: 0.006, tenorYears: 10, gracePeriods: 12, repaymentType: 'linear', minDscr: 1.25 },
    { id: 'mezz', name: 'Mezzanine Debt', type: 'debt', enabled: true, sizingPct: 0.10, interestRate: 0.115, upfrontFeePct: 0.025, commitmentFeePct: 0.008, tenorYears: 7, gracePeriods: 18, repaymentType: 'annuity', minDscr: 1.1 },
    { id: 'equity', name: 'Sponsor Equity', type: 'equity', enabled: true, sizingPct: 0.25, interestRate: 0, upfrontFeePct: 0, commitmentFeePct: 0, tenorYears: 0, gracePeriods: 0, repaymentType: 'linear' }
  ],
  dsra: { enabled: true, monthsForwardDebtService: 6, funding: 'upfront', releaseAtMaturity: true },
  sensitivities: { price: 1, volume: 1, capex: 1, opex: 1, interest: 1 }
};
