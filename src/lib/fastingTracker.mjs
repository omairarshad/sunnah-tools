/** Account-free fasting records: a user-supplied Qada target, undated legacy tally and dated completions. */
import {validCivilDate} from './personalTools.mjs';

const integer=(n,min,max)=>Number.isSafeInteger(n)&&n>=min&&n<=max;
const isRecord=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);

export function validateFastingPlan(value){
 if(!isRecord(value)||value.version!==2||!integer(value.target,0,10000)||!integer(value.carried,0,value.target)||!Array.isArray(value.entries)||value.entries.length>3660)return null;
 const dates=new Set(),entries=[];
 let qada=0;
 for(const row of value.entries){
  if(!isRecord(row)||!validCivilDate(row.date)||!['qada','voluntary'].includes(row.kind)||dates.has(row.date)||Object.keys(row).some(key=>!['date','kind'].includes(key)))return null;
  dates.add(row.date);if(row.kind==='qada')qada++;
  entries.push({date:row.date,kind:row.kind});
 }
 if(value.carried+qada>value.target)return null;
 return {version:2,target:value.target,carried:value.carried,entries:entries.sort((a,b)=>b.date.localeCompare(a.date))};
}

/** Previous single-number counter had no dates; preserve it without inventing a history. */
export function migrateLegacyFastingPlan(raw){
 if(!isRecord(raw)||!integer(raw.total,0,10000)||!integer(raw.done,0,raw.total))return null;
 return {version:2,target:raw.total,carried:raw.done,entries:[]};
}

export function fastingPlanStats(plan){
 const valid=validateFastingPlan(plan);if(!valid)return null;
 const datedQada=valid.entries.filter(x=>x.kind==='qada').length;
 return {target:valid.target,completed:valid.carried+datedQada,datedQada,carried:valid.carried,remaining:valid.target-valid.carried-datedQada,voluntary:valid.entries.length-datedQada};
}

/** Add a record for a civil day no later than the user's local current date. */
export function addCompletedFast(plan,{date,kind},today){
 const valid=validateFastingPlan(plan),stats=valid&&fastingPlanStats(valid);
 if(!valid||!validCivilDate(date)||!validCivilDate(today)||date>today||!['qada','voluntary'].includes(kind)||valid.entries.some(e=>e.date===date)||valid.entries.length>=3660||(kind==='qada'&&stats.remaining===0))return null;
 return validateFastingPlan({...valid,entries:[...valid.entries,{date,kind}]});
}

export function removeCompletedFast(plan,date){
 const valid=validateFastingPlan(plan);
 if(!valid||!validCivilDate(date)||!valid.entries.some(e=>e.date===date))return null;
 return validateFastingPlan({...valid,entries:valid.entries.filter(e=>e.date!==date)});
}

export function fastingPlanCSV(plan){
 const valid=validateFastingPlan(plan);if(!valid)throw new RangeError('Invalid fasting plan');
 const rows=['Kind,Gregorian date,Completed fasts,Source'];
 if(valid.carried)rows.push('Qada (legacy undated),,'+valid.carried+',Original browser counter');
 for(const row of valid.entries)rows.push((row.kind==='qada'?'Qada':'Voluntary')+','+row.date+',1,User recorded');
 rows.push('Qada target,,'+valid.target+',User supplied');
 return '\uFEFF'+rows.join('\r\n')+'\r\n';
}
