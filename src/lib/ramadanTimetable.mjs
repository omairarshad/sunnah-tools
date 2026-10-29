import {CalculationMethod,Coordinates,HighLatitudeRule,PolarCircleResolution,PrayerTimes} from 'adhan';
import {fastingDuration,fastingDurationLabel,planningReminder} from './fastingKnowledge.mjs';
import {ramadanDays} from './ramadanHelpers.mjs';

export const RAMADAN_METHODS=Object.freeze([
 ['mwl','Muslim World League'],['makkah','Umm al-Qura (Makkah)'],['karachi','Karachi'],
 ['na','ISNA (North America)'],['singapore','Singapore'],['turkey','Turkey'],
 ['dubai','Dubai'],['egypt','Egyptian'],['moon','Moonsighting Committee']
]);
export const RAMADAN_HIGH_LAT=Object.freeze([
 ['recommended','Library-recommended rule'],['angle','Twilight angle'],
 ['seventh','One-seventh of night'],['middle','Middle of night']
]);
export const RAMADAN_POLAR=Object.freeze([
 ['unresolved','Show unresolved (no approximation)'],
 ['nearest-day','Nearest suitable day'],['nearest-location','Nearest suitable latitude']
]);

const validInstant=value=>value instanceof Date&&Number.isFinite(value.getTime());
const validZone=zone=>{try{new Intl.DateTimeFormat('en-GB',{timeZone:zone});return true}catch{return false}};
export const methodName=key=>RAMADAN_METHODS.find(x=>x[0]===key)?.[1]??'Unknown method';
export const highLatName=key=>RAMADAN_HIGH_LAT.find(x=>x[0]===key)?.[1]??'Unknown rule';
export const polarName=key=>RAMADAN_POLAR.find(x=>x[0]===key)?.[1]??'Unknown polar handling';

function parameters(method,highLatitude,polar,coords){
 const constructors={mwl:CalculationMethod.MuslimWorldLeague,makkah:CalculationMethod.UmmAlQura,karachi:CalculationMethod.Karachi,na:CalculationMethod.NorthAmerica,singapore:CalculationMethod.Singapore,turkey:CalculationMethod.Turkey,dubai:CalculationMethod.Dubai,egypt:CalculationMethod.Egyptian,moon:CalculationMethod.MoonsightingCommittee};
 const p=constructors[method]();
 p.highLatitudeRule=highLatitude==='angle'?HighLatitudeRule.TwilightAngle:highLatitude==='seventh'?HighLatitudeRule.SeventhOfTheNight:highLatitude==='middle'?HighLatitudeRule.MiddleOfTheNight:HighLatitudeRule.recommended(coords);
 p.polarCircleResolution=polar==='nearest-day'?PolarCircleResolution.AqrabYaum:polar==='nearest-location'?PolarCircleResolution.AqrabBalad:PolarCircleResolution.Unresolved;
 return p;
}
/** Gregorian calendar date in the chosen location; never use the device's time zone. */
export function civilDateAt(instant,zone){
 if(!validInstant(instant)||!validZone(zone))return null;
 const parts=new Intl.DateTimeFormat('en-GB',{year:'numeric',month:'2-digit',day:'2-digit',timeZone:zone}).formatToParts(instant);
 const get=type=>parts.find(p=>p.type===type)?.value;
 return `${get('year')}-${get('month')}-${get('day')}`;
}
export function localClock(instant,zone){
 if(!validInstant(instant)||!validZone(zone))return 'Unavailable';
 return new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:zone}).format(instant);
}
/**
 * A month of *estimates*. Failures remain visible as unavailable rows; never
 * silently shorten the religious month or replace unresolved dawn with sunrise.
 * The optional calculate override enables deterministic date/DST regression tests.
 */
export function buildRamadanTimetable(input,calculate=(coords,d,p)=>new PrayerTimes(coords,d,p)){
 const {start,count,latitude,longitude,zone,method='mwl',highLatitude='recommended',polar='unresolved',reminderMinutes=0}=input??{};
 const dates=ramadanDays(start,count);
 if(!dates||!Number.isFinite(latitude)||Math.abs(latitude)>90||!Number.isFinite(longitude)||Math.abs(longitude)>180||!validZone(zone)||
    !RAMADAN_METHODS.some(x=>x[0]===method)||!RAMADAN_HIGH_LAT.some(x=>x[0]===highLatitude)||!RAMADAN_POLAR.some(x=>x[0]===polar)||![0,5,10,15,20].includes(reminderMinutes))return null;
 const coords=new Coordinates(latitude,longitude),p=parameters(method,highLatitude,polar,coords);
 const rows=dates.map(({day,iso})=>{
  const weekday=new Intl.DateTimeFormat('en-GB',{weekday:'short',timeZone:'UTC'}).format(new Date(iso+'T12:00:00Z'));
  const unavailable=reason=>({day,date:iso,weekday,fajr:'Unavailable',maghrib:'Unavailable',duration:'Unavailable',reminder:'',fajrInstant:null,maghribInstant:null,status:reason});
  try{
   // Adhan reads local Date calendar components and produces absolute UTC instants.
   const [y,m,d]=iso.split('-').map(Number);
   const date=new Date(y,m-1,d,12);
   const result=calculate(coords,date,p);
   const fajr=result?.fajr,maghrib=result?.maghrib;
   const duration=fastingDuration(fajr,maghrib);
   if(duration===null||civilDateAt(fajr,zone)!==iso||civilDateAt(maghrib,zone)!==iso)return unavailable('Unavailable — check high-latitude rule, polar conditions, coordinates and timezone');
   const reminderInstant=reminderMinutes?planningReminder(fajr,reminderMinutes):null;
   return {day,date:iso,weekday,fajr:localClock(fajr,zone),maghrib:localClock(maghrib,zone),duration:fastingDurationLabel(duration),reminder:reminderInstant?localClock(reminderInstant,zone):'',fajrInstant:fajr,maghribInstant:maghrib,status:'Calculated estimate'};
  }catch{return unavailable('Unavailable — calculation failed for this date')}
 });
 return {rows,complete:rows.every(r=>r.fajrInstant&&r.maghribInstant),unavailable:rows.filter(r=>!r.fajrInstant).length,first:rows[0].date,last:rows.at(-1).date};
}
