/* Portable, account-free data formats; no network requests or outside libraries. */
export const PRAYER_NAMES=['Fajr','Dhuhr','Asr','Maghrib','Isha','Witr'];
const isRecord=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
export function validCivilDate(value){
 if(typeof value!=='string'||!/^20\d\d-\d\d-\d\d$/.test(value))return false;
 const d=new Date(value+'T12:00:00Z');
 return Number.isFinite(d.getTime())&&d.toISOString().slice(0,10)===value;
}
const int=(n,min,max)=>Number.isSafeInteger(n)&&n>=min&&n<=max;
const numericString=(s,min,max)=>typeof s==='string'&&s.length<=12&&s.trim()!==''&&Number.isFinite(Number(s))&&Number(s)>=min&&Number(s)<=max;
const optionalDate=s=>s===''||validCivilDate(s);
export function validateQuranPlan(v){
 if(!isRecord(v)||!int(v.pages,1,10000)||!int(v.days,1,3650)||!int(v.done,0,v.pages)||!validCivilDate(v.start))return null;
 return {pages:v.pages,days:v.days,done:v.done,start:v.start};
}
export function validateQadaPlan(v){
 if(!isRecord(v)||v.version!==2||!['days','years','range'].includes(v.mode)||!numericString(v.days,1,36525)||!numericString(v.years,.01,100)||!numericString(v.excluded,0,36525)||typeof v.start!=='string'||typeof v.end!=='string'||!optionalDate(v.start)||!optionalDate(v.end)||typeof v.witr!=='boolean'||!isRecord(v.overrides)||!isRecord(v.done))return null;
 /** @type {Record<string,string>} */ const overrides={};
 /** @type {Record<string,number>} */ const done={};
 for(const key of Object.keys(v.overrides)){
  if(!PRAYER_NAMES.includes(key))return null;
  const entry=v.overrides[key];
  if(entry!==''&&!numericString(entry,0,1000000))return null;
  overrides[key]=entry;
 }
 for(const key of Object.keys(v.done)){
  if(!PRAYER_NAMES.includes(key)||!int(v.done[key],0,1000000))return null;
  done[key]=v.done[key];
 }
 return {version:2,mode:v.mode,days:v.days,years:v.years,start:v.start,end:v.end,excluded:v.excluded,witr:v.witr,overrides,done};
}
export function validateSalahHistory(v){
 if(!isRecord(v)||v.version!==1||!isRecord(v.entries)||Object.keys(v.entries).length>366)return null;
 const entries={};
 for(const [date,prayers] of Object.entries(v.entries)){
  if(!validCivilDate(date)||!Array.isArray(prayers)||prayers.length>5||prayers.some(p=>!PRAYER_NAMES.slice(0,5).includes(p))||new Set(prayers).size!==prayers.length)return null;
  entries[date]=prayers;
 }
 return {version:1,entries};
}
const toUtc=d=>{
 if(!(d instanceof Date)||!Number.isFinite(d.getTime()))throw new RangeError('Invalid calendar time');
 return d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
};
const escapeIcs=value=>String(value).replace(/\\/g,'\\\\').replace(/\r\n|\r|\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
/** Events are actual UTC instants, not formatted clock strings. DST is already represented in the dates. */
export function makeRamadanIcs(rows,stamp=new Date(),metadata={}){
 if(!Array.isArray(rows)||rows.length<1||rows.length>30)throw new RangeError('Expected 1 to 30 Ramadan dates');
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','CALSCALE:GREGORIAN','PRODID:-//Sunnah Tools//Ramadan Calendar//EN','METHOD:PUBLISH'];
 const fields=['location','zone','method','highLatitude','polar'];
 const details=fields.map(key=>typeof metadata[key]==='string'?metadata[key].slice(0,110):'');
 const coordinates=Number.isFinite(metadata.latitude)&&Number.isFinite(metadata.longitude)?`${metadata.latitude}, ${metadata.longitude}`:'';
 const calendarContext=[...details,coordinates].filter(Boolean).join(' | ');
 // A stable context-specific UID avoids replacing one city's imported calendar
 // events with a different city's events when both are imported.
 const signature=calendarContext?(Array.from(calendarContext).reduce((hash,char)=>Math.imul(hash^char.charCodeAt(0),16777619),2166136261)>>>0).toString(16):'';
 const seen=new Set();
 for(const row of rows){
  if(!validCivilDate(row.day)||!(row.fajr instanceof Date)||!(row.maghrib instanceof Date)||row.fajr.getTime()>=row.maghrib.getTime()||seen.has(row.day))throw new RangeError('Invalid Ramadan time or repeated day');
  seen.add(row.day);
  for(const [key,title,instant] of [['fajr','Suhoor cutoff (calculated Fajr)',row.fajr],['maghrib','Iftar (calculated Maghrib)',row.maghrib]]){
   const start=toUtc(instant),end=toUtc(new Date(instant.getTime()+60000));
   lines.push('BEGIN:VEVENT','UID:'+row.day+'-'+key+(signature?'-'+signature:'')+'@sunnah.tools','DTSTAMP:'+toUtc(stamp),'DTSTART:'+start,'DTEND:'+end,'SUMMARY:'+escapeIcs(title),...(details[0]?['LOCATION:'+escapeIcs(details[0])]:[]),'DESCRIPTION:'+escapeIcs('Calculated estimate. Confirm local Ramadan dates and mosque times.'+(calendarContext?' Settings: '+calendarContext:'')),'END:VEVENT');
  }
 }
 lines.push('END:VCALENDAR');
 return lines.join('\r\n')+'\r\n';
}
export function downloadText(filename,text,type='application/json'){
 if(typeof window==='undefined')return;
 const url=URL.createObjectURL(new Blob([text],{type}));
 const a=document.createElement('a');a.href=url;a.download=filename;a.click();
 window.setTimeout(()=>URL.revokeObjectURL(url),1500);
}
