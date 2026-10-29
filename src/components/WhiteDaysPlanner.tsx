import {useMemo,useState} from 'react';
import {localISODate} from '../lib/calculations.mjs';
import {dateFromISO} from '../lib/growthCalculations.mjs';
import {whiteDaysPlan,whiteDaysCSV,whiteDaysIcs} from '../lib/hijriCalendars.mjs';
import {downloadText} from '../lib/personalTools.mjs';

const readable=(iso:string)=>new Intl.DateTimeFormat('en-GB',{weekday:'short',day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(iso+'T12:00:00Z'));
const statusText=(status:string)=>status==='not-recommended'?'13 Dhul Hijjah · Tashreeq, not an ordinary voluntary fast':status==='ramadan-obligatory'?'Ramadan · not a separate voluntary White Days fast':'Potential voluntary White Day';
export default function WhiteDaysPlanner(){
 const [anchor,setAnchor]=useState(()=>localISODate()),[months,setMonths]=useState(6),[shift,setShift]=useState(0),[notice,setNotice]=useState('');
 const data=useMemo(()=>{const validDate=dateFromISO(anchor);return validDate?whiteDaysPlan(validDate,months,shift):null},[anchor,months,shift]);
 const exportCSV=()=>{if(!data)return;try{downloadText('white-days-'+anchor+'.csv',whiteDaysCSV(data),'text/csv;charset=utf-8');setNotice('Downloaded all labelled dates, including Ramadan and Tashreeq exceptions.')}catch{setNotice('Could not export the calendar CSV.')}};
 const exportICS=()=>{if(!data||!data.eligible)return;try{downloadText('white-days-eligible-'+anchor+'.ics',whiteDaysIcs(data),'text/calendar;charset=utf-8');setNotice('Downloaded upcoming potential voluntary fasting dates only. Confirm dates and religious eligibility locally.')}catch{setNotice('Could not export eligible dates.')}};
 return <div className="white-planner">
  <p className="small">The White Days (<em>Ayyam al-Bid</em>) are the <strong>13th, 14th and 15th of each Hijri month</strong>. Browse a calculated monthly plan, see Ramadan/Tashreeq exceptions, and export only dates suitable as ordinary voluntary-fast reminders.</p>
  <div className="white-plan-fields"><label>Plan from Gregorian date<input type="date" min="1900-01-01" max="2100-12-31" value={anchor} onChange={e=>setAnchor(e.target.value)}/></label><label>Hijri months to show<select value={months} onChange={e=>setMonths(Number(e.target.value))}><option value={3}>Next 3 months</option><option value={6}>Next 6 months</option><option value={12}>Next 12 months</option></select></label><label>Illustrative local date difference<select value={shift} onChange={e=>setShift(Number(e.target.value))}><option value={0}>None — Umm al-Qura dates</option><option value={-1}>One Gregorian day earlier</option><option value={1}>One Gregorian day later</option></select></label></div>
  <p className="small white-shift-note">The dates use an Umm al-Qura calendar calculation. A ±1 day display is <strong>only a neighbouring-date illustration</strong>, not a confirmed moon sighting or a location-specific ruling. Check your local Islamic calendar before fasting.</p>
  {!data&&<p className="warn" role="alert">Select a valid date and supported range. The calendar supports the Umm al-Qura years available to the conversion library.</p>}
  {data&&<>
   <div className="white-plan-summary"><div><span>Hijri months</span><strong>{data.months.length}</strong></div><div><span>Day numbers per month</span><strong>13 · 14 · 15</strong></div><div><span>Future potential voluntary days</span><strong>{data.eligible}</strong></div></div>
   <div className="white-plan-print-heading"><h2>White Days (Ayyam al-Bid)</h2><p>From {anchor} · {months} months · Calculated Umm al-Qura {shift?`· illustrative ${shift>0?'+':''}${shift}-day shift`:''}</p><p>Local moon-sighting dates and personal fasting guidance take precedence.</p></div>
   <div className="white-plan-months">{data.months.map(m=><section className="white-plan-month" key={`${m.year}-${m.month}`}><h3>{m.name} {m.year} AH</h3><div className="white-plan-days">{m.dates.map(d=><article key={d.day} className={'white-plan-day'+(d.fastingStatus!=='voluntary-day'?' white-plan-exception':'')+(d.passed?' white-plan-past':'')}><span>Hijri {d.day}</span><strong>{readable(d.iso!)}</strong><small>{statusText(d.fastingStatus)}{d.passed?' · date passed':''}</small></article>)}</div></section>)}</div>
   <div className="action-row white-plan-actions print-hide"><button type="button" onClick={exportICS} disabled={!data.eligible}>Download eligible dates (.ics)</button><button type="button" className="secondary" onClick={exportCSV}>Download full CSV</button><button type="button" className="secondary" onClick={()=>window.print()}>Print / Save PDF</button></div>
  </>}
  {notice&&<p className="small" role="status">{notice}</p>}
  <p className="warn">The <strong>13th of Dhul Hijjah</strong> is one of the days of Tashreeq; it is not an ordinary optional fasting recommendation. Ramadan is obligatory fasting and not a separate voluntary White Days routine. Calendar files are all-day date markers, not Fajr reminders; check individual circumstances and local guidance. <a href="/tools/fasting-times/">Check Fajr/Iftar times</a>.</p>
 </div>;
}
