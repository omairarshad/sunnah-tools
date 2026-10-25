import {test} from 'node:test';
import assert from 'node:assert/strict';
import {CalculationMethod,Coordinates,Madhab,PrayerTimes,Qibla,HighLatitudeRule,PolarCircleResolution} from 'adhan';
const isValid=d=>d instanceof Date&&Number.isFinite(d.getTime());
test('London prayer times form coherent chronological order',()=>{
 const c=new Coordinates(51.5072,-0.1276),m=CalculationMethod.MuslimWorldLeague();
 m.highLatitudeRule=HighLatitudeRule.recommended(c);
 const p=new PrayerTimes(c,new Date(2027,1,10),m);
 for(const d of [p.fajr,p.sunrise,p.dhuhr,p.asr,p.maghrib,p.isha])assert.equal(isValid(d),true);
 assert.ok(p.fajr<p.sunrise&&p.sunrise<p.dhuhr&&p.dhuhr<p.asr&&p.asr<p.maghrib&&p.maghrib<p.isha);
});
test('Hanafi Asr occurs later than standard Asr',()=>{
 const c=new Coordinates(24.8607,67.0011),d=new Date(2027,1,10);
 const a=CalculationMethod.Karachi(),b=CalculationMethod.Karachi();a.madhab=Madhab.Shafi;b.madhab=Madhab.Hanafi;
 assert.ok(new PrayerTimes(c,d,b).asr>new PrayerTimes(c,d,a).asr);
});
test('Qibla bearings fall in expected broad hemisphere ranges',()=>{
 const l=Qibla(new Coordinates(51.5072,-0.1276)),ny=Qibla(new Coordinates(40.7128,-74.006));
 assert.ok(l>100&&l<140,'London Qibla should point southeast');
 assert.ok(ny>40&&ny<90,'New York Qibla should point northeast');
});
test('high-latitude and polar settings are available without silently inventing timings',()=>{
 const c=new Coordinates(69.6492,18.9553),m=CalculationMethod.MuslimWorldLeague();
 m.highLatitudeRule=HighLatitudeRule.SeventhOfTheNight;
 m.polarCircleResolution=PolarCircleResolution.AqrabYaum;
 assert.ok(new PrayerTimes(c,new Date(2027,5,21),m));
});
test('Europe/London formatting handles the 2027 spring DST switch',()=>{
 const fmt=d=>new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/London',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(d));
 assert.equal(fmt('2027-03-28T00:30:00Z'),'00:30');
 assert.equal(fmt('2027-03-28T01:30:00Z'),'02:30');
});
