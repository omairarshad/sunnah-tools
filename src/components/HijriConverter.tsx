import {useState} from 'react';
import {localISODate} from '../lib/calculations.mjs';
import {downloadText} from '../lib/personalTools.mjs';
import {HIJRI_CALENDAR_METHODS,HIJRI_MONTH_NAMES,gregorianToHijri,hijriToGregorianDate,hijriMonthRange,hijriDateLabel,parseGregorianDate,shiftGregorianDate} from '../lib/hijriConversion.mjs';

type Method='islamic-umalqura'|'islamic-civil';
const readableDate=(iso:string|null)=>{
 const date=iso&&parseGregorianDate(iso);
 return date?new Intl.DateTimeFormat('en-GB',{dateStyle:'full',timeZone:'UTC'}).format(date):'Unavailable';
};
const others=(selected:Method):Method=>selected==='islamic-umalqura'?'islamic-civil':'islamic-umalqura';

export default function HijriConverter(){
 const [direction,setDirection]=useState<'to-hijri'|'to-gregorian'>('to-hijri');
 const [calendar,setCalendar]=useState<Method>('islamic-umalqura');
 const [gregorian,setGregorian]=useState(()=>localISODate());
 const [afterSunset,setAfterSunset]=useState(false);
 const [year,setYear]=useState(1448),[month,setMonth]=useState(1),[day,setDay]=useState(1);
 const [message,setMessage]=useState('');
 const comparison=others(calendar);
 const adjusted=direction==='to-hijri'?(afterSunset?shiftGregorianDate(gregorian,1):gregorian):null;
 const main=direction==='to-hijri'&&adjusted?gregorianToHijri(adjusted,calendar):null;
 const compare=direction==='to-hijri'&&adjusted?gregorianToHijri(adjusted,comparison):null;
 const reverse=direction==='to-gregorian'?hijriToGregorianDate(year,month,day,calendar):null;
 const reverseCompare=direction==='to-gregorian'?hijriToGregorianDate(year,month,day,comparison):null;
 const period=direction==='to-hijri'&&main?hijriMonthRange(main.year,main.month,calendar):hijriMonthRange(year,month,calendar);
 const valid=direction==='to-hijri'?Boolean(main&&compare):Boolean(reverse);
 const heading=HIJRI_CALENDAR_METHODS[calendar];
 const copyable=()=>{
  const lines=[`Hijri date conversion — ${heading}`,direction==='to-hijri'?
   `Gregorian date: ${gregorian}${afterSunset?' (viewing after sunset; following lunar day is illustrative)':''}`:
   `Hijri date: ${day} ${HIJRI_MONTH_NAMES[month-1]??'unknown'} ${year} AH`];
  if(direction==='to-hijri')lines.push(`Umm al-Qura: ${hijriDateLabel(gregorianToHijri(adjusted!,'islamic-umalqura'))}`,`Civil/tabular: ${hijriDateLabel(gregorianToHijri(adjusted!,'islamic-civil'))}`);
  else lines.push(`${heading}: ${reverse??'Unavailable'}`,`${HIJRI_CALENDAR_METHODS[comparison]}: ${reverseCompare??'Unavailable'}`);
  if(period)lines.push(`Selected calendar month: ${period.start} to ${period.end} (${period.days} days)`);
  lines.push('Calculated calendar comparison only. A local crescent-sighting decision and the sunset boundary may change the religious date. Confirm important observances with your local authority.');
  return lines.join('\n');
 };
 const copy=async()=>{
  if(!valid)return;
  try{if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');await navigator.clipboard.writeText(copyable());setMessage('Conversion summary copied.')}catch{setMessage('Clipboard unavailable. You can download the text summary instead.')}
 };
 const exportText=()=>{
  if(!valid)return;
  try{downloadText('hijri-conversion-'+(direction==='to-hijri'?gregorian:`${year}-${month}-${day}`)+'.txt',copyable(),'text/plain;charset=utf-8');setMessage('Text summary downloaded.')}catch{setMessage('Could not download the summary on this device.')}
 };
 return <div className="hijri-converter">
  <p className="small">Compare two defined calendar systems for planning. Neither result reports an observed crescent or determines an official Ramadan or Eid date.</p>
  <div className="hijri-converter-settings">
   <label>Conversion direction
    <select value={direction} onChange={event=>{setDirection(event.target.value as typeof direction);setMessage('')}}>
     <option value="to-hijri">Gregorian → Hijri</option><option value="to-gregorian">Hijri → Gregorian</option>
    </select>
   </label>
   <label>Primary calendar system
    <select value={calendar} onChange={event=>{setCalendar(event.target.value as Method);setMessage('')}}>
     <option value="islamic-umalqura">Umm al-Qura (calculated)</option>
     <option value="islamic-civil">Civil Hijri (tabular)</option>
    </select>
   </label>
  </div>
  {direction==='to-hijri'?<>
   <label>Gregorian calendar date
    <input type="date" value={gregorian} onChange={event=>{setGregorian(event.target.value);setMessage('')}}/>
   </label>
   <div className="hijri-converter-actions"><button type="button" className="secondary" onClick={()=>{setGregorian(localISODate());setAfterSunset(false);setMessage('')}}>Use today's local date</button></div>
   <label className="hijri-sunset-option"><input type="checkbox" checked={afterSunset} onChange={event=>{setAfterSunset(event.target.checked);setMessage('')}}/> View the next lunar day (if your local sunset has passed)</label>
   {afterSunset&&<p className="hijri-inline-note">Illustration only: this advances the displayed calendar day. The tool cannot verify your local sunset or moon sighting.</p>}
   {main&&compare?<>
    <div className="hijri-primary-result" role="status"><span>{heading}</span><strong>{hijriDateLabel(main)}</strong><small>{readableDate(gregorian)}{afterSunset?' · after-sunset illustration':''}</small></div>
    <div className="hijri-compare-grid"><div><span>Umm al-Qura</span><strong>{hijriDateLabel(gregorianToHijri(adjusted!,'islamic-umalqura'))}</strong></div><div><span>Civil / tabular</span><strong>{hijriDateLabel(gregorianToHijri(adjusted!,'islamic-civil'))}</strong></div></div>
    <p className="small">{main.year===compare.year&&main.month===compare.month&&main.day===compare.day?'Both calendar systems agree on this date.':'The two calendar systems differ here. Neither automatically overrules your local moon-sighting decision.'}</p>
   </>:<p role="alert" className="warn">Select a valid Gregorian date within the supported 1300–1600 AH calendar range (roughly 1882–2174 CE).</p>}
  </>:<>
   <div className="hijri-three-inputs">
    <label>Hijri year (AH)<input type="number" min="1300" max="1600" step="1" value={year} onChange={event=>{setYear(Number(event.target.value));setMessage('')}}/></label>
    <label>Hijri month<select value={month} onChange={event=>{setMonth(Number(event.target.value));setMessage('')}}>{HIJRI_MONTH_NAMES.map((name,index)=><option key={name} value={index+1}>{index+1} · {name}</option>)}</select></label>
    <label>Hijri day<input type="number" min="1" max="30" step="1" value={day} onChange={event=>{setDay(Number(event.target.value));setMessage('')}}/></label>
   </div>
   {reverse?<>
    <div className="hijri-primary-result" role="status"><span>{heading}</span><strong>{readableDate(reverse)}</strong><small>Gregorian civil date · {reverse}</small></div>
    <div className="hijri-compare-grid"><div><span>{heading}</span><strong>{reverse}</strong></div><div><span>{HIJRI_CALENDAR_METHODS[comparison]}</span><strong>{reverseCompare??'Invalid day for that calendar'}</strong></div></div>
    <p className="small">The same numbered Hijri date can correspond to a different Gregorian date under the other calendar method.</p>
   </>:<p role="alert" className="warn">No matching date. Check the year (1300–1600 AH), month and day: a Hijri month may contain only 29 days.</p>}
  </>}
  {period&&<div className="hijri-month-range"><h3>{direction==='to-hijri'?main?.monthName:HIJRI_MONTH_NAMES[month-1]} {direction==='to-hijri'?main?.year:year} AH · {heading}</h3><p><strong>{period.days} days</strong> in this calculated month, from {readableDate(period.start)} to {readableDate(period.end)}.</p><small>Month boundaries are calendar calculations, not confirmed local crescent observations.</small></div>}
  <div className="hijri-converter-actions"><button type="button" className="secondary" disabled={!valid} onClick={copy}>Copy comparison</button><button type="button" className="secondary" disabled={!valid} onClick={exportText}>Download text summary</button></div>
  {message&&<p role="status" className="small">{message}</p>}
  <p className="small">Calculations run in your browser; this converter does not save the dates you enter. Before acting on Ramadan, Eid or other religious dates, consult your local mosque or recognised calendar authority.</p>
 </div>;
}
