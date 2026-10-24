import {useState} from 'react';
import {goldValue,upcomingEvents,printableDates} from '../lib/extended.mjs';
import {localISODate} from '../lib/calculations.mjs';

const currencies=['GBP','USD','EUR','PKR','SAR','AED','CAD','AUD','INR'];
const money=(number:number,currency:string)=>new Intl.NumberFormat('en-GB',{style:'currency',currency,maximumFractionDigits:2}).format(number);
const prettyDate=(iso:string)=>new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(iso+'T12:00:00Z'));

export function GoldZakat() {
 const [weight,setWeight]=useState(''),[karat,setKarat]=useState(22),[price,setPrice]=useState(''),[currency,setCurrency]=useState('GBP'),[hawl,setHawl]=useState(false);
 const w=weight===''?NaN:Number(weight),p=price===''?NaN:Number(price);
 const data=goldValue({weightGrams:w,karat,price24kPerGram:p});
 return <div>
 <div className="two">
 <label>Gold weight excluding stones (grams)<input type="number" inputMode="decimal" min="0" step="any" value={weight} onChange={e=>setWeight(e.target.value)} placeholder="e.g. 50"/></label>
 <label>Gold purity / hallmark<select value={karat} onChange={e=>setKarat(Number(e.target.value))}>{[24,22,21,18,14,9].map(k=><option value={k} key={k}>{k} karat ({(100*k/24).toFixed(1)}% gold)</option>)}</select></label>
 </div>
 <div className="two">
 <label>Currency<select value={currency} onChange={e=>setCurrency(e.target.value)}>{currencies.map(c=><option key={c}>{c}</option>)}</select></label>
 <label>Current 24-karat gold price per gram<input type="number" inputMode="decimal" min="0" step="any" value={price} onChange={e=>setPrice(e.target.value)} placeholder="Enter a verified price"/></label>
 </div>
 <p className="small">Use a verified market value for pure (24k) gold per gram, in your selected currency. This is an approximate metal-content valuation, not a jewellery resale quote.</p>
 {data&&p>0?<><div className="two"><div className="result"><span>Pure gold equivalent</span><strong>{data.pureGoldGrams.toFixed(2)} g</strong></div><div className="result"><span>Indicative gold content value</span><strong>{money(data.estimatedValue,currency)}</strong></div></div>
 <div className="result"><span>Conditional 2.5% Zakat on this gold</span><strong>{money(data.conditionalZakat,currency)}</strong></div></>:<p className="warn">Enter a non-negative weight and a positive 24k gold price per gram to calculate.</p>}
 <label className="check"><input type="checkbox" checked={hawl} onChange={e=>setHawl(e.target.checked)}/> I've checked my applicable Nisab, hawl and jewellery rulings.</label>
 {!hawl&&<p className="warn">This figure is not automatically payable. Zakat depends on the total relevant wealth, hawl and scholarly treatment of personal jewellery. Consult qualified guidance before deciding what you owe.</p>}
 <p className="small">Non-gold gemstones, workmanship and retail markup are not counted in the metal-content valuation. Some schools exempt personal-use jewellery and others do not.</p>
 </div>;
}

export function IslamicEvents() {
 const [offset,setOffset]=useState(0);
 const base=new Date();base.setUTCFullYear(base.getUTCFullYear()+offset);
 const upcoming=upcomingEvents(base,12);
 return <div>
 <div className="action-row"><button className="secondary" disabled={offset===0} onClick={()=>setOffset(v=>Math.max(0,v-1))}>← Earlier</button><button className="secondary" disabled={offset===2} onClick={()=>setOffset(v=>Math.min(2,v+1))}>Later year →</button></div>
 <div className="table-wrap"><table><thead><tr><th>Observance</th><th>Calculated Gregorian date</th><th>Hijri date</th></tr></thead><tbody>{upcoming.map(e=><tr key={e.name+e.date}><td><strong>{e.name}</strong></td><td>{prettyDate(e.date)}</td><td>{e.note}, {e.hijriYear} AH</td></tr>)}</tbody></table></div>
 <p className="warn">Illustrative Umm al-Qura calendar conversions only. Actual events, including Ramadan and the Eids, may move with moon sightings and local announcements. Islamic dates begin at sunset, not civil midnight. Laylat al-Qadr is not assigned a fixed date.</p>
 </div>;
}

export function PrayerChart(){
 const [start,setStart]=useState(()=>localISODate()),[days,setDays]=useState(30);
 const dates=printableDates(start,days);
 return <div>
 <div className="two print-hide">
  <label>First day<input type="date" value={start} onChange={e=>setStart(e.target.value)} /></label>
  <label>Chart length<select value={days} onChange={e=>setDays(Number(e.target.value))}><option value={7}>7 days</option><option value={14}>14 days</option><option value={30}>30 days</option></select></label>
 </div>
 <p className="small print-hide">Print the blank checklist and tick each prayer on paper. No account or personal data is required.</p>
 {dates.length>0?<div className="table-wrap"><table className="chart-print"><thead><tr><th>Date</th><th>Fajr</th><th>Dhuhr</th><th>Asr</th><th>Maghrib</th><th>Isha</th></tr></thead><tbody>{dates.map(d=><tr key={d}><td>{new Intl.DateTimeFormat('en-GB',{day:'2-digit',month:'short',timeZone:'UTC'}).format(new Date(d+'T12:00:00Z'))}</td>{['fajr','dhuhr','asr','maghrib','isha'].map(p=><td className="chart-box" key={p}>□</td>)}</tr>)}</tbody></table></div>:<p className="warn">Choose a valid date.</p>}
 <div className="action-row print-hide"><button onClick={()=>window.print()}>Print / Save as PDF</button></div>
 <p className="small print-hide">Tip: use your browser's Print command and choose 'Save as PDF' for a reusable file.</p>
 </div>;
}
