import { useMemo, useState } from 'react';
import { sampleProject } from './data/sampleProject';
import { solveProject } from './engine/solver';
import type { EngineResult, Period, ProjectModel } from './types/project';
import { InputPanel } from './components/InputPanel';

type Lang = 'en' | 'tr';
type Page = 'dashboard' | 'inputs' | 'outputs' | 'statements' | 'validation';

type Row = {
  label: string;
  values: number[];
};

const dict: Record<Lang, Record<string, string>> = {
  en: {
    dashboard: 'Dashboard', inputs: 'Inputs', outputs: 'Outputs', statements: 'Statements', validation: 'Validation', inputsTitle: 'Assumption workbook', inputsHelp: 'Edit assumptions in focused financial-model sections. All calculations refresh instantly.', project: 'Project', timeline: 'Timeline', capex: 'CAPEX', revenue: 'Revenue', opex: 'OPEX', tax: 'Tax', depreciation: 'Depreciation', workingCapital: 'Working Capital', dsra: 'DSRA', sensitivities: 'Sensitivities', financing: 'Financing Instruments', engine: 'Model Engine', warnings: 'Validation Warnings', projectName: 'Project name', sponsor: 'Sponsor', currency: 'Currency', version: 'Version', startDate: 'Start date', frequency: 'Frequency', periods: 'Total periods', constructionPeriods: 'Construction periods', operationsPeriods: 'Operations periods', hardCosts: 'Hard costs', softCosts: 'Soft costs', contingencyPct: 'Contingency %', spendCurve: 'Spend curve', capacity: 'Volume / capacity', price: 'Price', priceEscalation: 'Price escalation', availability: 'Availability', degradation: 'Degradation', merchantUpside: 'Merchant upside %', fixedOpex: 'Fixed OPEX', variableOpex: 'Variable OPEX / unit', opexEscalation: 'OPEX escalation', majorMaintenance: 'Major maintenance', majorMaintenanceEvery: 'Maintenance every periods', taxDepWc: 'Tax, depreciation and working capital', taxRate: 'Corporate tax rate', vatRate: 'VAT rate', usefulLife: 'Useful life years', residualValue: 'Residual value %', receivableDays: 'Receivable days', payableDays: 'Payable days', inventoryDays: 'Inventory days', enabled: 'Enabled', name: 'Name', sizingPct: 'Sizing %', interestRate: 'Interest rate', upfrontFee: 'Upfront fee %', tenor: 'Tenor years', grace: 'Grace periods', dsraEnabled: 'DSRA enabled', dsraMonths: 'DSRA months', priceSensitivity: 'Price sensitivity', volumeSensitivity: 'Volume sensitivity', capexSensitivity: 'CAPEX sensitivity', opexSensitivity: 'OPEX sensitivity', totalUses: 'Total Uses', sourcesUses: 'Sources & Uses', periodicOutputs: 'Periodic outputs', annualSummary: 'Annual summary', balanceSheet: 'Balance Sheet', noWarnings: 'No warnings. Model checks are clear.', modelHealth: 'Model health', keyRatios: 'Key ratios', liquidity: 'Liquidity', cashFlow: 'Cash flow', clearOutputs: 'Outputs are grouped into annual summaries, period detail, Sources & Uses, ratios and statements.',
  },
  tr: {
    dashboard: 'Özet', inputs: 'Girdiler', outputs: 'Çıktılar', statements: 'Tablolar', validation: 'Kontroller', inputsTitle: 'Varsayım çalışma kitabı', inputsHelp: 'Varsayımları finansal model bölümlerinde düzenleyin. Tüm hesaplamalar anında yenilenir.', project: 'Proje', timeline: 'Zaman Çizelgesi', capex: 'Yatırım Harcaması', revenue: 'Gelir', opex: 'İşletme Gideri', tax: 'Vergi', depreciation: 'Amortisman', workingCapital: 'İşletme Sermayesi', dsra: 'Borç Servis Rezervi', sensitivities: 'Duyarlılıklar', financing: 'Finansman Araçları', engine: 'Model Motoru', warnings: 'Doğrulama Uyarıları', projectName: 'Proje adı', sponsor: 'Sponsor', currency: 'Para birimi', version: 'Versiyon', startDate: 'Başlangıç tarihi', frequency: 'Frekans', periods: 'Toplam dönem', constructionPeriods: 'İnşaat dönemi', operationsPeriods: 'İşletme dönemi', hardCosts: 'Ana yatırım', softCosts: 'Yan maliyetler', contingencyPct: 'Beklenmeyen %', spendCurve: 'Harcama eğrisi', capacity: 'Hacim / kapasite', price: 'Fiyat', priceEscalation: 'Fiyat artışı', availability: 'Kullanılabilirlik', degradation: 'Verim kaybı', merchantUpside: 'Piyasa artısı %', fixedOpex: 'Sabit OPEX', variableOpex: 'Değişken OPEX / birim', opexEscalation: 'OPEX artışı', majorMaintenance: 'Büyük bakım', majorMaintenanceEvery: 'Bakım dönem aralığı', taxDepWc: 'Vergi, amortisman ve işletme sermayesi', taxRate: 'Kurumlar vergisi', vatRate: 'KDV oranı', usefulLife: 'Faydalı ömür', residualValue: 'Hurda değer %', receivableDays: 'Alacak gün', payableDays: 'Borç gün', inventoryDays: 'Stok gün', enabled: 'Aktif', name: 'Ad', sizingPct: 'Finansman %', interestRate: 'Faiz oranı', upfrontFee: 'Peşin ücret %', tenor: 'Vade yıl', grace: 'Geri ödemesiz dönem', dsraEnabled: 'DSRA aktif', dsraMonths: 'DSRA ay', priceSensitivity: 'Fiyat duyarlılığı', volumeSensitivity: 'Hacim duyarlılığı', capexSensitivity: 'CAPEX duyarlılığı', opexSensitivity: 'OPEX duyarlılığı', totalUses: 'Toplam Kullanım', sourcesUses: 'Kaynaklar ve Kullanımlar', periodicOutputs: 'Dönemsel çıktılar', annualSummary: 'Yıllık özet', balanceSheet: 'Bilanço', noWarnings: 'Uyarı yok. Model kontrolleri temiz.', modelHealth: 'Model sağlığı', keyRatios: 'Temel oranlar', liquidity: 'Likidite', cashFlow: 'Nakit akımı', clearOutputs: 'Çıktılar yıllık özetler, dönem detayları, kaynak-kullanım, oranlar ve finansal tablolar halinde ayrıldı.',
  },
};

