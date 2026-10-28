import {test} from 'node:test';
import assert from 'node:assert/strict';
import {clockMinutes,timeOnClock,manualNightWindow,calculatedNightWindow} from '../src/lib/tahajjud.mjs';
test('an eleven hour mosque timetable yields the last third at 01:20',()=>{
 const x=manualNightWindow('18:00','05:00');
 assert.equal(x.nightMinutes,660);
 assert.equal(x.thirdMinutes,220);
 assert.equal(x.firstThirdEnd,'21:40');
 assert.equal(x.lastThirdStart,'01:20');
 assert.equal(x.fajr,'05:00');
});
test('manual calculation handles a night crossing midnight and short winter days',()=>{
 assert.equal(manualNightWindow('16:00','07:00')?.lastThirdStart,'02:00');
 assert.equal(manualNightWindow('20:30','03:30')?.lastThirdStart,'01:10');
 assert.equal(timeOnClock(1445),'00:05');
 assert.equal(clockMinutes('24:00'),null);
 assert.equal(clockMinutes('06:60'),null);
 assert.equal(manualNightWindow('not a time','05:00'),null);
 assert.equal(manualNightWindow('02:00','03:00'),null);
});
test('city calculation uses actual instants across UK spring clock change',()=>{
 const m=new Date('2027-03-27T18:30:00Z'),f=new Date('2027-03-28T04:30:00Z');
 const x=calculatedNightWindow(m,f,'Europe/London');
 assert.equal(x?.nightMinutes,600);
 assert.equal(x?.lastThirdDate?.toISOString(),'2027-03-28T01:10:00.000Z');
 assert.equal(x?.lastThirdStart,'02:10');
 assert.equal(x?.fajr,'05:30');
});
test('calculated mode rejects invalid date intervals',()=>{
 assert.equal(calculatedNightWindow(new Date(NaN),new Date(),'Europe/London'),null);
 assert.equal(calculatedNightWindow(new Date('2026-10-01'),new Date('2026-09-30'),'Europe/London'),null);
});
