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
 if(y<1900||y>2100)return null;
 const date=new Date(Date.UTC(y,m-1,d,12));
 if(date.getUTCFullYear()!==y||date.getUTCMonth()!==m-1||date.getUTCDate()!==d)return null;
 return Array.from({length:count},(_,i)=>{
  const day=new Date(date.getTime()+i*86400000);
  return {day:i+1,iso:day.toISOString().slice(0,10)};
 });
}
/** An algorithmic calendar suggestion, never an announcement of moon sighting. */
export function estimatedRamadanStart(asOf=new Date()){
 if(!(asOf instanceof Date)||!Number.isFinite(asOf.getTime()))return null;
 try{
  const formatter=new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura',{year:'numeric',month:'numeric',day:'numeric',timeZone:'UTC'});
  const base=new Date(Date.UTC(asOf.getUTCFullYear(),asOf.getUTCMonth(),asOf.getUTCDate(),12));
  const currentMonth=Number(formatter.formatToParts(base).find(x=>x.type==='month')?.value);
  for(let offset=currentMonth===9?-29:0;offset<=400;offset++){
   const d=new Date(base.getTime()+offset*86400000);
   const parts=formatter.formatToParts(d);
   const get=type=>Number(parts.find(x=>x.type===type)?.value);
   if(get('month')===9&&get('day')===1)return d.toISOString().slice(0,10);
  }
 }catch{}
 return null;
}
export function csvEscape(value){
 if(typeof value==='number'&&Number.isFinite(value))return String(value);
 let text=String(value??'');
 // Spreadsheet apps may interpret user-supplied city labels as executable formulas.
 if(/^[\s]*[=+\-@]/.test(text))text="'"+text;
 return /[",\r\n]/.test(text)?'"'+text.replace(/"/g,'""')+'"':text;
}
export function timetableCSV(rows,metadata={}){
 if(!Array.isArray(rows)||![29,30,1].includes(rows.length))throw new RangeError('Invalid Ramadan timetable length');
 const header=['Ramadan day','Gregorian date','Weekday','Fajr / Suhoor cutoff','Maghrib / Iftar','Approximate fast duration','Optional pre-Fajr reminder (not the cutoff)','Location','Latitude','Longitude','Time zone','Calculation method','High-latitude rule','Polar handling','Status'];
 return '\uFEFF'+[header,...rows.map(r=>[r.day,r.date,r.weekday??'',r.fajr,r.maghrib,r.duration??'',r.reminder??'',metadata.location??'',metadata.latitude??'',metadata.longitude??'',metadata.zone??'',metadata.method??'',metadata.highLatitude??'',metadata.polar??'',r.status??'Calculated estimate'])].map(line=>line.map(csvEscape).join(',')).join('\r\n')+'\r\n';
}
