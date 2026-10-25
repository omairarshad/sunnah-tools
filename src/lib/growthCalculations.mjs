/** Deterministic planning arithmetic. These are not religious rulings or verified local rates. */
export function dateFromISO(value){
 if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return null;
 const [y,m,d]=value.split('-').map(Number);
 if(y<1900||y>2100||m<1||m>12||d<1||d>31)return null;
 const date=new Date(Date.UTC(y,m-1,d,12));
 return date.getUTCFullYear()===y&&date.getUTCMonth()===m-1&&date.getUTCDate()===d?date:null;
}
export function isoPlusDays(value,days){
 const date=dateFromISO(value);
 if(!date||!Number.isSafeInteger(days)||Math.abs(days)>36525)return null;
 date.setUTCDate(date.getUTCDate()+days);
 return date.toISOString().slice(0,10);
}
export function oddNightDates(firstFast){
 if(!dateFromISO(firstFast))return [];
 return [21,23,25,27,29].map(night=>({
  night,evening:isoPlusDays(firstFast,night-2),daytime:isoPlusDays(firstFast,night-1)
 }));
}
export function inclusiveDays(start,end){
 const a=dateFromISO(start),b=dateFromISO(end);
 if(!a||!b||b<a)return null;
 const days=Math.round((b.getTime()-a.getTime())/86400000)+1;
 return days<=36525?days:null;
}
export function qadaPlanningDays({mode,days,years,start,end,excluded}){
 const base=mode==='range'?inclusiveDays(start,end):mode==='years'?
  (Number.isFinite(years)&&years>0&&years<=100?Math.round(years*365.2425):null):
  (Number.isSafeInteger(days)&&days>=1&&days<=36525?days:null);
 if(base===null||!Number.isSafeInteger(excluded)||excluded<0||excluded>base)return null;
 return base-excluded;
}
export function simpleEstimate(count,rate,unit=1){
 if(!Number.isSafeInteger(count)||count<1||count>100000||!Number.isFinite(rate)||rate<=0||rate>100000000||!Number.isSafeInteger(unit)||unit<1)return null;
 const total=count*unit*rate;
 return Number.isFinite(total)?{units:count*unit,total}:null;
}
export function qurbaniEstimate(animal,participants,cost){
 const max=['sheep','goat'].includes(animal)?1:['cow','buffalo','camel'].includes(animal)?7:0;
 if(!max||!Number.isSafeInteger(participants)||participants<1||participants>max||!Number.isFinite(cost)||cost<=0||cost>1000000000)return null;
 return {max,participants,perPerson:cost/participants,total:cost};
}
