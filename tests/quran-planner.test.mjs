import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildQuranSchedule,quranScheduleCSV,upgradeQuranBackup,validateQuranSchedule} from '../src/lib/quranPlanner.mjs';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const initial={version:3,pages:604,done:0,days:30,start:'2027-02-08',sessions:5,bufferDays:0};

test('complete Quran page allocation covers every page exactly once',()=>{
 const result=buildQuranSchedule(initial);
 assert.equal(result.readingDays,30);
 assert.equal(result.rows.length,30);
 assert.equal(result.remaining,604);
 assert.equal(result.rows.reduce((total,row)=>total+row.pages,0),604);
 assert.deepEqual(new Set(result.rows.map(row=>row.pages)),new Set([20,21]));
 assert.equal(result.rows[0].from,1);
 assert.equal(result.rows.at(-1).to,604);
 for(let i=1;i<result.rows.length;i++)assert.equal(result.rows[i].from,result.rows[i-1].to+1);
 for(const row of result.rows){assert.equal(row.sessions.reduce((sum,session)=>sum+session.pages,0),row.pages);assert.ok(row.sessions.every(s=>s.from>=row.from&&s.to<=row.to))}
});
test('buffers preserve deadline and remove only assigned new pages',()=>{
 const result=buildQuranSchedule({...initial,bufferDays:1});
 assert.equal(result.readingDays,26);
 assert.equal(result.bufferCount,4);
 assert.equal(result.rows.filter(row=>row.buffer).length,4);
 assert.deepEqual(result.rows.filter(row=>row.buffer).map(row=>row.number),[7,14,21,28]);
 assert.equal(result.rows.reduce((sum,row)=>sum+row.pages,0),604);
 assert.equal(result.endDate,buildQuranSchedule(initial).endDate);
 assert.ok(result.rows.filter(row=>!row.buffer).every(row=>row.pages>=23&&row.pages<=24));
});
test('partial completion starts at the next unread page, without fake progress',()=>{
 const result=buildQuranSchedule({...initial,pages:100,done:53,days:14,bufferDays:2,sessions:3});
 const reading=result.rows.filter(row=>row.pages);
 assert.equal(reading[0].from,54);
 assert.equal(reading.at(-1).to,100);
 assert.equal(result.rows.reduce((sum,row)=>sum+row.pages,0),47);
 assert.equal(result.percent,53);
 const finished=buildQuranSchedule({...initial,done:604});
 assert.equal(finished.remaining,0);
 assert.ok(finished.rows.every(row=>row.pages===0));
});
test('UTC-noon civil date arithmetic retains days across DST',()=>{
 const result=buildQuranSchedule({...initial,days:5,start:'2027-03-27',bufferDays:0});
 assert.deepEqual(result.rows.map(row=>row.date),['2027-03-27','2027-03-28','2027-03-29','2027-03-30','2027-03-31']);
 const autumn=buildQuranSchedule({...initial,days:3,start:'2027-10-30'});
 assert.deepEqual(autumn.rows.map(row=>row.date),['2027-10-30','2027-10-31','2027-11-01']);
});
test('v2 backup migration retains progress and v3 input validation bounds settings',()=>{
 const old={pages:604,done:48,days:30,start:'2027-02-08'};
 assert.deepEqual(upgradeQuranBackup(old),{version:3,...old,sessions:5,bufferDays:0});
 assert.deepEqual(upgradeQuranBackup(initial),initial);
 assert.equal(validateQuranSchedule({...initial,sessions:2}),null);
 assert.equal(upgradeQuranBackup({...initial,sessions:2}),null);
 assert.equal(validateQuranSchedule({...initial,bufferDays:3}),null);
 assert.equal(validateQuranSchedule({...initial,days:3651}),null);
 assert.equal(validateQuranSchedule({...initial,done:605}),null);
 assert.equal(validateQuranSchedule({...initial,start:'2027-02-29'}),null);
 assert.equal(upgradeQuranBackup({...old,done:-1}),null);
});
test('CSV exports the full timetable, not only the UI preview',()=>{
 const csv=quranScheduleCSV({...initial,days:40,bufferDays:1});
 assert.equal(csv.split('\r\n').length,42);
 assert.equal((csv.match(/Buffer \/ catch-up/g)||[]).length,5);
 assert.ok(csv.includes('Reading sessions per day'));
 assert.ok(csv.startsWith('\uFEFF'));
 assert.throws(()=>quranScheduleCSV({...initial,pages:0}));
});
test('Quran Planner has indexable guide, source trail and separate client calculator',()=>{
 const app=read('src/components/ToolApp.tsx'),route=read('src/pages/tools/[slug].astro');
 const component=read('src/components/QuranPlanner.tsx'),guide=read('src/components/QuranPlannerGuide.astro');
 assert.match(app,/slug==='quran-planner'\)return <QuranPlanner\/>/);
 assert.match(route,/slug==='quran-planner'&&<QuranPlannerGuide\/>/);
 for(const anchor of ['quran-how-to','quran-editions','quran-pace','quran-example','quran-catchup','quran-privacy','quran-questions','quran-sources'])assert.ok(guide.includes('id="'+anchor+'"'),anchor);
 for(const ref of ['quran.com/73/4','quran.com/54/17','sunnah.com/bukhari:5054'])assert.ok(guide.includes(ref),ref);
 for(const phrase of ['Replan remaining pages from today','Download complete CSV','Download JSON backup','sunnah-quran-reading-v2','sunnah-quran-reading-v3','Three sessions'])assert.ok(component.includes(phrase),phrase);
 const seo=read('src/data/toolSeo.ts');assert.match(seo,/Quran Reading Planner – Daily Pages, Khatm & Catch-Up Schedule/);
});
