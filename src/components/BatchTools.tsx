import {useEffect,useState} from 'react';
import CitySearch from './CitySearch';
import {adjacentMonth,hijriMonth,hijriParts,HIJRI_MONTHS} from '../lib/hijriCalendars.mjs';
import {downloadText} from '../lib/personalTools.mjs';

const readable=(iso:string)=>new Intl.DateTimeFormat('en-GB',{weekday:'short',day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(iso+'T12:00:00Z'));
const todayHijri=()=>hijriParts(new Date())??{year:1448,month:4,day:1};
const safeStorage=(key:string):string[]=>{try{const a=JSON.parse(localStorage.getItem(key)??'[]');return Array.isArray(a)?a.filter((x:unknown)=>typeof x==='string'):[]}catch{return []}};
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
 {category:'Documents & travel',items:['Passport and any required travel permissions','Travel bookings and accommodation details','Emergency contact information','Health/medication documentation where needed','Phone charger and travel adapter','Confirm current visa and Nusuk requirements','Check airline baggage and liquids limits']},
 {category:'Clothing & comfort',items:['Comfortable modest clothing','Suitable footwear for long walks','Lightweight reusable water bottle','Weather-appropriate outerwear','Small day bag and toiletries','Sun protection compatible with ihram restrictions']},
 {category:'Worship & practical items',items:['Prayer essentials and personal dua notes','Your own ihram clothing if applicable','Unscented toiletries for ihram as appropriate','Prayer-time and Qibla tools saved offline','Small personal first-aid supplies','Check fragrances and footwear restrictions before ihram']},
 {category:'Before leaving',items:['Review official travel and entry requirements','Review rites with a qualified guide','Confirm bookings and meeting points','Arrange medication and mobility needs','Share travel plan with a trusted contact','Check current vaccination and health guidance','Make a hydration and mobility plan']}
];
export function UmrahPackingChecklist(){
 const [trip,setTrip]=useState<'Umrah'|'Hajj'>('Umrah'),[checked,setChecked]=useState<string[]>([]),[ready,setReady]=useState(false),[message,setMessage]=useState('');
 const key='sunnah-journey-packing-v1';
 useEffect(()=>{setChecked(safeStorage(key));setReady(true)},[]);
 useEffect(()=>{if(ready)try{localStorage.setItem(key,JSON.stringify(checked))}catch{}},[checked,ready]);
 const all=PACKING.flatMap(group=>group.items);
 const safeChecked=checked.filter(v=>all.includes(v));
 const exportCSV=()=>{const rows=[['Category','Suggested item','Packed'],...PACKING.flatMap(group=>group.items.map(item=>[group.category,item,safeChecked.includes(item)?'Yes':'No']))];downloadText('umrah-hajj-packing.csv','\uFEFF'+rows.map(r=>r.map(v=>'"'+v.replaceAll('"','""')+'"').join(',')).join('\r\n')+'\r\n','text/csv;charset=utf-8');setMessage('Downloaded a local checklist; no travel information was submitted.');};
 return <div className="batch-tool">
 <label>Preparing for<select value={trip} onChange={e=>setTrip(e.target.value as 'Umrah'|'Hajj')}><option>Umrah</option><option>Hajj</option></select></label>
 <p className="small">Practical suggestions only, not an official Hajj/Umrah requirements list. Consult recognised operators and current official travel guidance.</p>
 <div className="result"><span>{trip} packing progress</span><strong>{safeChecked.length} / {all.length} items</strong><progress value={safeChecked.length} max={all.length}/></div>
 {PACKING.map(group=><section className="pack-group" key={group.category}><h3>{group.category}</h3>{group.items.map(item=><label className="check" key={item}><input type="checkbox" checked={checked.includes(item)} onChange={e=>setChecked(current=>e.target.checked?[...current,item]:current.filter(x=>x!==item))}/>{item}</label>)}</section>)}
 <div className="action-row print-hide"><button type="button" onClick={exportCSV}>Download checklist CSV</button><button onClick={()=>window.print()}>Print checklist</button><button className="secondary" onClick={()=>{if(window.confirm('Clear every tick in this checklist?'))setChecked([])}}>Reset ticks</button></div>
 {message&&<p role="status" className="small">{message}</p>}
 <p className="small">Your existing checklist is preserved on this device. Additions are voluntary planning suggestions, not official visa or health requirements. Check current Saudi, airline, Nusuk and travel health guidance before travelling.</p>
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
