import {validCivilDate} from './personalTools.mjs';
export const FIVE_PRAYERS=Object.freeze(['Fajr','Dhuhr','Asr','Maghrib','Isha']);
export const FARD_COUNTS=Object.freeze([2,4,4,3,4]);
export function utcDay(iso,offset=0){
 if(!validCivilDate(iso)||!Number.isSafeInteger(offset)||Math.abs(offset)>3660)return null;
 const date=new Date(iso+'T12:00:00Z');date.setUTCDate(date.getUTCDate()+offset);
 const result=date.toISOString().slice(0,10);return validCivilDate(result)?result:null;
}
export function prayerChartDays(start,count=30){
 if(!validCivilDate(start)||![7,14,30].includes(count))return null;
 const dates=Array.from({length:count},(_,i)=>utcDay(start,i));
 if(dates.some(x=>!x))return null;
 return dates.map((iso,index)=>({iso,index:index+1,weekday:new Intl.DateTimeFormat('en-GB',{weekday:'short',timeZone:'UTC'}).format(new Date(iso+'T12:00:00Z'))}));
}
export function prayerHistorySummary(entries,today,windowDays=7){
 if(!validCivilDate(today)||![7,30,90].includes(windowDays)||entries===null||typeof entries!=='object'||Array.isArray(entries))return null;
 const min=utcDay(today,-(windowDays-1)),dates=Array.from({length:windowDays},(_,i)=>utcDay(min,i));
 const observed=dates.filter(date=>Object.prototype.hasOwnProperty.call(entries,date));
 let ticked=0;
 for(const day of observed){
  const value=entries[day];
  if(!Array.isArray(value)||value.length>5||value.some(p=>!FIVE_PRAYERS.includes(p))||new Set(value).size!==value.length)return null;
  ticked+=value.length;
 }
 return {days:windowDays,recordedDays:observed.length,unrecordedDays:windowDays-observed.length,ticked,recordedSlots:observed.length*5,
  percent:observed.length?Math.round(ticked/(observed.length*5)*100):null};
}
/** Milestones from an independently established Qada target; not a ruling on missed prayers. */
export function qadaPace(total,completed,daily){
 if(![total,completed,daily].every(Number.isSafeInteger)||total<0||total>6000000||completed<0||completed>total||daily<1||daily>500)return null;
 const remaining=total-completed;
 return {remaining,daily,estimatedDays:Math.ceil(remaining/daily),estimatedWeeks:Math.ceil(remaining/daily/7),
  estimatedMonths:Math.ceil(remaining/daily/30)};
}
export const RAWATIB_EXAMPLE=Object.freeze([
 {prayer:'Fajr',fard:2,commonBefore:'2',commonAfter:'—'},
 {prayer:'Dhuhr',fard:4,commonBefore:'2 or 4',commonAfter:'2'},
 {prayer:'Asr',fard:4,commonBefore:'Voluntary (varies)',commonAfter:'—'},
 {prayer:'Maghrib',fard:3,commonBefore:'—',commonAfter:'2'},
 {prayer:'Isha',fard:4,commonBefore:'—',commonAfter:'2'}
]);
export function widgetConfig({lat,lon,tz,city,method='mwl',school='standard',theme='light',sunrise=true,size='regular'}){
 const la=Number(lat),lo=Number(lon);
 if(String(lat).trim()===''||String(lon).trim()===''||!Number.isFinite(la)||Math.abs(la)>90||!Number.isFinite(lo)||Math.abs(lo)>180||
 !['mwl','karachi','makkah','na','egypt','singapore','turkey','dubai'].includes(method)||
 !['hanafi','standard'].includes(school)||!['dark','light'].includes(theme)||typeof sunrise!=='boolean'||!['compact','regular'].includes(size)||
 typeof tz!=='string'||tz.length>78||typeof city!=='string'||city.length>60)return null;
 try{new Intl.DateTimeFormat('en',{timeZone:tz})}catch{return null}
 const params=new URLSearchParams({lat:String(la),lon:String(lo),tz,city,method,school,theme,sunrise:sunrise?'1':'0',size});
 const url='https://sunnah.tools/embed/prayer-times/?'+params.toString();
 const height=size==='compact'?345:415;
 const html='<iframe src="'+url.replaceAll('&','&amp;')+'" title="Calculated daily Islamic prayer times" loading="lazy" style="display:block;width:100%;max-width:480px;height:'+height+'px;border:0;border-radius:14px" referrerpolicy="no-referrer-when-downgrade"></iframe>';
 return {url,html,height};
}
