import {useEffect,useState} from 'react';
import {GoldZakat,IslamicEvents,PrayerChart} from './NextTools';
import CitySearch from './CitySearch';
import {CalculationMethod,Coordinates,Madhab,PrayerTimes,Qibla,HighLatitudeRule,PolarCircleResolution} from 'adhan';
import {localISODate,nisabAmounts,parseAmount,zakatEstimate,finalThirdStart,readingPlan,hijriToGregorian} from '../lib/calculations.mjs';
const cities=[['Newcastle upon Tyne','Europe/London',54.9783,-1.6178],['London','Europe/London',51.5072,-0.1276],['Makkah','Asia/Riyadh',21.4225,39.8262],['Madinah','Asia/Riyadh',24.4672,39.6111],['New York','America/New_York',40.7128,-74.006],['Karachi','Asia/Karachi',24.8607,67.0011],['Lahore','Asia/Karachi',31.5204,74.3587],['Dubai','Asia/Dubai',25.2048,55.2708],['Kuala Lumpur','Asia/Kuala_Lumpur',3.139,101.6869],['Jakarta','Asia/Jakarta',-6.2088,106.8456],['Istanbul','Europe/Istanbul',41.0082,28.9784],['Toronto','America/Toronto',43.6532,-79.3832],['Sydney','Australia/Sydney',-33.8688,151.2093]] as const;
const labels=['Fajr','Sunrise','Dhuhr','Asr','Maghrib','Isha'] as const;
function fmt(d:Date,zone:string){return !(d instanceof Date)||Number.isNaN(d.getTime())?'—':new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:zone,hour12:false}).format(d)}
function dayAtZone(tz:string){const p=new Intl.DateTimeFormat('en-CA',{year:'numeric',month:'2-digit',day:'2-digit',timeZone:tz}).formatToParts(new Date());const f=(x:string)=>p.find(y=>y.type===x)?.value??'';return `${f('year')}-${f('month')}-${f('day')}`}
function date(s:string){const m=/^(\d{4})-(\d\d)-(\d\d)$/.exec(s);if(!m)return null;const d=new Date(+m[1],+m[2]-1,+m[3]);return d.getFullYear()===+m[1]&&d.getMonth()===+m[2]-1&&d.getDate()===+m[3]?d:null}
function islamic(d:Date){return new Intl.DateTimeFormat('en-GB-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(d)}
function Block({title,value}:{title:string,value:string|number}){return <div className="result"><span>{title}</span><strong>{value}</strong></div>}
function Field({label,children}:{label:string,children:React.ReactNode}){return <label>{label}{children}</label>}
function Prayer({kind}:{kind:string}){
const [city,setCity]=useState(0),[lat,setLat]=useState(''),[lon,setLon]=useState(''),[zone,setZone]=useState(''),[day,setDay]=useState(''),[method,setMethod]=useState('mwl'),[highLat,setHighLat]=useState('recommended'),[polar,setPolar]=useState('unresolved'),[hanafi,setHanafi]=useState(false),[start,setStart]=useState('2027-02-08'),[error,setError]=useState(''),[customLabel,setCustomLabel]=useState(''),[now,setNow]=useState(()=>Date.now());
useEffect(()=>{if(kind!=='fasting-times')return;const timer=window.setInterval(()=>setNow(Date.now()),30000);return()=>window.clearInterval(timer)},[kind]);
const c=cities[city],latitude=lat===''?c[2]:Number(lat),longitude=lon===''?c[3]:Number(lon),tz=zone||c[1];
const params=()=>{const m=method==='makkah'?CalculationMethod.UmmAlQura():method==='karachi'?CalculationMethod.Karachi():method==='na'?CalculationMethod.NorthAmerica():method==='singapore'?CalculationMethod.Singapore():method==='turkey'?CalculationMethod.Turkey():method==='dubai'?CalculationMethod.Dubai():method==='egypt'?CalculationMethod.Egyptian():method==='moon'?CalculationMethod.MoonsightingCommittee():CalculationMethod.MuslimWorldLeague();m.madhab=hanafi?Madhab.Hanafi:Madhab.Shafi;m.highLatitudeRule=highLat==='seventh'?HighLatitudeRule.SeventhOfTheNight:highLat==='middle'?HighLatitudeRule.MiddleOfTheNight:highLat==='angle'?HighLatitudeRule.TwilightAngle:HighLatitudeRule.recommended(new Coordinates(latitude,longitude));m.polarCircleResolution=polar==='nearest-day'?PolarCircleResolution.AqrabYaum:polar==='nearest-location'?PolarCircleResolution.AqrabBalad:PolarCircleResolution.Unresolved;return m};
const calculate=(d:Date)=>new PrayerTimes(new Coordinates(latitude,longitude),d,params());
const valid=Number.isFinite(latitude)&&Math.abs(latitude)<=90&&Number.isFinite(longitude)&&Math.abs(longitude)<=180;
let times:PrayerTimes|null=null,bearing:number|null=null,lastThird:Date|null=null,following:Date|null=null;
try{new Intl.DateTimeFormat('en',{timeZone:tz});if(!valid)throw Error('Invalid coordinates');const d=date(day||dayAtZone(tz));if(!d)throw Error('Invalid date');times=calculate(d);bearing=Qibla(new Coordinates(latitude,longitude));const next=new Date(d);next.setDate(d.getDate()+1);following=calculate(next).fajr;lastThird=finalThirdStart(times.maghrib,following)}catch{}
const locate=()=>navigator.geolocation?.getCurrentPosition(pos=>{setLat(String(pos.coords.latitude));setLon(String(pos.coords.longitude));setZone(Intl.DateTimeFormat().resolvedOptions().timeZone);setCustomLabel('Detected location');setError('')},()=>setError('Location permission declined or unavailable. Enter coordinates manually.'));
const rows=Array.from({length:30},(_,i)=>{const d=date(start);if(!d)return null;d.setDate(d.getDate()+i);try{const t=calculate(d);return {day:i+1,date:d.toLocaleDateString('en-GB'),fajr:fmt(t.fajr,tz),maghrib:fmt(t.maghrib,tz)}}catch{return null}}).filter(x=>x!==null);
return <div><CitySearch onSelect={chosen=>{setLat(String(chosen[3]));setLon(String(chosen[4]));setZone(chosen[5]);setCustomLabel(chosen[0]+', '+chosen[1]);setDay('');setError('')}}/>{customLabel&&<p className="small" role="status">Selected: <strong>{customLabel}</strong> · {latitude.toFixed(4)}°, {longitude.toFixed(4)}° · {tz}</p>}<details className="settings"><summary>Or choose a popular city / enter coordinates</summary><div className="two"><Field label="Preset city"><select value={city} onChange={e=>{const i=+e.target.value;setCity(i);setLat('');setLon('');setZone('');setDay('');setCustomLabel('');setMethod(['mwl','mwl','makkah','makkah','na','karachi','karachi','dubai','singapore','singapore','turkey','na','mwl'][i])}}>{cities.map((c,i)=><option value={i} key={i}>{c[0]}</option>)}</select></Field><div><label>Or detect your position</label><button type="button" onClick={locate}>Use my location</button></div></div><p className="small">Worldwide locations supported through manual coordinates and timezone.</p><div className="two"><Field label="Latitude"><input placeholder={String(c[2])} value={lat} onChange={e=>setLat(e.target.value)}/></Field><Field label="Longitude"><input placeholder={String(c[3])} value={lon} onChange={e=>setLon(e.target.value)}/></Field></div><Field label="Timezone (IANA)"><input placeholder={c[1]} value={zone} onChange={e=>setZone(e.target.value)}/></Field>{error&&<p role="alert">{error}</p>}</details>
{kind!=='qibla-finder'&&<><div className="two"><Field label="Calculation convention"><select value={method} onChange={e=>setMethod(e.target.value)}><option value="mwl">Muslim World League</option><option value="makkah">Umm al-Qura</option><option value="karachi">Karachi</option><option value="na">ISNA North America</option><option value="singapore">Singapore / Malaysia / Indonesia</option><option value="turkey">Turkey</option><option value="dubai">Dubai</option><option value="egypt">Egyptian</option><option value="moon">Moonsighting Committee</option></select></Field><Field label="Asr school"><select value={hanafi?'hanafi':'standard'} onChange={e=>setHanafi(e.target.value==='hanafi')}><option value="standard">Standard</option><option value="hanafi">Hanafi</option></select></Field></div><details className="settings"><summary>High-latitude and polar calculation settings</summary><div className="two"><Field label="High latitude rule"><select value={highLat} onChange={e=>setHighLat(e.target.value)}><option value="recommended">Recommended for location</option><option value="seventh">Seventh of night</option><option value="middle">Middle of night</option><option value="angle">Twilight angle</option></select></Field><Field label="Polar circle fallback"><select value={polar} onChange={e=>setPolar(e.target.value)}><option value="unresolved">Unresolved (show unavailable)</option><option value="nearest-day">Nearest date with sunrise/sunset</option><option value="nearest-location">Nearest qualifying location</option></select></Field></div><p className="small">High-latitude conventions and polar fallback results need local scholarly confirmation.</p></details></>}
{kind==='fasting-times'&&<>{times?<><div className="two"><Block title="Suhoor cutoff (calculated Fajr)" value={fmt(times.fajr,tz)}/><Block title="Iftar time (calculated Maghrib)" value={fmt(times.maghrib,tz)}/></div>{(()=>{const tomorrowDate=date(dayAtZone(tz));if(!tomorrowDate)return null;tomorrowDate.setDate(tomorrowDate.getDate()+1);const nextTimes=calculate(tomorrowDate);const events=[{name:'Fajr (suhoor cutoff)',at:times!.fajr},{name:'Maghrib (iftar)',at:times!.maghrib},{name:'Next Fajr',at:nextTimes.fajr},{name:'Next Maghrib',at:nextTimes.maghrib}].filter(x=>x.at.getTime()>now).sort((a,b)=>a.at.getTime()-b.at.getTime());const next=events[0];if(!next)return null;const diff=Math.max(0,next.at.getTime()-now),hours=Math.floor(diff/3600000),minutes=Math.floor(diff%3600000/60000);return <Block title={'Countdown to '+next.name} value={hours+'h '+minutes+'m'}/>})()}</>:<p className="warn">Could not calculate times. Check coordinates and timezone.</p>}<p className="small">Automatically updates while this page is open. Dates shown are for the selected location's current day.</p></>}
{kind==='prayer-times'&&<><Field label="Date"><input type="date" value={day||dayAtZone(tz)} onChange={e=>setDay(e.target.value)}/></Field>{times?<div className="prayers">{labels.map(x=><div key={x}><span>{x}</span><strong>{fmt(times![x.toLowerCase() as Lowercase<typeof x>],tz)}</strong></div>)}</div>:<p>Could not calculate times. Check the location and timezone.</p>}</>}
{kind==='qibla-finder'&&<><Block title="Qibla bearing clockwise from true north" value={bearing===null?'Check your location':bearing.toFixed(1)+'°'}/>{bearing!==null&&<div className="compass" role="img" aria-label={`Qibla is ${bearing.toFixed(1)} degrees clockwise from true north`}><span className="compass-n">N</span><span className="compass-arrow" style={{transform:`rotate(${bearing}deg)`}}>↑</span><span className="compass-s">S</span></div>}</>}
{kind==='tahajjud-time'&&<>{times&&lastThird&&following?<><Block title="Maghrib" value={fmt(times.maghrib,tz)}/><Block title="Beginning of the final third of night" value={fmt(lastThird,tz)}/><Block title="Following Fajr" value={fmt(following,tz)}/></>:<p>Check your location.</p>}</>}
{kind==='ramadan-timetable'&&<><Field label="Estimated first day of Ramadan (Gregorian)"><input type="date" value={start} onChange={e=>setStart(e.target.value)}/></Field><div className="table-wrap"><table><thead><tr><th>Day</th><th>Date</th><th>Fajr</th><th>Maghrib</th></tr></thead><tbody>{rows.map(x=><tr key={x.day}><td>{x.day}</td><td>{x.date}</td><td>{x.fajr}</td><td>{x.maghrib}</td></tr>)}</tbody></table></div><button className="print-hide" onClick={()=>window.print()}>Print / Save as PDF</button></>}
<p className="warn">These are calculated times, not mosque congregation times. Check local methodology, high-latitude conventions, and moon sighting before relying on a timetable.</p></div>
}
function Zakat(){
 const keys=['Cash and savings','Gold weight (grams)','Silver weight (grams)','Gold market price per gram','Silver market price per gram','Eligible investments','Business/trading stock','Other eligible assets','Deductible immediate liabilities'];
 const [v,setV]=useState<string[]>(Array(9).fill('')),[metal,setMetal]=useState<'gold'|'silver'>('silver'),[currency,setCurrency]=useState('GBP'),[hawl,setHawl]=useState(false);
 const a=v.map(parseAmount),valid=a.every(Number.isFinite);
 const assets=a[0]+a[1]*a[3]+a[2]*a[4]+a[5]+a[6]+a[7];
 const nisab=nisabAmounts(a[3],a[4]);
 const requiredPrice=metal==='gold'?a[3]:a[4];
 const result=valid&&requiredPrice>0?zakatEstimate({assets,debts:a[8],threshold:metal==='gold'?nisab.gold:nisab.silver}):null;
 const money=(v:number)=>new Intl.NumberFormat('en-GB',{style:'currency',currency,maximumFractionDigits:2}).format(v);
 return <>
 <div className="two"><Field label="Currency"><select value={currency} onChange={e=>setCurrency(e.target.value)}>{['GBP','USD','EUR','PKR','SAR','AED','CAD','AUD','INR'].map(x=><option key={x}>{x}</option>)}</select></Field>
 <Field label="Nisab comparison"><select value={metal} onChange={e=>setMetal(e.target.value as 'gold'|'silver')}><option value="silver">Silver benchmark (612.36g)</option><option value="gold">Gold benchmark (87.48g)</option></select></Field></div>
 <p className="small">Enter the current metal price per gram yourself, in your chosen currency. This tool does not fetch live commodity prices.</p>
 <div className="two">{keys.map((x,i)=><Field label={x} key={x}><input type="number" inputMode="decimal" min="0" step="any" value={v[i]} onChange={e=>setV(v.map((y,j)=>j===i?e.target.value:y))} placeholder={i===3||i===4?'Required for Nisab calculation':'0'} /></Field>)}</div>
 <label className="check"><input type="checkbox" checked={hawl} onChange={e=>setHawl(e.target.checked)}/> I have checked the applicable lunar-year (hawl) requirement for my circumstances.</label>
 {result?<><div className="prayers"><div>Assets<strong>{money(assets)}</strong></div><div>After liabilities<strong>{money(result.net)}</strong></div><div>Selected Nisab<strong>{money(result.threshold)}</strong></div></div>
 <Block title="Estimated Zakat at 2.5%" value={result.eligible?money(result.amount):money(0)}/>
 {!result.eligible&&<p className="small">Your entered net assets are below the selected Nisab benchmark.</p>}
 {!hawl&&<p className="warn">Hawl and eligibility are not verified. This figure is only a conditional estimate, not a determination of what you owe.</p>}</>:<p className="warn">Enter valid non-negative amounts and a positive price for the selected Nisab metal before an estimate can be shown.</p>}
 <p className="small">A calculator cannot decide which assets, investments, jewellery and debts qualify under every school of Islamic law. Check specific guidance before paying.</p>
 </>;
}
function Nisab(){
 const [gold,setGold]=useState(''),[silver,setSilver]=useState(''),[currency,setCurrency]=useState('GBP');
 const gp=parseAmount(gold),sp=parseAmount(silver),valid=Number.isFinite(gp)&&Number.isFinite(sp);
 const money=(n:number)=>new Intl.NumberFormat('en-GB',{style:'currency',currency,maximumFractionDigits:2}).format(n);
 const v=nisabAmounts(gp,sp);
 return <><p>Type verified gold and silver prices per gram in the <strong>same currency</strong>.</p>
 <Field label="Currency"><select value={currency} onChange={e=>setCurrency(e.target.value)}>{['GBP','USD','EUR','PKR','SAR','AED','CAD','AUD','INR'].map(x=><option key={x}>{x}</option>)}</select></Field>
 <div className="two"><Field label="24k gold price / gram"><input type="number" inputMode="decimal" min="0" step="any" placeholder="Enter current price" value={gold} onChange={e=>setGold(e.target.value)}/></Field><Field label="Silver price / gram"><input type="number" inputMode="decimal" min="0" step="any" placeholder="Enter current price" value={silver} onChange={e=>setSilver(e.target.value)}/></Field></div>
 {valid?<div className="two"><Block title="Gold Nisab · 87.48 g" value={gp>0?money(v.gold):'Enter gold price'}/><Block title="Silver Nisab · 612.36 g" value={sp>0?money(v.silver):'Enter silver price'}/></div>:<p className="warn">Prices must be non-negative numbers.</p>}
 <p className="warn">These are thresholds, not a Zakat eligibility ruling. No live price feed is connected; verify current prices independently.</p></>;
}
function Hijri({age=false}:{age?:boolean}){
 const [value,setValue]=useState(()=>age?'2000-01-01':localISODate());
 const [direction,setDirection]=useState<'gregorian'|'hijri'>('gregorian');
 const [hy,setHy]=useState(1448),[hm,setHm]=useState(1),[hd,setHd]=useState(1);
 const d=date(value),h=d?new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate(),12)):null;
 let years:number|null=null;
 if(h){const opts={year:'numeric',month:'numeric',day:'numeric',timeZone:'UTC'} as const;
 const parts=(x:Date)=>{const p=new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura',{...opts}).formatToParts(x);return ['year','month','day'].map(t=>Number(p.find(z=>z.type===t)?.value))};
 const [by,bm,bd]=parts(h),[ty,tm,td]=parts(new Date());
 years=ty-by-(tm<bm||(tm===bm&&td<bd)?1:0);
 if(h>new Date())years=null;
 }
 const back=direction==='hijri'&&!age?hijriToGregorian(hy,hm,hd):null;
 return <>
 {!age&&<Field label="Conversion direction"><select value={direction} onChange={e=>setDirection(e.target.value as 'gregorian'|'hijri')}><option value="gregorian">Gregorian → Hijri</option><option value="hijri">Hijri → Gregorian</option></select></Field>}
 {(age||direction==='gregorian')?<><Field label={age?'Gregorian date of birth':'Gregorian date'}><input type="date" value={value} onChange={e=>setValue(e.target.value)}/></Field>
 <Block title={age?'Completed Islamic lunar years':'Umm al-Qura Hijri date'} value={h?(age?(years===null?'Choose a past date':years+' years'):islamic(h)):'Choose a valid date'}/>
 {!age&&<button className="secondary" type="button" onClick={()=>setValue(localISODate())}>Jump to today</button>}
 </>:<><div className="two"><Field label="Hijri year (AH)"><input type="number" min="1300" max="1600" step="1" value={hy} onChange={e=>setHy(Number(e.target.value))}/></Field><Field label="Hijri month (1–12)"><input type="number" min="1" max="12" step="1" value={hm} onChange={e=>setHm(Number(e.target.value))}/></Field></div>
 <Field label="Hijri day (1–30)"><input type="number" min="1" max="30" step="1" value={hd} onChange={e=>setHd(Number(e.target.value))}/></Field>
 <Block title="Gregorian date" value={back?new Intl.DateTimeFormat('en-GB',{dateStyle:'long',timeZone:'UTC'}).format(back):'No matching date in supported range'}/>
 </>}
 <p className="small">The Gregorian input defaults to today on your device. Calculated Umm al-Qura dates may differ from locally observed lunar months. Reverse conversion supports Hijri years 1300–1600 AH.</p>
 </>;
}
function Counter(){
 const [n,setN]=useState(0),[target,setTarget]=useState(33),[ready,setReady]=useState(false);
 useEffect(()=>{try{const x=Number(localStorage.getItem('sunnah-count'));if(Number.isSafeInteger(x)&&x>=0)setN(x)}catch{}setReady(true)},[]);
 useEffect(()=>{if(ready){try{localStorage.setItem('sunnah-count',String(n))}catch{}}},[n,ready]);
 useEffect(()=>{function press(e:KeyboardEvent){if(e.code==='Space'&&e.target instanceof HTMLElement&&!['INPUT','BUTTON','SELECT','TEXTAREA'].includes(e.target.tagName)){e.preventDefault();setN(v=>v+1)}}window.addEventListener('keydown',press);return()=>window.removeEventListener('keydown',press)},[]);
 return <><Block title="Your dhikr count" value={n}/><div className="two"><Field label="Optional target"><select value={target} onChange={e=>setTarget(+e.target.value)}><option value={33}>33 repetitions</option><option value={99}>99 repetitions</option><option value={100}>100 repetitions</option><option value={1000}>1000 repetitions</option></select></Field><div><label>Progress</label><progress value={Math.min(n,target)} max={target}/><p className="small">{Math.min(n,target)} of {target}</p></div></div>
 <div className="action-row"><button onClick={()=>setN(v=>v+1)}>+ Count</button><button className="secondary" onClick={()=>{if(window.confirm('Reset the current count?'))setN(0)}}>Reset</button></div>
 <p className="small">Press the Space key when not focused on a control. Your tally is saved in this browser.</p></>;
}
function Quran(){
 const [p,setP]=useState(604),[days,setDays]=useState(30),[done,setDone]=useState(0);
 const plan=readingPlan(p,done,days);
 return <><div className="two"><Field label="Pages in your Mushaf"><input type="number" min="1" step="1" value={p} onChange={e=>setP(e.target.value===''?0:Number(e.target.value))}/></Field>
 <Field label="Days remaining"><input type="number" min="1" step="1" value={days} onChange={e=>setDays(e.target.value===''?0:Number(e.target.value))}/></Field></div>
 <Field label="Pages already read"><input type="number" min="0" step="1" value={done} onChange={e=>setDone(e.target.value===''?0:Number(e.target.value))}/></Field>
 {plan?<><div className="prayers"><div>Pages left<strong>{plan.remaining}</strong></div><div>Pages per day<strong>{plan.perDay}</strong></div><div>Pages per prayer<strong>{plan.perPrayer}</strong></div></div><label>Reading progress · {plan.percent}%</label><progress max={p} value={done}/></>:<p className="warn">Enter positive whole-number page and day totals, with completed pages no greater than the total.</p>}
 <p className="small">604 pages is a common Mushaf layout. Change it to match your edition.</p></>;
}
function RamadanCountdown(){
 const [target,setTarget]=useState('2027-02-08'),[now,setNow]=useState(()=>Date.now());
 useEffect(()=>{const id=window.setInterval(()=>setNow(Date.now()),60000);return()=>window.clearInterval(id)},[]);
 const dateTime=date(target);const targetMs=dateTime?.getTime()??NaN;
 const ms=targetMs-now,valid=Number.isFinite(targetMs);
 const d=Math.max(0,Math.ceil(ms/86400000));
 return <><Field label="Estimated first day of Ramadan"><input type="date" value={target} onChange={e=>setTarget(e.target.value)}/></Field>
 {valid?<Block title="Days until the estimated start" value={ms>0?d:'Date reached or passed'}/>:<p className="warn">Choose a valid Gregorian date.</p>}
 <p className="warn">This is an editable estimate, not a moon-sighting announcement. Ramadan begins when confirmed by your local religious authority.</p></>;
}
function FastingTracker(){
 const [total,setTotal]=useState(0),[done,setDone]=useState(0),[ready,setReady]=useState(false);
 useEffect(()=>{try{const v=JSON.parse(localStorage.getItem('sunnah-fasts')??'{}');if(Number.isSafeInteger(v.total)&&v.total>=0)setTotal(v.total);if(Number.isSafeInteger(v.done)&&v.done>=0)setDone(v.done)}catch{}setReady(true)},[]);
 useEffect(()=>{if(ready){try{localStorage.setItem('sunnah-fasts',JSON.stringify({total,done}))}catch{}}},[total,done,ready]);
 return <><Field label="Fasting days you intend to complete"><input type="number" min="0" step="1" value={total} onChange={e=>{const n=Number(e.target.value);if(Number.isSafeInteger(n)&&n>=0){setTotal(n);setDone(d=>Math.min(d,n))}}}/></Field>
 <div className="two"><Block title="Completed" value={done}/><Block title="Remaining" value={Math.max(0,total-done)}/></div>
 <div className="action-row"><button disabled={done>=total} onClick={()=>setDone(v=>Math.min(total,v+1))}>Mark one fast completed</button><button className="secondary" disabled={done===0} onClick={()=>setDone(v=>Math.max(0,v-1))}>Undo</button></div><progress value={done} max={Math.max(1,total)}/><p className="small">Stored only on this device. This tool does not determine how many make-up fasts you owe.</p></>;
}
function SalahTracker(){
 const prayers=['Fajr','Dhuhr','Asr','Maghrib','Isha'] as const;
 const [selected,setSelected]=useState<string[]>([]),[ready,setReady]=useState(false),[today,setToday]=useState(()=>localISODate());
 useEffect(()=>{try{const p=JSON.parse(localStorage.getItem('sunnah-prayers')??'{}');if(p.day===localISODate()&&Array.isArray(p.selected))setSelected(p.selected.filter((x:unknown)=>typeof x==='string'&&prayers.includes(x as typeof prayers[number])))}catch{}setReady(true)},[]);
 useEffect(()=>{if(ready){try{localStorage.setItem('sunnah-prayers',JSON.stringify({day:today,selected}))}catch{}}},[ready,selected,today]);
 useEffect(()=>{const t=window.setInterval(()=>{const day=localISODate();if(day!==today){setToday(day);setSelected([])}},60000);return()=>window.clearInterval(t)},[today]);
 return <><p>Today: <strong>{today}</strong></p><div className="tracker-checks">{prayers.map(prayer=><label className="check" key={prayer}><input type="checkbox" checked={selected.includes(prayer)} onChange={e=>setSelected(v=>e.target.checked?[...v,prayer]:v.filter(x=>x!==prayer))}/>{prayer}</label>)}</div>
 <Block title="Prayers ticked today" value={`${selected.length} / 5`}/>
 <p className="small">Private, device-only checklist. It resets when your local calendar day changes.</p></>;
}

export default function ToolApp({slug}:{slug:string}){
 if(['prayer-times','qibla-finder','tahajjud-time','ramadan-timetable','fasting-times'].includes(slug))return <Prayer kind={slug}/>;
 if(slug==='zakat-calculator')return <Zakat/>;
 if(slug==='gold-zakat-calculator')return <GoldZakat/>;
 if(slug==='islamic-events-calendar')return <IslamicEvents/>;
 if(slug==='printable-prayer-chart')return <PrayerChart/>;
 if(slug==='nisab-calculator')return <Nisab/>;
 if(slug==='hijri-converter')return <Hijri/>;
 if(slug==='islamic-age')return <Hijri age/>;
 if(slug==='tasbih-counter')return <Counter/>;
 if(slug==='quran-planner')return <Quran/>;
 if(slug==='ramadan-countdown')return <RamadanCountdown/>;
 if(slug==='fasting-tracker')return <FastingTracker/>;
 if(slug==='salah-tracker')return <SalahTracker/>;
 return <p>Tool unavailable.</p>
}
