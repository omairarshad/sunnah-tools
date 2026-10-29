import {useEffect,useMemo,useState} from 'react';
import CitySearch from './CitySearch';
import {downloadText,makeRamadanIcs} from '../lib/personalTools.mjs';
import {estimatedRamadanStart,timetableCSV} from '../lib/ramadanHelpers.mjs';
import {buildRamadanTimetable,methodName,highLatName,polarName,RAMADAN_METHODS,RAMADAN_HIGH_LAT,RAMADAN_POLAR} from '../lib/ramadanTimetable.mjs';

// Keep preset indices compatible with prayer settings saved by earlier releases.
const cities=[
 ['Newcastle upon Tyne','Europe/London',54.9783,-1.6178],['London','Europe/London',51.5072,-0.1276],
 ['Makkah','Asia/Riyadh',21.4225,39.8262],['Madinah','Asia/Riyadh',24.4672,39.6111],
 ['New York','America/New_York',40.7128,-74.006],['Karachi','Asia/Karachi',24.8607,67.0011],
 ['Lahore','Asia/Karachi',31.5204,74.3587],['Dubai','Asia/Dubai',25.2048,55.2708],
 ['Kuala Lumpur','Asia/Kuala_Lumpur',3.139,101.6869],['Jakarta','Asia/Jakarta',-6.2088,106.8456],
 ['Istanbul','Europe/Istanbul',41.0082,28.9784],['Toronto','America/Toronto',43.6532,-79.3832],
 ['Sydney','Australia/Sydney',-33.8688,151.2093]
] as const;
const defaultMethod=(country:string)=>({SA:'makkah',PK:'karachi',SG:'singapore',MY:'singapore',ID:'singapore',AE:'dubai',TR:'turkey',US:'na',CA:'na'} as Record<string,string>)[country]||'mwl';
const validZone=(zone:string)=>{try{new Intl.DateTimeFormat('en',{timeZone:zone});return true}catch{return false}};

