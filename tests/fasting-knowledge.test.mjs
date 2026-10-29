import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fastingDuration,fastingDurationLabel,planningReminder,upcomingFastingEvent,fastingWeekCSV} from '../src/lib/fastingKnowledge.mjs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('fasting interval uses elapsed UTC minutes, not naive local clock subtraction',()=>{
 const dawn=new Date('2027-03-28T03:15:00Z'),sunset=new Date('2027-03-28T18:30:00Z');
 assert.equal(fastingDuration(dawn,sunset),915);
 assert.equal(fastingDurationLabel(915),'15h 15m');
 assert.equal(fastingDuration(new Date('invalid'),sunset),null);
 assert.equal(fastingDuration(sunset,dawn),null);
});
test('optional imsak reminder cannot change or replace Fajr',()=>{
 const fajr=new Date('2027-03-28T04:00:00Z');
 assert.equal(planningReminder(fajr,10).toISOString(),'2027-03-28T03:50:00.000Z');
 assert.equal(fajr.toISOString(),'2027-03-28T04:00:00.000Z');
 assert.equal(planningReminder(fajr,31),null);
 assert.equal(planningReminder(fajr,-1),null);
});
test('countdown selects nearest event after now across overnight boundary',()=>{
 const today={fajr:new Date('2027-03-28T04:00:00Z'),maghrib:new Date('2027-03-28T18:00:00Z')};
 const tomorrow={fajr:new Date('2027-03-29T03:58:00Z'),maghrib:new Date('2027-03-29T18:01:00Z')};
 const atNoon=upcomingFastingEvent(new Date('2027-03-28T12:00:00Z'),today,tomorrow);
 assert.equal(atNoon.name,'Maghrib — iftar');assert.equal(atNoon.description,'6h 00m');
 const afterIftar=upcomingFastingEvent(new Date('2027-03-28T21:00:00Z'),today,tomorrow);
 assert.equal(afterIftar.name,'Fajr — suhoor ends (tomorrow)');
 assert.equal(upcomingFastingEvent(new Date('invalid'),today,tomorrow),null);
});
test('seven-day CSV includes settings, escapes spreadsheet injection',()=>{
 const row=(i)=>({date:'2027-04-'+String(i).padStart(2,'0'),fajr:'04:45',maghrib:'19:50',duration:'15h 05m'});
 const csv=fastingWeekCSV(Array.from({length:7},(_,i)=>row(i+1)),{location:'=HYPERLINK("https://bad")',zone:'Europe/London',method:'Muslim World League'});
 assert.equal(csv.split('\r\n').length,9);
 assert.ok(csv.includes("'=HYPERLINK"));
 assert.ok(csv.includes('Europe/London'));
 assert.throws(()=>fastingWeekCSV([]));
});
test('fasting panel is distinct from prayer output and warns about planning imsak',()=>{
 const panel=read('src/components/FastingTimesPanel.tsx');
 for(const term of ['Optional suhoor planning reminder','not','Fajr is the cutoff','Download seven-day CSV','Next 7 days from selected date','Show today','local mosque'])assert.ok(panel.includes(term),term);
 const app=read('src/components/ToolApp.tsx');
 assert.match(app,/FastingTimesPanel/);
});
