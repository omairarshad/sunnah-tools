import {useMemo,useState} from 'react';
import {lastTenNights,laylatPlannerIcs} from '../lib/growthCalculations.mjs';
import {estimatedRamadanStart} from '../lib/ramadanHelpers.mjs';
import {downloadText} from '../lib/personalTools.mjs';

const readable=(iso:string)=>new Intl.DateTimeFormat('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(iso+'T12:00:00Z'));
export default function LaylatulQadrPlanner(){
 const [first,setFirst]=useState(()=>estimatedRamadanStart()??''),[length,setLength]=useState(30),[oddOnly,setOddOnly]=useState(false),[notice,setNotice]=useState('');
 const nights=useMemo(()=>lastTenNights(first,length),[first,length]);
 const displayed=nights?(oddOnly?nights.filter(n=>n.odd):nights):[];
 const exportICS=()=>{
  if(!nights)return;
  try{downloadText('ramadan-last-ten-nights-'+first+'.ics',laylatPlannerIcs(nights,{oddOnly}),'text/calendar;charset=utf-8');setNotice(`Downloaded ${oddOnly?'five odd-numbered':'ten'} all-day evening date markers. They are not sunset alarms.`)}catch{setNotice('Calendar export unavailable. Please check the start date.')}
 };
 return <div className="qadr-planner">
  <p className="small">Laylatul Qadr is sought throughout the <strong>last ten nights</strong> of Ramadan. This planner shows every night, highlighting 21, 23, 25, 27 and 29 when numbered from the start. It cannot identify the actual Night of Decree.</p>
  <div className="qadr-fields"><label>First Ramadan fasting day (Gregorian)<input type="date" min="1900-01-01" max="2100-12-31" value={first} onChange={e=>setFirst(e.target.value)}/></label><label>Assumed Ramadan month length<select value={length} onChange={e=>setLength(Number(e.target.value))}><option value={30}>30 nights — provisional</option><option value={29}>29 nights</option></select></label><label>View nights<select value={oddOnly?'odd':'all'} onChange={e=>setOddOnly(e.target.value==='odd')}><option value="all">All last ten nights</option><option value="odd">Only five odd-numbered nights</option></select></label></div>
  <p className="small qadr-date-warning">The default date is an algorithmic Umm al-Qura suggestion, not a moon-sighting announcement. Enter your local first fasting day. The month's final length can be known only after the relevant Shawwal decision.</p>
  {!nights&&<p className="warn" role="alert">Choose a valid first fasting day and 29 or 30 nights.</p>}
  {nights&&<>
   <div className="qadr-overview"><div><span>First evening in this ten-night view</span><strong>{readable(nights[0].evening!)}</strong></div><div><span>Final evening</span><strong>{readable(nights.at(-1)!.evening!)}</strong></div><div><span>Highlighted odd-numbered nights</span><strong>21 · 23 · 25 · 27 · 29</strong></div></div>
   <div className="qadr-night-list">{displayed.map(n=><article key={n.night} className={'qadr-night'+(n.odd?' qadr-odd':'')}><span className="qadr-night-badge">Ramadan night {n.night}{n.odd?' · odd-numbered':''}</span><strong>{readable(n.evening!)}</strong><small>Starts at <strong>local sunset</strong> this evening; continues before dawn on {readable(n.daytime!)}.</small></article>)}</div>
   <p className="small">With a provisional 30-night month, the last ten are nights 21–30. If the month has 29 nights, its final ten are nights 20–29. Numbering from the <em>end</em> can therefore differ from highlighting odd numbers counted from the beginning. Seek the night throughout the final stretch.</p>
   <div className="action-row qadr-actions print-hide"><button type="button" onClick={exportICS}>Download {oddOnly?'odd-night':'last-ten-night'} calendar (.ics)</button><button type="button" className="secondary" onClick={()=>window.print()}>Print night planner</button></div>
  </>}
  {notice&&<p className="small" role="status">{notice}</p>}
  <p className="warn">These are civil <strong>evening dates only</strong>; no sunset time is computed here. Calendar entries are all-day planning markers, not notifications at Maghrib. Confirm your local Ramadan count and <a href="/tools/fasting-times/">local sunset</a>. The 27th night is not guaranteed to be Laylatul Qadr.</p>
 </div>;
}
