import {useEffect,useState} from 'react';
import {localISODate} from '../lib/calculations.mjs';
import {downloadText} from '../lib/personalTools.mjs';
import {buildQuranSchedule,quranScheduleCSV,upgradeQuranBackup,validateQuranSchedule} from '../lib/quranPlanner.mjs';

type Plan={version:3;pages:number;done:number;days:number;start:string;sessions:number;bufferDays:number};
const defaultPlan=():Plan=>({version:3,pages:604,done:0,days:30,start:localISODate(),sessions:5,bufferDays:0});
const range=(from:number|null,to:number|null)=>from===null||to===null?'—':from===to?String(from):from+'–'+to;
const prettyDate=(iso:string)=>new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(iso+'T12:00:00Z'));

export default function QuranPlanner(){
 const [values,setValues]=useState<Plan>(defaultPlan);
 const [ready,setReady]=useState(false),[status,setStatus]=useState(''),[previewDays,setPreviewDays]=useState(14);
 const edit=(change:Partial<Plan>)=>{setValues(v=>({...v,...change}));setStatus('')};
 useEffect(()=>{
  for(const key of ['sunnah-quran-reading-v3','sunnah-quran-reading-v2']){
   try{const restored=upgradeQuranBackup(JSON.parse(localStorage.getItem(key)??'null'));
    if(restored){setValues(restored as Plan);break}
   }catch{}
  }
  setReady(true);
 },[]);
 useEffect(()=>{if(!ready)return;const validated=validateQuranSchedule(values);if(validated)try{localStorage.setItem('sunnah-quran-reading-v3',JSON.stringify(validated))}catch{}},[values,ready]);
 const valid=validateQuranSchedule(values),schedule=buildQuranSchedule(values);
 const currentDay=localISODate(),next=schedule?.rows.find(r=>r.date>=currentDay&&r.pages>0);
 const outdated=Boolean(schedule&&values.start<currentDay&&schedule.remaining>0);
 const backup=()=>{if(!valid)return;downloadText('quran-reading-plan-v3.json',JSON.stringify(valid,null,2));setStatus('Plan backup downloaded. It includes your selected pace settings.')};
 const csv=()=>{if(!valid)return;try{downloadText('quran-reading-schedule-'+values.start+'.csv',quranScheduleCSV(valid),'text/csv;charset=utf-8');setStatus('Full dated schedule downloaded as CSV.')}catch{setStatus('Could not create the schedule download. Check your inputs.')}};
 const restore=async(event:React.ChangeEvent<HTMLInputElement>)=>{
  const file=event.target.files?.[0];event.target.value='';if(!file)return;
  if(file.size>32000){setStatus('Backup is too large (32 KB limit).');return}
  try{
   const data=upgradeQuranBackup(JSON.parse(await file.text()));
   if(!data){setStatus('Invalid backup. Use a Quran Planner v3 or earlier v2 JSON export.');return}
   if(!window.confirm('Replace the saved Quran reading plan on this device?'))return;
   setValues(data as Plan);setStatus('Reading plan restored on this device.');
  }catch{setStatus('Could not read this backup file.')}
 };
 return <div className="quran-planner">
  <p className="small">Plan pages in <strong>your own Mushaf edition</strong>. Five sessions are optional reading slots, not an extra religious requirement. Your progress stays in this browser.</p>
  <div className="quran-plan-fields">
   <label>Pages in your Mushaf<input type="number" min="1" max="10000" step="1" value={values.pages} onChange={e=>edit({pages:Number(e.target.value)})}/></label>
   <label>Pages already read<input type="number" min="0" max={values.pages} step="1" value={values.done} onChange={e=>edit({done:Number(e.target.value)})}/></label>
   <label>Days to finish from plan start<input type="number" min="1" max="3650" step="1" value={values.days} onChange={e=>edit({days:Number(e.target.value)})}/></label>
   <label>Plan start date<input type="date" value={values.start} onChange={e=>edit({start:e.target.value})}/></label>
   <label>Reading sessions on active days<select value={values.sessions} onChange={e=>edit({sessions:Number(e.target.value)})}><option value={1}>One session</option><option value={3}>Three sessions</option><option value={5}>Five short sessions</option></select></label>
   <label>Optional buffer days in each 7-day block<select value={values.bufferDays} onChange={e=>edit({bufferDays:Number(e.target.value)})}><option value={0}>No buffer days</option><option value={1}>One catch-up day</option><option value={2}>Two catch-up days</option></select></label>
  </div>
  <p className="small">Buffer days are the last one or two positions in each seven-day block counted from your chosen start. They have no new pages assigned, so you can catch up or rest. Your finish date remains the one you chose.</p>
  {schedule?<>
   <div className="quran-plan-overview" role="status">
    <div><span>Pages remaining</span><strong>{schedule.remaining}</strong></div>
    <div><span>Reading days</span><strong>{schedule.readingDays}</strong></div>
    <div><span>Approx. pages / reading day</span><strong>{schedule.averagePages.toFixed(1)}</strong></div>
    <div><span>Approx. pages / session</span><strong>{schedule.averageSessionPages.toFixed(1)}</strong></div>
   </div>
   <label className="quran-progress-label" htmlFor="quran-progress-meter">Reading progress · {schedule.percent}%</label>
   <progress id="quran-progress-meter" max={values.pages} value={values.done}/>
   <div className="quran-deadline"><strong>Target completion: {prettyDate(schedule.endDate)}</strong><span>{schedule.readingDays} reading days and {schedule.bufferCount} optional buffer days · {values.sessions} session{values.sessions===1?'':'s'} per active day</span></div>
   {schedule.remaining===0?<p className="quran-next-reading" role="status">All {values.pages} pages are marked read. May your reading be beneficial.</p>:next?<p className="quran-next-reading">Next scheduled reading: <strong>{prettyDate(next.date)} · pages {range(next.from,next.to)}</strong> ({next.pages} page{next.pages===1?'':'s'}). The session breakdown is in the table below.</p>:<p className="quran-next-reading">No future reading date is left on this schedule. Replan the remaining pages from today.</p>}
   {outdated&&<div className="quran-replan"><p>Your schedule began before today. The daily ranges are a plan from that original start date; changing pages read does not automatically move past dates.</p><button type="button" className="secondary" onClick={()=>{edit({start:localISODate()});setStatus('Remaining pages replanned from today.')}}>Replan remaining pages from today</button></div>}
   <details className="settings quran-day-table" open><summary>Daily page ranges and optional sessions</summary>
    <div className="quran-preview-controls"><label>Days to preview<select value={previewDays} onChange={e=>setPreviewDays(Number(e.target.value))}><option value={14}>First 14 days</option><option value={31}>First 31 days</option></select></label><small>Download the CSV for all {values.days} days.</small></div>
    <div className="table-wrap"><table><thead><tr><th scope="col">Day</th><th scope="col">Gregorian date</th><th scope="col">Assigned pages</th><th scope="col">Optional sessions</th></tr></thead><tbody>{schedule.rows.slice(0,previewDays).map(row=><tr key={row.number}><td>{row.number}</td><td>{prettyDate(row.date)}</td><td>{row.buffer?'Catch-up / buffer':row.pages?range(row.from,row.to):'No new pages'}</td><td>{row.sessions.map(session=>range(session.from,session.to)).join(' · ')||'—'}</td></tr>)}</tbody></table></div>
   </details>
   <div className="action-row quran-export-actions"><button type="button" className="secondary" onClick={csv}>Download complete CSV</button><button type="button" className="secondary" onClick={()=>window.print()}>Print timetable</button><button type="button" className="secondary" onClick={backup}>Download JSON backup</button></div>
  </>:<p role="alert" className="warn">Enter a valid page total (1–10,000), pages already read no greater than the total, 1–3,650 planned days, and a valid date. Settings must be whole numbers.</p>}
  <label className="quran-restore">Restore an earlier or current plan backup<input type="file" accept=".json,application/json" aria-label="Restore Quran reading plan from JSON" onChange={restore}/></label>
  {status&&<p className="small" role="status">{status}</p>}
  <p className="small">A 604-page Mushaf is a common reference layout, not a universal page count. The planner doesn't fetch your reading or independently record completion; enter your own progress. Export your JSON backup before clearing browser storage or switching devices.</p>
 </div>;
}
