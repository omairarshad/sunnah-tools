/** Fasting times use real UTC instants. The calculator does not infer religious rulings. */
const validDate=d=>d instanceof Date&&Number.isFinite(d.getTime());
export function fastingDuration(fajr,maghrib){
 if(!validDate(fajr)||!validDate(maghrib))return null;
 const minutes=Math.round((maghrib.getTime()-fajr.getTime())/60000);
 return minutes>0&&minutes<1440?minutes:null;
}
export function fastingDurationLabel(minutes){
 if(!Number.isInteger(minutes)||minutes<0)return 'Unavailable';
 return Math.floor(minutes/60)+'h '+String(minutes%60).padStart(2,'0')+'m';
}
/** Optional pre-dawn reminder. This is NOT the start of the fast. */
export function planningReminder(fajr,minutes){
 if(!validDate(fajr)||!Number.isInteger(minutes)||minutes<0||minutes>30)return null;
 return new Date(fajr.getTime()-minutes*60000);
}
export function upcomingFastingEvent(now,day,tomorrow){
 if(!validDate(now))return null;
 const events=[
  {name:'Fajr — suhoor ends',at:day?.fajr},
  {name:'Maghrib — iftar',at:day?.maghrib},
  {name:'Fajr — suhoor ends (tomorrow)',at:tomorrow?.fajr},
  {name:'Maghrib — iftar (tomorrow)',at:tomorrow?.maghrib}
 ];
 const future=events.filter(e=>validDate(e.at)&&e.at.getTime()>now.getTime()).sort((a,b)=>a.at-b.at);
 if(!future.length)return null;
 const next=future[0],remaining=Math.ceil((next.at.getTime()-now.getTime())/60000);
 return {name:next.name,at:next.at,minutes:remaining,description:fastingDurationLabel(remaining)};
}
const csvCell=v=>{
 let s=String(v??'');
 if(/^[\s]*[=+\-@]/.test(s))s="'"+s;
 return /[",\r\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;
};
export function fastingWeekCSV(rows,{location='',zone='',method=''}={}){
 if(!Array.isArray(rows)||rows.length!==7)throw new RangeError('A seven-day timetable is required');
 const lines=[['Date','Suhoor ends (Fajr)','Iftar (Maghrib)','Approximate fast duration','Location','Time zone','Calculation method'].join(',')];
 for(const r of rows){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(r?.date)||[r.fajr,r.maghrib,r.duration].some(x=>typeof x!=='string'||x.length>40))throw new RangeError('Invalid fasting timetable row');
  lines.push([r.date,r.fajr,r.maghrib,r.duration,location,zone,method].map(csvCell).join(','));
 }
 return '\uFEFF'+lines.join('\r\n')+'\r\n';
}
