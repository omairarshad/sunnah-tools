import {test} from 'node:test';
import assert from 'node:assert/strict';
import {hijriMonth,whiteDaysPlan,whiteDaysCSV,whiteDaysIcs} from '../src/lib/hijriCalendars.mjs';
import {isoPlusDays} from '../src/lib/growthCalculations.mjs';

const at=(iso)=>new Date(iso+'T12:00:00Z');
test('monthly White Days plan shows complete 13th–15th sets for 3, 6 or 12 months',()=>{
 const first=hijriMonth(1448,4).start;
 for(const n of [3,6,12]){
  const plan=whiteDaysPlan(at(first),n);
  assert.equal(plan.months.length,n);
  assert.equal(plan.months.flatMap(m=>m.dates).length,n*3);
  for(const m of plan.months)assert.deepEqual(m.dates.map(d=>d.day),[13,14,15]);
 }
 assert.equal(whiteDaysPlan(at(first),7),null);
 assert.equal(whiteDaysPlan(new Date('invalid'),3),null);
});
test('planning after the 15th begins next month, while planning on the 14th retains all 3 dates',()=>{
 const month=hijriMonth(1448,5);
 const onFourteenth=whiteDaysPlan(at(isoPlusDays(month.start,13)),3);
 assert.equal(onFourteenth.months[0].month,5);
 assert.equal(onFourteenth.months[0].dates.length,3);
 assert.equal(onFourteenth.months[0].dates[0].passed,true);
 const after=whiteDaysPlan(at(isoPlusDays(month.start,15)),3);
 assert.equal(after.months[0].month,6);
});
test('illustrative plus and minus one-day shifts never change the underlying Hijri day',()=>{
 const first=hijriMonth(1448,5).start;
 const normal=whiteDaysPlan(at(first),3,0);
 const earlier=whiteDaysPlan(at(first),3,-1);
 const later=whiteDaysPlan(at(first),3,1);
 assert.equal(earlier.months[0].dates[0].iso,isoPlusDays(normal.months[0].dates[0].iso,-1));
 assert.equal(later.months[0].dates[2].iso,isoPlusDays(normal.months[0].dates[2].iso,1));
 assert.deepEqual(earlier.months[0].dates.map(d=>d.day),[13,14,15]);
 assert.equal(whiteDaysPlan(at(first),3,2),null);
});
test('Ramadan and 13 Dhul Hijjah are explicit exceptions, not eligible optional fasts',()=>{
 const ramadan=whiteDaysPlan(at(hijriMonth(1448,9).start),3);
 const ramadanMonth=ramadan.months.find(m=>m.month===9);
 assert.ok(ramadanMonth);
 assert.ok(ramadanMonth.dates.every(d=>d.fastingStatus==='ramadan-obligatory'));
 const dhul=whiteDaysPlan(at(hijriMonth(1448,12).start),3);
 const dhulMonth=dhul.months.find(m=>m.month===12);
 assert.equal(dhulMonth.dates[0].fastingStatus,'not-recommended');
 assert.equal(dhulMonth.dates[1].fastingStatus,'voluntary-day');
 assert.equal(dhulMonth.dates[2].fastingStatus,'voluntary-day');
 const exported=whiteDaysIcs(dhul,new Date('2026-10-29T12:00:00Z'));
 assert.doesNotMatch(exported,new RegExp('UID:'+dhulMonth.dates[0].iso));
 assert.match(exported,new RegExp('UID:'+dhulMonth.dates[1].iso));
 const exportedRamadan=whiteDaysIcs(ramadan);
 for(const date of ramadanMonth.dates)assert.doesNotMatch(exportedRamadan,new RegExp('UID:'+date.iso));
});
test('CSV exports every labelled date and calendar exports only future optional reminders',()=>{
 const plan=whiteDaysPlan(at(hijriMonth(1448,4).start),3);
 const csv=whiteDaysCSV(plan),ics=whiteDaysIcs(plan);
 assert.equal(csv.charCodeAt(0),0xfeff);
 assert.equal(csv.split('\r\n').filter(Boolean).length,10);
 assert.match(csv,/Umm al-Qura; confirm local moon sighting/);
 assert.equal((ics.match(/BEGIN:VEVENT/g)||[]).length,9);
 assert.match(ics,/DTSTART;VALUE=DATE:/);
 assert.doesNotMatch(ics,/DTSTART:\d{8}T/);
 assert.throws(()=>whiteDaysIcs(plan,new Date('invalid')),RangeError);
});
