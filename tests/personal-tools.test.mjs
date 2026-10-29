import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validCivilDate,validateQuranPlan,validateQadaPlan,validateSalahHistory,makeRamadanIcs} from '../src/lib/personalTools.mjs';
test('date and Quran reading plans reject impossible and oversized user input',()=>{
 assert.equal(validCivilDate('2027-02-29'),false);
 assert.equal(validCivilDate('2028-02-29'),true);
 const plan={pages:604,days:30,done:67,start:'2027-02-08'};
 assert.deepEqual(validateQuranPlan(plan),plan);
 assert.equal(validateQuranPlan({...plan,done:605}),null);
 assert.equal(validateQuranPlan({...plan,start:'2030-02-30'}),null);
 assert.equal(validateQuranPlan({...plan,days:-1}),null);
});
test('Qada plan import restricts prayer names, counts and dangerous properties',()=>{
 const plan={version:2,mode:'days',days:'30',years:'1',start:'',end:'',excluded:'0',witr:false,overrides:{Fajr:'23'},done:{Fajr:7,Asr:0}};
 assert.deepEqual(validateQadaPlan(plan),plan);
 assert.equal(validateQadaPlan({...plan,mode:'unknown'}),null);
 assert.equal(validateQadaPlan({...plan,done:{Maghrib:-1}}),null);
 assert.equal(validateQadaPlan({...plan,done:{Unknown:1}}),null);
 assert.equal(validateQadaPlan({...plan,overrides:{Fajr:'1000001'}}),null);
 assert.equal(validateQadaPlan({...plan,start:'2027-02-31'}),null);
 assert.equal(validateQadaPlan({...plan,version:999}),null);
});
test('Salah history schema validates only known prayers and dates',()=>{
 const h={version:1,entries:{'2026-10-24':['Fajr','Dhuhr']}};
 assert.deepEqual(validateSalahHistory(h),h);
 assert.equal(validateSalahHistory({version:1,entries:{'2026-10-24':['Fajr','Fajr']}}),null);
 assert.equal(validateSalahHistory({version:1,entries:{'2026-99-99':['Fajr']}}),null);
});
test('Ramadan ICS uses actual instants across Britain daylight saving transition',()=>{
 const before={day:'2027-03-27',fajr:new Date('2027-03-27T04:50:00Z'),maghrib:new Date('2027-03-27T18:25:00Z')};
 const after={day:'2027-03-28',fajr:new Date('2027-03-28T04:48:00Z'),maghrib:new Date('2027-03-28T18:26:00Z')};
 const output=makeRamadanIcs([before,after],new Date('2026-10-25T12:00:00Z'));
 assert.match(output,/BEGIN:VCALENDAR\r\nVERSION:2.0/);
 assert.match(output,/DTSTART:20270327T045000Z/);
 assert.match(output,/DTSTART:20270328T044800Z/);
 assert.match(output,/DTSTART:20270328T182600Z/);
 assert.equal((output.match(/BEGIN:VEVENT/g)||[]).length,4);
 assert.ok(output.endsWith('END:VCALENDAR\r\n'));
 assert.throws(()=>makeRamadanIcs([before,before]));
 assert.throws(()=>makeRamadanIcs([{...before,maghrib:new Date('2027-03-27T04:00:00Z')}]));
});
test('Ramadan ICS escapes location data and uses context-specific event identifiers',()=>{
 const event={day:'2027-03-27',fajr:new Date('2027-03-27T04:50:00Z'),maghrib:new Date('2027-03-27T18:25:00Z')};
 const stamp=new Date('2026-10-25T12:00:00Z');
 const london=makeRamadanIcs([event],stamp,{location:'London, UK',zone:'Europe/London',method:'MWL'});
 const newcastle=makeRamadanIcs([event],stamp,{location:'Newcastle; UK',zone:'Europe/London',method:'MWL'});
 assert.match(london,/LOCATION:London\\, UK/);
 assert.match(newcastle,/LOCATION:Newcastle\\; UK/);
 assert.match(london,/DESCRIPTION:Calculated estimate/);
 assert.notEqual(london.match(/UID:([^\r\n]+)/)?.[1],newcastle.match(/UID:([^\r\n]+)/)?.[1]);
});
