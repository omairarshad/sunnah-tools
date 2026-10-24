import {hijriToGregorian,localISODate} from './calculations.mjs';

export function goldValue({weightGrams,karat,price24kPerGram}) {
 if (![weightGrams,karat,price24kPerGram].every(x=>Number.isFinite(x)&&x>=0)||karat<1||karat>24)return null;
 const pureGoldGrams=weightGrams*karat/24;
 const estimatedValue=pureGoldGrams*price24kPerGram;
 return {pureGoldGrams,estimatedValue,conditionalZakat:estimatedValue*0.025};
}
export const ISLAMIC_EVENTS=[
 {name:'Islamic New Year',month:1,day:1,note:'1 Muharram'},
 {name:'Day of Ashura',month:1,day:10,note:'10 Muharram'},
 {name:'Ramadan begins',month:9,day:1,note:'1 Ramadan; confirm local moon sighting'},
 {name:'Eid al-Fitr',month:10,day:1,note:'1 Shawwal; confirm local moon sighting'},
 {name:'Hajj begins',month:12,day:8,note:'8 Dhul Hijjah'},
 {name:'Day of Arafah',month:12,day:9,note:'9 Dhul Hijjah'},
 {name:'Eid al-Adha',month:12,day:10,note:'10 Dhul Hijjah; confirm local announcement'}
];
function hijriYearOn(value) {
 const parts=new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura',{year:'numeric',timeZone:'UTC'}).formatToParts(value);
 return Number(parts.find(x=>x.type==='year')?.value);
}
export function upcomingEvents(today=new Date(),limit=10) {
 if(!(today instanceof Date)||Number.isNaN(today.getTime()))return [];
 const year=hijriYearOn(today);
 if(!Number.isFinite(year))return [];
 const floor=localISODate(today);
 return Array.from({length:3},(_,n)=>year+n).flatMap(hijriYear=>
  ISLAMIC_EVENTS.map(event=>{const calculated=hijriToGregorian(hijriYear,event.month,event.day);return calculated?{...event,hijriYear,date:calculated.toISOString().slice(0,10)}:null}).filter(event=>event!==null)
 ).filter(event=>event.date>=floor).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,limit);
}
export function printableDates(start,days) {
 if(!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(start)||![7,14,30].includes(days))return [];
 const [year,month,day]=start.split('-').map(Number);
 const first=new Date(Date.UTC(year,month-1,day,12));
 if(first.getUTCFullYear()!==year||first.getUTCMonth()!==month-1||first.getUTCDate()!==day)return [];
 return Array.from({length:days},(_,i)=>new Date(first.getTime()+i*86400000).toISOString().slice(0,10));
}
