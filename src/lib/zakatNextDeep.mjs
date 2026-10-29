import {hijriToGregorian} from './calculations.mjs';
import {hijriParts,HIJRI_MONTHS} from './hijriCalendars.mjs';
import {dateFromISO,isoPlusDays} from './growthCalculations.mjs';

const pennies=n=>Math.round((n+Number.EPSILON)*100)/100;
const valid=(n,max=1e10)=>typeof n==='number'&&Number.isFinite(n)&&n>=0&&n<=max;
const positive=n=>valid(n)&&n>0;

/** Calculated civil date reminder only. This does not determine Zakat liability. */
export function hawlReviewTimeline(reference,asOf=new Date(),count=3,shift=0){
 if(!dateFromISO(reference)||!(asOf instanceof Date)||Number.isNaN(asOf.getTime())||
 !Number.isInteger(count)||count<1||count>6||![-1,0,1].includes(shift))return null;
 const start=dateFromISO(reference),hijri=hijriParts(start);
 if(!hijri||start.getTime()>asOf.getTime()+86400000)return null;
 const today=asOf.toISOString().slice(0,10),reviews=[];
 for(let offset=1;offset<=120&&reviews.length<count;offset++){
  const year=hijri.year+offset;
  if(year>1599)break;
  let day=hijri.day,converted=hijriToGregorian(year,hijri.month,day),clamped=false;
  if(!converted&&day===30){day=29;converted=hijriToGregorian(year,hijri.month,29);clamped=!!converted}
  if(!converted)continue;
  const iso=converted.toISOString().slice(0,10),illustrativeISO=isoPlusDays(iso,shift);
  if(illustrativeISO&&illustrativeISO>=today)reviews.push({year,month:hijri.month,day,monthName:HIJRI_MONTHS[hijri.month-1],iso,illustrativeISO,clamped});
 }
 if(reviews.length!==count)return null;
 return {reference,originalHijri:hijri,shift,reviews,asOf:today};
}
/** All-day calendar markers, not a payment-demand notification. */
export function hawlReviewICS(timeline,stamp=new Date()){
 if(!timeline||!Array.isArray(timeline.reviews)||!timeline.reviews.length||
 !(stamp instanceof Date)||Number.isNaN(stamp.getTime()))throw new RangeError('Invalid timeline');
 const dtstamp=stamp.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','CALSCALE:GREGORIAN','METHOD:PUBLISH','PRODID:-//Sunnah Tools//Zakat Review Reminder//EN'];
 for(const r of timeline.reviews){
  if(!dateFromISO(r.illustrativeISO))throw new RangeError('Invalid review date');
  const next=isoPlusDays(r.illustrativeISO,1);
  if(!next)throw new RangeError('Invalid review date');
  lines.push('BEGIN:VEVENT','UID:hawl-review-'+r.year+'-'+r.illustrativeISO+'@sunnah.tools',
   'DTSTAMP:'+dtstamp,'DTSTART;VALUE=DATE:'+r.illustrativeISO.replaceAll('-',''),
   'DTEND;VALUE=DATE:'+next.replaceAll('-',''),
   'SUMMARY:Review Zakat wealth - estimated Hijri anniversary',
   'DESCRIPTION:Calendar reminder only. Check Nisab continuity and applicable hawl rules. Umm al-Qura projection; local moon sighting can differ. NOT an automatic Zakat obligation.',
   'END:VEVENT');
 }
 return lines.concat('END:VCALENDAR','').join('\r\n');
}

export const INVESTMENT_TYPES=Object.freeze([
 {id:'trading-share',label:'Shares acquired for resale'},
 {id:'long-share',label:'Long-term shares or equity funds'},
 {id:'currency-crypto',label:'Currency-like / trading crypto holding'},
 {id:'utility-token',label:'Utility or other token requiring assessment'}
]);
/** Intention/asset classification is user-entered; not a religious determination. */
/** @param {{entries:Array<{kind:string,value:number,method?:string,percent?:number}>,otherWealth?:number,liabilities?:number,nisab?:number|null}} input */
export function investmentZakatBreakdown({entries,otherWealth=0,liabilities=0,nisab=null}){
 if(!Array.isArray(entries)||entries.length<1||entries.length>16||
 !valid(otherWealth)||!valid(liabilities)||(nisab!==null&&!positive(nisab)))return null;
 const lines=[];
 for(const [i,entry] of entries.entries()){
  if(!entry||!INVESTMENT_TYPES.some(t=>t.id===entry.kind)||!valid(entry.value,1e11))return null;
  let fraction=1,assumption='Full market value, user classification';
  if(entry.kind==='long-share'){
   if(entry.method==='proxy25'){fraction=0.25;assumption='Optional 25% proxy only if the chosen guidance accepts it'}
   else if(entry.method==='underlying'&&valid(entry.percent,100)){fraction=entry.percent/100;assumption='User-entered proportion of underlying zakatable assets'}
   else return null;
  }
  if(entry.kind==='utility-token'){
   if(entry.method!=='assessed'||!valid(entry.percent,100))return null;
   fraction=entry.percent/100;assumption='Explicit user-entered qualified assessment, not automatic exclusion';
  }
  if(!['long-share','utility-token'].includes(entry.kind)&&entry.method&&entry.method!=='full')return null;
  lines.push({index:i+1,kind:entry.kind,value:entry.value,fraction,assumption,zakatable:pennies(entry.value*fraction)});
 }
 const investmentBase=pennies(lines.reduce((sum,r)=>sum+r.zakatable,0));
 const totalBase=pennies(investmentBase+otherWealth);
 const net=pennies(Math.max(0,totalBase-liabilities));
 if(![investmentBase,totalBase,net].every(x=>valid(x,1e12)))return null;
 const status=nisab===null?'unchecked':net>=nisab?'threshold-reached':'below-threshold';
 return {lines,investmentBase,totalBase,net,nisab,status,conditionalZakat:status==='threshold-reached'?pennies(net*0.025):0,
  hypotheticalZakat:pennies(net*0.025)};
}
/** Whole-animal cost split versus N out of 7 animal shares; minor-unit-preserving rounding. */
export function qurbaniAllocation({animal,price,participants=1,mode='shares'}){
 const capacity=['sheep','goat'].includes(animal)?1:['cow','buffalo','camel'].includes(animal)?7:0;
 if(!capacity||!positive(price)||price>1e9||!Number.isSafeInteger(participants)||participants<1||participants>capacity||!['shares','whole'].includes(mode))return null;
 const minor=Math.round(price*100);
 if(!Number.isSafeInteger(minor)||minor<1)return null;
 const slots=mode==='whole'?participants:capacity;
 const low=Math.floor(minor/slots),remainder=minor%slots;
 const all=Array.from({length:slots},(_,i)=>(low+(i<remainder?1:0))/100);
 const allocation=mode==='whole'?all:all.slice(0,participants);
 const selectedMinor=allocation.reduce((s,x)=>s+Math.round(x*100),0);
 return {capacity,participants,mode,total:minor/100,unitMinimum:low/100,unitMaximum:(low+(remainder?1:0))/100,
  allocation,selectedTotal:selectedMinor/100,unallocated:(minor-selectedMinor)/100,remainingShares:mode==='whole'?0:capacity-participants,
  penniesDistributed:remainder};
}
export function safeSummary(value){return String(value??'').replace(/[\r\n\t\u0000-\u001f]/g,' ').slice(0,90)}
