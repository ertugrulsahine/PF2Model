import type { CapexAssumptions, DepreciationAssumptions, DsraAssumptions, FinancingInstrument, OpexAssumptions, ProjectInfo, ProjectModel, RevenueAssumptions, Sensitivities, TaxAssumptions, TimelineAssumptions, WorkingCapitalAssumptions } from '../types/project';

type Props = {
  model: ProjectModel;
  setModel: (p: ProjectModel) => void;
  t: (k: string) => string;
};

type SectionKey = Exclude<keyof ProjectModel, 'financing'>;
type Scalar = string | number | boolean;

function toNumber(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function Field({ label, value, onChange, type = 'number' }: { label: string; value: Scalar; onChange: (value: string) => void; type?: 'text' | 'number' }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type={type} value={String(value)} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

export function InputPanel({ model, setModel, t }: Props) {
  const patchSection = <K extends SectionKey>(key: K, value: ProjectModel[K]) => setModel({ ...model, [key]: value });
  const patchFinancing = (index: number, patch: Partial<FinancingInstrument>) => {
    setModel({ ...model, financing: model.financing.map((instrument, i) => (i === index ? { ...instrument, ...patch } : instrument)) });
  };

  const project = model.project;
  const timeline = model.timeline;
  const capex = model.capex;
  const revenue = model.revenue;
  const opex = model.opex;
  const tax = model.tax;
  const depreciation = model.depreciation;
  const workingCapital = model.workingCapital;
  const dsra = model.dsra;
  const sensitivities = model.sensitivities;

  return (
    <div className="page-stack">
      <section className="panel hero-panel">
        <p className="eyebrow">{t('inputs')}</p>
        <h2>{t('inputsTitle')}</h2>
        <p>{t('inputsHelp')}</p>
      </section>

      <section className="panel form-section">
        <h3>{t('project')}</h3>
        <div className="form-grid">
          <Field label={t('projectName')} type="text" value={project.name} onChange={(name) => patchSection('project', { ...project, name } as ProjectInfo)} />
          <Field label={t('sponsor')} type="text" value={project.sponsor} onChange={(sponsor) => patchSection('project', { ...project, sponsor } as ProjectInfo)} />
          <Field label={t('currency')} type="text" value={project.currency} onChange={(currency) => patchSection('project', { ...project, currency } as ProjectInfo)} />
          <Field label={t('version')} type="text" value={project.version} onChange={(version) => patchSection('project', { ...project, version } as ProjectInfo)} />
        </div>
      </section>

      <section className="panel form-section">
        <h3>{t('timeline')}</h3>
        <div className="form-grid">
          <Field label={t('startDate')} type="text" value={timeline.startDate} onChange={(startDate) => patchSection('timeline', { ...timeline, startDate } as TimelineAssumptions)} />
          <label className="field"><span>{t('frequency')}</span><select value={timeline.frequency} onChange={(event) => patchSection('timeline', { ...timeline, frequency: event.target.value as TimelineAssumptions['frequency'] })}><option value="monthly">Monthly</option><option value="quarterly">Quarterly</option><option value="semiAnnual">Semi-annual</option><option value="annual">Annual</option></select></label>
          <Field label={t('periods')} value={timeline.periods} onChange={(periods) => patchSection('timeline', { ...timeline, periods: toNumber(periods) })} />
          <Field label={t('constructionPeriods')} value={timeline.constructionPeriods} onChange={(constructionPeriods) => patchSection('timeline', { ...timeline, constructionPeriods: toNumber(constructionPeriods) })} />
          <Field label={t('operationsPeriods')} value={timeline.operationsPeriods} onChange={(operationsPeriods) => patchSection('timeline', { ...timeline, operationsPeriods: toNumber(operationsPeriods) })} />
        </div>
      </section>

      <section className="panel form-section">
        <h3>{t('capex')}</h3>
        <div className="form-grid">
          <Field label={t('hardCosts')} value={capex.hardCosts} onChange={(hardCosts) => patchSection('capex', { ...capex, hardCosts: toNumber(hardCosts) } as CapexAssumptions)} />
          <Field label={t('softCosts')} value={capex.softCosts} onChange={(softCosts) => patchSection('capex', { ...capex, softCosts: toNumber(softCosts) } as CapexAssumptions)} />
          <Field label={t('contingencyPct')} value={capex.contingencyPct} onChange={(contingencyPct) => patchSection('capex', { ...capex, contingencyPct: toNumber(contingencyPct) } as CapexAssumptions)} />
          <label className="field wide"><span>{t('spendCurve')}</span><input value={capex.spendCurve.join(', ')} onChange={(event) => patchSection('capex', { ...capex, spendCurve: event.target.value.split(',').map((v) => toNumber(v.trim())) } as CapexAssumptions)} /></label>
        </div>
      </section>

      <section className="panel form-section">
        <h3>{t('revenue')}</h3>
        <div className="form-grid">
          <Field label={t('capacity')} value={revenue.capacity} onChange={(capacity) => patchSection('revenue', { ...revenue, capacity: toNumber(capacity) } as RevenueAssumptions)} />
          <Field label={t('price')} value={revenue.price} onChange={(price) => patchSection('revenue', { ...revenue, price: toNumber(price) } as RevenueAssumptions)} />
          <Field label={t('priceEscalation')} value={revenue.priceEscalation} onChange={(priceEscalation) => patchSection('revenue', { ...revenue, priceEscalation: toNumber(priceEscalation) } as RevenueAssumptions)} />
          <Field label={t('availability')} value={revenue.availability} onChange={(availability) => patchSection('revenue', { ...revenue, availability: toNumber(availability) } as RevenueAssumptions)} />
          <Field label={t('degradation')} value={revenue.degradation} onChange={(degradation) => patchSection('revenue', { ...revenue, degradation: toNumber(degradation) } as RevenueAssumptions)} />
          <Field label={t('merchantUpside')} value={revenue.merchantUpsidePct} onChange={(merchantUpsidePct) => patchSection('revenue', { ...revenue, merchantUpsidePct: toNumber(merchantUpsidePct) } as RevenueAssumptions)} />
        </div>
      </section>

      <section className="panel form-section">
        <h3>{t('opex')}</h3>
        <div className="form-grid">
          <Field label={t('fixedOpex')} value={opex.fixed} onChange={(fixed) => patchSection('opex', { ...opex, fixed: toNumber(fixed) } as OpexAssumptions)} />
          <Field label={t('variableOpex')} value={opex.variablePerUnit} onChange={(variablePerUnit) => patchSection('opex', { ...opex, variablePerUnit: toNumber(variablePerUnit) } as OpexAssumptions)} />
          <Field label={t('opexEscalation')} value={opex.escalation} onChange={(escalation) => patchSection('opex', { ...opex, escalation: toNumber(escalation) } as OpexAssumptions)} />
          <Field label={t('majorMaintenance')} value={opex.majorMaintenance} onChange={(majorMaintenance) => patchSection('opex', { ...opex, majorMaintenance: toNumber(majorMaintenance) } as OpexAssumptions)} />
          <Field label={t('majorMaintenanceEvery')} value={opex.majorMaintenanceEvery} onChange={(majorMaintenanceEvery) => patchSection('opex', { ...opex, majorMaintenanceEvery: toNumber(majorMaintenanceEvery) } as OpexAssumptions)} />
        </div>
      </section>

      <section className="panel form-section">
        <h3>{t('taxDepWc')}</h3>
        <div className="form-grid">
          <Field label={t('taxRate')} value={tax.corporateTaxRate} onChange={(corporateTaxRate) => patchSection('tax', { ...tax, corporateTaxRate: toNumber(corporateTaxRate) } as TaxAssumptions)} />
          <Field label={t('vatRate')} value={tax.vatRate} onChange={(vatRate) => patchSection('tax', { ...tax, vatRate: toNumber(vatRate) } as TaxAssumptions)} />
          <Field label={t('usefulLife')} value={depreciation.usefulLifeYears} onChange={(usefulLifeYears) => patchSection('depreciation', { ...depreciation, usefulLifeYears: toNumber(usefulLifeYears) } as DepreciationAssumptions)} />
          <Field label={t('residualValue')} value={depreciation.residualValuePct} onChange={(residualValuePct) => patchSection('depreciation', { ...depreciation, residualValuePct: toNumber(residualValuePct) } as DepreciationAssumptions)} />
          <Field label={t('receivableDays')} value={workingCapital.receivableDays} onChange={(receivableDays) => patchSection('workingCapital', { ...workingCapital, receivableDays: toNumber(receivableDays) } as WorkingCapitalAssumptions)} />
          <Field label={t('payableDays')} value={workingCapital.payableDays} onChange={(payableDays) => patchSection('workingCapital', { ...workingCapital, payableDays: toNumber(payableDays) } as WorkingCapitalAssumptions)} />
          <Field label={t('inventoryDays')} value={workingCapital.inventoryDays} onChange={(inventoryDays) => patchSection('workingCapital', { ...workingCapital, inventoryDays: toNumber(inventoryDays) } as WorkingCapitalAssumptions)} />
        </div>
      </section>

      <section className="panel form-section">
        <h3>{t('financing')}</h3>
        <div className="instrument-list">
          {model.financing.map((instrument, index) => (
            <article className="instrument-card" key={instrument.id}>
              <div className="instrument-header"><strong>{instrument.name}</strong><label><input type="checkbox" checked={instrument.enabled} onChange={(event) => patchFinancing(index, { enabled: event.target.checked })} /> {t('enabled')}</label></div>
              <div className="form-grid compact">
                <Field label={t('name')} type="text" value={instrument.name} onChange={(name) => patchFinancing(index, { name })} />
                <Field label={t('sizingPct')} value={instrument.sizingPct} onChange={(sizingPct) => patchFinancing(index, { sizingPct: toNumber(sizingPct) })} />
                <Field label={t('interestRate')} value={instrument.interestRate} onChange={(interestRate) => patchFinancing(index, { interestRate: toNumber(interestRate) })} />
                <Field label={t('upfrontFee')} value={instrument.upfrontFeePct} onChange={(upfrontFeePct) => patchFinancing(index, { upfrontFeePct: toNumber(upfrontFeePct) })} />
                <Field label={t('tenor')} value={instrument.tenorYears} onChange={(tenorYears) => patchFinancing(index, { tenorYears: toNumber(tenorYears) })} />
                <Field label={t('grace')} value={instrument.gracePeriods} onChange={(gracePeriods) => patchFinancing(index, { gracePeriods: toNumber(gracePeriods) })} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel form-section">
        <h3>{t('dsra')} & {t('sensitivities')}</h3>
        <div className="form-grid">
          <label className="field check"><span>{t('dsraEnabled')}</span><input type="checkbox" checked={dsra.enabled} onChange={(event) => patchSection('dsra', { ...dsra, enabled: event.target.checked } as DsraAssumptions)} /></label>
          <Field label={t('dsraMonths')} value={dsra.monthsForwardDebtService} onChange={(monthsForwardDebtService) => patchSection('dsra', { ...dsra, monthsForwardDebtService: toNumber(monthsForwardDebtService) } as DsraAssumptions)} />
          <Field label={t('priceSensitivity')} value={sensitivities.price} onChange={(price) => patchSection('sensitivities', { ...sensitivities, price: toNumber(price) } as Sensitivities)} />
          <Field label={t('volumeSensitivity')} value={sensitivities.volume} onChange={(volume) => patchSection('sensitivities', { ...sensitivities, volume: toNumber(volume) } as Sensitivities)} />
          <Field label={t('capexSensitivity')} value={sensitivities.capex} onChange={(capexSensitivity) => patchSection('sensitivities', { ...sensitivities, capex: toNumber(capexSensitivity) } as Sensitivities)} />
          <Field label={t('opexSensitivity')} value={sensitivities.opex} onChange={(opexSensitivity) => patchSection('sensitivities', { ...sensitivities, opex: toNumber(opexSensitivity) } as Sensitivities)} />
        </div>
      </section>
    </div>
  );
}
