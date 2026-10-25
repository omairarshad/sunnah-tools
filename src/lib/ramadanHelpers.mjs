/** Values supplied by a selected trusted local charity or authority. No live rate is assumed. */
export function fitranaEstimate({people,ratePerPerson,additional=0}){
 if(!Number.isInteger(people)||people<1||people>10000||
    !Number.isFinite(ratePerPerson)||ratePerPerson<=0||ratePerPerson>1e9||
    !Number.isFinite(additional)||additional<0||additional>1e12)return null;
 const total=people*ratePerPerson+additional;
 if(!Number.isFinite(total))return null;
 return {people,ratePerPerson,additional,total};
}
export function ramadanDays(start,count=30){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(start)||![29,30].includes(count))return null;
 const [y,m,d]=start.split('-').map(Number);
 const date=new Date(Date.UTC(y,m-1,d,12));
 if(date.getUTCFullYear()!==y||date.getUTCMonth()!==m-1||date.getUTCDate()!==d)return null;
 return Array.from({length:count},(_,i)=>{
  const day=new Date(date.getTime()+i*86400000);
  return {day:i+1,iso:day.toISOString().slice(0,10)};
 });
}
export function csvEscape(value){
 const text=String(value);
 return /[",\r\n]/.test(text)?'"'+text.replace(/"/g,'""')+'"':text;
}
export function timetableCSV(rows){
 const header=['Ramadan day','Gregorian date','Fajr / Suhoor cutoff','Maghrib / Iftar'];
 return [header,...rows.map(r=>[r.day,r.date,r.fajr,r.maghrib])].map(line=>line.map(csvEscape).join(',')).join('\r\n')+'\r\n';
}
