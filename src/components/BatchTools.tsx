import {useEffect,useMemo,useState} from 'react';
import CitySearch from './CitySearch';
import {adjacentMonth,hijriMonth,hijriParts,whiteDaysFrom,HIJRI_MONTHS} from '../lib/hijriCalendars.mjs';

const readable=(iso:string)=>new Intl.DateTimeFormat('en-GB',{weekday:'short',day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(iso+'T12:00:00Z'));
const todayHijri=()=>hijriParts(new Date())??{year:1448,month:4,day:1};
const safeStorage=(key:string):string[]=>{try{const a=JSON.parse(localStorage.getItem(key)??'[]');return Array.isArray(a)?a.filter((x:unknown)=>typeof x==='string'):[]}catch{return []}};
function downloadICS(days:{day:number;iso:string;fastingStatus:string}[]){
 const allowed=days.filter(d=>d.fastingStatus==='voluntary-day');
 if(!allowed.length)return;
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Sunnah Tools//White Days Calendar//EN','CALSCALE:GREGORIAN',...allowed.flatMap(d=>{const start=d.iso.replaceAll('-','');const next=new Date(d.iso+'T12:00:00Z');next.setUTCDate(next.getUTCDate()+1);const end=next.toISOString().slice(0,10).replaceAll('-','');return ['BEGIN:VEVENT','UID:'+start+'-white-days@sunnah.tools','DTSTAMP:'+new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,''),'DTSTART;VALUE=DATE:'+start,'DTEND;VALUE=DATE:'+end,'SUMMARY:White Days fasting - '+d.day+' Hijri','DESCRIPTION:Calculated Umm al-Qura date; verify with local moon sighting.','END:VEVENT'] }),'END:VCALENDAR'];
 const blob=new Blob([lines.join('\r\n')+'\r\n'],{type:'text/calendar;charset=utf-8'});
 const href=URL.createObjectURL(blob);const a=document.createElement('a');a.href=href;a.download='sunnah-tools-white-days.ics';a.click();window.setTimeout(()=>URL.revokeObjectURL(href),3000);
}
export function WhiteDaysCalendar(){
 const [base,setBase]=useState(()=>new Date().toISOString()),[months,setMonths]=useState(6);
 const items=useMemo(()=>whiteDaysFrom(new Date(base),months),[base,months]);
 const days=items.flatMap(item=>item.dates);
 return <div className="batch-tool">
 <p className="small">Dates for the 13th, 14th and 15th of upcoming Islamic months. Calculated using Umm al-Qura; the local lunar calendar can differ.</p>
 <label>Months ahead<select value={months} onChange={e=>setMonths(Number(e.target.value))}><option value={3}>Next 3 months</option><option value={6}>Next 6 months</option><option value={12}>Next 12 months</option></select></label>
 {items.map(item=><section className="white-month" key={item.year+'-'+item.month}>
  <h3>{item.name} {item.year} AH</h3>
  <div className="white-days">{item.dates.map(d=><div key={d.iso} className={'white-day '+(d.fastingStatus!=='voluntary-day'?'white-day-alert':'')}>
   <span>{d.day} {item.name}</span><strong>{readable(d.iso)}</strong>
   <small>{d.fastingStatus==='not-recommended'?'13 Dhul Hijjah: Tashreeq, not for ordinary voluntary fasting':d.fastingStatus==='ramadan-obligatory'?'Ramadan obligatory fast; not a separate voluntary fast':'Optional White Day'}</small>
  </div>)}</div>
 </section>)}
 <div className="action-row print-hide"><button onClick={()=>downloadICS(days)}>Add eligible dates to my calendar (.ics)</button><button className="secondary" onClick={()=>window.print()}>Print dates</button></div>
 <p className="warn">Important: The 13th of Dhul Hijjah is a day of Tashreeq and is <strong>not</strong> a general voluntary fasting recommendation. Ramadan fasting is obligatory rather than a separate optional White Days fast. Dates can differ locally.</p>
 <p className="small">Based on the report in <a href="https://sunnah.com/abudawud/14/137" target="_blank" rel="noopener noreferrer">Sunan Abi Dawud 2449</a>. For exceptions and Tashreeq see local scholarly guidance.</p>
 </div>;
}

export function PrintableHijriCalendar(){
 const [choice,setChoice]=useState(todayHijri);
 const data=hijriMonth(choice.year,choice.month);
 const prev=adjacentMonth(choice.year,choice.month,-1),next=adjacentMonth(choice.year,choice.month,1);
 const move=(direction:number)=>{const next=adjacentMonth(choice.year,choice.month,direction);if(next)setChoice({...next,day:1})};
 return <div className="batch-tool">
 <div className="month-toolbar print-hide">
  <button className="secondary" onClick={()=>move(-1)} disabled={!prev}>← Previous</button>
  <button className="secondary" onClick={()=>setChoice(todayHijri())}>Current month</button>
  <button className="secondary" onClick={()=>move(1)} disabled={!next}>Next →</button>
 </div>
 <div className="two print-hide"><label>Hijri month<select value={choice.month} onChange={e=>setChoice(v=>({...v,month:Number(e.target.value)}))}>{HIJRI_MONTHS.map((name,i)=><option key={name} value={i+1}>{name}</option>)}</select></label><label>Hijri year (1300–1599 AH)<input type="number" min="1300" max="1599" step="1" value={choice.year} onChange={e=>setChoice(v=>({...v,year:Number(e.target.value)}))}/></label></div>
 {data?<><div className="calendar-print-heading"><h2>{data.name} {data.year} AH</h2><p>{readable(data.start)} – {readable(data.end)}</p></div>
 <div className="hijri-calendar-grid" role="table" aria-label={'Hijri month '+data.name+' '+data.year}>
  {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(name=><div className="calendar-weekday" role="columnheader" key={name}>{name}</div>)}
  {data.cells.map((cell,i)=>cell?<div className={'calendar-cell'+(cell.whiteDay?' is-white-day':'')} role="cell" key={cell.iso}><strong>{cell.day}</strong><small>{new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',timeZone:'UTC'}).format(new Date(cell.iso+'T12:00:00Z'))}</small>{cell.whiteDay&&<span className="calendar-dot" title="13th–15th Hijri dates"></span>}</div>:<div className="calendar-cell is-empty" aria-hidden="true" role="cell" key={'blank-'+i}/>)}
 </div><p className="small">Highlighted cells are Hijri days 13–15, not necessarily valid voluntary fasting days in every month.</p>
 <button className="print-hide" onClick={()=>window.print()}>Print / Save as PDF</button></>:<p className="warn">Choose a valid Hijri year and month supported by your browser's Umm al-Qura calendar.</p>}
 <p className="small">A Hijri day begins at sunset. The displayed Gregorian daytime dates are calculated estimates; local moon sighting may differ.</p>
 </div>;
}

type Pack={category:string;items:string[]};
const PACKING:Pack[]=[
 {category:'Documents & travel',items:['Passport and any required travel permissions','Travel bookings and accommodation details','Emergency contact information','Health/medication documentation where needed','Phone charger and travel adapter']},
 {category:'Clothing & comfort',items:['Comfortable modest clothing','Suitable footwear for long walks','Lightweight reusable water bottle','Weather-appropriate outerwear','Small day bag and toiletries']},
 {category:'Worship & practical items',items:['Prayer essentials and personal dua notes','Your own ihram clothing if applicable','Unscented toiletries for ihram as appropriate','Prayer-time and Qibla tools saved offline','Small personal first-aid supplies']},
 {category:'Before leaving',items:['Review official travel and entry requirements','Review rites with a qualified guide','Confirm bookings and meeting points','Arrange medication and mobility needs','Share travel plan with a trusted contact']}
];
export function UmrahPackingChecklist(){
 const [trip,setTrip]=useState<'Umrah'|'Hajj'>('Umrah'),[checked,setChecked]=useState<string[]>([]),[ready,setReady]=useState(false);
 const key='sunnah-journey-packing-v1';
 useEffect(()=>{setChecked(safeStorage(key));setReady(true)},[]);
 useEffect(()=>{if(ready)try{localStorage.setItem(key,JSON.stringify(checked))}catch{}},[checked,ready]);
 const all=PACKING.flatMap(group=>group.items);
 return <div className="batch-tool">
 <label>Preparing for<select value={trip} onChange={e=>setTrip(e.target.value as 'Umrah'|'Hajj')}><option>Umrah</option><option>Hajj</option></select></label>
 <p className="small">Practical suggestions only, not an official Hajj/Umrah requirements list. Consult recognised operators and current official travel guidance.</p>
 <div className="result"><span>{trip} packing progress</span><strong>{checked.length} / {all.length} items</strong><progress value={checked.length} max={all.length}/></div>
 {PACKING.map(group=><section className="pack-group" key={group.category}><h3>{group.category}</h3>{group.items.map(item=><label className="check" key={item}><input type="checkbox" checked={checked.includes(item)} onChange={e=>setChecked(current=>e.target.checked?[...current,item]:current.filter(x=>x!==item))}/>{item}</label>)}</section>)}
 <div className="action-row print-hide"><button onClick={()=>window.print()}>Print checklist</button><button className="secondary" onClick={()=>{if(window.confirm('Clear every tick in this checklist?'))setChecked([])}}>Reset ticks</button></div>
 <p className="small">Your list is saved on this device. Check current visa, vaccination, permit and airline requirements before travelling.</p>
 </div>;
}

export function PrayerWidgetGenerator(){
 const [lat,setLat]=useState('51.5072'),[lon,setLon]=useState('-0.1276'),[tz,setTz]=useState('Europe/London'),[label,setLabel]=useState('London'),[method,setMethod]=useState('mwl'),[school,setSchool]=useState('standard'),[theme,setTheme]=useState('light'),[copied,setCopied]=useState(false);
 const valid=Number.isFinite(Number(lat))&&Number.isFinite(Number(lon))&&Math.abs(Number(lat))<=90&&Math.abs(Number(lon))<=180&&!!tz.trim()&&(()=>{try{new Intl.DateTimeFormat('en',{timeZone:tz});return true}catch{return false}})();
 const params=new URLSearchParams({lat,lon,tz,city:label,method,school,theme});
 const relative='/embed/prayer-times/?'+params.toString(),absolute='https://sunnah.tools'+relative;
 const html='<iframe src="'+absolute.replaceAll('&','&amp;')+'" title="Islamic prayer times" loading="lazy" style="width:100%;max-width:460px;height:410px;border:0;border-radius:14px"></iframe>';
 const copy=async()=>{try{await navigator.clipboard.writeText(html);setCopied(true)}catch{setCopied(false)}};
 return <div className="batch-tool">
 <p>Choose a city or set coordinates and a recognised calculation method. Copy the iframe code into your mosque, school or community website.</p>
 <CitySearch onSelect={city=>{setLat(String(city[3]));setLon(String(city[4]));setTz(city[5]);setLabel(city[0]+', '+city[1]);setCopied(false)}}/>
 <div className="two"><label>Latitude<input value={lat} onChange={e=>setLat(e.target.value)} inputMode="decimal"/></label><label>Longitude<input value={lon} onChange={e=>setLon(e.target.value)} inputMode="decimal"/></label></div>
 <div className="two"><label>Location name<input value={label} maxLength={60} onChange={e=>setLabel(e.target.value)}/></label><label>Timezone (IANA)<input value={tz} onChange={e=>setTz(e.target.value)} placeholder="Europe/London"/></label></div>
 <div className="two"><label>Calculation method<select value={method} onChange={e=>setMethod(e.target.value)}><option value="mwl">Muslim World League</option><option value="karachi">Karachi</option><option value="makkah">Umm al-Qura</option><option value="na">North America / ISNA</option><option value="egypt">Egypt</option><option value="singapore">Singapore</option><option value="turkey">Turkey</option><option value="dubai">Dubai</option></select></label><label>Asr method<select value={school} onChange={e=>setSchool(e.target.value)}><option value="standard">Standard</option><option value="hanafi">Hanafi</option></select></label></div>
 <label>Appearance<select value={theme} onChange={e=>setTheme(e.target.value)}><option value="light">Light</option><option value="dark">Dark</option></select></label>
 {valid?<><div className="widget-preview"><strong>Widget preview</strong><iframe title="Prayer time widget preview" src={relative} loading="lazy"/></div>
 <label>Embed code<textarea className="embed-code" value={html} readOnly rows={4}/></label>
 <button onClick={copy}>{copied?'✓ Copied code':'Copy embed code'}</button></>:<p className="warn">Please enter valid coordinates and an IANA timezone before generating your widget.</p>}
 <p className="warn">Times are calculated prayer starts, not verified mosque jamaat times. Choose the method used by your local authority and check dates against the mosque timetable before embedding.</p>
 
 </div>;
}
