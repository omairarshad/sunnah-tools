import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {prayerChartDays,utcDay,prayerHistorySummary,qadaPace,FIVE_PRAYERS,FARD_COUNTS,widgetConfig} from '../src/lib/prayerFive.mjs';

test('7, 14 and 30 day blank prayer charts preserve civil dates over leap day and DST',()=>{
 assert.equal(prayerChartDays('2028-02-28',7)[1].iso,'2028-02-29');
 const plan=prayerChartDays('2027-03-25',7);
 assert.equal(plan[4].iso,'2027-03-29');
 assert.deepEqual([7,14,30].map(n=>prayerChartDays('2026-11-01',n).length),[7,14,30]);
 assert.equal(prayerChartDays('2027-02-30',7),null);
 assert.equal(prayerChartDays('2027-01-01',31),null);
 assert.equal(utcDay('2028-02-28',2),'2028-03-01');
});
test('Salah history never equates unrecorded days with missed prayers',()=>{
 const sample={'2026-10-29':['Fajr','Dhuhr','Asr'],'2026-10-28':[],'2026-10-27':['Fajr','Dhuhr','Asr','Maghrib','Isha']};
 const s=prayerHistorySummary(sample,'2026-10-29',7);
 assert.equal(s.recordedDays,3);assert.equal(s.unrecordedDays,4);assert.equal(s.ticked,8);
 assert.equal(s.recordedSlots,15);assert.equal(s.percent,53);
 assert.equal(prayerHistorySummary({},'2026-10-29',7).percent,null);
 assert.equal(prayerHistorySummary(sample,'2026-02-30',7),null);
 assert.equal(prayerHistorySummary(sample,'2026-10-29',8),null);
 assert.equal(prayerHistorySummary({'2026-10-29':['Fajr','Fajr']},'2026-10-29',7),null);
});
test('Qada pacing is conditional arithmetic on remaining manually established targets',()=>{
 assert.deepEqual(qadaPace(150,10,5),{remaining:140,daily:5,estimatedDays:28,estimatedWeeks:4,estimatedMonths:1});
 assert.equal(qadaPace(150,150,5).estimatedDays,0);
 for(const bad of [[150,-1,5],[150,151,5],[150,0,0],[150,0,501],[150,0,1.5]])assert.equal(qadaPace(...bad),null);
});
test('Five Fard prayer names and counts are separate from voluntary Sunnah',()=>{
 assert.deepEqual(FIVE_PRAYERS,['Fajr','Dhuhr','Asr','Maghrib','Isha']);
 assert.deepEqual(FARD_COUNTS,[2,4,4,3,4]);
 assert.equal(FARD_COUNTS.reduce((a,b)=>a+b,0),17);
});
test('Widget URL encodes city labels, validates location and exposes appearance controls',()=>{
 const data=widgetConfig({lat:'51.5072',lon:'-0.1276',tz:'Europe/London',city:'London & UK "Mosque"',method:'mwl',school:'hanafi',theme:'dark',sunrise:false,size:'compact'});
 assert.ok(data);assert.match(data.url,/sunrise=0&size=compact/);
 assert.match(data.url,/London\+%26\+UK/);assert.ok(data.html.includes('&amp;'));
 assert.match(data.html,/height:345px/);assert.ok(!data.html.includes('src="https://sunnah.tools/embed/prayer-times/?lat=51.5072&lon='));
 assert.equal(widgetConfig({lat:'',lon:1,tz:'Europe/London',city:'x'}),null);
 assert.equal(widgetConfig({lat:91,lon:0,tz:'Europe/London',city:'x'}),null);
 assert.equal(widgetConfig({lat:51,lon:1,tz:'London',city:'x'}),null);
 assert.equal(widgetConfig({lat:51,lon:1,tz:'Europe/London',city:'x',method:'unknown'}),null);
});
test('Dedicated prayer tools, legacy-safe backup and embed options stay connected',()=>{
 const app=readFileSync('src/components/ToolApp.tsx','utf8');
 const growth=readFileSync('src/components/GrowthTools.tsx','utf8');
 const embedded=readFileSync('src/components/EmbeddedPrayerTimes.tsx','utf8');
 const page=readFileSync('src/pages/tools/[slug].astro','utf8');
 const audit=readFileSync('scripts/audit-site.mjs','utf8');
 for(const [slug,component,guide] of [
 ['prayer-times-widget','PrayerWidgetDeep','PrayerWidgetDeepGuide'],
 ['printable-prayer-chart','PrayerChartDeep','PrayerChartDeepGuide'],
 ['salah-tracker','SalahTrackerDeep','SalahTrackerDeepGuide'],
 ['prayer-rakats-chart','PrayerRakatsDeep','PrayerRakatsDeepGuide'],
 ['qada-prayer-calculator','QadaPrayerCalculator','QadaPrayerDeepGuide']]){
  assert.match(app,new RegExp(component));
  assert.match(page,new RegExp(guide));
  assert.match(audit,new RegExp(slug));
  const content=readFileSync('src/components/'+guide+'.astro','utf8');
  assert.match(content,/three-tool-example/);assert.match(content,/Frequently asked questions/);
 }
 assert.match(growth,/sunnah-qada-plan-v2/);assert.match(growth,/qadaPace/);
 assert.match(embedded,/sunrise/);assert.match(embedded,/embed-compact/);
 const tracker=readFileSync('src/components/SalahTrackerDeep.tsx','utf8');
 assert.match(tracker,/sunnah-salah-history-v2/);assert.match(tracker,/validateSalahHistory/);
 assert.match(tracker,/unknown|Unknown/);
});
