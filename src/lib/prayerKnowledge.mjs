/** Portable date/clock exports and convention comparisons. */
const headings=['Date','Fajr','Sunrise','Dhuhr','Asr','Maghrib','Isha'];
export function differenceMinutes(primary,alternative){
 if(!(primary instanceof Date)||!(alternative instanceof Date)||![primary,alternative].every(x=>Number.isFinite(x.getTime())))return null;
 return Math.round((alternative.getTime()-primary.getTime())/60000);
}
export function differenceLabel(value){
 if(!Number.isSafeInteger(value))return 'Unavailable';
 return value===0?'Same calculated time':(value>0?'+':'−')+Math.abs(value)+' min';
}
const csvCell=x=>{
 let val=String(x??'');
 // Protect worksheet users if untrusted labels ever reach the export.
 if(/^[\s]*[=+@-]/.test(val))val="'"+val;
 return /[,;"\r\n]/.test(val)?'"'+val.replace(/"/g,'""')+'"':val;
};
export function prayerWeekCSV(rows,metadata={}){
 if(!Array.isArray(rows)||rows.length<1||rows.length>31)throw new RangeError('Invalid prayer timetable');
 const columns=['Location','Time zone','Calculation method','Asr setting',...headings];
 const location=csvCell(metadata.location??''),zone=csvCell(metadata.zone??''),method=csvCell(metadata.method??''),asr=csvCell(metadata.asr??'');
 const lines=[columns.join(',')];
 for(const row of rows){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(row.date)||headings.slice(1).some(key=>typeof row[key]!=='string'||row[key].length>30))throw new RangeError('Invalid timetable row');
  lines.push([location,zone,method,asr,...headings.map((key,i)=>csvCell(i===0?row.date:row[key]))].join(','));
 }
 return '\uFEFF'+lines.join('\r\n')+'\r\n';
}