export default function RamadanTimetable(){
 const [city,setCity]=useState(1),[lat,setLat]=useState(''),[lon,setLon]=useState(''),[zone,setZone]=useState(''),[customLabel,setCustomLabel]=useState('');
 const [method,setMethod]=useState('mwl'),[highLat,setHighLat]=useState('recommended'),[polar,setPolar]=useState('unresolved');
 const [start,setStart]=useState(()=>estimatedRamadanStart()??''),[length,setLength]=useState(30),[reminderMinutes,setReminderMinutes]=useState(0),[compare,setCompare]=useState('none');
 const [settingsReady,setSettingsReady]=useState(false),[notice,setNotice]=useState('');
 useEffect(()=>{
  try{
   const raw=JSON.parse(localStorage.getItem('sunnah-prayer-settings-v2')??'null');
   if(raw&&typeof raw==='object'){
    if(Number.isInteger(raw.city)&&raw.city>=0&&raw.city<cities.length)setCity(raw.city);
    if(typeof raw.lat==='string'&&raw.lat.length<30)setLat(raw.lat);
    if(typeof raw.lon==='string'&&raw.lon.length<30)setLon(raw.lon);
    if(typeof raw.zone==='string'&&raw.zone.length<80)setZone(raw.zone);
    if(RAMADAN_METHODS.some(m=>m[0]===raw.method))setMethod(raw.method);
    if(typeof raw.label==='string'&&raw.label.length<120)setCustomLabel(raw.label);
   }
  }catch{}
  setSettingsReady(true);
 },[]);
 useEffect(()=>{
  if(!settingsReady)return;
  try{
   const raw=JSON.parse(localStorage.getItem('sunnah-prayer-settings-v2')??'{}');
   localStorage.setItem('sunnah-prayer-settings-v2',JSON.stringify({...raw,city,lat,lon,zone,method,label:customLabel}));
  }catch{}
 },[settingsReady,city,lat,lon,zone,method,customLabel]);

 const selected=cities[city],usingCoordinates=lat.trim()!==''||lon.trim()!=='';
 const latitude=usingCoordinates?Number(lat):selected[2],longitude=usingCoordinates?Number(lon):selected[3],tz=zone.trim()||selected[1];
 const validLocation=(!usingCoordinates||(lat.trim()!==''&&lon.trim()!==''))&&Number.isFinite(latitude)&&Math.abs(latitude)<=90&&Number.isFinite(longitude)&&Math.abs(longitude)<=180&&validZone(tz);
 const location=customLabel||(usingCoordinates?'Custom coordinates':selected[0]);
 const data=useMemo(()=>validLocation?buildRamadanTimetable({start,count:length,latitude,longitude,zone:tz,method,highLatitude:highLat,polar,reminderMinutes}):null,[validLocation,start,length,latitude,longitude,tz,method,highLat,polar,reminderMinutes]);
 const comparison=useMemo(()=>data&&compare!=='none'&&compare!==method?buildRamadanTimetable({start,count:length,latitude,longitude,zone:tz,method:compare,highLatitude:highLat,polar}):null,[data,compare,method,start,length,latitude,longitude,tz,highLat,polar]);
 const first=data?.rows[0];

 const setPreset=(index:number)=>{setCity(index);setLat('');setLon('');setZone('');setCustomLabel('');setMethod(index===2||index===3?'makkah':index===4||index===11?'na':index===5||index===6?'karachi':index===7?'dubai':index===8||index===9?'singapore':index===10?'turkey':'mwl');setNotice('')};
 const locate=()=>{
  if(!navigator.geolocation){setNotice('Geolocation is unavailable. Choose a city or enter your coordinates.');return}
  navigator.geolocation.getCurrentPosition(position=>{
   setLat(String(position.coords.latitude));setLon(String(position.coords.longitude));setZone(Intl.DateTimeFormat().resolvedOptions().timeZone);setCustomLabel('Detected coordinates');setNotice('Coordinates loaded. Verify the timezone and calculation method before using the timetable.');
  },()=>setNotice('Location permission declined or unavailable. Enter coordinates or use the city search.'),{timeout:12000,maximumAge:120000});
 };
 const metadata={location,latitude,longitude,zone:tz,method:methodName(method),highLatitude:highLatName(highLat),polar:polarName(polar)};
 const downloadCSV=()=>{
  if(!data)return;
  try{downloadText('ramadan-timetable-'+start+'.csv',timetableCSV(data.rows,metadata),'text/csv;charset=utf-8');setNotice(data.unavailable?'CSV downloaded, with unavailable entries clearly marked.':'Full timetable CSV downloaded.')}catch{setNotice('Could not download the timetable CSV.')}
 };
 const downloadCalendar=()=>{
  if(!data?.complete)return;
  try{
   const items=data.rows.map(row=>({day:row.date,fajr:row.fajrInstant,maghrib:row.maghribInstant}));
   downloadText('ramadan-fajr-iftar-'+start+'.ics',makeRamadanIcs(items,undefined,metadata),'text/calendar;charset=utf-8');
   setNotice('Calendar downloaded. Import only after checking the Ramadan dates and your local mosque timetable.');
  }catch{setNotice('Could not create the calendar. Check your dates and location.')}
 };

 return <div className="ramadan-timetable">
  <p className="ramadan-calendar-intro">Create a 29- or 30-day <strong>planning timetable</strong> for any location. Daily times are calculated from dawn and sunset; this tool does not announce the beginning or end of Ramadan.</p>
  <CitySearch onSelect={chosen=>{setLat(String(chosen[3]));setLon(String(chosen[4]));setZone(chosen[5]);setCustomLabel(chosen[0]+', '+chosen[1]);setMethod(defaultMethod(chosen[1]));setNotice('')}}/>
  <details className="settings ramadan-location-settings"><summary>Or choose a preset city, coordinates and timezone</summary>
   <div className="two"><label>Preset city<select value={city} onChange={e=>setPreset(Number(e.target.value))}>{cities.map((c,i)=><option key={c[0]} value={i}>{c[0]}</option>)}</select></label><label>Time zone (IANA name)<input type="text" value={zone} onChange={e=>setZone(e.target.value)} placeholder={selected[1]} maxLength={79}/></label></div>
   <div className="two"><label>Latitude (-90 to 90)<input type="number" inputMode="decimal" step="any" min="-90" max="90" placeholder={String(selected[2])} value={lat} onChange={e=>{setLat(e.target.value);setCustomLabel('')}}/></label><label>Longitude (-180 to 180)<input type="number" inputMode="decimal" step="any" min="-180" max="180" placeholder={String(selected[3])} value={lon} onChange={e=>{setLon(e.target.value);setCustomLabel('')}}/></label></div>
   <button type="button" className="secondary" onClick={locate}>Use my location (optional)</button>
   <p className="small">Enter both coordinates together. The time zone must match the selected place. The site remembers your location and prayer-method preferences in this browser, as it does in Prayer Times; it does not send coordinates to a prayer-time API.</p>
  </details>
  <div className="ramadan-calendar-fields"><label>Expected first fasting day (Gregorian)<input type="date" value={start} min="1900-01-01" max="2100-12-31" onChange={e=>setStart(e.target.value)}/></label><label>Month length<select value={length} onChange={e=>setLength(Number(e.target.value))}><option value={30}>30 days — provisional</option><option value={29}>29 days</option></select></label><label>Calculation method<select value={method} onChange={e=>setMethod(e.target.value)}>{RAMADAN_METHODS.map(([key,name])=><option value={key} key={key}>{name}</option>)}</select></label></div>
  <p className="small ramadan-estimate">The suggested start is an <strong>Umm al-Qura calendar estimate</strong>, not an observed crescent or an official announcement. Set the actual start and month length when your recognised local authority confirms them. The first fasting day is the day after Ramadan begins at sunset.</p>
  <details className="settings ramadan-advanced"><summary>Advanced: high-latitude rules, optional reminder and method comparison</summary>
   <div className="ramadan-calendar-fields"><label>High-latitude rule<select value={highLat} onChange={e=>setHighLat(e.target.value)}>{RAMADAN_HIGH_LAT.map(([key,name])=><option value={key} key={key}>{name}</option>)}</select></label><label>Polar handling<select value={polar} onChange={e=>setPolar(e.target.value)}>{RAMADAN_POLAR.map(([key,name])=><option value={key} key={key}>{name}</option>)}</select></label><label>Optional suhoor preparation reminder<select value={reminderMinutes} onChange={e=>setReminderMinutes(Number(e.target.value))}><option value={0}>Off — Fajr is the cutoff</option>{[5,10,15,20].map(n=><option key={n} value={n}>{n} minutes before Fajr</option>)}</select></label><label>Compare first-day Fajr using<select value={compare} onChange={e=>setCompare(e.target.value)}><option value="none">No comparison</option>{RAMADAN_METHODS.map(([key,name])=><option key={key} value={key}>{name}</option>)}</select></label></div>
   <p className="small">An earlier preparation reminder is <strong>not a separate religious imsak cutoff</strong>; the Fajr calculation remains unchanged. High-latitude and polar approximations need your mosque's guidance. In some locations, a result cannot be computed responsibly.</p>
   {compare!==method&&comparison&&first&&<p className="ramadan-comparison">First-day Fajr: <strong>{first.fajr}</strong> with {methodName(method)} versus <strong>{comparison.rows[0].fajr}</strong> with {methodName(compare)}. These are alternative estimates, not a ruling on which method to follow.</p>}
  </details>
  {!validLocation&&<p className="warn" role="alert">Enter two valid coordinates and a valid IANA timezone, or choose a city. Check the region matches the selected timezone.</p>}
  {validLocation&&!data&&<p className="warn" role="alert">Choose a valid first fasting day between 1900 and 2100 and a 29- or 30-day month.</p>}
  {data&&<>
   <div className="ramadan-calendar-summary" aria-label="Timetable summary"><div><span>First fasting day</span><strong>{data.first}</strong></div><div><span>Provisional last day</span><strong>{data.last}</strong></div><div><span>Days generated</span><strong>{data.rows.length} of {length}</strong></div><div><span>Location and zone</span><strong>{location}</strong><small>{tz}</small></div></div>
   <div className="ramadan-print-heading"><h2>Ramadan Suhoor &amp; Iftar Timetable</h2><p>{location} · {latitude.toFixed(4)}°, {longitude.toFixed(4)}° · {tz} · {methodName(method)} · {length} days</p><p>High latitude: {highLatName(highLat)} · Polar handling: {polarName(polar)} · {reminderMinutes?`${reminderMinutes}-minute optional preparation reminder`: 'No early reminder'}</p><p>Provisional dates. Confirm local moon-sighting announcements and your mosque's Fajr and Maghrib times before relying on this schedule.</p></div>
   <div className="table-wrap ramadan-month-table"><table><thead><tr><th scope="col">Ramadan</th><th scope="col">Gregorian date</th><th scope="col">Suhoor ends <small>(Fajr)</small></th><th scope="col">Iftar <small>(Maghrib)</small></th><th scope="col">Fast length <small>(approx.)</small></th>{reminderMinutes>0&&<th scope="col">Reminder <small>(not cutoff)</small></th>}</tr></thead><tbody>{data.rows.map(r=><tr key={r.day} className={r.fajrInstant?'':'ramadan-unavailable'}><th scope="row">{r.day}</th><td>{r.weekday} {r.date}</td><td>{r.fajr}</td><td>{r.maghrib}</td><td>{r.duration}</td>{reminderMinutes>0&&<td>{r.reminder||'Unavailable'}</td>}</tr>)}</tbody></table></div>
   {data.unavailable>0&&<p className="warn" role="alert">{data.unavailable} day(s) have unavailable times. Check the coordinates, timezone, polar setting and local high-latitude guidance. Unavailable dates remain visible; calendar export is disabled rather than making events with fabricated times.</p>}
   <p className="small ramadan-calendar-legend"><strong>Reading the table:</strong> Fajr is the calculated start of the daily fast; Maghrib is the calculated end. Times use <strong>{tz}</strong>, including daylight-saving changes. An earlier reminder, if selected, is optional preparation only. These are not mosque congregational times.</p>
   <div className="action-row ramadan-export-actions print-hide"><button type="button" onClick={()=>window.print()}>Print / Save PDF</button><button className="secondary" type="button" onClick={downloadCSV}>Download full CSV</button><button className="secondary" type="button" disabled={!data.complete} onClick={downloadCalendar}>Download calendar (.ics)</button></div>
   {notice&&<p role="status" className="small">{notice}</p>}
   <p className="ramadan-calendar-caution">Before sharing or importing a calendar, confirm the actual Ramadan dates and the Fajr/Maghrib convention followed by your mosque or religious authority. If you travel, generate a new timetable for your destination rather than reusing these times.</p>
  </>}
  {!data&&notice&&<p role="status" className="small">{notice}</p>}
 </div>;
}
