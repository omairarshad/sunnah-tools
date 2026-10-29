import {useState} from 'react';
import type {PrayerTimes} from 'adhan';
import {downloadText} from '../lib/personalTools.mjs';
import {fastingDuration,fastingDurationLabel,planningReminder,upcomingFastingEvent,fastingWeekCSV} from '../lib/fastingKnowledge.mjs';

const isoDate=(date:Date)=>[date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');
const parseISO=(input:string)=>{const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(input);if(!m)return null;const d=new Date(+m[1],+m[2]-1,+m[3]);return isoDate(d)===input?d:null};
const format=(date:Date,zone:string)=>date instanceof Date&&Number.isFinite(date.getTime())?new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:zone}).format(date):'Unavailable';
export default function FastingTimesPanel({selectedTimes,selectedISO,todayISO,zone,method,location,now,calculate,resetDate}:{selectedTimes:PrayerTimes|null;selectedISO:string;todayISO:string;zone:string;method:string;location:string;now:number;calculate:(d:Date)=>PrayerTimes;resetDate:()=>void}){
 const [minutes,setMinutes]=useState(0),[exportStatus,setExportStatus]=useState('');
 const base=parseISO(selectedISO),today=parseISO(todayISO);
 let todayTimes:PrayerTimes|null=null,tomorrowTimes:PrayerTimes|null=null;
 try{if(today){todayTimes=calculate(today);const following=new Date(today.getFullYear(),today.getMonth(),today.getDate()+1);tomorrowTimes=calculate(following)}}catch{}
 const next=upcomingFastingEvent(new Date(now),todayTimes,tomorrowTimes);
 const duration=selectedTimes?fastingDuration(selectedTimes.fajr,selectedTimes.maghrib):null;
 const reminder=selectedTimes&&minutes>0?planningReminder(selectedTimes.fajr,minutes):null;
 const rows=()=>{
  if(!base)return [];
  return Array.from({length:7},(_,i)=>{
   const d=new Date(base.getFullYear(),base.getMonth(),base.getDate()+i);
   try{
    const t=calculate(d),length=fastingDuration(t.fajr,t.maghrib);
    return {date:isoDate(d),fajr:format(t.fajr,zone),maghrib:format(t.maghrib,zone),duration:fastingDurationLabel(length)};
   }catch{return {date:isoDate(d),fajr:'Unavailable',maghrib:'Unavailable',duration:'Unavailable'}}
  });
 };
 const exportCSV=()=>{
  const timetable=rows();
  if(timetable.length!==7){setExportStatus('Choose a valid date to export a seven-day timetable.');return}
  try{downloadText('suhoor-iftar-'+selectedISO+'.csv',fastingWeekCSV(timetable,{location,zone,method}),'text/csv;charset=utf-8');setExportStatus('Seven-day CSV downloaded with your selected location and method.')}catch{setExportStatus('Could not export this timetable. Check your date and location.')}
 };
 if(!selectedTimes||!base)return <p className="warn" role="alert">Could not calculate fasting times. Check your coordinates, date, timezone and method.</p>;
 return <div className="fasting-panel">
  <div className="fasting-date-context"><p><strong>Calculated for {selectedISO}</strong> in {location} · {zone}</p><button type="button" className="secondary" onClick={resetDate}>Show today</button></div>
  <div className="fasting-main-times">
   <div><span>Suhoor ends / Fajr begins</span><strong>{format(selectedTimes.fajr,zone)}</strong><small>Calculated true-dawn reference; the daily fast begins at Fajr</small></div>
   <div><span>Iftar / Maghrib begins</span><strong>{format(selectedTimes.maghrib,zone)}</strong><small>Calculated sunset reference; the daily fast ends at Maghrib</small></div>
  </div>
  <div className="fasting-duration-card"><span>Approximate daylight fasting interval for {selectedISO}</span><strong>{fastingDurationLabel(duration)}</strong><small>From calculated Fajr to calculated Maghrib; not a ruling or a guarantee of observed dawn/sunset.</small></div>
  <div className="fasting-reminder">
   <label>Optional suhoor planning reminder
    <select value={minutes} onChange={e=>setMinutes(Number(e.target.value))}>
     <option value={0}>Off — Fajr is the cutoff</option><option value={5}>5 minutes before Fajr</option><option value={10}>10 minutes before Fajr</option><option value={15}>15 minutes before Fajr</option><option value={20}>20 minutes before Fajr</option>
    </select>
   </label>
   {reminder&&<p role="status">Optional preparation reminder: <strong>{format(reminder,zone)}</strong>. This earlier time is <strong>not</strong> the beginning of the fast, not a required imsak time, and does not change the Fajr result.</p>}
   <p className="small">Some mosque calendars print an earlier “imsak” entry. This calculator keeps Fajr separate and never silently subtracts extra minutes from it.</p>
  </div>
  {next?<div className="fasting-countdown" aria-live="off"><span>Next event for today's location ({todayISO})</span><strong>{next.name}: {next.description}</strong><small>Next at {format(next.at,zone)} · Countdown updates approximately every 30 seconds while the page is open.</small></div>:<p className="small">No further fasting event could be calculated for today. Please check your location and polar settings.</p>}
  {selectedISO!==todayISO&&<p className="small">You are viewing another date. The live countdown still uses <strong>today ({todayISO})</strong> in the selected location; it is not a countdown to the historical or future date you selected.</p>}
  <details className="settings fasting-week"><summary>Next 7 days from selected date</summary>
   <div className="table-wrap"><table><thead><tr><th scope="col">Date</th><th scope="col">Fajr / suhoor ends</th><th scope="col">Maghrib / iftar</th><th scope="col">Approx. duration</th></tr></thead><tbody>{rows().map(r=><tr key={r.date}><th scope="row">{r.date}</th><td>{r.fajr}</td><td>{r.maghrib}</td><td>{r.duration}</td></tr>)}</tbody></table></div>
   <p className="small">Every entry is an estimate for {location}, using {method} in {zone}. The timetable is not an official Ramadan moon-sighting announcement.</p>
   <div className="action-row"><button type="button" className="secondary" onClick={exportCSV}>Download seven-day CSV</button><button type="button" className="secondary" onClick={()=>window.print()}>Print timetable</button></div>
  </details>
  {exportStatus&&<p className="small" role="status">{exportStatus}</p>}
  <p className="small">Fajr is calculated using your selected twilight method and any high-latitude adjustment. In UK summer, prayer-time authorities may use a special timetable. Verify both Fajr and Maghrib with your local mosque before relying on an estimate for fasting.</p>
 </div>;
}
