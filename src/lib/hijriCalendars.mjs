import {hijriToGregorian} from './calculations.mjs';
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
