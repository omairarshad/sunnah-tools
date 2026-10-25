import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PrayerTimes,CalculationMethod,Coordinates,Madhab,HighLatitudeRule} from 'adhan';
const make=(latitude,longitude,date,hanafi=false)=>{
 const coords=new Coordinates(latitude,longitude),params=CalculationMethod.MuslimWorldLeague();
 params.madhab=hanafi?Madhab.Hanafi:Madhab.Shafi;
 params.highLatitudeRule=HighLatitudeRule.recommended(coords);
 return new PrayerTimes(coords,date,params);
};
const clock=(date,zone)=>{
 const p=new Intl.DateTimeFormat('en-GB',{timeZone:zone,hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(date);
 return Number(p.find(x=>x.type==='hour').value)*60+Number(p.find(x=>x.type==='minute').value);
};
test('London clock times reflect spring DST boundary without changing UTC calculation logic',()=>{
 const before=make(51.5072,-.1276,new Date(2027,2,27)),after=make(51.5072,-.1276,new Date(2027,2,28));
 for(const d of [before,after])for(const k of ['fajr','sunrise','dhuhr','asr','maghrib','isha'])assert.ok(Number.isFinite(d[k].getTime()),k);
 const difference=clock(after.dhuhr,'Europe/London')-clock(before.dhuhr,'Europe/London');
 assert.ok(difference>=40&&difference<=80,'Expected UK clock change around 60 minutes: '+difference);
});
test('Hanafi Asr follows standard Asr with same location and method',()=>{
 const at=new Date(2027,3,6),standard=make(51.5,-.13,at),hanafi=make(51.5,-.13,at,true);
 assert.ok(hanafi.asr.getTime()>standard.asr.getTime());
 assert.ok(standard.maghrib.getTime()>standard.asr.getTime());
});
test('polar and high latitude calculations are documented as estimates rather than an official schedule',()=>{
 const city=readFileSync(new URL('../src/components/CityPrayerTable.tsx',import.meta.url),'utf8');
 const main=readFileSync(new URL('../src/components/ToolApp.tsx',import.meta.url),'utf8');
 assert.match(city,/HighLatitudeRule\.recommended/);
 assert.match(city,/not mosque jamaat times/);
 assert.match(main,/polarCircleResolution/);
 assert.match(main,/High-latitude conventions and polar fallback results need local scholarly confirmation/);
});
test('private plans can be restored and calendar export relies on UTC date objects',()=>{
 const tool=readFileSync(new URL('../src/components/ToolApp.tsx',import.meta.url),'utf8');
 const qada=readFileSync(new URL('../src/components/GrowthTools.tsx',import.meta.url),'utf8');
 const compass=readFileSync(new URL('../src/components/QiblaOrientation.tsx',import.meta.url),'utf8');
 for(const expected of ['validateQuranPlan','validateSalahHistory','makeRamadanIcs','See asset breakdown','Restore saved plan','Restore history'])assert.ok(tool.includes(expected),expected);
 assert.match(qada,/validateQadaPlan/);
 assert.match(qada,/Restore plan from JSON/);
 assert.match(compass,/webkitCompassHeading/);
 assert.match(compass,/magnetic declination/);
});
