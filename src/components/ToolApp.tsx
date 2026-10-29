import {useEffect,useState} from 'react';
import {GoldZakat,IslamicEvents,PrayerChart} from './NextTools';
import CitySearch from './CitySearch';
import {LaylatulQadrNights,FidyaCalculator,QadaPrayerCalculator,QurbaniShareCalculator,KaffarahCalculator,TawafSaiCounter} from './GrowthTools';
import FitranaCalculator from './FitranaCalculator';
import ZakatCalculator from './ZakatCalculator';
import {ExpansionTool} from './ExpansionTools';
import QiblaOrientation from './QiblaOrientation';
import QiblaDetails from './QiblaDetails';
import {qiblaContext} from '../lib/qiblaDetails.mjs';
import TahajjudCalculator from './TahajjudCalculator';
import FastingTimesPanel from './FastingTimesPanel';
import HijriConverter from './HijriConverter';
import QuranPlanner from './QuranPlanner';
import {ramadanDays,timetableCSV} from '../lib/ramadanHelpers.mjs';
import {makeRamadanIcs,validateSalahHistory,downloadText} from '../lib/personalTools.mjs';
import {differenceMinutes,differenceLabel,prayerWeekCSV} from '../lib/prayerKnowledge.mjs';
import {WhiteDaysCalendar,PrintableHijriCalendar,PrayerWidgetGenerator,UmrahPackingChecklist} from './BatchTools';
import {CalculationMethod,Coordinates,Madhab,PrayerTimes,Qibla,HighLatitudeRule,PolarCircleResolution} from 'adhan';
import {localISODate,nisabAmounts,parseAmount,finalThirdStart,hijriToGregorian} from '../lib/calculations.mjs';
const cities=[['Newcastle upon Tyne','Europe/London',54.9783,-1.6178],['London','Europe/London',51.5072,-0.1276],['Makkah','Asia/Riyadh',21.4225,39.8262],['Madinah','Asia/Riyadh',24.4672,39.6111],['New York','America/New_York',40.7128,-74.006],['Karachi','Asia/Karachi',24.8607,67.0011],['Lahore','Asia/Karachi',31.5204,74.3587],['Dubai','Asia/Dubai',25.2048,55.2708],['Kuala Lumpur','Asia/Kuala_Lumpur',3.139,101.6869],['Jakarta','Asia/Jakarta',-6.2088,106.8456],['Istanbul','Europe/Istanbul',41.0082,28.9784],['Toronto','America/Toronto',43.6532,-79.3832],['Sydney','Australia/Sydney',-33.8688,151.2093]] as const;
const labels=['Fajr','Sunrise','Dhuhr','Asr','Maghrib','Isha'] as const;
function fmt(d:Date,zone:string){return !(d instanceof Date)||Number.isNaN(d.getTime())?'—':new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:zone,hour12:false}).format(d)}
function dayAtZone(tz:string){const p=new Intl.DateTimeFormat('en-CA',{year:'numeric',month:'2-digit',day:'2-digit',timeZone:tz}).formatToParts(new Date());const f=(x:string)=>p.find(y=>y.type===x)?.value??'';return `${f('year')}-${f('month')}-${f('day')}`}
function date(s:string){const m=/^(\d{4})-(\d\d)-(\d\d)$/.exec(s);if(!m)return null;const d=new Date(+m[1],+m[2]-1,+m[3]);return d.getFullYear()===+m[1]&&d.getMonth()===+m[2]-1&&d.getDate()===+m[3]?d:null}
function islamic(d:Date){return new Intl.DateTimeFormat('en-GB-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(d)}
function Block({title,value}:{title:string,value:string|number}){return <div className="result"><span>{title}</span><strong>{value}</strong></div>}
function Field({label,children}:{label:string,children:React.ReactNode}){return <label>{label}{children}</label>}
function Prayer({kind}:{kind:string}){
const [city,setCity]=useState(1),[lat,setLat]=useState(''),[lon,setLon]=useState(''),[zone,setZone]=useState(''),[day,setDay]=useState(''),[method,setMethod]=useState('mwl'),[highLat,setHighLat]=useState('recommended'),[polar,setPolar]=useState('unresolved'),[hanafi,setHanafi]=useState(false),[start,setStart]=useState('2027-02-08'),[ramadanLength,setRamadanLength]=useState(30),[error,setError]=useState(''),[customLabel,setCustomLabel]=useState(''),[compareMethod,setCompareMethod]=useState('none'),[now,setNow]=useState(()=>Date.now());
useEffect(()=>{if(kind!=='fasting-times')return;const timer=window.setInterval(()=>setNow(Date.now()),30000);return()=>window.clearInterval(timer)},[kind]);
const [settingsReady,setSettingsReady]=useState(false);
 useEffect(()=>{try{const raw=JSON.parse(localStorage.getItem('sunnah-prayer-settings-v2')??'null');
 if(raw&&typeof raw==='object'){if(Number.isInteger(raw.city)&&raw.city>=0&&raw.city<cities.length)setCity(raw.city);
 if(typeof raw.lat==='string'&&raw.lat.length<30)setLat(raw.lat);
 if(typeof raw.lon==='string'&&raw.lon.length<30)setLon(raw.lon);
 if(typeof raw.zone==='string'&&raw.zone.length<80)setZone(raw.zone);
 if(['mwl','makkah','karachi','na','singapore','turkey','dubai','egypt','moon'].includes(raw.method))setMethod(raw.method);
 if(typeof raw.hanafi==='boolean')setHanafi(raw.hanafi);
 if(typeof raw.label==='string'&&raw.label.length<120)setCustomLabel(raw.label);}}catch{}setSettingsReady(true)},[]);
 useEffect(()=>{if(settingsReady)try{localStorage.setItem('sunnah-prayer-settings-v2',JSON.stringify({city,lat,lon,zone,method,hanafi,label:customLabel}))}catch{}},[settingsReady,city,lat,lon,zone,method,hanafi,customLabel]);
 const c=cities[city],latitude=lat===''?c[2]:Number(lat),longitude=lon===''?c[3]:Number(lon),tz=zone||c[1];
const params=(selectedMethod=method)=>{const m=selectedMethod==='makkah'?CalculationMethod.UmmAlQura():selectedMethod==='karachi'?CalculationMethod.Karachi():selectedMethod==='na'?CalculationMethod.NorthAmerica():selectedMethod==='singapore'?CalculationMethod.Singapore():selectedMethod==='turkey'?CalculationMethod.Turkey():selectedMethod==='dubai'?CalculationMethod.Dubai():selectedMethod==='egypt'?CalculationMethod.Egyptian():selectedMethod==='moon'?CalculationMethod.MoonsightingCommittee():CalculationMethod.MuslimWorldLeague();m.madhab=hanafi?Madhab.Hanafi:Madhab.Shafi;m.highLatitudeRule=highLat==='seventh'?HighLatitudeRule.SeventhOfTheNight:highLat==='middle'?HighLatitudeRule.MiddleOfTheNight:highLat==='angle'?HighLatitudeRule.TwilightAngle:HighLatitudeRule.recommended(new Coordinates(latitude,longitude));m.polarCircleResolution=polar==='nearest-day'?PolarCircleResolution.AqrabYaum:polar==='nearest-location'?PolarCircleResolution.AqrabBalad:PolarCircleResolution.Unresolved;return m};
const calculate=(d:Date,selectedMethod=method)=>new PrayerTimes(new Coordinates(latitude,longitude),d,params(selectedMethod));
const valid=Number.isFinite(latitude)&&Math.abs(latitude)<=90&&Number.isFinite(longitude)&&Math.abs(longitude)<=180;
let times:PrayerTimes|null=null,bearing:number|null=null,lastThird:Date|null=null,following:Date|null=null;
try{new Intl.DateTimeFormat('en',{timeZone:tz});if(!valid)throw Error('Invalid coordinates');const d=date(day||dayAtZone(tz));if(!d)throw Error('Invalid date');times=calculate(d);bearing=Qibla(new Coordinates(latitude,longitude));const next=new Date(d);next.setDate(d.getDate()+1);following=calculate(next).fajr;lastThird=finalThirdStart(times.maghrib,following)}catch{}

let compared:PrayerTimes|null=null;
if(kind==='prayer-times'&&times&&compareMethod!=='none'&&compareMethod!==method){
 try{const d=date(day||dayAtZone(tz));if(d)compared=calculate(d,compareMethod)}catch{}
}
const week=()=>{
 if(!times)return [];
 const base=date(day||dayAtZone(tz));if(!base)return [];
 return Array.from({length:7},(_,i)=>{
  const d=new Date(base.getFullYear(),base.getMonth(),base.getDate()+i);
  try{const t=calculate(d);return {date:[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-'),Fajr:fmt(t.fajr,tz),Sunrise:fmt(t.sunrise,tz),Dhuhr:fmt(t.dhuhr,tz),Asr:fmt(t.asr,tz),Maghrib:fmt(t.maghrib,tz),Isha:fmt(t.isha,tz)}}catch{return null}
 }).filter(x=>x!==null);
};
const exportWeek=()=>{
 const data=week();if(!data.length){setError('The weekly timetable is not available for these settings.');return}
 try{
  const csv=prayerWeekCSV(data,{location:customLabel||c[0],zone:tz,method,asr:hanafi?'Hanafi':'Standard'});
  downloadText('prayer-times-week-'+data[0].date+'.csv',csv,'text/csv;charset=utf-8');
  setError('');
 }catch{setError('Could not export the weekly timetable. Check your dates and location.')}
};
const locate=()=>{if(!navigator.geolocation){setError('Location is unavailable. Choose a city or enter coordinates instead.');return}navigator.geolocation.getCurrentPosition(pos=>{setLat(String(pos.coords.latitude));setLon(String(pos.coords.longitude));setZone(Intl.DateTimeFormat().resolvedOptions().timeZone);setCustomLabel('Detected location');setError('')},()=>setError('Location permission declined or unavailable. Enter coordinates manually.'),{timeout:12000,maximumAge:120000});};
const rows=kind==='ramadan-timetable'?(ramadanDays(start,ramadanLength)??[]).map(item=>{const d=date(item.iso);if(!d)return null;try{const t=calculate(d);return {day:item.day,date:item.iso,fajr:fmt(t.fajr,tz),maghrib:fmt(t.maghrib,tz)}}catch{return null}}).filter(x=>x!==null):[];
const exportRamadanIcs=()=>{
  const dates=ramadanDays(start,ramadanLength);
  if(!dates||!valid)return;
  try{
    new Intl.DateTimeFormat('en',{timeZone:tz});
    const items=dates.map(row=>{const d=date(row.iso);if(!d)throw new Error('Invalid day');const t=calculate(d);return {day:row.iso,fajr:t.fajr,maghrib:t.maghrib}});
    downloadText('ramadan-times-'+start+'.ics',makeRamadanIcs(items),'text/calendar;charset=utf-8');
    setError('');
  }catch{setError('Could not create calendar. Check your location and dates.')}
 };
 const exportTimetable=()=>{
 if(!rows.length)return;
 const csv=timetableCSV(rows);
 const url=URL.createObjectURL(new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8'}));
 const link=document.createElement('a');link.href=url;link.download='sunnah-tools-ramadan-'+start+'.csv';link.click();
 window.setTimeout(()=>URL.revokeObjectURL(url),3000);
};
return <div><p className="small">{customLabel?'Showing times for '+customLabel:'Example location: '+c[0]+'. Search for your own city before using these times.'}</p><CitySearch onSelect={chosen=>{setLat(String(chosen[3]));setLon(String(chosen[4]));setZone(chosen[5]);setCustomLabel(chosen[0]+', '+chosen[1]);setDay('');setMethod(({SA:'makkah',PK:'karachi',SG:'singapore',MY:'singapore',ID:'singapore',AE:'dubai',TR:'turkey',US:'na',CA:'na'} as Record<string,string>)[chosen[1]]||'mwl');setError('')}}/>{customLabel&&<p className="small" role="status">Selected: <strong>{customLabel}</strong> · {latitude.toFixed(4)}°, {longitude.toFixed(4)}° · {tz}</p>}<details className="settings"><summary>Or choose a popular city / enter coordinates</summary><div className="two"><Field label="Preset city"><select value={city} onChange={e=>{const i=+e.target.value;setCity(i);setLat('');setLon('');setZone('');setDay('');setCustomLabel('');setMethod(['mwl','mwl','makkah','makkah','na','karachi','karachi','dubai','singapore','singapore','turkey','na','mwl'][i])}}>{cities.map((c,i)=><option value={i} key={i}>{c[0]}</option>)}</select></Field><div><label>Or detect your position</label><button type="button" onClick={locate}>Use my location</button></div></div><p className="small">For other locations, enter coordinates and your location's timezone. The suggested prayer calculation method can be changed below to match your local mosque.</p><div className="two"><Field label="Latitude"><input placeholder={String(c[2])} value={lat} onChange={e=>setLat(e.target.value)}/></Field><Field label="Longitude"><input placeholder={String(c[3])} value={lon} onChange={e=>setLon(e.target.value)}/></Field></div><Field label="Timezone (IANA)"><input placeholder={c[1]} value={zone} onChange={e=>setZone(e.target.value)}/></Field>{error&&<p role="alert">{error}</p>}</details>
{kind!=='qibla-finder'&&<><div className="two"><Field label="Calculation convention"><select value={method} onChange={e=>setMethod(e.target.value)}><option value="mwl">Muslim World League</option><option value="makkah">Umm al-Qura</option><option value="karachi">Karachi</option><option value="na">ISNA North America</option><option value="singapore">Singapore / Malaysia / Indonesia</option><option value="turkey">Turkey</option><option value="dubai">Dubai</option><option value="egypt">Egyptian</option><option value="moon">Moonsighting Committee</option></select></Field><Field label="Asr school"><select value={hanafi?'hanafi':'standard'} onChange={e=>setHanafi(e.target.value==='hanafi')}><option value="standard">Standard</option><option value="hanafi">Hanafi</option></select></Field></div><details className="settings"><summary>High-latitude and polar calculation settings</summary><div className="two"><Field label="High latitude rule"><select value={highLat} onChange={e=>setHighLat(e.target.value)}><option value="recommended">Recommended for location</option><option value="seventh">Seventh of night</option><option value="middle">Middle of night</option><option value="angle">Twilight angle</option></select></Field><Field label="Polar circle fallback"><select value={polar} onChange={e=>setPolar(e.target.value)}><option value="unresolved">Unresolved (show unavailable)</option><option value="nearest-day">Nearest date with sunrise/sunset</option><option value="nearest-location">Nearest qualifying location</option></select></Field></div><p className="small">High-latitude conventions and polar fallback results need local scholarly confirmation.</p></details></>}
{kind==='fasting-times'&&<>
 <label className="fasting-date-select">Fasting timetable date
  <input type="date" value={day||dayAtZone(tz)} onChange={e=>setDay(e.target.value)}/>
 </label>
 <FastingTimesPanel selectedTimes={times} selectedISO={day||dayAtZone(tz)} todayISO={dayAtZone(tz)} zone={tz} method={method} location={customLabel||c[0]} now={now} calculate={calculate} resetDate={()=>setDay('')}/>
 </>}
{kind==='prayer-times'&&<><Field label="Date"><input type="date" value={day||dayAtZone(tz)} onChange={e=>setDay(e.target.value)}/></Field>{times?<div className="prayers">{labels.map(x=><div key={x}><span>{x}</span><strong>{fmt(times![x.toLowerCase() as Lowercase<typeof x>],tz)}</strong></div>)}</div>:<p>Could not calculate times. Check the location and timezone.</p>}
 {times&&<div className="prayer-method-compare"><label>Compare Fajr and Isha calculation methods
 <select value={compareMethod} onChange={e=>setCompareMethod(e.target.value)}>
  <option value="none">Do not compare</option>
  <option value="mwl">Muslim World League (18° / 17°)</option>
  <option value="karachi">Karachi (18° / 18°)</option>
  <option value="na">ISNA (15° / 15°)</option>
  <option value="egypt">Egyptian (19.5° / 17.5°)</option>
  <option value="makkah">Umm al-Qura (fixed Isha interval)</option>
 </select></label>
 {compareMethod!== 'none'&&compareMethod===method&&<p className="small">Select a different method to see a side-by-side comparison.</p>}
 {compared&&<div className="table-wrap"><table><thead><tr><th>Prayer</th><th>Selected method</th><th>Comparison</th><th>Difference</th></tr></thead><tbody>{(['fajr','isha'] as const).map(key=><tr key={key}><th scope="row">{key==='fajr'?'Fajr':'Isha'}</th><td>{fmt(times[key],tz)}</td><td>{fmt(compared[key],tz)}</td><td>{differenceLabel(differenceMinutes(times[key],compared[key]))}</td></tr>)}</tbody></table></div>}
 {compared&&<p className="small">Positive difference means the comparison method gives a later time. The same time under two methods can occur where a high-latitude adjustment limits twilight calculations. This comparison does not determine which method your mosque follows. Umm al-Qura's standard library preset may not include its Ramadan Isha adjustment.</p>}
 </div>}
 {times&&<details className="settings"><summary>Next 7 days</summary><div className="table-wrap"><table><thead><tr><th>Date</th>{labels.filter(x=>x!=='Sunrise').map(x=><th key={x}>{x}</th>)}</tr></thead><tbody>{Array.from({length:7},(_,i)=>{const base=date(day||dayAtZone(tz))!;const d=new Date(base.getFullYear(),base.getMonth(),base.getDate()+i);let t:PrayerTimes|null=null;try{t=calculate(d)}catch{}return <tr key={i}><td>{new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short'}).format(d)}</td>{labels.filter(x=>x!=='Sunrise').map(x=><td key={x}>{t?fmt(t[x.toLowerCase() as Lowercase<typeof x>],tz):'—'}</td>)}</tr>})}</tbody></table></div><p className="small">These are calculated start times, not local congregation times. The selected timezone accounts for daylight-saving changes.</p><div className="action-row"><button type="button" className="secondary" onClick={exportWeek}>Download 7-day CSV</button><button type="button" className="secondary" onClick={()=>window.print()}>Print timetable</button></div>{error&&<p role="status" className="small">{error}</p>}</details>}</>}
{kind==='qibla-finder'&&<><p className="small">Find true north on a map or calibrated compass, then turn clockwise by the bearing shown. Phone sensors may use magnetic north.</p><Block title="Qibla bearing clockwise from true north" value={bearing===null?'Check your location':qiblaContext(latitude,longitude,bearing)?.status==='ok'?bearing.toFixed(1)+'°':'Bearing undefined at these coordinates'}/>{bearing!==null&&qiblaContext(latitude,longitude,bearing)?.status==='ok'&&<div className="compass" role="img" aria-label={`Qibla is ${bearing.toFixed(1)} degrees clockwise from true north`}><span className="compass-n">N</span><span className="compass-arrow" style={{transform:`rotate(${bearing}deg)`}}>↑</span><span className="compass-s">S</span></div>}{bearing!==null&&<QiblaDetails bearing={bearing} latitude={latitude} longitude={longitude} locationLabel={customLabel||c[0]}/>}{bearing!==null&&qiblaContext(latitude,longitude,bearing)?.status==='ok'&&<QiblaOrientation bearing={bearing}/>}</>}
{kind==='tahajjud-time'&&<>{times&&lastThird&&following?<><Block title="Maghrib" value={fmt(times.maghrib,tz)}/><Block title="Beginning of the final third of night" value={fmt(lastThird,tz)}/><Block title="Following Fajr" value={fmt(following,tz)}/></>:<p>Check your location.</p>}</>}
{kind==='ramadan-timetable'&&<><div className="two"><Field label="Estimated first day of Ramadan (Gregorian)"><input type="date" value={start} onChange={e=>setStart(e.target.value)}/></Field><Field label="Timetable length"><select value={ramadanLength} onChange={e=>setRamadanLength(Number(e.target.value))}><option value={29}>29 days</option><option value={30}>30 days</option></select></Field></div><p className="small">The date and 29/30-day length are editable estimates. Verify your country's announcement before relying on the final calendar. Timezone: <strong>{tz}</strong>. Method: <strong>{method}</strong>.</p><div className="ramadan-print-heading"><h2>Ramadan timetable</h2><p>{customLabel||c[0]} · {tz} · {method} · {ramadanLength} days</p></div><div className="table-wrap"><table><thead><tr><th>Day</th><th>Date</th><th>Fajr</th><th>Maghrib</th></tr></thead><tbody>{rows.map(x=><tr key={x.day}><td>{x.day}</td><td>{x.date}</td><td>{x.fajr}</td><td>{x.maghrib}</td></tr>)}</tbody></table></div><div className="action-row print-hide"><button onClick={()=>window.print()}>Print / Save as PDF</button><button className="secondary" onClick={exportTimetable} disabled={!rows.length}>Download CSV</button><button className="secondary" type="button" onClick={exportRamadanIcs} disabled={!rows.length}>Download calendar (.ics)</button></div></>}
<p className="warn">These are calculated times, not mosque congregation times. Check local methodology, high-latitude conventions, and moon sighting before relying on a timetable.</p></div>
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
 <p className="warn">These values are based on the prices you enter. Check current prices and seek guidance on which Nisab threshold applies.</p></>;
}
function Hijri({age=false}:{age?:boolean}){
 const [value,setValue]=useState(()=>age?'2000-01-01':localISODate());
 const [direction,setDirection]=useState<'gregorian'|'hijri'>('gregorian'),[observationShift,setObservationShift]=useState(0);
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
 <Block title={age?'Completed Islamic lunar years':'Umm al-Qura Hijri date'} value={h?(age?(years===null?'Choose a past date':years+' years'):islamic(new Date(h.getTime()+observationShift*86400000))):'Choose a valid date'}/>
 {!age&&<><button className="secondary" type="button" onClick={()=>setValue(localISODate())}>Jump to today</button><Field label="Local moon-sighting adjustment (illustrative)"><select value={observationShift} onChange={e=>setObservationShift(Number(e.target.value))}><option value={0}>No adjustment — Umm al-Qura</option><option value={-1}>One day earlier</option><option value={1}>One day later</option></select></Field></>}
 </>:<><div className="two"><Field label="Hijri year (AH)"><input type="number" min="1300" max="1600" step="1" value={hy} onChange={e=>setHy(Number(e.target.value))}/></Field><Field label="Hijri month (1–12)"><input type="number" min="1" max="12" step="1" value={hm} onChange={e=>setHm(Number(e.target.value))}/></Field></div>
 <Field label="Hijri day (1–30)"><input type="number" min="1" max="30" step="1" value={hd} onChange={e=>setHd(Number(e.target.value))}/></Field>
 <Block title="Gregorian date" value={back?new Intl.DateTimeFormat('en-GB',{dateStyle:'long',timeZone:'UTC'}).format(back):'No matching date in supported range'}/>
 </>}
 <p className="small">The adjustment shows a neighbouring calendar date; it does not establish a confirmed sighting. Dates begin at sunset, so check your local announcement.  Hijri-to-Gregorian conversion supports 1300–1600 AH.</p>
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
 const [entries,setEntries]=useState<Record<string,string[]>>({}),[ready,setReady]=useState(false),[today,setToday]=useState(()=>localISODate()),[restoreStatus,setRestoreStatus]=useState('');
 useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem('sunnah-salah-history-v2')??'{}');if(saved&&typeof saved==='object'&&!Array.isArray(saved)){const records:Record<string,string[]>={};for(const [day,values] of Object.entries(saved)){if(/^\d{4}-\d{2}-\d{2}$/.test(day)&&Array.isArray(values)&&Object.keys(records).length<365)records[day]=values.filter((p:unknown)=>typeof p==='string'&&prayers.includes(p as typeof prayers[number])) as string[]}setEntries(records)}else{const older=JSON.parse(localStorage.getItem('sunnah-prayers')??'{}');if(older?.day===localISODate()&&Array.isArray(older.selected))setEntries({[older.day]:older.selected.filter((p:unknown)=>typeof p==='string'&&prayers.includes(p as typeof prayers[number]))})}}catch{}setReady(true)},[]);
 useEffect(()=>{if(ready)try{const cutoff=new Date();cutoff.setDate(cutoff.getDate()-90);const min=localISODate(cutoff);localStorage.setItem('sunnah-salah-history-v2',JSON.stringify(Object.fromEntries(Object.entries(entries).filter(([key])=>key>=min).slice(-120))))}catch{}},[entries,ready]);
 useEffect(()=>{const timer=window.setInterval(()=>{const d=localISODate();if(d!==today)setToday(d)},60000);return()=>window.clearInterval(timer)},[today]);
 const selected=entries[today]??[];
 const toggle=(prayer:string,on:boolean)=>setEntries(v=>({...v,[today]:on?[...(v[today]??[]).filter(p=>p!==prayer),prayer]:(v[today]??[]).filter(p=>p!==prayer)}));
 const past=Object.entries(entries).filter(([day])=>day!==today).sort(([a],[b])=>b.localeCompare(a)).slice(0,30);
 const exportCsv=()=>{const cells=[['Date',...prayers],...Object.entries(entries).sort(([a],[b])=>a.localeCompare(b)).map(([day,items])=>[day,...prayers.map(p=>items.includes(p)?'Yes':'')])];const blob=new Blob([cells.map(row=>row.join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='salah-history.csv';a.click();window.setTimeout(()=>URL.revokeObjectURL(url),1000)};
 const backupHistory=()=>downloadText('salah-history.json',JSON.stringify({version:1,entries},null,2));
 const restoreHistory=async(event:React.ChangeEvent<HTMLInputElement>)=>{
  const file=event.target.files?.[0];event.target.value='';if(!file)return;
  if(file.size>60000){setRestoreStatus('Salah history backup is too large.');return}
  try{
   const parsed=validateSalahHistory(JSON.parse(await file.text()));
   if(!parsed){setRestoreStatus('This is not a valid Salah history backup.');return}
   if(!window.confirm('Replace the Salah history saved on this device?'))return;
   const cutoff=new Date();cutoff.setDate(cutoff.getDate()-90);
   const min=localISODate(cutoff),max=localISODate();
   setEntries(Object.fromEntries(Object.entries(parsed.entries).filter(([date])=>date>=min&&date<=max)));
   setRestoreStatus('History restored (latest 90 days).');
  }catch{setRestoreStatus('Could not read this backup.')}
 };
 return <><p>Today: <strong>{today}</strong></p><div className="tracker-checks">{prayers.map(prayer=><label className="check" key={prayer}><input type="checkbox" checked={selected.includes(prayer)} onChange={e=>toggle(prayer,e.target.checked)}/>{prayer}</label>)}</div>
 <Block title="Prayers ticked today" value={selected.length+' / 5'}/>
 <details className="settings"><summary>Previous days ({past.length})</summary>{past.length?<div className="table-wrap"><table><thead><tr><th>Date</th><th>Recorded prayers</th></tr></thead><tbody>{past.map(([day,items])=><tr key={day}><td>{day}</td><td>{items.join(', ')||'None ticked'}</td></tr>)}</tbody></table></div>:<p>No previous days recorded yet.</p>}</details>
 <div className="action-row"><button type="button" className="secondary" onClick={exportCsv} disabled={!Object.keys(entries).length}>Download prayer history (CSV)</button><button type="button" className="secondary" onClick={backupHistory} disabled={!Object.keys(entries).length}>Back up history (JSON)</button><label>Restore history<input type="file" accept=".json,application/json" aria-label="Restore Salah history JSON" onChange={restoreHistory}/></label></div>{restoreStatus&&<p role="status" className="small">{restoreStatus}</p>}
 <p className="small">A private checklist for personal reflection; not a measure of worship. Entries are saved only on this device for up to 90 days. Export before clearing browser data.</p></>;
}

export default function ToolApp({slug}:{slug:string}){
 if(["prayer-rakats-chart","daily-adhkar","halal-additives-checker","zakat-anniversary-calculator","dhul-hijjah-planner","travel-prayer-guide","quran-juz-finder","zakat-stocks-crypto","hifz-tracker"].includes(slug))return <ExpansionTool slug={slug}/>;
 if(slug==='laylatul-qadr-nights')return <LaylatulQadrNights/>;
 if(slug==='fidya-calculator')return <FidyaCalculator/>;
 if(slug==='qada-prayer-calculator')return <QadaPrayerCalculator/>;
 if(slug==='qurbani-share-calculator')return <QurbaniShareCalculator/>;
 if(slug==='kaffarah-calculator')return <KaffarahCalculator/>;
 if(slug==='tawaf-sai-counter')return <TawafSaiCounter/>;
 if(slug==='tahajjud-time')return <TahajjudCalculator/>;
 if(['prayer-times','qibla-finder','ramadan-timetable','fasting-times'].includes(slug))return <Prayer kind={slug}/>;
 if(slug==='white-days-calendar')return <WhiteDaysCalendar/>;
 if(slug==='printable-hijri-calendar')return <PrintableHijriCalendar/>;
 if(slug==='prayer-times-widget')return <PrayerWidgetGenerator/>;
 if(slug==='umrah-packing-checklist')return <UmrahPackingChecklist/>;
 if(slug==='zakat-calculator')return <ZakatCalculator/>;
 if(slug==='fitrana-calculator')return <FitranaCalculator/>;
 if(slug==='gold-zakat-calculator')return <GoldZakat/>;
 if(slug==='islamic-events-calendar')return <IslamicEvents/>;
 if(slug==='printable-prayer-chart')return <PrayerChart/>;
 if(slug==='nisab-calculator')return <Nisab/>;
 if(slug==='hijri-converter')return <HijriConverter/>;
 if(slug==='islamic-age')return <Hijri age/>;
 if(slug==='tasbih-counter')return <Counter/>;
 if(slug==='quran-planner')return <QuranPlanner/>;
 if(slug==='ramadan-countdown')return <RamadanCountdown/>;
 if(slug==='fasting-tracker')return <FastingTracker/>;
 if(slug==='salah-tracker')return <SalahTracker/>;
 return <p>Tool unavailable.</p>
}
