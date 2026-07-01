export type Frequency = 'monthly' | 'quarterly' | 'semiAnnual' | 'annual';
export type RepaymentType = 'annuity' | 'linear' | 'sculpted';
export type InstrumentType = 'debt' | 'equity' | 'grant';

export interface ProjectInfo { name: string; sponsor: string; currency: string; version: string; }
export interface TimelineAssumptions { startDate: string; periods: number; frequency: Frequency; constructionPeriods: number; operationsPeriods: number; }
export interface CapexAssumptions { hardCosts: number; softCosts: number; contingencyPct: number; spendCurve: number[]; }
export interface RevenueAssumptions { capacity: number; volumeUnit: string; price: number; priceEscalation: number; availability: number; degradation: number; merchantUpsidePct: number; }
export interface OpexAssumptions { fixed: number; variablePerUnit: number; escalation: number; majorMaintenance: number; majorMaintenanceEvery: number; }
export interface TaxAssumptions { corporateTaxRate: number; vatRate: number; lossCarryForwardYears: number; }
export interface DepreciationAssumptions { method: 'straightLine'; usefulLifeYears: number; residualValuePct: number; }
export interface WorkingCapitalAssumptions { receivableDays: number; payableDays: number; inventoryDays: number; }
export interface FinancingInstrument { id: string; name: string; type: InstrumentType; enabled: boolean; sizingPct: number; interestRate: number; upfrontFeePct: number; commitmentFeePct: number; tenorYears: number; gracePeriods: number; repaymentType: RepaymentType; minDscr?: number; }
export interface DsraAssumptions { enabled: boolean; monthsForwardDebtService: number; funding: 'upfront' | 'cashflow'; releaseAtMaturity: boolean; }
export interface Sensitivities { price: number; volume: number; capex: number; opex: number; interest: number; }
export interface ProjectModel { project: ProjectInfo; timeline: TimelineAssumptions; capex: CapexAssumptions; revenue: RevenueAssumptions; opex: OpexAssumptions; tax: TaxAssumptions; depreciation: DepreciationAssumptions; workingCapital: WorkingCapitalAssumptions; financing: FinancingInstrument[]; dsra: DsraAssumptions; sensitivities: Sensitivities; }

export interface Period { index: number; label: string; start: Date; end: Date; year: number; isConstruction: boolean; isOperations: boolean; yearFraction: number; }
export interface EngineResult { periods: Period[]; capex: number[]; revenue: number[]; opex: number[]; ebitda: number[]; depreciation: number[]; tax: number[]; workingCapital: number[]; debtService: number[]; dsra: number[]; cashAvailable: number[]; distributions: number[]; totalUses: number; sources: Record<string, number>; uses: Record<string, number>; assets: number[]; liabilitiesEquity: number[]; warnings: string[]; ratios: Record<string, number>; converged: boolean; iterations: number; }
