import {useEffect,useState} from 'react';
import {localISODate} from '../lib/calculations.mjs';
import {downloadText} from '../lib/personalTools.mjs';
import {validateFastingPlan,migrateLegacyFastingPlan,fastingPlanStats,addCompletedFast,removeCompletedFast,fastingPlanCSV} from '../lib/fastingTracker.mjs';

type Kind='qada'|'voluntary';
type Entry={date:string;kind:Kind};
type Plan={version:number;target:number;carried:number;entries:Entry[]};
const blank=():Plan=>({version:2,target:0,carried:0,entries:[]});
const labelDate=(date:string)=>new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric',weekday:'short',timeZone:'UTC'}).format(new Date(date+'T12:00:00Z'));
const key='sunnah-fasts-v2';

export default function FastingTracker(){
 const [plan,setPlan]=useState<Plan>(blank),[ready,setReady]=useState(false),[date,setDate]=useState(()=>localISODate()),[kind,setKind]=useState<Kind>('qada'),[message,setMessage]=useState('');
 useEffect(()=>{
  let safeToSave=true;
  try{
   const stored=localStorage.getItem(key);
   if(stored!==null){
    const valid=validateFastingPlan(JSON.parse(stored));
    if(valid)setPlan(valid);
    else{safeToSave=false;setMessage('Your saved fasting plan could not be validated. It has not been overwritten. Download or inspect your original site data, or choose Clear local plan to start again.');}
   }else{
    const legacy=migrateLegacyFastingPlan(JSON.parse(localStorage.getItem('sunnah-fasts')??'null'));
    if(legacy){setPlan(legacy);setMessage('Your previous counter was preserved as undated completed Qada fasts. No dates were invented.');}
   }
  }catch{safeToSave=false;setMessage('Could not read an existing browser record. It has not been overwritten; preserve the original site data before resetting.');}
  setReady(safeToSave);
 },[]);
 useEffect(()=>{if(ready)try{localStorage.setItem(key,JSON.stringify(plan))}catch{setMessage('Browser storage is unavailable; download a backup to retain this session’s progress.')}},[ready,plan]);
 const stats=fastingPlanStats(plan)!;
 const updateTarget=(value:string)=>{
  const n=Number(value);
  if(!/^\d*$/.test(value)||!Number.isSafeInteger(n)||n<stats.completed||n>10000){setMessage('The target must be at least the number already recorded and no more than 10,000.');return}
  if(!ready){setMessage('Saved plan cannot be validated. Clear it explicitly before adding new records.');return}
  setPlan(previous=>({...previous,target:n}));setMessage('');
 };
 const record=()=>{
  if(!ready){setMessage('Saved plan is not ready; preserve or clear the existing data first.');return}
  const next=addCompletedFast(plan,{date,kind},localISODate());
  if(!next){setMessage('Could not add this completion. Check that the date is valid, not in the future, not already recorded, and that Qada days remain in the target.');return}
  setPlan(next);setMessage(kind==='qada'?'One self-reported make-up fast recorded.':'One self-reported voluntary fast recorded.');
 };
 const backup=()=>downloadText('fasting-plan-backup.json',JSON.stringify(plan,null,2),'application/json;charset=utf-8');
 const csv=()=>downloadText('fasting-history.csv',fastingPlanCSV(plan),'text/csv;charset=utf-8');
 const restore=async(e:React.ChangeEvent<HTMLInputElement>)=>{
  const file=e.target.files?.[0];e.target.value='';if(!file)return;
  if(file.size>128000){setMessage('The backup exceeds the 128 KB limit.');return}
  try{const next=validateFastingPlan(JSON.parse(await file.text()));if(!next){setMessage('This is not a valid v2 fasting-plan backup.');return}
   if(!window.confirm('Replace this browser’s current fasting plan and completion history with the selected backup?'))return;
   setPlan(next);setReady(true);setMessage('Validated backup restored on this device.');
  }catch{setMessage('Unable to read the backup. Choose a valid JSON file.');}
 };
 const remove=(entry:Entry)=>{const next=removeCompletedFast(plan,entry.date);if(next){setPlan(next);setMessage('Removed the completion on '+entry.date+'.')}};
 const reset=()=>{if(window.confirm('Clear the fasting plan and all completion records in this browser? Download a backup first if you need one.')){setPlan(blank());setReady(true);setMessage('Local fasting plan cleared.')}};
 return <div className="fasting-deep-tool fasting-history">
  <p className="small">Keep an account-free record of <strong>make-up (Qada)</strong> and <strong>voluntary</strong> fasts separately. You decide your Qada target; the tracker never calculates religious liability.</p>
  <div className="fasting-deep-fields"><label>Qada fasts in your self-chosen plan<input type="number" min={stats.completed} max="10000" step="1" inputMode="numeric" value={plan.target} disabled={!ready} onChange={e=>updateTarget(e.target.value)}/></label></div>
  <div className="fasting-deep-stats"><div><span>Qada completed</span><strong>{stats.completed}</strong></div><div><span>Qada remaining</span><strong>{stats.remaining}</strong></div><div><span>Voluntary recorded</span><strong>{stats.voluntary}</strong></div></div>
  <progress value={stats.completed} max={Math.max(1,stats.target)} aria-label="Qada fast completion progress"/>
  <p className="small">{stats.target===0?'Set your own Qada target if one applies.':`${stats.completed} of ${stats.target} Qada days recorded (${Math.round(stats.completed/stats.target*100)}%).`}{stats.carried?` Includes ${stats.carried} undated completions imported from your old counter.`:''}</p>
  <section className="fasting-deep-panel" aria-labelledby="fasting-record-heading"><h3 id="fasting-record-heading">Record a completed fast</h3>
   <div className="fasting-deep-fields"><label>Fast category<select value={kind} onChange={e=>setKind(e.target.value as Kind)}><option value="qada">Qada — make-up fast</option><option value="voluntary">Voluntary — optional fast</option></select></label><label>Gregorian date the fast was completed<input type="date" min="2000-01-01" max={localISODate()} value={date} onChange={e=>setDate(e.target.value)}/></label></div>
   <button type="button" onClick={record} disabled={!ready}>Record this completed fast</button>
   <p className="small">One completion per civil day; no future date or duplicate is accepted. Recording a date is your statement, not independent verification that a fast was valid.</p>
  </section>
  <section className="fasting-deep-panel" aria-labelledby="fasting-records-heading"><h3 id="fasting-records-heading">Completed fasting history</h3>
   {plan.entries.length?<div className="fasting-history-list">{plan.entries.map(entry=><div key={entry.date}><span><strong>{labelDate(entry.date)}</strong><small>{entry.kind==='qada'?'Make-up (Qada)':'Voluntary'}</small></span><button type="button" className="secondary" onClick={()=>remove(entry)} aria-label={'Remove fast on '+entry.date}>Remove</button></div>)}</div>:<p className="small">No dated fasts recorded yet. Existing undated counter entries remain counted separately.</p>}
   {stats.carried>0&&<div className="fasting-legacy"><span>{stats.carried} older completion{stats.carried!==1?'s':''} without dates</span><button className="secondary" type="button" onClick={()=>setPlan(prev=>({...prev,carried:prev.carried-1}))}>Undo one undated completion</button></div>}
  </section>
  <div className="action-row fasting-deep-actions print-hide"><button type="button" className="secondary" disabled={!ready} onClick={backup}>Download private JSON backup</button><button type="button" className="secondary" disabled={!ready} onClick={csv}>Download history CSV</button><label className="fasting-backup-label">Restore JSON backup<input type="file" accept=".json,application/json" onChange={restore}/></label><button type="button" className="secondary" onClick={()=>window.print()}>Print / Save PDF</button><button type="button" className="secondary fasting-danger" onClick={reset}>Clear local plan</button></div>
  {message&&<p className="small" role="status">{message}</p>}
  <p className="warn">Everything is stored only in this browser’s local storage unless you choose to export a file. Clearing site data or changing device may remove it. Qada obligations, permissible dates, exemptions, missed-fast remedies and intentions require qualified religious guidance. See <a href="/tools/fasting-times/">Suhoor &amp; Iftar Times</a> and <a href="/tools/fidya-calculator/">Fidya</a> for distinct planning needs.</p>
 </div>;
}
