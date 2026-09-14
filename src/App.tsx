import { useMemo, useState } from 'react';
import { sampleProject } from './data/sampleProject';
import { solveProject } from './engine/solver';
import type { ProjectModel, Period } from './types/project';
import { InputPanel } from './components/InputPanel';

type Lang = 'en' | 'tr';
const dict: Record<Lang, Record<string, string>> = { en:{inputs:'Editable Inputs',project:'Project',timeline:'Timeline',capex:'CAPEX',revenue:'Revenue',opex:'OPEX',tax:'Tax',depreciation:'Depreciation',workingCapital:'Working Capital',dsra:'DSRA',sensitivities:'Sensitivities',financing:'Financing Instruments',engine:'Model Engine',warnings:'Validation Warnings'}, tr:{inputs:'Düzenlenebilir Girdiler',project:'Proje',timeline:'Zaman Çizelgesi',capex:'Yatırım Harcaması',revenue:'Gelir',opex:'İşletme Gideri',tax:'Vergi',depreciation:'Amortisman',workingCapital:'İşletme Sermayesi',dsra:'Borç Servis Rezervi',sensitivities:'Duyarlılıklar',financing:'Finansman Araçları',engine:'Model Motoru',warnings:'Doğrulama Uyarıları'}};

export default function App() {
  const [model, setModel] = useState<ProjectModel>(sampleProject);
  const [dark, setDark] = useState(true);
  const [lang, setLang] = useState<Lang>('en');
  const r = useMemo(() => solveProject(model), [model]);
  const t = (k: string) => dict[lang][k] ?? k;
  return <main className={dark ? 'dark' : ''}><header><div><h1>{model.project.name}</h1><p className="marker">{model.project.version} • Vite React TypeScript • GitHub Pages base ./</p></div><nav><button onClick={() => setDark(!dark)}>{dark ? 'Light' : 'Dark'}</button><button onClick={() => setLang(lang === 'en' ? 'tr' : 'en')}>{lang === 'en' ? 'Türkçe' : 'English'}</button></nav></header><div className="grid"><InputPanel model={model} setModel={setModel} t={t}/><section className="card"><h2>{t('engine')}</h2><div className="kpis"><b>Total Uses</b><span>{r.totalUses.toLocaleString()}</span><b>Converged</b><span>{String(r.converged)} ({r.iterations})</span><b>Avg DSCR</b><span>{r.ratios.averageDscr.toFixed(2)}</span><b>Min DSCR</b><span>{r.ratios.minDscr.toFixed(2)}</span></div><h3>Sources & Uses</h3><table><tbody>{Object.entries(r.sources).map(([k, v]) => <tr key={k}><td>{k}</td><td>{v.toLocaleString()}</td></tr>)}{Object.entries(r.uses).map(([k, v]) => <tr key={k}><td>Use: {k}</td><td>{v.toLocaleString()}</td></tr>)}</tbody></table><h3>{t('warnings')}</h3>{r.warnings.length ? <ul>{r.warnings.map(w => <li key={w}>{w}</li>)}</ul> : <p>No warnings.</p>}<h3>Periodic Outputs</h3><table><thead><tr><th>Period</th><th>Revenue</th><th>OPEX</th><th>Debt Service</th><th>DSRA</th><th>Distribution</th></tr></thead><tbody>{r.periods.slice(0, 24).map((p: Period, i: number) => <tr key={p.index}><td>{p.label}</td><td>{r.revenue[i].toFixed(0)}</td><td>{r.opex[i].toFixed(0)}</td><td>{r.debtService[i].toFixed(0)}</td><td>{r.dsra[i].toFixed(0)}</td><td>{r.distributions[i].toFixed(0)}</td></tr>)}</tbody></table></section></div></main>;
}
