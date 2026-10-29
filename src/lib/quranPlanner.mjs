import {validCivilDate,validateQuranPlan} from './personalTools.mjs';

/** A planning aid, not a prescribed pace or a fixed Mushaf page map. */
const integer=(n,min,max)=>Number.isSafeInteger(n)&&n>=min&&n<=max;
export function validateQuranSchedule(v){
 if(!v||typeof v!=='object'||Array.isArray(v)||v.version!==3||!integer(v.pages,1,10000)||!integer(v.days,1,3650)||!integer(v.done,0,v.pages)||!validCivilDate(v.start)||![1,3,5].includes(v.sessions)||!integer(v.bufferDays,0,2))return null;
 return {version:3,pages:v.pages,days:v.days,done:v.done,start:v.start,sessions:v.sessions,bufferDays:v.bufferDays};
}
/** Keep existing v2 local plans and user-exported JSON backups usable. */
export function upgradeQuranBackup(raw){
 if(raw&&typeof raw==='object'&&'version' in raw)return validateQuranSchedule(raw);
 const newer=validateQuranSchedule(raw);
 if(newer)return newer;
 const previous=validateQuranPlan(raw);
 return previous?{version:3,...previous,sessions:5,bufferDays:0}:null;
}
const DAY=86400000;
const dateOn=(start,index)=>new Date(Date.parse(start+'T12:00:00Z')+index*DAY).toISOString().slice(0,10);
/** Buffer days are the final 1 or 2 positions in each seven-day plan block. */
export function buildQuranSchedule(input){
 const plan=validateQuranSchedule(input);
 if(!plan)return null;
 const {pages,days,done,start,sessions,bufferDays}=plan;
 const readingDays=Array.from({length:days},(_,index)=>index).filter(index=>index%7<7-bufferDays).length;
 if(!readingDays)return null;
 const remaining=pages-done;
 let readingIndex=0;
 const rows=Array.from({length:days},(_,index)=>{
  const date=dateOn(start,index),buffer=index%7>=7-bufferDays;
  if(buffer)return {number:index+1,date,buffer:true,pages:0,from:null,to:null,sessions:[]};
  const first=done+Math.floor(remaining*readingIndex/readingDays)+1;
  const last=done+Math.floor(remaining*(readingIndex+1)/readingDays);
  readingIndex++;
  const amount=Math.max(0,last-first+1);
  const splits=Array.from({length:sessions},(_,session)=>{
   const from=first+Math.floor(amount*session/sessions);
   const to=first+Math.floor(amount*(session+1)/sessions)-1;
   return from<=to?[{number:session+1,from,to,pages:to-from+1}]:[];
  }).flat();
  return {number:index+1,date,buffer:false,pages:amount,from:amount?first:null,to:amount?last:null,sessions:splits};
 });
 return {rows,readingDays,bufferCount:days-readingDays,remaining,averagePages:remaining/readingDays,averageSessionPages:remaining/readingDays/sessions,endDate:rows.at(-1).date,percent:Math.round(done/pages*100)};
}
const cell=value=>{
 let s=String(value??'');
 if(/^[\s]*[=+\-@]/.test(s))s="'"+s;
 return /[",\r\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;
};
export function quranScheduleCSV(input){
 const plan=validateQuranSchedule(input),result=buildQuranSchedule(input);
 if(!plan||!result)throw new RangeError('Invalid reading schedule');
 const lines=[['Plan day','Gregorian date','Type','Page from','Page to','Pages','Session ranges','Mushaf pages','Pages already read at planning','Reading sessions per day','Buffer days per week'].join(',')];
 for(const row of result.rows){
  const segments=row.sessions.map(s=>s.from===s.to?String(s.from):s.from+'–'+s.to).join(' | ');
  lines.push([row.number,row.date,row.buffer?'Buffer / catch-up':row.pages?'Reading':'Review / no new pages',row.from??'',row.to??'',row.pages,segments,plan.pages,plan.done,plan.sessions,plan.bufferDays].map(cell).join(','));
 }
 return '\uFEFF'+lines.join('\r\n')+'\r\n';
}
