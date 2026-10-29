import {test} from 'node:test';
import assert from 'node:assert/strict';
import {calculateRamadanStart,countdownParts,ramadanStartIcs} from '../src/lib/ramadanCountdown.mjs';

const london={latitude:51.5072,longitude:-0.1276,zone:'Europe/London'};
test('Ramadan sunset precedes the first daylight fast and uses the configured time zone',()=>{
 const result=calculateRamadanStart({...london,firstFast:'2027-02-08'});
 assert.equal(result.eveningDate,'2027-02-07');
 assert.equal(result.firstFast,'2027-02-08');
 assert.equal(result.at.toISOString().slice(0,10),'2027-02-07');
 assert.equal(result.fajr.toISOString().slice(0,10),'2027-02-08');
 assert.match(result.atClock,/^\d{2}:\d{2}$/);
 assert.ok(result.fajr>result.at);
 assert.equal(result.issue,null);
});
test('Ramadan calculation rejects invalid dates, locations and time zones',()=>{
 assert.equal(calculateRamadanStart({...london,firstFast:'2027-02-30'}),null);
 assert.equal(calculateRamadanStart({...london,firstFast:'2027-02-08',latitude:91}),null);
 assert.equal(calculateRamadanStart({...london,firstFast:'2027-02-08',zone:'Invalid/Zone'}),null);
});
test('a local date remains correct in time zones far from UTC and across DST',()=>{
 for(const firstFast of ['2027-03-28','2027-03-29']){
  const result=calculateRamadanStart({...london,firstFast});
  assert.equal(result.eveningDate,firstFast==='2027-03-28'?'2027-03-27':'2027-03-28');
  assert.ok(result.at instanceof Date);
  assert.ok(result.fajr instanceof Date);
 }
 const sydney=calculateRamadanStart({firstFast:'2027-02-08',latitude:-33.8688,longitude:151.2093,zone:'Australia/Sydney'});
 assert.equal(sydney.eveningDate,'2027-02-07');
 assert.ok(sydney.at instanceof Date);
 assert.ok(sydney.fajr instanceof Date);
});
test('countdown counts down from the instant and clearly marks elapsed starts',()=>{
 const at=new Date('2027-02-07T17:00:00Z');
 assert.deepEqual(countdownParts(at,new Date('2027-02-06T15:59:59Z')),{upcoming:true,days:1,hours:1,minutes:1});
 assert.deepEqual(countdownParts(at,new Date('2027-02-07T17:00:00Z')),{upcoming:false,days:0,hours:0,minutes:0});
 assert.equal(countdownParts(null),null);
});
test('Ramadan .ics records the UTC sunset instant without claiming a sighting',()=>{
 const result=calculateRamadanStart({...london,firstFast:'2027-02-08'});
 const ics=ramadanStartIcs(result,{location:'London',zone:'Europe/London'},new Date('2026-10-29T12:00:00Z'));
 assert.match(ics,/DTSTART:20270207T170000Z/);
 assert.match(ics,/DTSTAMP:20261029T120000Z/);
 assert.match(ics,/not a moon-sighting announcement/i);
 assert.throws(()=>ramadanStartIcs(result,{},null),RangeError);
});
