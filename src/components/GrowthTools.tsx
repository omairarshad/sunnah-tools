import {validateQadaPlan} from '../lib/personalTools.mjs';
import {useEffect,useState} from 'react';
import {qadaPlanningDays,qurbaniEstimate} from '../lib/growthCalculations.mjs';
import {qadaPace} from '../lib/prayerFive.mjs';

const currencies=['GBP','USD','EUR','PKR','INR','SAR','AED','CAD','AUD','MYR'];
const money=(n:number,currency:string)=>new Intl.NumberFormat('en-GB',{style:'currency',currency,maximumFractionDigits:2}).format(n);
const intValue=(value:string)=>/^\d+$/.test(value)?Number(value):NaN;
function Currency({value,onChange}:{value:string;onChange:(value:string)=>void}){
 return <label>Currency<select value={value} onChange={e=>onChange(e.target.value)}>{currencies.map(code=><option key={code} value={code}>{code}</option>)}</select></label>;
}
function Notice({children}:{children:React.ReactNode}){return <p className="warn">{children}</p>}


const prayerNames=['Fajr','Dhuhr','Asr','Maghrib','Isha'] as const;
export function QadaPrayerCalculator(){
 const [restoreStatus,setRestoreStatus]=useState('');
 const restorePlan=async(event:React.ChangeEvent<HTMLInputElement>)=>{
  const file=event.target.files?.[0];event.target.value='';if(!file)return;
  if(file.size>64000){setRestoreStatus('File is too large for a Qada plan.');return}
  try{
   const restored=validateQadaPlan(JSON.parse(await file.text()));
   if(!restored){setRestoreStatus('This is not a valid Qada plan backup.');return}
   if(!window.confirm('Replace your current Qada plan and completed counts?'))return;
   setMode(restored.mode);setDays(restored.days);setYears(restored.years);setStart(restored.start);setEnd(restored.end);
   setExcluded(restored.excluded);setWitr(restored.witr);setOverrides(restored.overrides);setDone(restored.done);
   setRestoreStatus('Qada plan and progress restored on this device.');
  }catch{setRestoreStatus('Could not read the backup file.')}
 };

 const [mode,setMode]=useState<'days'|'years'|'range'>('days'),[days,setDays]=useState('30'),[years,setYears]=useState('1'),[start,setStart]=useState(''),[end,setEnd]=useState(''),[excluded,setExcluded]=useState('0'),[witr,setWitr]=useState(false);
 const [overrides,setOverrides]=useState<Record<string,string>>({}),[done,setDone]=useState<Record<string,number>>({}),[ready,setReady]=useState(false),[daily,setDaily]=useState('5');
 const storageKey='sunnah-qada-plan-v2';
 useEffect(()=>{try{const value=JSON.parse(localStorage.getItem(storageKey)??'null')??{done:JSON.parse(localStorage.getItem('sunnah-qada-progress-v1')??'{}')};
 if(value&&typeof value==='object'&&!Array.isArray(value)){
 const safe:Record<string,number>={};for(const key of [...prayerNames,'Witr'])if(Number.isSafeInteger(value.done?.[key])&&value.done[key]>=0&&value.done[key]<=1000000)safe[key]=value.done[key];setDone(safe);
 if(['days','years','range'].includes(value.mode))setMode(value.mode);
 for(const [key,setter] of [['days',setDays],['years',setYears],['start',setStart],['end',setEnd],['excluded',setExcluded]] as const){const v=value[key];if(typeof v==='string'&&v.length<30)setter(v)}
 if(typeof value.witr==='boolean')setWitr(value.witr);
 if(value.overrides&&typeof value.overrides==='object'){const next:Record<string,string>={};for(const name of [...prayerNames,'Witr']){const v=value.overrides[name];if(typeof v==='string'&&v.length<12)next[name]=v}setOverrides(next)}
 }}catch{}setReady(true)},[]);
 useEffect(()=>{if(ready)try{localStorage.setItem(storageKey,JSON.stringify({mode,days,years,start,end,excluded,witr,overrides,done}))}catch{}},[ready,mode,days,years,start,end,excluded,witr,overrides,done]);
 const backup=()=>{const blob=new Blob([JSON.stringify({version:2,mode,days,years,start,end,excluded,witr,overrides,done},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='qada-prayer-plan.json';a.click();window.setTimeout(()=>URL.revokeObjectURL(url),1000)};
 const base=qadaPlanningDays({mode,days:intValue(days),years:Number(years),start,end,excluded:intValue(excluded)});
 const names:string[]=witr?[...prayerNames,'Witr']:[...prayerNames];
 const targets=names.map(name=>({name,target:overrides[name]===undefined||overrides[name]===''?(base??NaN):intValue(overrides[name])}));
 const valid=base!==null&&targets.every(item=>Number.isSafeInteger(item.target)&&item.target>=0&&item.target<=1000000);
 const total=valid?targets.reduce((sum,item)=>sum+item.target,0):0;
 const completed=valid?targets.reduce((sum,item)=>sum+Math.min(item.target,done[item.name]??0),0):0;
 const pacing=valid?qadaPace(total,completed,/^\d+$/.test(daily)?Number(daily):NaN):null;
 const adjust=(name:string,delta:number,target:number)=>setDone(prev=>({...prev,[name]:Math.min(target,Math.max(0,(prev[name]??0)+delta))}));
 return <div className="growth-tool">
  <p>Estimate missed prayers (Qada Salah) and record prayers you have made up. Check which prayers you need to include with a qualified scholar.</p>
  <label>How would you like to estimate the period?<select value={mode} onChange={e=>setMode(e.target.value as 'days'|'years'|'range')}><option value="days">Number of days</option><option value="years">Approximate years</option><option value="range">Inclusive date range</option></select></label>
  {mode==='days'&&<label>Estimated days to review<input type="number" min="1" max="36525" step="1" value={days} onChange={e=>setDays(e.target.value)}/></label>}
  {mode==='years'&&<label>Estimated years to review<input type="number" min="0.01" max="100" step="any" value={years} onChange={e=>setYears(e.target.value)}/></label>}
  {mode==='range'&&<div className="two"><label>Start date<input type="date" value={start} onChange={e=>setStart(e.target.value)}/></label><label>End date (inclusive)<input type="date" value={end} onChange={e=>setEnd(e.target.value)}/></label></div>}
  <label>Days to exclude from the estimate<input type="number" min="0" step="1" value={excluded} onChange={e=>setExcluded(e.target.value)}/></label>
  <p className="small">Only exclude days after checking the rules relevant to your circumstances, such as pre-puberty periods and valid exemptions. The date-range option counts civil days, not individual prayers.</p>
  <label className="check"><input type="checkbox" checked={witr} onChange={e=>setWitr(e.target.checked)}/> Include Witr in my plan (school-dependent)</label>
  {valid?<><div className="two"><div className="result"><span>Estimated prayers in this plan</span><strong>{total.toLocaleString('en-GB')}</strong></div><div className="result"><span>Remaining after recorded progress</span><strong>{(total-completed).toLocaleString('en-GB')}</strong></div></div>
   <p className="small">Adjust each prayer count as needed. Blank fields use {base?.toLocaleString('en-GB')} days.</p>
   <div className="growth-qada-pacing"><label>Optional make-up planning pace (prayers per civil day)<input type="number" min="1" max="500" step="1" value={daily} onChange={e=>setDaily(e.target.value)}/></label>{pacing?<p role="status">At {pacing.daily} made-up prayers per day, <strong>{pacing.remaining.toLocaleString('en-GB')}</strong> recorded remaining prayers would take approximately <strong>{pacing.estimatedDays.toLocaleString('en-GB')} days</strong> ({pacing.estimatedWeeks} weeks). This is a planning estimate, not a required pace or deadline.</p>:<p className="small">Choose a whole number from 1 to 500 for an optional pace estimate.</p>}</div>
   <div className="growth-qada-list">{targets.map(({name,target})=><div className="growth-qada-row" key={name}>
    <div><strong>{name}</strong><label>Estimated missed prayers<input aria-label={'Estimated missed '+name+' prayers'} type="number" min="0" max="1000000" step="1" value={overrides[name]??''} placeholder={String(base)} onChange={e=>setOverrides(v=>({...v,[name]:e.target.value}))}/></label></div>
    <div className="growth-qada-progress"><span>{Math.min(target,done[name]??0).toLocaleString('en-GB')} / {target.toLocaleString('en-GB')} made up</span><progress value={Math.min(target,done[name]??0)} max={Math.max(1,target)}/><div className="action-row"><button type="button" onClick={()=>adjust(name,1,target)} disabled={(done[name]??0)>=target}>+ 1 completed</button><button type="button" className="secondary" onClick={()=>adjust(name,-1,target)} disabled={(done[name]??0)<=0}>Undo</button></div></div>
   </div>)}</div>
   <div className="action-row"><button type="button" className="secondary" onClick={backup}>Download plan backup (JSON)</button><label>Restore plan from JSON<input type="file" accept=".json,application/json" aria-label="Restore Qada plan and progress" onChange={restorePlan}/></label><button type="button" className="secondary" onClick={()=>{if(window.confirm('Clear saved Qada plan and progress on this device?')){setDone({});setOverrides({});setMode('days');setDays('30');setYears('1');setStart('');setEnd('');setExcluded('0');setWitr(false)}}}>Reset plan and progress</button></div>
  </>:<Notice>Enter a valid period and exclusions, and use non-negative whole numbers for individual prayer targets.</Notice>}
  {restoreStatus&&<p role="status" className="small">{restoreStatus}</p>}
  <p className="small">This device now remembers both your estimated targets and recorded progress. Keep a downloaded backup before clearing browser data.</p><Notice>Scholars differ on making up deliberately missed prayers, Witr and other circumstances. This is a private organisational aid, not a fatwa or an automatic determination of liability. Seek qualified guidance before setting your targets.</Notice>
  <p className="small">Reference: <a href="https://sunnah.com/muslim:684a" target="_blank" rel="noopener noreferrer">Sahih Muslim 684a</a> on prayer missed through sleep or forgetfulness.</p>
 </div>;
}

export function QurbaniShareCalculator(){
 const [animal,setAnimal]=useState('cow'),[participants,setParticipants]=useState('7'),[cost,setCost]=useState(''),[currency,setCurrency]=useState('GBP');
 const max=['sheep','goat'].includes(animal)?1:7;
 const estimate=qurbaniEstimate(animal,intValue(participants),Number(cost));
 return <div className="growth-tool">
  <p>Enter the quoted cost of your Qurbani (Udhiyah) animal to see how much each participant would contribute.</p>
  <div className="two"><label>Animal type<select value={animal} onChange={e=>{const a=e.target.value;setAnimal(a);setParticipants(['sheep','goat'].includes(a)?'1':'7')}}><option value="sheep">Sheep</option><option value="goat">Goat</option><option value="cow">Cow</option><option value="buffalo">Buffalo</option><option value="camel">Camel</option></select></label>
  <label>Participants (one share each)<select value={participants} onChange={e=>setParticipants(e.target.value)}>{Array.from({length:max},(_,i)=><option key={i+1} value={i+1}>{i+1}</option>)}</select></label></div>
  <div className="two"><label>Total animal and processing cost<input type="number" min="0.01" step="any" inputMode="decimal" value={cost} onChange={e=>setCost(e.target.value)} placeholder="Enter quoted total"/></label><Currency value={currency} onChange={setCurrency}/></div>
  {estimate?<><div className="two"><div className="result" role="status"><span>Equal cost per participant</span><strong>{money(estimate.perPerson,currency)}</strong></div><div className="result"><span>Combined cost</span><strong>{money(estimate.total,currency)}</strong></div></div><p className="small">{estimate.participants} participant{estimate.participants===1?'':'s'} × {money(estimate.perPerson,currency)} each (rounded for display).</p></>:<p className="small">Enter a positive total cost to see an equal-split estimate.</p>}
  <Notice>A sheep or goat is treated as one Qurbani share in the commonly cited ruling; a cow, buffalo or camel can accommodate up to seven. This calculator only divides a quoted cost equally. Eligibility, intentions, ownership and local practice require qualified guidance.</Notice>
  <p className="small">Reference: <a href="https://sunnah.com/muslim:1318a" target="_blank" rel="noopener noreferrer">Sahih Muslim 1318a</a> on shared sacrifice.</p>
 </div>;
}


type RoundType='tawaf'|'sai';
export function TawafSaiCounter(){
 const [rounds,setRounds]=useState<Record<RoundType,number>>({tawaf:0,sai:0}),[ready,setReady]=useState(false);
 const storageKey='sunnah-tawaf-sai-v1';
 useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem(storageKey)??'{}');const safe=(n:unknown)=>Number.isSafeInteger(n)&&typeof n==='number'&&n>=0&&n<=7?n:0;setRounds({tawaf:safe(saved.tawaf),sai:safe(saved.sai)})}catch{}setReady(true)},[]);
 useEffect(()=>{if(ready)try{localStorage.setItem(storageKey,JSON.stringify(rounds))}catch{}},[rounds,ready]);
 const change=(type:RoundType,delta:number)=>setRounds(v=>({...v,[type]:Math.min(7,Math.max(0,v[type]+delta))}));
 const reset=(type:RoundType)=>{if(window.confirm('Reset the '+(type==='tawaf'?'Tawaf':'Sa’i')+' counter to zero?'))setRounds(v=>({...v,[type]:0}))};
 return <div className="growth-tool">
  <p>Count seven Tawaf circuits and seven Sa'i lengths. Each counter can be undone or reset separately.</p>
  <div className="growth-count-grid">
   {(['tawaf','sai'] as const).map(type=><section className="growth-count-card" key={type} aria-label={type==='tawaf'?'Tawaf counter':'Sai counter'}>
    <span className="growth-eyebrow">{type==='tawaf'?'TAWAF · KAABA':'SA’I · SAFA & MARWAH'}</span>
    <h3>{type==='tawaf'?'Tawaf circuits':'Sa’i lengths'}</h3>
    <div className="growth-count" aria-live="polite"><strong>{rounds[type]}</strong><span> / 7</span></div>
    <progress value={rounds[type]} max={7}/>
    <p className="small">{type==='tawaf'?(rounds.tawaf===7?'Seven circuits recorded.':'Each complete circuit starts and ends at the Black Stone.'):
      (rounds.sai===7?'Seven lengths recorded; finish at Marwah.':rounds.sai%2===0?'Next length: Safa → Marwah':'Next length: Marwah → Safa')}</p>
    <div className="action-row"><button type="button" disabled={rounds[type]>=7} onClick={()=>change(type,1)}>+ Completed one</button><button type="button" className="secondary" disabled={rounds[type]===0} onClick={()=>change(type,-1)}>Undo</button><button type="button" className="secondary" onClick={()=>reset(type)}>Reset</button></div>
   </section>)}
  </div>
  <Notice>Sa'i consists of seven one-way lengths, starting at Safa and ending at Marwah — not seven return journeys. These counters are reminders, not a verification of ritual validity. Follow a qualified guide for the rites and applicable rules.</Notice>
  <p className="small">Reference: <a href="https://quran.com/2/158" target="_blank" rel="noopener noreferrer">Quran 2:158</a> on Safa and Marwah. Progress is stored in this browser only.</p>
 </div>;
}
