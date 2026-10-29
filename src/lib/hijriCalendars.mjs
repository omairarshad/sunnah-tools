import {hijriToGregorian} from './calculations.mjs';
import {dateFromISO,isoPlusDays} from './growthCalculations.mjs';
export const HIJRI_MONTHS=['Muharram','Safar',"Rabi al-Awwal","Rabi al-Thani",'Jumada al-Ula','Jumada al-Akhirah','Rajab',"Sha'ban",'Ramadan','Shawwal',"Dhul Qa'dah",'Dhul Hijjah'];
const formatter=new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura',{year:'numeric',month:'numeric',day:'numeric',timeZone:'UTC'});
export function hijriParts(date=new Date()){
 if(!(date instanceof Date)||!Number.isFinite(date.getTime()))return null;
 const parts=formatter.formatToParts(date);
 const value=name=>Number(parts.find(part=>part.type===name)?.value);
 const [year,month,day]=['year','month','day'].map(value);
 return Number.isInteger(year)&&Number.isInteger(month)&&Number.isInteger(day)?{year,month,day}:null;
}
export function adjacentMonth(year,month,offset=1){
 if(!Number.isInteger(year)||!Number.isInteger(month)||month<1||month>12||!Number.isInteger(offset))return null;
 const index=year*12+month-1+offset;
 const y=Math.floor(index/12),m=index-y*12+1;
 return y>=1300&&y<=1600?{year:y,month:m}:null;
}
export function hijriMonth(year,month){
 if(!Number.isInteger(year)||year<1300||year>1599||!Number.isInteger(month)||month<1||month>12)return null;
 const next=adjacentMonth(year,month);
 const first=hijriToGregorian(year,month,1),lastBoundary=next?hijriToGregorian(next.year,next.month,1):null;
 if(!first||!lastBoundary)return null;
 const ms=86400000,days=Math.round((lastBoundary.getTime()-first.getTime())/ms);
 if(days!==29&&days!==30)return null;
 const mondayOffset=(first.getUTCDay()+6)%7;
 /** @type {Array<null|{day:number,iso:string,weekday:number,whiteDay:boolean,fastingStatus:string}>} */
 const cells=Array.from({length:mondayOffset},()=>null);
 for(let day=1;day<=days;day++){
  const date=new Date(first.getTime()+(day-1)*ms);
  cells.push({day,iso:date.toISOString().slice(0,10),weekday:date.getUTCDay(),whiteDay:day>=13&&day<=15,fastingStatus:month===12&&day===13?'not-recommended':month===9?'ramadan-obligatory':day>=13&&day<=15?'voluntary-day':'other'});
 }
 return {year,month,name:HIJRI_MONTHS[month-1],days,start:first.toISOString().slice(0,10),end:new Date(lastBoundary.getTime()-ms).toISOString().slice(0,10),cells};
}
export function whiteDaysFrom(start=new Date(),monthCount=6){
 const today=hijriParts(start);if(!today||!Number.isInteger(monthCount)||monthCount<1||monthCount>24)return [];
 const isoToday=start.toISOString().slice(0,10);
 const list=[];
 for(let i=0;i<monthCount+1;i++){
  const target=adjacentMonth(today.year,today.month,i),month=target&&hijriMonth(target.year,target.month);
  if(!month)continue;
  const candidates=month.cells.filter(cell=>cell&&cell.whiteDay&&cell.iso>=isoToday);
  if(candidates.length)list.push({year:month.year,month:month.month,name:month.name,dates:candidates.map(({day,iso,fastingStatus})=>({day,iso,fastingStatus}))});
  if(list.length>=monthCount)break;
 }
 return list;
}
/** Full 13–15 date sets, beginning with the current month only if its 15th has not passed. */
export function whiteDaysPlan(reference,monthCount=6,dayShift=0){
 if(!(reference instanceof Date)||!Number.isFinite(reference.getTime())||![3,6,12].includes(monthCount)||![-1,0,1].includes(dayShift))return null;
 const today=hijriParts(reference),isoToday=reference.toISOString().slice(0,10);
 if(!today)return null;
 const startOffset=today.day>15?1:0;
 const months=[];
 for(let index=0;index<monthCount;index++){
  const target=adjacentMonth(today.year,today.month,startOffset+index),month=target&&hijriMonth(target.year,target.month);
  if(!month)return null;
  const dates=month.cells.filter(cell=>cell?.whiteDay).map(cell=>({
   day:cell.day,iso:isoPlusDays(cell.iso,dayShift),originalISO:cell.iso,
   fastingStatus:cell.fastingStatus,passed:isoPlusDays(cell.iso,dayShift)<isoToday
  }));
  months.push({year:month.year,month:month.month,name:month.name,dates});
 }
 return {months,dayShift,reference:isoToday,eligible:months.flatMap(month=>month.dates).filter(d=>d.fastingStatus==='voluntary-day'&&!d.passed).length};
}
const csvCell=value=>{let s=String(value??'');if(/^[\s]*[=+\-@]/.test(s))s="'"+s;return /[",\r\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s};
export function whiteDaysCSV(plan){
 if(!plan||!Array.isArray(plan.months)||![-1,0,1].includes(plan.dayShift))throw new RangeError('Invalid White Days plan');
 const lines=[['Hijri year','Hijri month','Hijri day','Estimated Gregorian date','Status','Past at reference date','Illustrative day shift','Basis']];
 for(const month of plan.months)for(const d of month.dates)lines.push([month.year,month.name,d.day,d.iso,d.fastingStatus,d.passed?'Yes':'No',plan.dayShift,'Umm al-Qura; confirm local moon sighting']);
 return '\uFEFF'+lines.map(line=>line.map(csvCell).join(',')).join('\r\n')+'\r\n';
}
/** Voluntary dates only; Ramadan and 13 Dhul Hijjah are never exported as optional fasts. */
export function whiteDaysIcs(plan,stamp=new Date()){
 if(!plan||!Array.isArray(plan.months)||!(stamp instanceof Date)||!Number.isFinite(stamp.getTime()))throw new RangeError('Invalid White Days export');
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','CALSCALE:GREGORIAN','PRODID:-//Sunnah Tools//White Days Planner//EN'];
 const seen=new Set(),dtstamp=stamp.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
 for(const month of plan.months)for(const d of month.dates){
  if(d.fastingStatus!=='voluntary-day'||d.passed)continue;
  if(!dateFromISO(d.iso)||!Number.isInteger(d.day)||![13,14,15].includes(d.day)||seen.has(d.iso))throw new RangeError('Invalid White Day export');
  seen.add(d.iso);
  lines.push('BEGIN:VEVENT','UID:'+d.iso+'-white-days@sunnah.tools','DTSTAMP:'+dtstamp,'DTSTART;VALUE=DATE:'+d.iso.replaceAll('-',''),'DTEND;VALUE=DATE:'+isoPlusDays(d.iso,1).replaceAll('-',''),`SUMMARY:White Days - Hijri ${d.day} (date reminder)`,'DESCRIPTION:All-day planning marker. Calculated Umm al-Qura date; confirm local sighting and individual fasting guidance.','END:VEVENT');
 }
 return [...lines,'END:VCALENDAR'].join('\r\n')+'\r\n';
}
