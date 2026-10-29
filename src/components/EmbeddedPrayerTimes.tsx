import {useEffect,useState} from 'react';
import {CalculationMethod,Coordinates,Madhab,PrayerTimes,HighLatitudeRule} from 'adhan';
const methods:Record<string,()=>ReturnType<typeof CalculationMethod.MuslimWorldLeague>>={
 mwl:()=>CalculationMethod.MuslimWorldLeague(),karachi:()=>CalculationMethod.Karachi(),makkah:()=>CalculationMethod.UmmAlQura(),
 na:()=>CalculationMethod.NorthAmerica(),egypt:()=>CalculationMethod.Egyptian(),singapore:()=>CalculationMethod.Singapore(),
 turkey:()=>CalculationMethod.Turkey(),dubai:()=>CalculationMethod.Dubai()
};
const names=['Fajr','Sunrise','Dhuhr','Asr','Maghrib','Isha'] as const;
function parse(){
 const search=new URLSearchParams(window.location.search);
 const lat=Number(search.get('lat')),lon=Number(search.get('lon')),tz=search.get('tz')??'',method=search.get('method')??'mwl';
 const school=search.get('school')==='hanafi'?'hanafi':'standard',theme=search.get('theme')==='dark'?'dark':'light';
 const sunrise=search.get('sunrise')!=='0',size=search.get('size')==='compact'?'compact':'regular';
 let valid=search.has('lat')&&search.has('lon')&&Number.isFinite(lat)&&Math.abs(lat)<=90&&Number.isFinite(lon)&&Math.abs(lon)<=180&&tz.length<80&&!!methods[method];
 try{new Intl.DateTimeFormat('en',{timeZone:tz})}catch{valid=false}
 return {lat,lon,tz,method,school,theme,sunrise,size,city:(search.get('city')??'Selected location').slice(0,60),valid};
}
export default function EmbeddedPrayerTimes(){
 const [now,setNow]=useState(()=>Date.now()),[cfg,setCfg]=useState<ReturnType<typeof parse>|null>(null);
 useEffect(()=>{setCfg(parse());const id=window.setInterval(()=>setNow(Date.now()),60000);return()=>window.clearInterval(id)},[]);
 if(!cfg)return <div className="embed-loading">Loading prayer times…</div>;
 if(!cfg.valid)return <div className="embed-error">Invalid location or calculation settings. Generate new embed code from sunnah.tools.</div>;
 const {lat,lon,tz,method,school,theme,city,sunrise,size}=cfg;
 try{
  const pieces=new Intl.DateTimeFormat('en-GB',{timeZone:tz,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(now));
  const v=(k:string)=>Number(pieces.find(x=>x.type===k)?.value);
  const date=new Date(v('year'),v('month')-1,v('day'));
  const coordinates=new Coordinates(lat,lon),params=methods[method]();
  params.madhab=school==='hanafi'?Madhab.Hanafi:Madhab.Shafi;
  params.highLatitudeRule=HighLatitudeRule.recommended(coordinates);
  const result=new PrayerTimes(coordinates,date,params);
  const fmt=(d:Date)=>d instanceof Date&&!Number.isNaN(d.getTime())?new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:tz,hour12:false}).format(d):'—';
  return <div className={'embed-card theme-'+theme+(size==='compact'?' embed-compact':'')}><div className="embed-header"><span className="embed-kicker">PRAYER TIME WIDGET</span><h1>Prayer times</h1><p>{city} · {tz}</p></div>
   <div className="embed-dates">{new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:tz}).format(new Date(now))}</div>
   <div className="embed-prayers">{names.filter(name=>sunrise||name!=='Sunrise').map(name=><div key={name}><span>{name}</span><strong>{fmt(result[name.toLowerCase() as Lowercase<typeof name>])}</strong></div>)}</div>
   <div className="embed-footer"><small>Calculated prayer starts, not congregation times · {method.toUpperCase()}</small><a href="https://sunnah.tools/tools/prayer-times/" target="_blank" rel="noopener noreferrer">Sunnah Tools ↗</a></div>
  </div>;
 }catch{return <div className="embed-error">Could not calculate these prayer times. Check the timezone and selected method.</div>}
}
