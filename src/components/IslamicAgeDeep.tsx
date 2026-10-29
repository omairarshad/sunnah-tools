import {useState} from 'react';
import {localISODate} from '../lib/calculations.mjs';
import {hijriAge} from '../lib/quranRemembranceDeep.mjs';
export default function IslamicAgeDeep(){
 const [birth,setBirth]=useState(''),[shift,setShift]=useState(0);
 const today=localISODate(),result=hijriAge(birth,today);
 return <div className="fasting-deep-tool">
 <p className="small">Compare your completed <strong>Gregorian (solar) years</strong> with completed <strong>Hijri (lunar) years</strong>, using an explicitly named <strong>Umm al-Qura calendar calculation</strong>. The estimate is for personal interest, not puberty, marriage, legal capacity or religious age-of-accountability decisions.</p>
 <div className="fasting-deep-fields"><label>Gregorian birth date<input type="date" value={birth} onChange={e=>setBirth(e.target.value)} max={today}/></label>
 <label>Illustrative local-calendar difference<select value={shift} onChange={e=>setShift(Number(e.target.value))}><option value={0}>Umm al-Qura calculated (no shift)</option><option value={-1}>One civil day earlier (illustration only)</option><option value={1}>One civil day later (illustration only)</option></select></label></div>
 {result?<><div className="fasting-deep-stats"><div><span>Completed Gregorian years</span><strong>{result.gregorianAge}</strong></div><div><span>Completed calculated Hijri years</span><strong>{result.hijriYears}</strong></div><div><span>Next calculated Hijri birthday</span><strong>{result.nextHijriAnniversary}</strong></div></div>
 <div className="fasting-deep-breakdown"><h3>How these ages compare</h3><p><strong>Birth date:</strong> {birth} (Gregorian) ≈ {result.birthHijriText} (Umm al-Qura).</p><p><strong>Today:</strong> {today} (Gregorian) ≈ {result.todayHijriText}.</p><p><strong>Completed age:</strong> {result.gregorianAge} Gregorian years versus {result.hijriYears} Hijri years.</p>
 <p><strong>Next calculated lunar anniversary:</strong> {result.nextHijriAnniversary} (for Hijri year {result.nextYear}). {result.clamped?'The birthday was day 30 in a month with no day 30 this year; day 29 was used for the reminder.':''}</p>
 {shift!==0&&<p><strong>Local crescent-sighting illustration:</strong> a community calendar could differ by around one civil day. This selector deliberately does not change your numerical age or assert that the official birthday was shifted by {shift} day.</p>}
 </div><div className="action-row print-hide"><button type="button" onClick={()=>window.print()}>Print age comparison</button></div></>:<p className="small" role="status">Enter a valid past Gregorian birth date within the calendar's supported period (Umm al-Qura approximately 1300–1599 AH).</p>}
 <p className="warn">Hijri civil dates often differ from official moon-sighting or sunset conventions, and Hijri months vary between 29 and 30 days. For 29 February births, Gregorian anniversary comparison uses 28 February as a labelled planning convention. No birth date is stored or submitted.</p>
 </div>;
}
