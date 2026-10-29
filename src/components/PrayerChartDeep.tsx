import {useState} from 'react';
import {localISODate} from '../lib/calculations.mjs';
import {prayerChartDays,FIVE_PRAYERS} from '../lib/prayerFive.mjs';
import {downloadText} from '../lib/personalTools.mjs';
export default function PrayerChartDeep(){
 const [start,setStart]=useState(()=>localISODate()),[count,setCount]=useState(30),[title,setTitle]=useState('My Salah chart'),[notice,setNotice]=useState('');
 const rows=prayerChartDays(start,count);
 const exportCSV=()=>{if(!rows)return;const data=[['Day','Gregorian date','Weekday',...FIVE_PRAYERS],...rows.map(r=>[r.index,r.iso,r.weekday,...FIVE_PRAYERS.map(()=> '')])];
 downloadText('blank-salah-chart.csv','\uFEFF'+data.map(x=>x.join(',')).join('\r\n')+'\r\n','text/csv;charset=utf-8');setNotice('Downloaded an entirely blank chart. No prayer data was exported.');};
 return <div className="batch-tool">
 <p className="small">Create a printable <strong>blank</strong> prayer checklist for 7, 14 or 30 civil days. There is no account or saved information; mark it privately on paper or a PDF printout.</p>
 <div className="two print-hide"><label>Starting day<input type="date" value={start} onChange={e=>setStart(e.target.value)}/></label><label>Chart length<select value={count} onChange={e=>setCount(Number(e.target.value))}><option value={7}>7 days</option><option value={14}>14 days</option><option value={30}>30 days</option></select></label><label>Optional chart heading<input maxLength={60} value={title} onChange={e=>setTitle(e.target.value)}/></label></div>
 {rows?<><div className="calendar-print-heading"><h2>{title||'Salah chart'}</h2><p>{start} to {rows.at(-1)?.iso} · {rows.length} days</p></div>
 <div className="table-wrap"><table className="chart-print"><thead><tr><th scope="col">Date</th><th scope="col">Day</th>{FIVE_PRAYERS.map(p=><th scope="col" key={p}>{p}</th>)}</tr></thead><tbody>{rows.map(r=><tr key={r.iso}><th scope="row">{r.iso}</th><td>{r.weekday}</td>{FIVE_PRAYERS.map(p=><td key={p} className="chart-box" aria-label={p+' blank box'}>□</td>)}</tr>)}</tbody></table></div>
 <div className="action-row print-hide"><button type="button" onClick={()=>window.print()}>Print / Save as PDF</button><button type="button" className="secondary" onClick={exportCSV}>Download blank CSV</button></div></>:<p role="alert" className="warn">Choose a valid start date and chart length.</p>}
 {notice&&<p className="small" role="status">{notice}</p>}
 <p className="small">The chart records only what you choose to mark. A blank box is not evidence that a prayer was missed, and a tick does not establish religious validity. Use the <a href="/tools/salah-tracker/">private Salah Tracker</a> if you prefer on-device records.</p>
 </div>;
}
