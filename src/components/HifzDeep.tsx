import {useEffect,useState} from 'react';
import {FEATURED_SURAHS,hifzAssessment,migrateHifzLegacy,validateHifzBackup} from '../lib/quranRemembranceDeep.mjs';
import {downloadText} from '../lib/personalTools.mjs';
type Plan={version:2;surah:number;start:number;end:number;completed:number;days:number};
const initial:Plan={version:2,surah:67,start:1,end:30,completed:0,days:14};
const storage='sunnah-hifz-plan-v2';
export default function HifzDeep(){
 const [plan,setPlan]=useState<Plan>(initial),[ready,setReady]=useState(false),[notice,setNotice]=useState('');
 useEffect(()=>{try{
  const current=validateHifzBackup(JSON.parse(localStorage.getItem(storage)??'null'));
  if(current)setPlan(current as Plan);
  else{
   const older=migrateHifzLegacy(JSON.parse(localStorage.getItem('sunnah-hifz-plan-v1')??'null'));
   if(older){setPlan(older as Plan);setNotice('Compatible previous Hifz progress restored. Please confirm its Surah and verse range.')}
  }
 }catch{}setReady(true)},[]);
 useEffect(()=>{if(ready)try{localStorage.setItem(storage,JSON.stringify(plan))}catch{}},[ready,plan]);
 const result=hifzAssessment(plan);
 const update=(changes:Partial<Plan>)=>setPlan(p=>({...p,...changes}));
 const chooseSurah=(n:number)=>{const s=FEATURED_SURAHS.find(x=>x.number===n)!;setPlan({version:2,surah:n,start:1,end:s.ayahs,completed:0,days:14});setNotice('Switched Surah; the previous plan remains in your downloaded backups only.')};
 const restore=async(event:React.ChangeEvent<HTMLInputElement>)=>{const file=event.target.files?.[0];event.target.value='';if(!file)return;if(file.size>10000){setNotice('Backup exceeds 10KB. No changes made.');return}try{const p=validateHifzBackup(JSON.parse(await file.text()));if(!p){setNotice('Invalid Hifz backup. Current plan unchanged.');return}if(!window.confirm('Replace your local Hifz plan with this backup?'))return;setPlan(p as Plan);setNotice('Valid Hifz backup restored.')}catch{setNotice('Could not read the Hifz backup.')}}; 
 return <div className="fasting-deep-tool">
 <p className="small">A private memorisation planner for <strong>eleven verified Surahs</strong>. Unlike a free-text verse target, this checks every entered ayah against the selected Surah's length. Revise with a qualified teacher; memorised counts are not certification of Tajwid or retention.</p>
 <div className="fasting-deep-fields">
 <label>Surah (validated range)<select value={plan.surah} onChange={e=>chooseSurah(Number(e.target.value))}>{FEATURED_SURAHS.map(s=><option key={s.number} value={s.number}>{s.number}. {s.name} ({s.ayahs} ayahs)</option>)}</select></label>
 <label>First ayah<input type="number" min="1" step="1" value={plan.start} onChange={e=>update({start:Number(e.target.value),completed:0})}/></label>
 <label>Final ayah<input type="number" min="1" step="1" value={plan.end} onChange={e=>update({end:Number(e.target.value),completed:0})}/></label>
 <label>Verses memorised in this range<input type="number" min="0" step="1" value={plan.completed} onChange={e=>update({completed:Number(e.target.value)})}/></label>
 <label>Days for the remaining goal<input type="number" min="1" max="3650" step="1" value={plan.days} onChange={e=>update({days:Number(e.target.value)})}/></label></div>
 {result?<><div className="fasting-deep-stats"><div><span>Progress</span><strong>{plan.completed}/{result.total} ({result.percent}%)</strong></div><div><span>Remaining</span><strong>{result.remaining} ayahs</strong></div><div><span>Suggested daily pace</span><strong>{result.perDay} ayahs</strong></div></div>
 <progress max={result.total} value={plan.completed} aria-label="Recorded Hifz progress"/>
 {result.nextAyah&&<p>Next verse to work on: <a href={'https://quran.com/'+plan.surah+'/'+result.nextAyah} target="_blank" rel="noopener noreferrer">Surah {result.surah.name} {plan.surah}:{result.nextAyah}</a>.</p>}
 <div className="action-row"><button type="button" onClick={()=>update({completed:Math.min(result.total,plan.completed+1)})} disabled={result.remaining===0}>+ One memorised ayah</button><button type="button" className="secondary" onClick={()=>update({completed:Math.max(0,plan.completed-1)})} disabled={!plan.completed}>Undo</button></div>
 <div className="action-row print-hide"><button type="button" className="secondary" onClick={()=>downloadText('hifz-plan-backup.json',JSON.stringify(plan,null,2))}>Back up Hifz plan (JSON)</button><label>Restore JSON backup<input type="file" accept=".json,application/json" onChange={restore}/></label><button type="button" className="secondary" onClick={()=>window.print()}>Print plan</button></div></>:<p className="warn" role="alert">Check the range, completed count and days. The final ayah cannot exceed the selected Surah's known length.</p>}
 {notice&&<p className="small" role="status">{notice}</p>}
 <p className="warn">A past v1 plan can migrate only when its Surah name or number matches this supported list and its counts are valid; unknown old Surah names are left untouched in their original local storage. This planner does not silently invent a Quran verse count or claim that progress equals secure memorisation.</p>
 </div>;
}
