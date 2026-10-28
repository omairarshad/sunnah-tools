import {useEffect,useMemo,useState} from 'react';
import {CalculationMethod,Coordinates,PrayerTimes,HighLatitudeRule,PolarCircleResolution} from 'adhan';
import CitySearch from './CitySearch';
import {calculatedNightWindow,manualNightWindow} from '../lib/tahajjud.mjs';
type Method='mwl'|'karachi'|'makkah'|'na'|'singapore'|'turkey'|'dubai'|'egypt';
const presets=[
 {name:'London',lat:51.5072,lon:-.1276,zone:'Europe/London',method:'mwl' as Method},
 {name:'Newcastle upon Tyne',lat:54.9783,lon:-1.6178,zone:'Europe/London',method:'mwl' as Method},
 {name:'Makkah',lat:21.4225,lon:39.8262,zone:'Asia/Riyadh',method:'makkah' as Method},
 {name:'Karachi',lat:24.8607,lon:67.0011,zone:'Asia/Karachi',method:'karachi' as Method},
 {name:'New York',lat:40.7128,lon:-74.006,zone:'America/New_York',method:'na' as Method},
 {name:'Dubai',lat:25.2048,lon:55.2708,zone:'Asia/Dubai',method:'dubai' as Method}
];
const methods:[Method,string][]=[['mwl','Muslim World League'],['karachi','Karachi'],['makkah','Umm al-Qura'],['na','ISNA / North America'],['singapore','Singapore'],['turkey','Turkey'],['dubai','Dubai'],['egypt','Egypt']];
const civilDate=(zone:string)=>{const p=new Intl.DateTimeFormat('en-GB',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()),get=(k:string)=>p.find(x=>x.type===k)?.value??'';return get('year')+'-'+get('month')+'-'+get('day')};
const parseCivil=(s:string)=>{if(!/^\d{4}-\d\d-\d\d$/.test(s))return null;const [y,m,d]=s.split('-').map(Number);const x=new Date(y,m-1,d);return x.getFullYear()===y&&x.getMonth()===m-1&&x.getDate()===d?x:null};
const minutesLabel=(n:number)=>{const h=Math.floor(n/60),m=Math.round(n%60);return (h?h+' hr'+(h===1?'':'s'):'')+(m?' '+m+' min':'')||'0 min'};
function Notice({children}:{children:React.ReactNode}){return <p className="small tahajjud-note">{children}</p>}
export default function TahajjudCalculator(){
 const [mode,setMode]=useState<'city'|'manual'>('city'),[preset,setPreset]=useState(0),[latitude,setLatitude]=useState(''),[longitude,setLongitude]=useState(''),[timezone,setTimezone]=useState(''),[place,setPlace]=useState(''),[method,setMethod]=useState<Method>('mwl'),[day,setDay]=useState(''),[sunset,setSunset]=useState('18:30'),[dawn,setDawn]=useState('05:30'),[feedback,setFeedback]=useState('');
 const loc=presets[preset],lat=latitude===''?loc.lat:Number(latitude),lon=longitude===''?loc.lon:Number(longitude),zone=timezone||loc.zone,chosenDay=day||(()=>{try{return civilDate(zone)}catch{return ''}})();
 const valid=Number.isFinite(lat)&&lat>=-90&&lat<=90&&Number.isFinite(lon)&&lon>=-180&&lon<=180;
 const automated=useMemo(()=>{
  if(!valid)return null;
  const date=parseCivil(chosenDay);if(!date)return null;
  try{
   new Intl.DateTimeFormat('en',{timeZone:zone});
   const coords=new Coordinates(lat,lon);
   const params=method==='karachi'?CalculationMethod.Karachi():method==='makkah'?CalculationMethod.UmmAlQura():method==='na'?CalculationMethod.NorthAmerica():method==='singapore'?CalculationMethod.Singapore():method==='turkey'?CalculationMethod.Turkey():method==='dubai'?CalculationMethod.Dubai():method==='egypt'?CalculationMethod.Egyptian():CalculationMethod.MuslimWorldLeague();
   params.highLatitudeRule=HighLatitudeRule.recommended(coords);
   params.polarCircleResolution=PolarCircleResolution.Unresolved;
   const next=new Date(date.getFullYear(),date.getMonth(),date.getDate()+1);
   const currentTimes=new PrayerTimes(coords,date,params),following=new PrayerTimes(coords,next,params);
   const window=calculatedNightWindow(currentTimes.maghrib,following.fajr,zone);
   return window;
  }catch{return null}
 },[valid,lat,lon,zone,chosenDay,method]);
 const manually=manualNightWindow(sunset,dawn);
 const result=mode==='manual'?manually:automated;
 const chooseCity=(i:number)=>{const p=presets[i];setPreset(i);setLatitude('');setLongitude('');setTimezone('');setPlace('');setMethod(p.method);setDay('');setFeedback('')};
 const locate=()=>{
  if(!navigator.geolocation){setFeedback('Location is unavailable; choose a city or enter coordinates.');return}
  navigator.geolocation.getCurrentPosition(p=>{setLatitude(String(p.coords.latitude));setLongitude(String(p.coords.longitude));setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);setPlace('Your selected location');setDay('');setFeedback('Location updated on this device.')},()=>setFeedback('Location permission was not granted. Select a city or enter coordinates instead.'),{timeout:12000,enableHighAccuracy:false});
 };
 const copy=async()=>{
  if(!result)return;
  const msg='Last third of the night: '+result.lastThirdStart+'–'+result.fajr+'. Maghrib: '+result.maghrib+'. Based on '+(mode==='manual'?'entered mosque times':place||loc.name+'. Method: '+method)+'. Check local Fajr.';
  try{await navigator.clipboard.writeText(msg);setFeedback('Times copied.')}catch{setFeedback('Copy unavailable. You can select the displayed times instead.')}
 };
 useEffect(()=>{setFeedback('')},[mode]);
 return <div className="tahajjud-calculator">
  <div className="tahajjud-switch" role="group" aria-label="Tahajjud calculation input">
   <button type="button" className={mode==='city'?'':'secondary'} aria-pressed={mode==='city'} onClick={()=>setMode('city')}>Calculate by city</button>
   <button type="button" className={mode==='manual'?'':'secondary'} aria-pressed={mode==='manual'} onClick={()=>setMode('manual')}>Enter mosque times</button>
  </div>
  {mode==='city'?<>
   <p className="small">Choose the Maghrib date. Fajr is taken from the <strong>following morning</strong> using the selected calculation method.</p>
   <CitySearch onSelect={c=>{setLatitude(String(c[3]));setLongitude(String(c[4]));setTimezone(c[5]);setPlace(c[0]+', '+c[1]);setDay('');setMethod(({SA:'makkah',PK:'karachi',AE:'dubai',US:'na',CA:'na',SG:'singapore',MY:'singapore',TR:'turkey'} as Record<string,Method>)[c[1]]||'mwl')}}/>
   <div className="two"><label>Popular city<select value={preset} onChange={e=>chooseCity(Number(e.target.value))}>{presets.map((p,i)=><option key={p.name} value={i}>{p.name}</option>)}</select></label><label>Tonight's Maghrib date<input type="date" value={chosenDay} onChange={e=>setDay(e.target.value)}/></label></div>
   <p className="small">Using: <strong>{place||loc.name}</strong> · {zone}</p>
   <label>Prayer calculation method<select value={method} onChange={e=>setMethod(e.target.value as Method)}>{methods.map(([id,name])=><option value={id} key={id}>{name}</option>)}</select></label>
   <details className="settings"><summary>Use device location or precise coordinates</summary><button className="secondary" type="button" onClick={locate}>Use my location</button><div className="two"><label>Latitude<input inputMode="decimal" value={latitude} placeholder={String(loc.lat)} onChange={e=>setLatitude(e.target.value)}/></label><label>Longitude<input inputMode="decimal" value={longitude} placeholder={String(loc.lon)} onChange={e=>setLongitude(e.target.value)}/></label></div><label>Timezone (IANA)<input value={timezone} placeholder={loc.zone} onChange={e=>setTimezone(e.target.value)}/></label></details>
  </>:<>
   <p>Enter your mosque's Maghrib time for tonight and Fajr time for the <strong>next morning</strong>. Both must use the same local clock.</p>
   <div className="two"><label>Maghrib / sunset (today)<input type="time" value={sunset} onChange={e=>setSunset(e.target.value)} required/></label><label>Fajr (following morning)<input type="time" value={dawn} onChange={e=>setDawn(e.target.value)} required/></label></div>
   <Notice>For nights when clocks change (daylight saving), manual clock times alone cannot capture the elapsed overnight hour. Use the city calculation or ask your mosque for its final-third start.</Notice>
  </>}
  {result?<section className="tahajjud-results" aria-live="polite">
    <div className="result tahajjud-primary"><span>The final third begins</span><strong>{result.lastThirdStart}</strong><small>Continues until the following Fajr at {result.fajr}</small></div>
    <div className="tahajjud-overview"><div><span>Maghrib / sunset</span><strong>{result.maghrib}</strong></div><div><span>Night length</span><strong>{minutesLabel(result.nightMinutes)}</strong></div><div><span>One third</span><strong>{minutesLabel(result.thirdMinutes)}</strong></div><div><span>Following Fajr</span><strong>{result.fajr}</strong></div></div>
    <div className="tahajjud-timeline" aria-label={'The night runs from '+result.maghrib+' to '+result.fajr+'; final third begins at '+result.lastThirdStart}>
     <div className="tahajjud-segments"><span/><span/><span className="last"/></div>
     <div className="tahajjud-markers"><span>Maghrib<br/>{result.maghrib}</span><span>First third<br/>{result.firstThirdEnd}</span><span>Final third<br/>{result.lastThirdStart}</span><span>Fajr<br/>{result.fajr}</span></div>
    </div>
    <div className="action-row"><button type="button" className="secondary" onClick={()=>void copy()}>Copy night times</button><button type="button" className="secondary" onClick={()=>window.print()}>Print times</button></div>
   </section>:<p className="warn" role="alert">{mode==='manual'?'Enter valid times where Fajr is the next morning and the night is between 2 and 22 hours.':'These times could not be calculated. Check location, timezone, date and high-latitude conditions, or use your mosque times.'}</p>}
  {feedback&&<p role="status" className="small">{feedback}</p>}

 </div>;
}
