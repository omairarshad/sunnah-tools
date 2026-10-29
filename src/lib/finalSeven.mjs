import {hijriToGregorian} from './calculations.mjs';
import {hijriMonth} from './hijriCalendars.mjs';
import {ISLAMIC_EVENTS} from './extended.mjs';
export const TRAVEL_SCHOOLS=Object.freeze({
 hanafi:'An intended stay of 15 full days is a commonly cited Hanafi distinction; journey distance, city boundary and exceptions require a qualified assessment.',
 shafii:'Four complete intended days is commonly discussed in the Shafi’i school, excluding arrival/departure in certain treatments; seek individual guidance.',
 maliki:'Maliki rules depend on distance, intention and duration and cannot be assessed from a single travel number.',
 hanbali:'Hanbali school rules concerning journey, intention and residence require individual assessment.'
});
export function travelComparison(school,km='',stay=''){
 if(!TRAVEL_SCHOOLS[school]||!(km===''||Number.isFinite(Number(km))&&Number(km)>=0&&Number(km)<=100000)||!(stay===''||Number.isFinite(Number(stay))&&Number(stay)>=0&&Number(stay)<=36500))return null;
 return {note:TRAVEL_SCHOOLS[school],distance:km===''?null:Number(km),stay:stay===''?null:Number(stay),eligible:'not-assessed',
  fard:[['Fajr',2,2],['Dhuhr',4,2],['Asr',4,2],['Maghrib',3,3],['Isha',4,2]]};
}
const iso=d=>d.toISOString().slice(0,10);
export function shiftDate(isoDate,days){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)||!Number.isInteger(days)||Math.abs(days)>366)return null;
 const d=new Date(isoDate+'T12:00:00Z');
 if(!Number.isFinite(d.getTime())||iso(d)!==isoDate)return null;
 d.setUTCDate(d.getUTCDate()+days);return iso(d);
}
export function yearlyEvents(year,filter='all'){
 if(!Number.isInteger(year)||year<1300||year>1599||!['all','fasting','hajj','eid'].includes(filter))return null;
 return ISLAMIC_EVENTS.flatMap(e=>{const d=hijriToGregorian(year,e.month,e.day);return d?[{...e,iso:iso(d),year}]:[]})
  .filter(e=>filter==='all'||filter==='fasting'&&[1,9].includes(e.month)||filter==='hajj'&&e.month===12||filter==='eid'&&e.name.startsWith('Eid'));
}
export function monthCalendar(year,month,shift=0){
 if(![-1,0,1].includes(shift))return null;
 const m=hijriMonth(year,month);
 return m?{...m,shift,days:m.cells.filter(Boolean).map(c=>({...c,displayISO:shiftDate(c.iso,shift)}))}:null;
}
export function dhulDays(year,shift=0){
 if(!Number.isInteger(year)||year<1300||year>1599||![-1,0,1].includes(shift))return null;
 const days=Array.from({length:13},(_,i)=>{
 const d=hijriToGregorian(year,12,i+1);if(!d)return null;
 const day=i+1;return {day,iso:iso(d),displayISO:shiftDate(iso(d),shift),
 label:day===9?'Arafah (estimate)':day===10?'Eid al-Adha — no voluntary fast':day>=11?'Tashreeq — no ordinary voluntary fast':'First ten days'};});
 return days.every(Boolean)?days:null;
}
export function calendarCSV(records){
 if(!Array.isArray(records)||!records.length)return null;
 const safe=(v)=>{let s=String(v??'');if(/^\s*[=+\-@]/.test(s))s="'"+s;return /[",\r\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s};
 return '\uFEFF'+records.map(r=>r.map(safe).join(',')).join('\r\n')+'\r\n';
}
export function eventICS(entries){
 if(!Array.isArray(entries)||!entries.length||entries.length>40)return null;
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','METHOD:PUBLISH','PRODID:-//Sunnah Tools//Estimated Islamic Dates//EN'];
 for(let i=0;i<entries.length;i++){const e=entries[i],next=shiftDate(e.iso,1);
 if(!next||typeof e.label!=='string'||e.label.length>120)return null;
 lines.push('BEGIN:VEVENT','UID:estimate-'+i+'-'+e.iso+'@sunnah.tools','DTSTART;VALUE=DATE:'+e.iso.replaceAll('-',''),'DTEND;VALUE=DATE:'+next.replaceAll('-',''),
  'SUMMARY:'+e.label.replace(/[,;\\\r\n]/g,' '),
  'DESCRIPTION:Estimated Umm al-Qura CIVIL date only. Not local moon sighting or sunset notification. Confirm announcements.',
  'END:VEVENT');}
 return lines.concat('END:VCALENDAR','').join('\r\n');
}
export function saiDirection(n){return Number.isInteger(n)&&n>=0&&n<=7?n===7?'Finished at Marwah':n%2===0?'Safa → Marwah':'Marwah → Safa':null}
export const ADDITIVE_REVIEW=Object.freeze([
 {code:'E120',name:'Carmine / cochineal',source:'Insect-derived red colouring',check:'Ask a recognised halal authority about insect-based ingredients and your followed ruling.'},
 {code:'E322',name:'Lecithins',source:'Often soy, sunflower or egg',check:'Ask for the ingredient source and assess the whole product.'},
 {code:'E422',name:'Glycerol',source:'Can be plant, animal or synthetic',check:'Ask for the feedstock origin and any trustworthy product certification.'},
 {code:'E441',name:'Gelatine',source:'Collagen from animal tissue',check:'Confirm species, slaughter and product-specific certification.'},
 {code:'E471',name:'Mono- and diglycerides',source:'Fatty acid source may be plant or animal',check:'Confirm manufacturer feedstock; the E-number itself does not reveal halal status.'},
 {code:'E472e',name:'DATEM',source:'Fatty-acid ester source varies',check:'Ask the manufacturer about source material and certification.'},
 {code:'E904',name:'Shellac',source:'Lac insect resin',check:'Check the relevant scholarly view and product certification.'},
 {code:'E100',name:'Curcumin',source:'Generally turmeric-derived',check:'Review remaining ingredients; no single additive certifies a product.'},
 {code:'E300',name:'Ascorbic acid',source:'Often synthetic or fermentation-derived',check:'Review the complete formulation.'},
 {code:'E330',name:'Citric acid',source:'Often microbial fermentation',check:'Review the finished product and processes as applicable.'},
 {code:'E406',name:'Agar',source:'Seaweed-derived',check:'Review the complete formulation and certification.'}
]);
export function searchAdditives(q=''){
 if(typeof q!=='string'||q.length>100)return [];
 const term=q.trim().toLowerCase();
 return ADDITIVE_REVIEW.filter(x=>(x.code+' '+x.name+' '+x.source).toLowerCase().includes(term));
}
