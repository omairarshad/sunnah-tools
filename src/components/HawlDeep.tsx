import {useState} from 'react';
import {hawlReviewTimeline,hawlReviewICS} from '../lib/zakatNextDeep.mjs';
import {localISODate} from '../lib/calculations.mjs';
import {downloadText} from '../lib/personalTools.mjs';

const pretty=(iso:string)=>new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(iso+'T12:00:00Z'));
export default function HawlDeep(){
 const [reference,setReference]=useState(''),[shift,setShift]=useState(0),[count,setCount]=useState(3),[notice,setNotice]=useState('');
 const today=localISODate(),timeline=hawlReviewTimeline(reference,new Date(today+'T12:00:00Z'),count,shift);
 const exportICS=()=>{if(!timeline)return;downloadText('zakat-hawl-review-dates.ics',hawlReviewICS(timeline),'text/calendar;charset=utf-8');setNotice('Downloaded calendar review markers; these are not confirmed payment deadlines.')};
 const exportText=()=>{if(!timeline)return;const text=['Estimated Zakat anniversary review dates, not religious due-date rulings','Reference Gregorian date: '+reference,'Reference calculated Hijri: '+timeline.originalHijri.day+' '+timeline.reviews[0].monthName+' '+timeline.originalHijri.year+' AH',
  ...timeline.reviews.map(r=>r.illustrativeISO+' | '+r.day+' '+r.monthName+' '+r.year+' AH'+(r.clamped?' | day 30 absent, day 29 used':'')),
  'Umm al-Qura dates and optional illustrative local moon-sighting shift. Confirm Nisab/hawl continuity and the actual ruling separately.'].join('\n');
 downloadText('zakat-hawl-review-plan.txt',text,'text/plain;charset=utf-8');setNotice('Downloaded a personal review plan, not evidence of liability.')};
 return <div className="fasting-deep-tool">
  <p className="small">Choose the date you first met the applicable Nisab (or an established Zakat anniversary) to calculate <strong>upcoming Islamic lunar-year review dates</strong>. This is a planning reminder, not proof that Zakat is due.</p>
  <div className="fasting-deep-fields">
   <label>Gregorian reference date<input type="date" max={today} value={reference} onChange={e=>{setReference(e.target.value);setNotice('')}}/></label>
   <label>How many upcoming annual reviews?<select value={count} onChange={e=>setCount(Number(e.target.value))}><option value={1}>1</option><option value={3}>3</option><option value={5}>5</option></select></label>
   <label>Illustrative local moon-sighting difference<select value={shift} onChange={e=>setShift(Number(e.target.value))}><option value={0}>None (Umm al-Qura calculated)</option><option value={-1}>One civil day earlier (illustration)</option><option value={1}>One civil day later (illustration)</option></select></label>
  </div>
  <p className="small">The reference date uses its Gregorian civil day. Calculations use Umm al-Qura and display ISO-date equivalents; local Islamic days begin at sunset and official dates may differ.</p>
  {timeline?<><div className="fasting-deep-stats">
    <div><span>Original Hijri date</span><strong>{timeline.originalHijri.day} {timeline.reviews[0].monthName} {timeline.originalHijri.year} AH</strong></div>
    <div><span>Next review date</span><strong>{pretty(timeline.reviews[0].illustrativeISO)}</strong></div>
   </div><div className="table-wrap"><table><thead><tr><th scope="col">Hijri anniversary</th><th scope="col">Calculated date</th><th scope="col">Illustrative local date</th><th scope="col">Month adjustment</th></tr></thead><tbody>{timeline.reviews.map(r=><tr key={r.year}><th scope="row">{r.day} {r.monthName} {r.year} AH</th><td>{pretty(r.iso)}</td><td>{pretty(r.illustrativeISO)}</td><td>{r.clamped?'Original day 30 absent; day 29 used':'None'}</td></tr>)}</tbody></table></div>
   <div className="action-row print-hide"><button type="button" onClick={exportICS}>Add review dates to calendar (.ics)</button><button type="button" className="secondary" onClick={exportText}>Download summary</button><button type="button" className="secondary" onClick={()=>window.print()}>Print dates</button></div>
   </>:<p className="small" role="status">Enter a valid past reference date supported by the Umm al-Qura calendar to see upcoming review dates.</p>}
   {notice&&<p className="small" role="status">{notice}</p>}
   <p className="warn">The app does <strong>not</strong> check whether Nisab remained applicable, how a dip below it affects hawl, or whether later assets need a separate calculation. It does not automatically declare Zakat due or send reminders. Check your chosen school and local authority.</p>
 </div>;
}
