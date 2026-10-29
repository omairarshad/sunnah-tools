import {useEffect,useMemo,useState} from 'react';
import CitySearch from './CitySearch';
import {estimatedRamadanStart} from '../lib/ramadanHelpers.mjs';
import {isoPlusDays} from '../lib/growthCalculations.mjs';
import {calculateRamadanStart,countdownParts,ramadanStartIcs} from '../lib/ramadanCountdown.mjs';
import {RAMADAN_METHODS} from '../lib/ramadanTimetable.mjs';
import {downloadText} from '../lib/personalTools.mjs';

const presets=[['London','Europe/London',51.5072,-0.1276],['Newcastle upon Tyne','Europe/London',54.9783,-1.6178],['Makkah','Asia/Riyadh',21.4225,39.8262],['New York','America/New_York',40.7128,-74.006],['Sydney','Australia/Sydney',-33.8688,151.2093]] as const;
const fmtDate=(iso:string)=>new Intl.DateTimeFormat('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(iso+'T12:00:00Z'));

export default function RamadanCountdown(){
 const [target,setTarget]=useState(()=>estimatedRamadanStart()??''),[city,setCity]=useState(0),[lat,setLat]=useState(''),[lon,setLon]=useState(''),[zone,setZone]=useState(''),[location,setLocation]=useState('');
 const [method,setMethod]=useState('mwl'),[highLat,setHighLat]=useState('recommended'),[polar,setPolar]=useState('unresolved'),[now,setNow]=useState(()=>Date.now()),[notice,setNotice]=useState('');
 useEffect(()=>{const timer=window.setInterval(()=>setNow(Date.now()),30000);return()=>window.clearInterval(timer)},[]);
 const base=presets[city],usingManual=lat.trim()!==''||lon.trim()!=='',latitude=usingManual?Number(lat):base[2],longitude=usingManual?Number(lon):base[3],tz=zone.trim()||base[1];
 const validCoords=(!usingManual||(lat.trim()!==''&&lon.trim()!==''))&&Number.isFinite(latitude)&&Number.isFinite(longitude)&&Math.abs(latitude)<=90&&Math.abs(longitude)<=180;
 const place=location||(usingManual?'Selected coordinates':base[0]);
 const result=useMemo(()=>validCoords?calculateRamadanStart({firstFast:target,latitude,longitude,zone:tz,method,highLatitude:highLat,polar}):null,[validCoords,target,latitude,longitude,tz,method,highLat,polar]);
 const remaining=result?.at?countdownParts(result.at,new Date(now)):null;
 const comparisons=useMemo(()=>[-1,1].map(shift=>{const firstFast=isoPlusDays(target,shift);return {shift,date:firstFast,result:firstFast&&validCoords?calculateRamadanStart({firstFast,latitude,longitude,zone:tz,method,highLatitude:highLat,polar}):null}}),[target,latitude,longitude,tz,method,highLat,polar,validCoords]);
 const saveEvent=()=>{
  if(!result?.at)return;
  try{downloadText('ramadan-estimated-start-'+target+'.ics',ramadanStartIcs(result,{location:place,zone:tz}),'text/calendar;charset=utf-8');setNotice('Downloaded an estimated sunset event. Update your calendar if the local announcement changes.')}catch{setNotice('Could not make the calendar file. Check your chosen location and date.')}
 };
 return <div className="countdown-planner">
  <p className="small">Ramadan begins at <strong>local sunset on the evening before the first fast</strong>. This live countdown uses a calculated Maghrib sunset for your chosen location; it does not predict or verify the crescent.</p>
  <div className="countdown-inputs"><label>Expected first fasting day (Gregorian)<input type="date" min="1900-01-02" max="2100-12-31" value={target} onChange={e=>setTarget(e.target.value)}/></label><label>Sunset calculation method<select value={method} onChange={e=>setMethod(e.target.value)}>{RAMADAN_METHODS.map(([key,name])=><option key={key} value={key}>{name}</option>)}</select></label></div>
  <button type="button" className="secondary" onClick={()=>{setTarget(estimatedRamadanStart(new Date())??'');setNotice('Reset to the next Umm al-Qura calendar estimate. Confirm the date locally.')}}>Use next calendar estimate</button>
  <p className="small countdown-date-disclaimer">The default is an <strong>Umm al-Qura algorithmic estimate</strong>. The first fast and any announcement can differ by location and moon-sighting policy. Enter your recognised community's confirmed date when available.</p>
  <CitySearch onSelect={row=>{setLat(String(row[3]));setLon(String(row[4]));setZone(row[5]);setLocation(row[0]+', '+row[1]);setNotice('')}}/>
  <details className="settings countdown-advanced"><summary>Choose preset city, coordinates, time zone and polar settings</summary>
   <div className="two"><label>Example city<select value={city} onChange={e=>{setCity(Number(e.target.value));setLat('');setLon('');setZone('');setLocation('')}}>{presets.map((p,index)=><option key={p[0]} value={index}>{p[0]}</option>)}</select></label><label>IANA time zone<input type="text" value={zone} maxLength={79} onChange={e=>setZone(e.target.value)} placeholder={base[1]}/></label></div>
   <div className="two"><label>Latitude<input type="number" step="any" min="-90" max="90" value={lat} onChange={e=>{setLat(e.target.value);setLocation('')}} placeholder={String(base[2])}/></label><label>Longitude<input type="number" step="any" min="-180" max="180" value={lon} onChange={e=>{setLon(e.target.value);setLocation('')}} placeholder={String(base[3])}/></label></div>
   <div className="two"><label>High-latitude rule<select value={highLat} onChange={e=>setHighLat(e.target.value)}><option value="recommended">Recommended</option><option value="angle">Twilight angle</option><option value="middle">Middle of night</option><option value="seventh">One-seventh of night</option></select></label><label>Polar handling<select value={polar} onChange={e=>setPolar(e.target.value)}><option value="unresolved">Unresolved — no approximation</option><option value="nearest-day">Nearest suitable day</option><option value="nearest-location">Nearest suitable latitude</option></select></label></div>
   <p className="small">Enter both coordinates and the matching time zone. Polar approximations need qualified local guidance. The countdown does not save these settings to an account.</p>
  </details>
  {!validCoords&&<p className="warn" role="alert">Enter both coordinates within valid latitude and longitude ranges.</p>}
  {!result&&validCoords&&<p className="warn" role="alert">Choose a valid first fasting date, valid timezone and calculation settings.</p>}
  {result?.issue&&<p className="warn" role="alert">{result.issue}. No substitute sunset is invented for this location.</p>}
  {result?.at&&remaining&&<>
   <div className="result countdown-main-result" role="status" aria-live="off"><span>{remaining.upcoming?'Until estimated Ramadan sunset':'Estimated Ramadan sunset has passed'}</span><strong>{remaining.upcoming?`${remaining.days} days · ${String(remaining.hours).padStart(2,'0')} hrs · ${String(remaining.minutes).padStart(2,'0')} min`:'The selected start has passed'}</strong><small>Updates approximately every 30 seconds while open; not a sighting confirmation.</small></div>
   <div className="countdown-key-dates"><div><span>Ramadan's first evening</span><strong>{fmtDate(result.eveningDate!)}</strong><small>Calculated Maghrib at {result.atClock} ({tz})</small></div><div><span>First daytime fast</span><strong>{fmtDate(result.firstFast)}</strong><small>{result.firstFajrClock?`Calculated Fajr at ${result.firstFajrClock} (${tz})`:'Fajr unavailable — check local guidance'}</small></div></div>
   <details className="settings countdown-alternatives"><summary>If your community starts one day earlier or later</summary><div className="countdown-alternative-grid">{comparisons.map(candidate=><div key={candidate.shift}><strong>{candidate.shift<0?'One day earlier':'One day later'} · {candidate.date}</strong><small>{candidate.result?.at?`Sunset on ${candidate.result.eveningDate}, ${candidate.result.atClock} (${tz})`:'Sunset unavailable for these settings'}</small><button type="button" className="secondary" onClick={()=>setTarget(candidate.date!)}>Use this date</button></div>)}</div><p className="small">The alternatives illustrate calendar uncertainty; they are <strong>not probabilities or sightings</strong>.</p></details>
   <div className="action-row countdown-actions print-hide"><button type="button" onClick={saveEvent}>Download sunset calendar event (.ics)</button><button type="button" className="secondary" onClick={()=>window.print()}>Print countdown dates</button></div>
  </>}
  {notice&&<p className="small" role="status">{notice}</p>}
  <p className="warn">Check local moon-sighting announcements and your mosque's Maghrib/Fajr timetable before relying on these estimates. Sunset at a calculated horizon is not a verified local observation. <a href="/tools/ramadan-timetable/">Build a Ramadan timetable</a> after confirming the date.</p>
 </div>;
}