function money(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, notation: Math.abs(value) >= 1_000_000 ? 'compact' : 'standard', maximumFractionDigits: 1 }).format(value);
}

function number(value: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value);
}

function pct(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

function annualize(result: EngineResult): Array<{ year: number; revenue: number; opex: number; ebitda: number; debtService: number; tax: number; distributions: number }> {
  const byYear = new Map<number, { year: number; revenue: number; opex: number; ebitda: number; debtService: number; tax: number; distributions: number }>();
  result.periods.forEach((period, i) => {
    const row = byYear.get(period.year) ?? { year: period.year, revenue: 0, opex: 0, ebitda: 0, debtService: 0, tax: 0, distributions: 0 };
    row.revenue += result.revenue[i];
    row.opex += result.opex[i];
    row.ebitda += result.ebitda[i];
    row.debtService += result.debtService[i];
    row.tax += result.tax[i];
    row.distributions += result.distributions[i];
    byYear.set(period.year, row);
  });
  return [...byYear.values()];
}

function MetricCard({ label, value, note, tone = 'neutral' }: { label: string; value: string; note?: string; tone?: 'neutral' | 'good' | 'warn' }) {
  return <article className={`metric-card ${tone}`}><span>{label}</span><strong>{value}</strong>{note && <small>{note}</small>}</article>;
}

function DataTable({ columns, rows }: { columns: string[]; rows: Array<Array<string | number>> }) {
  return <div className="table-wrap"><table><thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={`${i}-${j}`}>{cell}</td>)}</tr>)}</tbody></table></div>;
}

