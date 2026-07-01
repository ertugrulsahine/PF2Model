import type { ProjectModel } from '../types/project';
type Props={ model:ProjectModel; setModel:(p:ProjectModel)=>void; t:(k:string)=>string };
export function InputPanel({model,setModel,t}:Props){
 const patch=<K extends keyof ProjectModel>(k:K,v:ProjectModel[K])=>setModel({...model,[k]:v});
 return <section className="card inputs"><h2>{t('inputs')}</h2>{(['project','timeline','capex','revenue','opex','tax','depreciation','workingCapital','dsra','sensitivities'] as const).map(k=><details key={k} open><summary>{t(k)}</summary><textarea value={JSON.stringify(model[k],null,2)} onChange={e=>{try{patch(k,JSON.parse(e.target.value));}catch{}}}/></details>)}<details open><summary>{t('financing')}</summary><textarea value={JSON.stringify(model.financing,null,2)} onChange={e=>{try{patch('financing',JSON.parse(e.target.value));}catch{}}}/></details></section>
}
