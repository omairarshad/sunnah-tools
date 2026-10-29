import {test} from 'node:test';
import assert from 'node:assert/strict';
import {PrayerTimes} from 'adhan';
import {estimatedRamadanStart,ramadanDays,timetableCSV} from '../src/lib/ramadanHelpers.mjs';
import {buildRamadanTimetable,civilDateAt,localClock,methodName} from '../src/lib/ramadanTimetable.mjs';

const london={start:'2027-02-08',count:30,latitude:51.5072,longitude:-0.1276,zone:'Europe/London',method:'mwl'};
test('algorithmic Ramadan date suggestion is current during Ramadan and future otherwise',()=>{
 const today=estimatedRamadanStart(new Date('2026-10-29T12:00:00Z'));
 assert.match(today,/^\d{4}-\d{2}-\d{2}$/);
 assert.ok(today>='2026-10-29');
 const inRamadan=new Date(Date.parse(today+'T12:00:00Z')+10*86400000);
 assert.equal(estimatedRamadanStart(inRamadan),today);
 const after=new Date(Date.parse(today+'T12:00:00Z')+31*86400000);
 assert.ok(estimatedRamadanStart(after)>today);
 assert.equal(estimatedRamadanStart(new Date('invalid')),null);
});
test('complete Ramadan plans have all 29 or 30 dates, valid clocks and absolute instants',()=>{
 for(const count of [29,30]){
  const data=buildRamadanTimetable({...london,count});
  assert.ok(data.complete);
  assert.equal(data.unavailable,0);
  assert.equal(data.rows.length,count);
  assert.equal(data.rows[0].date,'2027-02-08');
  assert.equal(data.rows.at(-1).date,count===29?'2027-03-08':'2027-03-09');
  for(const r of data.rows){
   assert.match(r.fajr,/^\d{2}:\d{2}$/);
   assert.match(r.maghrib,/^\d{2}:\d{2}$/);
   assert.equal(civilDateAt(r.fajrInstant,london.zone),r.date);
   assert.equal(civilDateAt(r.maghribInstant,london.zone),r.date);
   assert.ok(r.fajrInstant<r.maghribInstant);
  }
 }
});
test('DST formatting uses the chosen location timezone, not browser time',()=>{
 const before=new Date('2027-03-27T04:50:00Z'),after=new Date('2027-03-28T04:48:00Z');
 assert.equal(localClock(before,'Europe/London'),'04:50');
 assert.equal(localClock(after,'Europe/London'),'05:48');
 assert.equal(civilDateAt(new Date('2027-02-07T17:51:00Z'),'Australia/Sydney'),'2027-02-08');
 const special=(coords,d,p)=>{
  const date=d.getDate();
  if(d.getMonth()===2&&date===27)return {fajr:before,maghrib:new Date('2027-03-27T18:25:00Z')};
  if(d.getMonth()===2&&date===28)return {fajr:after,maghrib:new Date('2027-03-28T18:26:00Z')};
  return new PrayerTimes(coords,d,p);
 };
 const data=buildRamadanTimetable({...london,start:'2027-03-27'},special);
 assert.equal(data.rows[0].fajr,'04:50');
 assert.equal(data.rows[1].fajr,'05:48');
 assert.equal(data.rows[0].date,'2027-03-27');
 assert.equal(data.rows[1].date,'2027-03-28');
});
test('invalid or mismatched settings cannot generate apparently valid times',()=>{
 for(const settings of [{zone:'Moon/Base'},{latitude:91},{longitude:181},{method:'not-a-method'},{start:'2027-02-30'},{count:31},{reminderMinutes:-10}]){
  assert.equal(buildRamadanTimetable({...london,...settings}),null);
 }
 assert.equal(ramadanDays('1899-12-31',30),null);
 assert.equal(civilDateAt(new Date('2027-03-28T01:00:00Z'),'Invalid/Zone'),null);
});
test('an unresolved Fajr never silently removes a row or creates an exportable event',()=>{
 const broken=(coords,d,p)=>d.getDate()===10?{fajr:new Date(NaN),maghrib:new Date('2027-02-10T17:00:00Z')}:new PrayerTimes(coords,d,p);
 const data=buildRamadanTimetable(london,broken);
 assert.equal(data.rows.length,30);
 assert.equal(data.complete,false);
 assert.equal(data.unavailable,1);
 assert.equal(data.rows[2].date,'2027-02-10');
 assert.equal(data.rows[2].fajr,'Unavailable');
 assert.equal(data.rows[2].fajrInstant,null);
 assert.match(data.rows[2].status,/Unavailable/);
});
test('location timezone mismatch marks the whole calculated month unavailable',()=>{
 const data=buildRamadanTimetable({...london,zone:'Pacific/Auckland'});
 assert.equal(data.complete,false);
 assert.equal(data.rows.length,30);
 assert.ok(data.unavailable>0);
});
test('optional early reminders do not alter Fajr or Maghrib',()=>{
 const original=buildRamadanTimetable(london),withReminder=buildRamadanTimetable({...london,reminderMinutes:10});
 assert.equal(withReminder.rows[0].fajr,original.rows[0].fajr);
 assert.equal(withReminder.rows[0].maghrib,original.rows[0].maghrib);
 assert.notEqual(withReminder.rows[0].reminder,'');
 assert.equal(original.rows[0].reminder,'');
});
test('CSV includes provenance, duration and non-cutoff reminders and prevents formula injection',()=>{
 const data=buildRamadanTimetable({...london,reminderMinutes:10});
 const csv=timetableCSV(data.rows,{location:'=HYPERLINK("bad")',zone:'Europe/London',method:methodName('mwl'),highLatitude:'Recommended',polar:'Unresolved'});
 assert.ok(csv.startsWith('\uFEFFRamadan day'));
 assert.match(csv,/Optional pre-Fajr reminder \(not the cutoff\)/);
 assert.match(csv,/'=HYPERLINK/);
 assert.match(csv,/Muslim World League/);
 assert.match(csv,/10h|11h/);
 assert.equal(csv.trimEnd().split('\r\n').length,31);
 assert.throws(()=>timetableCSV([]));
});