function SourceUseCards({ result, currency }: { result: EngineResult; currency: string }) {
  const sourceTotal = Object.values(result.sources).reduce((a, b) => a + b, 0);
  const useTotal = Object.values(result.uses).reduce((a, b) => a + b, 0);
  return <div className="source-use-grid"><section className="panel"><h3>Sources</h3>{Object.entries(result.sources).map(([name, value]) => <div className="bar-row" key={name}><span>{name}</span><strong>{money(value, currency)}</strong><div><i style={{ width: `${Math.max(4, (value / sourceTotal) * 100)}%` }} /></div></div>)}<footer>{money(sourceTotal, currency)}</footer></section><section className="panel"><h3>Uses</h3>{Object.entries(result.uses).map(([name, value]) => <div className="bar-row use" key={name}><span>{name}</span><strong>{money(value, currency)}</strong><div><i style={{ width: `${Math.max(4, (value / useTotal) * 100)}%` }} /></div></div>)}<footer>{money(useTotal, currency)}</footer></section></div>;
}

function DashboardPage({ model, result, t }: { model: ProjectModel; result: EngineResult; t: (key: string) => string }) {
  const currency = model.project.currency;
  const sourceTotal = Object.values(result.sources).reduce((a, b) => a + b, 0);
  const useTotal = Object.values(result.uses).reduce((a, b) => a + b, 0);
  return <div className="page-stack"><section className="hero"><div><p className="eyebrow">{t('modelHealth')}</p><h2>{model.project.name}</h2><p>{model.project.sponsor} • {model.timeline.frequency} • {model.timeline.periods} periods</p></div><div className={`status-pill ${result.warnings.length ? 'warn' : 'good'}`}>{result.warnings.length ? `${result.warnings.length} warning(s)` : t('noWarnings')}</div></section><section className="metrics-grid"><MetricCard label={t('totalUses')} value={money(result.totalUses, currency)} note={`Sources/Uses delta ${money(sourceTotal - useTotal, currency)}`} tone={Math.abs(sourceTotal - useTotal) <= 1 ? 'good' : 'warn'} /><MetricCard label="Average DSCR" value={number(result.ratios.averageDscr)} tone={result.ratios.averageDscr >= 1.2 ? 'good' : 'warn'} /><MetricCard label="Minimum DSCR" value={number(result.ratios.minDscr)} tone={result.ratios.minDscr >= 1.1 ? 'good' : 'warn'} /><MetricCard label="Solver" value={result.converged ? 'Converged' : 'Not converged'} note={`${result.iterations} iterations`} tone={result.converged ? 'good' : 'warn'} /></section><SourceUseCards result={result} currency={currency} /><section className="panel"><h3>{t('annualSummary')}</h3><DataTable columns={['Year', 'Revenue', 'OPEX', 'EBITDA', 'Debt Service', 'Tax', 'Distribution']} rows={annualize(result).map((row) => [row.year, money(row.revenue, currency), money(row.opex, currency), money(row.ebitda, currency), money(row.debtService, currency), money(row.tax, currency), money(row.distributions, currency)])} /></section></div>;
}

function OutputsPage({ model, result, t }: { model: ProjectModel; result: EngineResult; t: (key: string) => string }) {
  const currency = model.project.currency;
  return <div className="page-stack"><section className="panel hero-panel"><p className="eyebrow">{t('outputs')}</p><h2>{t('clearOutputs')}</h2></section><section className="metrics-grid"><MetricCard label="Total Revenue" value={money(result.revenue.reduce((a, b) => a + b, 0), currency)} /><MetricCard label="Total EBITDA" value={money(result.ebitda.reduce((a, b) => a + b, 0), currency)} /><MetricCard label="Total Debt Service" value={money(result.debtService.reduce((a, b) => a + b, 0), currency)} /><MetricCard label="Total Distributions" value={money(result.distributions.reduce((a, b) => a + b, 0), currency)} /></section><section className="panel"><h3>{t('periodicOutputs')}</h3><DataTable columns={['Period', 'Revenue', 'OPEX', 'EBITDA', 'Tax', 'WC Δ', 'Debt Service', 'DSRA', 'Distribution']} rows={result.periods.map((period: Period, i: number) => [period.label, money(result.revenue[i], currency), money(result.opex[i], currency), money(result.ebitda[i], currency), money(result.tax[i], currency), money(result.workingCapital[i], currency), money(result.debtService[i], currency), money(result.dsra[i], currency), money(result.distributions[i], currency)])} /></section></div>;
}

