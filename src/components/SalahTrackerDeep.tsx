import {useEffect,useState} from 'react';
import {localISODate} from '../lib/calculations.mjs';
import {validateSalahHistory,downloadText} from '../lib/personalTools.mjs';
import {FIVE_PRAYERS,prayerHistorySummary,utcDay} from '../lib/prayerFive.mjs';
export default function SalahTrackerDeep(){
 const [entries,setEntries]=useState<Record<string,string[]>>({}),[ready,setReady]=useState(false),[now,setNow]=useState(()=>localISODate()),[selectedDate,setSelectedDate]=useState(()=>localISODate()),[range,setRange]=useState<7|30|90>(7),[notice,setNotice]=useState('');
 const storage='sunnah-salah-history-v2';
 useEffect(()=>{try{
  const existing=JSON.parse(localStorage.getItem(storage)??'null');
  const legacy=JSON.parse(localStorage.getItem('sunnah-prayers')??'null');
  const candidate=existing&&typeof existing==='object'&&!Array.isArray(existing)?
   {version:1,entries:existing}:
   {version:1,entries:legacy?.day===localISODate()&&Array.isArray(legacy.selected)?{[legacy.day]:legacy.selected}:{}};
  const cleaned:Record<string,string[]>={};
  if(candidate.entries&&typeof candidate.entries==='object')for(const [d,v] of Object.entries(candidate.entries)){
   if(typeof d==='string'&&Array.isArray(v)&&v.every(p=>FIVE_PRAYERS.includes(p))&&new Set(v).size===v.length&&v.length<=5)cleaned[d]=v as string[];
  }
  const valid=validateSalahHistory({version:1,entries:cleaned});
  if(valid)setEntries(Object.fromEntries(Object.entries(valid.entries).filter(([d])=>d>=utcDay(localISODate(),-89)&&d<=localISODate())));
 }catch{}setReady(true)},[]);
 useEffect(()=>{if(ready)try{localStorage.setItem(storage,JSON.stringify(Object.fromEntries(Object.entries(entries).filter(([d])=>d>=utcDay(now,-89)&&d<=now).sort(([a],[b])=>a.localeCompare(b))))) }catch{}},[entries,ready,now]);
 useEffect(()=>{const t=window.setInterval(()=>{const day=localISODate();if(day!==now){setNow(day);setSelectedDate(day)}},60000);return()=>window.clearInterval(t)},[now]);
 const dateOK=selectedDate>=utcDay(now,-89)!&&selectedDate<=now;
 const chosen=entries[selectedDate]??[];
 const summary=prayerHistorySummary(entries,now,range);
 const toggle=(prayer:string,checked:boolean)=>{if(!dateOK)return;setEntries(old=>({...old,[selectedDate]:checked?[...new Set([...(old[selectedDate]??[]),prayer])]:old[selectedDate]?.filter(p=>p!==prayer)??[]}))};
 const exportCSV=()=>{const cells=[['Date',...FIVE_PRAYERS,'Record status'],...Object.entries(entries).filter(([d])=>d>=utcDay(now,-89)&&d<=now).sort(([a],[b])=>a.localeCompare(b)).map(([day,ps])=>[day,...FIVE_PRAYERS.map(p=>ps.includes(p)?'Ticked':''),'Recorded'])];downloadText('salah-history.csv','\uFEFF'+cells.map(row=>row.join(',')).join('\r\n')+'\r\n','text/csv;charset=utf-8');setNotice('Downloaded recorded days only. Unrecorded days are never labelled missed.')};
 const exportJSON=()=>{downloadText('salah-history.json',JSON.stringify({version:1,entries},null,2));setNotice('Private v1-compatible backup downloaded.')};
 const restore=async(event:React.ChangeEvent<HTMLInputElement>)=>{const file=event.target.files?.[0];event.target.value='';if(!file)return;if(file.size>60000){setNotice('Backup too large (maximum 60 KB).');return}try{
  const v=validateSalahHistory(JSON.parse(await file.text()));if(!v){setNotice('Invalid backup. No changes were made.');return}
  if(!window.confirm('Replace the current local prayer history with this backup?'))return;
  setEntries(Object.fromEntries(Object.entries(v.entries).filter(([d])=>d>=utcDay(now,-89)&&d<=now)));
  setSelectedDate(now);setNotice('Valid history restored (latest 90 days only).');
 }catch{setNotice('Backup could not be read. Existing history is unchanged.')}};
 return <div className="fasting-deep-tool">
  <p className="small">Privately tick the five daily Fard prayers. Review the last 90 days without assuming that an unrecorded day means missed worship. Everything stays in your own browser; no account or server sync.</p>
  <div className="fasting-deep-fields"><label>Day to review (last 90 days)<input type="date" min={utcDay(now,-89)??undefined} max={now} value={selectedDate} onChange={e=>setSelectedDate(e.target.value)}/></label>
  <label>Summary window<select value={range} onChange={e=>setRange(Number(e.target.value) as 7|30|90)}><option value={7}>7 days</option><option value={30}>30 days</option><option value={90}>90 days</option></select></label></div>
  {dateOK?<><div className="tracker-checks">{FIVE_PRAYERS.map(p=><label className="check" key={p}><input type="checkbox" checked={chosen.includes(p)} onChange={e=>toggle(p,e.target.checked)}/>{p}</label>)}</div>
  <div className="fasting-deep-stats"><div><span>Ticked on selected date</span><strong>{chosen.length} / 5</strong></div><div><span>Days you recorded ({range}-day window)</span><strong>{summary?.recordedDays??0}</strong></div><div><span>Unrecorded days (unknown)</span><strong>{summary?.unrecordedDays??range}</strong></div></div>
  {summary&&<p className="small">{summary.ticked} prayer ticks across {summary.recordedDays} explicitly recorded days in the selected window. A blank record cannot tell whether Salah was performed. Tick completion is a personal note, not evidence of validity.</p>}
  </>:<p className="warn" role="alert">Select a valid date within the previous 90 days, including today.</p>}
  <details className="settings"><summary>Recorded history ({Object.keys(entries).length} days)</summary><div className="table-wrap"><table><thead><tr><th scope="col">Date</th><th scope="col">Personal checkmarks</th></tr></thead><tbody>{Object.entries(entries).sort(([a],[b])=>b.localeCompare(a)).slice(0,90).map(([day,ps])=><tr key={day}><th scope="row">{day}</th><td>{ps.join(', ')||'None ticked'}</td></tr>)}</tbody></table></div></details>
  <div className="action-row print-hide"><button type="button" onClick={exportCSV} disabled={!Object.keys(entries).length}>Download history CSV</button><button className="secondary" type="button" onClick={exportJSON} disabled={!Object.keys(entries).length}>Back up JSON</button><label>Restore history<input type="file" accept=".json,application/json" aria-label="Restore Salah history" onChange={restore}/></label></div>
  {notice&&<p role="status" className="small">{notice}</p>}
  <p className="warn">This voluntary self-record is not a religious score or a Qada calculation. Unrecorded dates are unknown. Existing history and v1 backups remain compatible; export before clearing your browser's storage.</p>
 </div>;
}
