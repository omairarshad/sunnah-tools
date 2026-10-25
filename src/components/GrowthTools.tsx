import {useEffect,useState} from 'react';
import {oddNightDates,qadaPlanningDays,simpleEstimate,qurbaniEstimate} from '../lib/growthCalculations.mjs';

const currencies=['GBP','USD','EUR','PKR','INR','SAR','AED','CAD','AUD','MYR'];
const money=(n:number,currency:string)=>new Intl.NumberFormat('en-GB',{style:'currency',currency,maximumFractionDigits:2}).format(n);
const dateLabel=(iso:string)=>new Intl.DateTimeFormat('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(iso+'T12:00:00Z'));
const intValue=(value:string)=>/^\d+$/.test(value)?Number(value):NaN;
function Currency({value,onChange}:{value:string;onChange:(value:string)=>void}){
 return <label>Currency<select value={value} onChange={e=>onChange(e.target.value)}>{currencies.map(code=><option key={code} value={code}>{code}</option>)}</select></label>;
}
function Notice({children}:{children:React.ReactNode}){return <p className="warn">{children}</p>}

export function LaylatulQadrNights(){
 const [first,setFirst]=useState('2027-02-08');
 const nights=oddNightDates(first);
 const download=()=>{
  if(!nights.length)return;
  const stamp=new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
  const events=nights.flatMap(item=>{
   const start=item.evening!.replaceAll('-',''),end=item.daytime!.replaceAll('-','');
   return ['BEGIN:VEVENT','UID:ramadan-'+item.night+'-'+start+'@sunnah.tools','DTSTAMP:'+stamp,
    'DTSTART;VALUE=DATE:'+start,'DTEND;VALUE=DATE:'+end,
    'SUMMARY:Ramadan '+item.night+'th night - starts at sunset',
    'DESCRIPTION:Planning reminder only. Night starts at local sunset. Confirm the first fast with your local community and seek Laylatul Qadr throughout the last ten nights.',
    'END:VEVENT'];
  });
  const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Sunnah Tools//Ramadan Night Planner//EN','CALSCALE:GREGORIAN',...events,'END:VCALENDAR'].join('\r\n')+'\r\n';
  const url=URL.createObjectURL(new Blob([ics],{type:'text/calendar;charset=utf-8'}));
  const a=document.createElement('a');a.href=url;a.download='ramadan-odd-nights.ics';a.click();window.setTimeout(()=>URL.revokeObjectURL(url),2000);
 };
 return <div className="growth-tool">
  <p>Enter the <strong>first daytime fast</strong> announced by your local community. The tool lists the civil evenings when the commonly numbered odd nights begin.</p>
  <label>First day of Ramadan (Gregorian)<input type="date" value={first} onChange={e=>setFirst(e.target.value)}/></label>
  <p className="small">The example date is not a confirmed Ramadan start. Use the date announced in your area.</p>
  {nights.length?<><div className="growth-night-grid">{nights.map(({night,evening,daytime})=><div className="growth-night" key={night}><span className="growth-eyebrow">NIGHT {night} OF RAMADAN</span><strong>{dateLabel(evening!)}</strong><small>Begins at local sunset; continues into {dateLabel(daytime!)} before dawn</small></div>)}</div>
  <div className="action-row print-hide"><button type="button" onClick={download}>Add evenings to calendar (.ics)</button><button type="button" className="secondary" onClick={()=>window.print()}>Print dates</button></div></>:<Notice>Enter a valid Gregorian start date.</Notice>}
  <Notice>The Islamic night begins at sunset, not midnight. Local moon-sighting announcements may change these dates. The odd-numbered nights are a planning aid; seek Laylatul Qadr throughout the last ten nights, not only these five.</Notice>
  <p className="small">Reference: <a href="https://sunnah.com/bukhari:2017" target="_blank" rel="noopener noreferrer">Sahih al-Bukhari 2017</a> on seeking Laylatul Qadr in the last ten nights.</p>
 </div>;
}

export function FidyaCalculator(){
 const [days,setDays]=useState(''),[rate,setRate]=useState(''),[currency,setCurrency]=useState('GBP');
 const estimate=simpleEstimate(intValue(days),Number(rate));
 return <div className="growth-tool">
  <p>Calculate an <strong>illustrative Fidya amount</strong> using the number of eligible fasting days and the verified local Fidya rate you supply.</p>
  <div className="two"><label>Fasting days for which Fidya applies<input type="number" min="1" max="100000" step="1" inputMode="numeric" value={days} onChange={e=>setDays(e.target.value)} placeholder="e.g. 5"/></label><label>Verified Fidya rate per day<input type="number" min="0.01" step="any" inputMode="decimal" value={rate} onChange={e=>setRate(e.target.value)} placeholder="Enter your local rate"/></label></div>
  <Currency value={currency} onChange={setCurrency}/>
  {estimate?<><div className="result" role="status"><span>Estimated Fidya at your entered rate</span><strong>{money(estimate.total,currency)}</strong><small>{days} days × {money(Number(rate),currency)} per day</small></div></>:<p className="small">Enter the number of days and your locally confirmed Fidya rate.</p>}
  <Notice>Fidya is not automatically due for every missed fast. Whether you should make up fasts, pay Fidya, or follow another ruling depends on your circumstances and school of law. Confirm eligibility and the current local rate with a qualified authority before paying.</Notice>
  <p className="small">Reference: <a href="https://quran.com/2/184" target="_blank" rel="noopener noreferrer">Quran 2:184</a>. Fidya, Fitrana and Kaffarah are different obligations.</p>
 </div>;
}

const prayerNames=['Fajr','Dhuhr','Asr','Maghrib','Isha'] as const;
export function QadaPrayerCalculator(){
 const [mode,setMode]=useState<'days'|'years'|'range'>('days'),[days,setDays]=useState('30'),[years,setYears]=useState('1'),[start,setStart]=useState(''),[end,setEnd]=useState(''),[excluded,setExcluded]=useState('0'),[witr,setWitr]=useState(false);
 const [overrides,setOverrides]=useState<Record<string,string>>({}),[done,setDone]=useState<Record<string,number>>({}),[ready,setReady]=useState(false);
 const storageKey='sunnah-qada-progress-v1';
 useEffect(()=>{try{const value=JSON.parse(localStorage.getItem(storageKey)??'{}');if(value&&typeof value==='object'&&!Array.isArray(value)){const safe:Record<string,number>={};for(const key of [...prayerNames,'Witr'])if(Number.isSafeInteger(value[key])&&value[key]>=0&&value[key]<=1000000)safe[key]=value[key];setDone(safe)}}catch{}setReady(true)},[]);
 useEffect(()=>{if(ready)try{localStorage.setItem(storageKey,JSON.stringify(done))}catch{}},[done,ready]);
 const base=qadaPlanningDays({mode,days:intValue(days),years:Number(years),start,end,excluded:intValue(excluded)});
 const names:string[]=witr?[...prayerNames,'Witr']:[...prayerNames];
 const targets=names.map(name=>({name,target:overrides[name]===undefined||overrides[name]===''?(base??NaN):intValue(overrides[name])}));
 const valid=base!==null&&targets.every(item=>Number.isSafeInteger(item.target)&&item.target>=0&&item.target<=1000000);
 const total=valid?targets.reduce((sum,item)=>sum+item.target,0):0;
 const completed=valid?targets.reduce((sum,item)=>sum+Math.min(item.target,done[item.name]??0),0):0;
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
   <div className="growth-qada-list">{targets.map(({name,target})=><div className="growth-qada-row" key={name}>
    <div><strong>{name}</strong><label>Estimated missed prayers<input aria-label={'Estimated missed '+name+' prayers'} type="number" min="0" max="1000000" step="1" value={overrides[name]??''} placeholder={String(base)} onChange={e=>setOverrides(v=>({...v,[name]:e.target.value}))}/></label></div>
    <div className="growth-qada-progress"><span>{Math.min(target,done[name]??0).toLocaleString('en-GB')} / {target.toLocaleString('en-GB')} made up</span><progress value={Math.min(target,done[name]??0)} max={Math.max(1,target)}/><div className="action-row"><button type="button" onClick={()=>adjust(name,1,target)} disabled={(done[name]??0)>=target}>+ 1 completed</button><button type="button" className="secondary" onClick={()=>adjust(name,-1,target)} disabled={(done[name]??0)<=0}>Undo</button></div></div>
   </div>)}</div>
   <button type="button" className="secondary" onClick={()=>{if(window.confirm('Clear all saved Qada prayer progress on this device?'))setDone({})}}>Reset saved progress</button>
  </>:<Notice>Enter a valid period and exclusions, and use non-negative whole numbers for individual prayer targets.</Notice>}
  <Notice>Scholars differ on making up deliberately missed prayers, Witr and other circumstances. This is a private organisational aid, not a fatwa or an automatic determination of liability. Seek qualified guidance before setting your targets.</Notice>
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

export function KaffarahCalculator(){
 const [type,setType]=useState<'oath'|'ramadan'>('oath'),[oaths,setOaths]=useState('1'),[rate,setRate]=useState(''),[currency,setCurrency]=useState('GBP');
 const incidents=type==='oath'?intValue(oaths):1;
 const people=type==='oath'?10:60;
 const estimate=simpleEstimate(incidents,Number(rate),people);
 const valid=Number.isSafeInteger(incidents)&&incidents>=1&&incidents<=100000;
 return <div className="growth-tool">
  <p>Explore a <strong>conditional food-cost illustration</strong> for two different Kaffarah scenarios. This calculator cannot determine whether Kaffarah is due or which remedy applies.</p>
  <label>Scenario<select value={type} onChange={e=>setType(e.target.value as 'oath'|'ramadan')}><option value="oath">Broken oath (Kaffarah al-Yamin)</option><option value="ramadan">Ramadan fast violation — single case for review</option></select></label>
  {type==='oath'?<><p className="small">Quran 5:89 discusses feeding ten needy people or clothing them; if unable, fasting three days. The applicable details and whether cash substitution is permitted require local guidance.</p><label>Number of distinct oaths to review<input type="number" min="1" max="100000" step="1" value={oaths} onChange={e=>setOaths(e.target.value)}/></label></>:
   <Notice>Not every broken or missed Ramadan fast incurs Kaffarah. The conditions, order of remedies, and whether feeding 60 people is an applicable option differ by school and circumstances. This screen illustrates one hypothetical case only; consult a qualified scholar before relying on it.</Notice>}
  <div className="two"><label>Verified local cost to feed one eligible person<input type="number" min="0.01" step="any" inputMode="decimal" value={rate} onChange={e=>setRate(e.target.value)} placeholder="Enter local cost"/></label><Currency value={currency} onChange={setCurrency}/></div>
  {valid&&<div className="result"><span>People in this illustrative feeding scenario</span><strong>{(incidents*people).toLocaleString('en-GB')}</strong><small>{type==='oath'?'10 people per oath, if feeding applies':'60 people in one hypothetical case, only if feeding is an applicable remedy'}</small></div>}
  {estimate?<div className="result" role="status"><span>Conditional food-cost estimate — not an amount automatically owed</span><strong>{money(estimate.total,currency)}</strong><small>{estimate.units.toLocaleString('en-GB')} × {money(Number(rate),currency)} per person</small></div>:<p className="small">Enter a positive verified local cost for an illustration. No universal Kaffarah amount is assumed.</p>}
  <Notice>Kaffarah for oaths and Ramadan violations are different. Feeding, clothing, fasting and monetary substitution are not interchangeable in every case. This is not a payment instruction or religious ruling.</Notice>
  <p className="small">References: <a href="https://quran.com/5/89" target="_blank" rel="noopener noreferrer">Quran 5:89</a> (oaths) and <a href="https://sunnah.com/bukhari:1936" target="_blank" rel="noopener noreferrer">Sahih al-Bukhari 1936</a> (Ramadan).</p>
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
