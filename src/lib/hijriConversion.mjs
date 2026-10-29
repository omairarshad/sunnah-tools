/** Calendar-only conversion. A computed Hijri date is not a sighting announcement. */
export const HIJRI_CALENDAR_METHODS={
 'islamic-umalqura':'Umm al-Qura (calculated)',
 'islamic-civil':'Civil Hijri (tabular)'
};
export const HIJRI_MONTH_NAMES=['Muharram','Safar','Rabi al-Awwal','Rabi al-Thani','Jumada al-Ula','Jumada al-Akhirah','Rajab',"Sha'ban",'Ramadan','Shawwal',"Dhul Qa'dah",'Dhul Hijjah'];
const DAY=86400000,NOON=43200000;
const supportedCalendar=calendar=>Object.hasOwn(HIJRI_CALENDAR_METHODS,calendar);
const isoDate=d=>d.toISOString().slice(0,10);

/** UTC noon avoids timezone and daylight-saving rollovers for civil date arithmetic. */
export function parseGregorianDate(iso){
 const match=/^(\d{4})-(\d{2})-(\d{2})$/.exec(iso??'');
 if(!match)return null;
 const [year,month,day]=match.slice(1).map(Number);
 if(year<1||month<1||month>12||day<1||day>31)return null;
 const date=new Date(Date.UTC(year,month-1,day,12));
 return date.getUTCFullYear()===year&&date.getUTCMonth()+1===month&&date.getUTCDate()===day?date:null;
}
export function shiftGregorianDate(iso,days){
 const date=parseGregorianDate(iso);
 return date&&Number.isInteger(days)&&Math.abs(days)<=2?isoDate(new Date(date.getTime()+days*DAY)):null;
}
const formatters=new Map();
function calendarParts(date,calendar){
 let formatter=formatters.get(calendar);
 if(!formatter){
  formatter=new Intl.DateTimeFormat('en-US',{calendar,timeZone:'UTC',numberingSystem:'latn',year:'numeric',month:'numeric',day:'numeric'});
  if(formatter.resolvedOptions().calendar!==calendar)throw new RangeError('Calendar not supported');
  formatters.set(calendar,formatter);
 }
 const entries=formatter.formatToParts(date);
 const value=type=>Number(entries.find(entry=>entry.type===type)?.value);
 const [year,month,day]=['year','month','day'].map(value);
 return [year,month,day].every(Number.isInteger)?{year,month,day}:null;
}
export function gregorianToHijri(iso,calendar='islamic-umalqura'){
 const date=parseGregorianDate(iso);
 if(!date||!supportedCalendar(calendar))return null;
 let parts;
 try{parts=calendarParts(date,calendar)}catch{return null}
 return parts&&parts.year>=1300&&parts.year<=1600&&parts.month>=1&&parts.month<=12
  ?{...parts,monthName:HIJRI_MONTH_NAMES[parts.month-1],calendar}:null;
}
/** Exact inverse by date comparison; does not normalize invalid lunar day 30. */
export function hijriToGregorianDate(year,month,day,calendar='islamic-umalqura'){
 if(!supportedCalendar(calendar)||![year,month,day].every(Number.isInteger)||year<1300||year>1600||month<1||month>12||day<1||day>30)return null;
 const target=year*10000+month*100+day;
 const approximate=622+(year-1)*354.36667/365.2425;
 let low=Math.floor(Date.UTC(Math.floor(approximate)-2,0,1,12)/DAY);
 let high=Math.floor(Date.UTC(Math.floor(approximate)+3,0,1,12)/DAY);
 while(low<=high){
  const middle=Math.floor((low+high)/2);
  let parts;
  try{parts=calendarParts(new Date(middle*DAY+NOON),calendar)}catch{return null}
  if(!parts)return null;
  const key=parts.year*10000+parts.month*100+parts.day;
  if(key===target)return isoDate(new Date(middle*DAY+NOON));
  if(key<target)low=middle+1;else high=middle-1;
 }
 return null;
}
export function hijriMonthRange(year,month,calendar='islamic-umalqura'){
 const start=hijriToGregorianDate(year,month,1,calendar);
 const nextMonth=month===12?1:month+1,nextYear=month===12?year+1:year;
 const following=hijriToGregorianDate(nextYear,nextMonth,1,calendar);
 if(!start)return null;
 // The last supported AH month cannot look ahead to 1601; use its final valid day.
 const finalDay=following?null:hijriToGregorianDate(year,month,30,calendar)??hijriToGregorianDate(year,month,29,calendar);
 const end=following?shiftGregorianDate(following,-1):finalDay;
 if(!end)return null;
 const count=Math.round((parseGregorianDate(end).getTime()-parseGregorianDate(start).getTime())/DAY)+1;
 if(count!==29&&count!==30)return null;
 return {start,end,days:count};
}
export function hijriDateLabel(parts){
 return parts?`${parts.day} ${parts.monthName??HIJRI_MONTH_NAMES[parts.month-1]} ${parts.year} AH`:'Unavailable';
}