function StatementsPage({ model, result, t }: { model: ProjectModel; result: EngineResult; t: (key: string) => string }) {
  const currency = model.project.currency;
  const rows: Row[] = [{ label: 'Revenue', values: result.revenue }, { label: 'OPEX', values: result.opex.map((v) => -v) }, { label: 'EBITDA', values: result.ebitda }, { label: 'Depreciation', values: result.depreciation.map((v) => -v) }, { label: 'Tax', values: result.tax.map((v) => -v) }, { label: 'Debt Service', values: result.debtService.map((v) => -v) }, { label: 'Distributions', values: result.distributions.map((v) => -v) }];
  return <div className="page-stack"><section className="panel"><h3>{t('cashFlow')}</h3><DataTable columns={['Line item', ...result.periods.slice(0, 12).map((p) => p.label)]} rows={rows.map((row) => [row.label, ...row.values.slice(0, 12).map((v) => money(v, currency))])} /></section><section className="panel"><h3>{t('balanceSheet')}</h3><DataTable columns={['Period', 'Assets', 'Liabilities + Equity', 'Check']} rows={result.periods.map((period, i) => [period.label, money(result.assets[i], currency), money(result.liabilitiesEquity[i], currency), money(result.assets[i] - result.liabilitiesEquity[i], currency)])} /></section><section className="panel"><h3>{t('keyRatios')}</h3><DataTable columns={['Ratio', 'Value']} rows={Object.entries(result.ratios).map(([name, value]) => [name, name.toLowerCase().includes('yield') ? pct(value) : number(value)])} /></section></div>;
}

function ValidationPage({ result, t }: { result: EngineResult; t: (key: string) => string }) {
  return <div className="page-stack"><section className="panel hero-panel"><p className="eyebrow">{t('validation')}</p><h2>{result.warnings.length ? t('warnings') : t('noWarnings')}</h2></section><section className="panel"><div className="validation-list">{result.warnings.length ? result.warnings.map((warning) => <article className="warning-card" key={warning}>⚠️ {warning}</article>) : <article className="success-card">✅ {t('noWarnings')}</article>}</div></section></div>;
}

export default function App() {
  const [model, setModel] = useState<ProjectModel>(sampleProject);
  const [dark, setDark] = useState(true);
  const [lang, setLang] = useState<Lang>('tr');
  const [page, setPage] = useState<Page>('dashboard');
  const result = useMemo(() => solveProject(model), [model]);
  const t = (key: string) => dict[lang][key] ?? key;
  const pages: Page[] = ['dashboard', 'inputs', 'outputs', 'statements', 'validation'];

  return (
    <main className={dark ? 'dark' : ''}>
      <aside className="sidebar">
        <div className="brand"><span>PF</span><div><strong>PF2Model</strong><small>{model.project.version}</small></div></div>
        <nav className="page-nav">{pages.map((navPage) => <button className={page === navPage ? 'active' : ''} key={navPage} onClick={() => setPage(navPage)}>{t(navPage)}</button>)}</nav>
        <div className="sidebar-actions"><button onClick={() => setDark(!dark)}>{dark ? 'Light' : 'Dark'}</button><button onClick={() => setLang(lang === 'en' ? 'tr' : 'en')}>{lang === 'en' ? 'Türkçe' : 'English'}</button></div>
      </aside>
      <section className="app-shell">
        <header className="topbar"><div><p className="eyebrow">{model.project.currency} Project Finance Model</p><h1>{t(page)}</h1></div><div className="build-marker">{model.project.version} • Vite/React/TS • Pages-ready</div></header>
        {page === 'dashboard' && <DashboardPage model={model} result={result} t={t} />}
        {page === 'inputs' && <InputPanel model={model} setModel={setModel} t={t} />}
        {page === 'outputs' && <OutputsPage model={model} result={result} t={t} />}
        {page === 'statements' && <StatementsPage model={model} result={result} t={t} />}
        {page === 'validation' && <ValidationPage result={result} t={t} />}
      </section>
    </main>
  );
}
