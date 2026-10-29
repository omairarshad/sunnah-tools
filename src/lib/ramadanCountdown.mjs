import {isoPlusDays,dateFromISO} from './growthCalculations.mjs';
import {buildRamadanTimetable,localClock} from './ramadanTimetable.mjs';

/** Ramadan's first religious night begins at the preceding local sunset. */
/** @param {{firstFast:string,latitude:number,longitude:number,zone:string,method?:string,highLatitude?:string,polar?:string}} options */
export function calculateRamadanStart({firstFast,latitude,longitude,zone,method='mwl',highLatitude='recommended',polar='unresolved'}={}){
 if(!dateFromISO(firstFast))return null;
 const eveningDate=isoPlusDays(firstFast,-1);
 const data=buildRamadanTimetable({start:eveningDate,count:29,latitude,longitude,zone,method,highLatitude,polar});
 if(!data)return null;
 const eve=data.rows[0],morning=data.rows[1];
 return {firstFast,eveningDate,at:eve.maghribInstant,atClock:eve.maghribInstant?localClock(eve.maghribInstant,zone):null,
  fajr:morning.fajrInstant,firstFajrClock:morning.fajrInstant?localClock(morning.fajrInstant,zone):null,
  issue:eve.maghribInstant?null:'Calculated sunset unavailable: check coordinates, timezone and polar conditions'};
}
/** Count down to an actual instant. Never calculate a civil-day difference in browser time. */
export function countdownParts(at,now=new Date()){
 if(!(at instanceof Date)||!Number.isFinite(at.getTime())||!(now instanceof Date)||!Number.isFinite(now.getTime()))return null;
 const ms=at.getTime()-now.getTime(),minutes=Math.ceil(Math.abs(ms)/60000);
 return {upcoming:ms>0,days:Math.floor(minutes/1440),hours:Math.floor(minutes%1440/60),minutes:minutes%60};
}
const safe=value=>String(value??'').replace(/\\/g,'\\\\').replace(/\r\n|\r|\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;').slice(0,190);
export function ramadanStartIcs(result,{location='',zone=''}={},stamp=new Date()){
 if(!result?.at||!(result.at instanceof Date)||!Number.isFinite(result.at.getTime())||!dateFromISO(result.firstFast)||!dateFromISO(result.eveningDate)||!(stamp instanceof Date)||!Number.isFinite(stamp.getTime()))throw new RangeError('Invalid Ramadan start event');
 const stampText=stamp.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
 const instant=result.at.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
 const end=new Date(result.at.getTime()+60000).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','CALSCALE:GREGORIAN','PRODID:-//Sunnah Tools//Ramadan Start//EN','BEGIN:VEVENT','UID:ramadan-start-'+result.firstFast+'@sunnah.tools','DTSTAMP:'+stampText,'DTSTART:'+instant,'DTEND:'+end,'SUMMARY:Estimated Ramadan begins at local sunset','DESCRIPTION:'+safe('Planning reminder only. Computed sunset in '+location+' ('+zone+'). Not a moon-sighting announcement; confirm the local date and mosque timetable.'),'END:VEVENT','END:VCALENDAR'];
 return lines.join('\r\n')+'\r\n';
}
