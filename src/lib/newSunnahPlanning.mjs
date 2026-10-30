import {hijriParts,hijriMonth,adjacentMonth,HIJRI_MONTHS} from './hijriCalendars.mjs';
import {dateFromISO,isoPlusDays} from './growthCalculations.mjs';

/** Date-only logic uses UTC noon and an explicitly labelled Umm al-Qura estimate. */
export const validISO=value=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&!!dateFromISO(value);
export const dateText=value=>{
 if(!validISO(value))return 'Invalid date';
 return new Intl.DateTimeFormat('en-GB',{weekday:'short',day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(value+'T12:00:00Z'));
};
export function hijamaPlan(anchorISO,months=12,shift=0){
 if(!validISO(anchorISO)||![3,6,12].includes(months)||![-1,0,1].includes(shift))return null;
 const today=hijriParts(new Date(anchorISO+'T12:00:00Z'));
 if(!today)return null;
 const entries=[];
 for(let index=0;index<months+2&&entries.length<months;index++){
  const target=adjacentMonth(today.year,today.month,index);
  const h=target&&hijriMonth(target.year,target.month);
  if(!h)break;
  const dates=[17,19,21].map(day=>{
   const cell=h.cells.find(x=>x?.day===day);
   const shifted=cell?isoPlusDays(cell.iso,shift):null;
   return cell&&shifted?{day,iso:shifted,originalISO:cell.iso}:null;
  }).filter(d=>d!==null);
  if(dates.some(d=>d.iso>=anchorISO))entries.push({year:h.year,month:h.month,name:h.name,dates});
 }
 return {entries,anchorISO,shift};
}
export function sunnahFastingPlan(anchorISO,days=90,shift=0){
 if(!validISO(anchorISO)||![30,90,180].includes(days)||![-1,0,1].includes(shift))return null;
 const results=[];
 for(let i=0;i<days;i++){
  const dayISO=isoPlusDays(anchorISO,i);
  if(!dayISO)continue;
  const date=new Date(dayISO+'T12:00:00Z');
  // The calendar shift is illustrative only: it does not establish sighting.
  const calendarISO=isoPlusDays(dayISO,-shift);
  if(!calendarISO)continue;
  const calendarDate=new Date(calendarISO+'T12:00:00Z');
  const h=hijriParts(calendarDate);
  if(!h)continue;
  const weekday=date.getUTCDay();
  const labels=[];
  if(weekday===1)labels.push('Monday');
  if(weekday===4)labels.push('Thursday');
  if(h.day>=13&&h.day<=15)labels.push('White Days');
  if(h.month===12&&h.day===9)labels.push('Arafah (for non-pilgrims)');
  if(h.month===1&&h.day===10)labels.push('Ashura');
  // Ordinary voluntary fasts must not be suggested for Ramadan,
  // Eid al-Fitr, Eid al-Adha or days of Tashriq.
  const blocked=h.month===9||(h.month===10&&h.day===1)||(h.month===12&&h.day>=10&&h.day<=13);
  if(!labels.length)continue;
  results.push({iso:dayISO,hijriDay:h.day,hijriMonth:HIJRI_MONTHS[h.month-1],hijriYear:h.year,labels,
   allowed:!blocked,reason:blocked?(h.month===9?'Ramadan obligatory fasting, not a voluntary fast':h.month===10?'Eid al-Fitr':'Eid al-Adha / days of Tashriq'):''});
 }
 return results;
}
export function aqiqahDates(birthISO){
 if(!validISO(birthISO))return null;
 const daySeven=isoPlusDays(birthISO,6),alternative=isoPlusDays(birthISO,7);
 const dayFourteen=isoPlusDays(birthISO,13),dayTwentyOne=isoPlusDays(birthISO,20);
 if(!daySeven||!alternative||!dayFourteen||!dayTwentyOne)return null;
 // The alternative illustrates another possible counting convention, not a prescribed day.
 return {birthISO,daySeven,alternative,dayFourteen,dayTwentyOne};
}
export function duhaWindow(sunrise,dhuhr,afterSunrise=20,beforeDhuhr=10){
 const parse=value=>{
  if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(value))return null;
  const [h,m]=value.split(':').map(Number);return h*60+m;
 };
 const a=parse(sunrise),b=parse(dhuhr);
 if(a===null||b===null||b-a<90||b-a>950||afterSunrise<15||beforeDhuhr<5)return null;
 const format=n=>String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0');
 if(a+afterSunrise>=b-beforeDhuhr)return null;
 return {start:format(a+afterSunrise),end:format(b-beforeDhuhr),sunrise,dhuhr};
}
const escapeIcs=s=>String(s).replaceAll('\\','\\\\').replaceAll(';','\\;').replaceAll(',','\\,').replaceAll('\n','\\n');
export function datePlanICS(entries,label,stamp=new Date()){
 if(!Array.isArray(entries)||entries.length>600||!entries.every(x=>validISO(x.iso)&&typeof x.title==='string'&&x.title.length<=180))throw new RangeError('Invalid calendar entries');
 const stampText=stamp.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','CALSCALE:GREGORIAN','PRODID:-//Sunnah Tools//Optional Date Planner//EN','X-WR-CALNAME:'+escapeIcs(label)];
 const seen=new Set();
 for(const e of entries){
  const key=e.iso+'-'+e.title;if(seen.has(key))continue;seen.add(key);
  const next=isoPlusDays(e.iso,1);
  if(!next)throw new RangeError('Calendar date outside the supported range');
  lines.push('BEGIN:VEVENT','UID:'+e.iso.replaceAll('-','')+'-'+seen.size+'@sunnah.tools',
   'DTSTAMP:'+stampText,'DTSTART;VALUE=DATE:'+e.iso.replaceAll('-',''),
   'DTEND;VALUE=DATE:'+next.replaceAll('-',''),
   'SUMMARY:'+escapeIcs(e.title),
   'DESCRIPTION:'+escapeIcs('Estimated date only. Confirm local moon sighting and applicable religious guidance.'),
   'END:VEVENT');
 }
 return [...lines,'END:VCALENDAR'].join('\r\n')+'\r\n';
}
