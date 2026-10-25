import {useEffect,useState} from 'react';
import {CalculationMethod,Coordinates,Madhab,PrayerTimes,HighLatitudeRule} from 'adhan';
type City={name:string;lat:number;lon:number;tz:string;method:string};
const DAYS=['Fajr','Sunrise','Dhuhr','Asr','Maghrib','Isha'] as const;
const methodOptions=[['mwl','Muslim World League'],['karachi','Karachi'],['makkah','Umm al-Qura'],['na','North America / ISNA'],['dubai','Dubai'],['turkey','Turkey'],['egypt','Egypt']];
function dayInZone(zone:string){const p=new Intl.DateTimeFormat('en-CA',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());const get=(n:string)=>Number(p.find(x=>x.type===n)?.value);return {year:get('year'),month:get('month'),day:get('day')}}
function fmt(t:Date|undefined,zone:string){return t instanceof Date&&Number.isFinite(t.getTime())?new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:zone}).format(t):'—'}
function calculator(method:string,hanafi:boolean,coords:Coordinates){
 const params=method==='makkah'?CalculationMethod.UmmAlQura():method==='karachi'?CalculationMethod.Karachi():method==='na'?CalculationMethod.NorthAmerica():method==='dubai'?CalculationMethod.Dubai():method==='turkey'?CalculationMethod.Turkey():method==='egypt'?CalculationMethod.Egyptian():CalculationMethod.MuslimWorldLeague();
 params.madhab=hanafi?Madhab.Hanafi:Madhab.Shafi;
 params.highLatitudeRule=HighLatitudeRule.recommended(coords);
 return params;
}
export default function CityPrayerTable({city}:{city:City}){
 const [method,setMethod]=useState(city.method),[hanafi,setHanafi]=useState(false),[day,setDay]=useState(dayInZone(city.tz)),[adjust,setAdjust]=useState(0);
 useEffect(()=>{const t=window.setInterval(()=>setDay(dayInZone(city.tz)),60000);return()=>window.clearInterval(t)},[city.tz]);
 const coords=new Coordinates(city.lat,city.lon),params=calculator(method,hanafi,coords);
 const rows=Array.from({length:7},(_,i)=>{const d=new Date(day.year,day.month-1,day.day+i);let pt:PrayerTimes|null=null;try{pt=new PrayerTimes(coords,d,params)}catch{}return {date:d,prayers:pt}});
 const format=(d:Date|undefined)=>fmt(d&&adjust?new Date(d.getTime()+adjust*60000):d,city.tz);
 return <div className="expansion-tool">
  <p><strong>Calculated for {city.name}</strong> · {city.tz} · latitude {city.lat.toFixed(3)}°, longitude {city.lon.toFixed(3)}°.</p>
  <div className="two"><label>Calculation method<select value={method} onChange={e=>setMethod(e.target.value)}>{methodOptions.map(([id,name])=><option value={id} key={id}>{name}</option>)}</select></label><label>Asr school<select value={hanafi?'hanafi':'standard'} onChange={e=>setHanafi(e.target.value==='hanafi')}><option value="standard">Standard</option><option value="hanafi">Hanafi</option></select></label></div>
  <label>Optional displayed time adjustment<select value={adjust} onChange={e=>setAdjust(Number(e.target.value))}><option value={0}>No adjustment</option>{[-10,-5,5,10].map(n=><option key={n} value={n}>{n>0?'+':''}{n} minutes (all times)</option>)}</select></label>
  <div className="table-wrap"><table><thead><tr><th>Local date</th>{DAYS.map(n=><th key={n}>{n}</th>)}</tr></thead><tbody>{rows.map(({date,prayers})=><tr key={date.toISOString()}><th scope="row">{new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',timeZone:city.tz}).format(new Date(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate(),12)))}</th>{DAYS.map(n=><td key={n}>{prayers?format(prayers[n.toLowerCase() as Lowercase<typeof n>]):'—'}</td>)}</tr>)}</tbody></table></div>
  <div className="action-row"><button type="button" onClick={()=>window.print()}>Print seven-day times</button><a href="/tools/prayer-times/">Open full prayer calculator</a></div>
  <p className="warn">These are calculated prayer beginnings, not mosque jamaat times. Fajr and Isha vary by authority; extreme twilight may need additional local adjustment. In summer or at high latitudes, check your mosque’s published schedule.</p>
 </div>
}
