import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {travelComparison,yearlyEvents,monthCalendar,dhulDays,calendarCSV,eventICS,saiDirection,searchAdditives} from '../src/lib/finalSeven.mjs';

test('travel comparison preserves school-specific distinctions and refuses eligibility verdict',()=>{
 for(const school of ['hanafi','shafii','maliki','hanbali']){
  const x=travelComparison(school,'120','7');assert.equal(x.eligible,'not-assessed');
  assert.deepEqual(x.fard.map(v=>v[2]),[2,2,2,3,2]);
 }
 assert.equal(travelComparison('bad','100','7'),null);
 assert.equal(travelComparison('hanafi','-2','1'),null);
 assert.equal(travelComparison('hanafi','x',''),null);
});
test('events stay aligned to valid Hijri years and filter categories',()=>{
 const all=yearlyEvents(1448,'all');assert.equal(all.length,7);
 assert.equal(yearlyEvents(1448,'eid').length,2);
 assert.equal(yearlyEvents(1448,'hajj').length,3);
 assert.equal(yearlyEvents(1448,'fasting').length,3);
 assert.equal(yearlyEvents(1200),null);
 assert.equal(yearlyEvents(1448,'arbitrary'),null);
 assert.ok(all.every(e=>/^\d{4}-\d{2}-\d{2}$/.test(e.iso)));
});
test('Hijri month calendar is 29 or 30 days and optional shift is illustrative',()=>{
 const a=monthCalendar(1448,9,0),b=monthCalendar(1448,9,1);
 assert.ok(a);assert.ok([29,30].includes(a.days.length));
 assert.equal(b.days[0].iso,a.days[0].iso);
 assert.notEqual(b.days[0].displayISO,a.days[0].iso);
 assert.equal(monthCalendar(1448,13),null);
 assert.equal(monthCalendar(1448,9,2),null);
});
test('Dhul Hijjah includes 13 days with a clear Eid/Tashreeq distinction',()=>{
 const d=dhulDays(1448,0);assert.equal(d.length,13);
 assert.match(d[8].label,/Arafah/);
 assert.match(d[9].label,/no voluntary fast/);
 assert.ok(d.slice(10).every(x=>x.label.includes('no ordinary voluntary fast')));
 assert.equal(dhulDays(1200),null);
 assert.equal(dhulDays(1448,-2),null);
});
test('Calendar CSV protects spreadsheet formulas; ICS marks canonical dates provisional',()=>{
 const csv=calendarCSV([['Name','Date'],['=HYPERLINK("evil")','2027-01-01']]);
 assert.match(csv,/'=HYPERLINK/);
 const ics=eventICS([{iso:'2027-01-01',label:'Estimated Eid'}]);
 assert.match(ics,/DTEND;VALUE=DATE:20270102/);
 assert.match(ics,/Not local moon sighting/);
 assert.equal(eventICS([{iso:'2027-02-30',label:'Wrong'}]),null);
});
test('Saʻi one-way lengths alternate and finish at Marwah',()=>{
 assert.equal(saiDirection(0),'Safa → Marwah');
 assert.equal(saiDirection(1),'Marwah → Safa');
 assert.equal(saiDirection(2),'Safa → Marwah');
 assert.equal(saiDirection(7),'Finished at Marwah');
 assert.equal(saiDirection(8),null);
});
test('E-number search gives evidence questions instead of halal or haram verdicts',()=>{
 const e=searchAdditives('E471');assert.equal(e.length,1);assert.match(e[0].source,/animal/);
 assert.ok(searchAdditives('glycerol').length>=1);
 assert.equal(searchAdditives('nonsense').length,0);
 assert.equal(searchAdditives('x'.repeat(101)).length,0);
 const data=readFileSync('src/lib/finalSeven.mjs','utf8');
 assert.doesNotMatch(data,/status:\s*'halal'|status:\s*'haram'/);
});
test('All seven routes have original static sourced guides and enhancements',()=>{
 const app=readFileSync('src/components/ToolApp.tsx','utf8'),page=readFileSync('src/pages/tools/[slug].astro','utf8'),audit=readFileSync('scripts/audit-site.mjs','utf8');
 const descriptors=[
 ['travel-prayer-guide','TravelPrayerDeep','TravelPrayerDeepGuide'],
 ['islamic-events-calendar','IslamicEventsDeep','IslamicEventsDeepGuide'],
 ['printable-hijri-calendar','PrintableHijriDeep','PrintableHijriDeepGuide'],
 ['dhul-hijjah-planner','DhulHijjahDeep','DhulHijjahDeepGuide'],
 ['halal-additives-checker','HalalAdditivesDeep','HalalAdditivesDeepGuide'],
 ['umrah-packing-checklist','UmrahPackingChecklist','UmrahPackingDeepGuide'],
 ['tawaf-sai-counter','TawafSaiCounter','TawafSaiDeepGuide']
 ];
 for(const [slug,component,guide] of descriptors){
  assert.match(app,new RegExp(component));
  assert.match(page,new RegExp(guide));
  assert.match(audit,new RegExp(slug));
  const g=readFileSync('src/components/'+guide+'.astro','utf8');
  assert.match(g,/three-tool-section/);assert.match(g,/three-tool-nav/);
  assert.match(g,/Frequently asked questions/);assert.match(g,/three-tool-facts/);
 }
 const batch=readFileSync('src/components/BatchTools.tsx','utf8');
 const growth=readFileSync('src/components/GrowthTools.tsx','utf8');
 assert.match(batch,/sunnah-journey-packing-v1/);
 assert.match(batch,/Download checklist CSV/);
 assert.match(growth,/sunnah-tawaf-sai-v1/);
 assert.match(growth,/Download progress snapshot/);
});
