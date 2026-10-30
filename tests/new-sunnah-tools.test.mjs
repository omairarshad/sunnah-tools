import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {hijamaPlan,sunnahFastingPlan,aqiqahDates,duhaWindow,datePlanICS,validISO,planCSV} from '../src/lib/newSunnahPlanning.mjs';
import {hijriParts} from '../src/lib/hijriCalendars.mjs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const toDate=iso=>new Date(iso+'T12:00:00Z');
test('Hijama planner produces the 17th, 19th and 21st of each month in order',()=>{
 const plan=hijamaPlan('2026-10-30',6,0);
 assert.ok(plan&&plan.entries.length>=5);
 for(const month of plan.entries){
  assert.deepEqual(month.dates.map(d=>d.day),[17,19,21]);
  for(const d of month.dates){
   const h=hijriParts(toDate(d.originalISO));
   assert.equal(h.day,d.day);
   assert.equal(h.month,month.month);
   assert.equal(h.year,month.year);
  }
 }
 assert.equal(hijamaPlan('not-a-date'),null);
 assert.equal(hijamaPlan('2026-10-30',14),null);
});
test('Hijama one-day shift is illustrative and changes no Hijri day reference',()=>{
 const a=hijamaPlan('2026-10-30',3,0),b=hijamaPlan('2026-10-30',3,1);
 assert.deepEqual(a.entries[0].dates.map(x=>x.day),b.entries[0].dates.map(x=>x.day));
 assert.notEqual(a.entries[0].dates[0].iso,b.entries[0].dates[0].iso);
});
test('fasting planner excludes Ramadan, Eid and Tashriq as voluntary reminders',()=>{
 const plan=sunnahFastingPlan('2026-01-01',180,0);
 assert.ok(plan&&plan.length>10);
 for(const d of plan){
  assert.ok(d.labels.length>0);
  const h=hijriParts(toDate(d.iso));
  if(h.month===9||(h.month===10&&h.day===1)||(h.month===12&&h.day>=10&&h.day<=13))assert.equal(d.allowed,false);
 }
 const allowed=plan.filter(d=>d.allowed);
 assert.ok(allowed.some(d=>d.labels.includes('Monday')));
 assert.ok(allowed.some(d=>d.labels.includes('Thursday')));
 assert.ok(allowed.some(d=>d.labels.includes('White Days')));
 assert.equal(sunnahFastingPlan('bad',90),null);
});
test('Aqiqah birth date counted as day one, Gregorian day arithmetic remains stable',()=>{
 assert.deepEqual(aqiqahDates('2026-10-30'),{
  birthISO:'2026-10-30',daySeven:'2026-11-05',alternative:'2026-11-06',
  dayFourteen:'2026-11-12',dayTwentyOne:'2026-11-19'
 });
 assert.equal(aqiqahDates('2026-02-30'),null);
});
test('Duha time windows use cautious inputs and reject invalid ordering',()=>{
 assert.deepEqual(duhaWindow('07:00','12:30'),{start:'07:20',end:'12:20',sunrise:'07:00',dhuhr:'12:30'});
 assert.equal(duhaWindow('08:30','09:10'),null);
 assert.equal(duhaWindow('garbage','12:30'),null);
});
test('calendar export keeps valid all-day dates and excludes injection',()=>{
 const text=datePlanICS([{iso:'2026-11-05',title:'Aqiqah reminder'},{iso:'2026-11-05',title:'Aqiqah reminder'}],'Aqiqah');
 assert.equal((text.match(/BEGIN:VEVENT/g)||[]).length,1);
 assert.match(text,/DTSTART;VALUE=DATE:20261105/);
 assert.throws(()=>datePlanICS([{iso:'2026-02-31',title:'Invalid'}],'A'),/Invalid/);
 assert.equal(validISO('2026-02-31'),false);
});
test('all seven tools have unique metadata, sources, guide and self-hosted illustration',()=>{
 const slugs=['hijama-date-planner','duha-prayer-time','istikhara-guide','friday-sunnah-checklist','islamic-will-planner','aqiqah-planner','sunnah-fasting-planner'];
 const names=read('src/data/tools.ts'),seo=read('src/data/toolSeo.ts'),insights=read('src/data/toolInsights.ts'),guides=read('src/data/guides.ts'),app=read('src/components/ToolApp.tsx'),guide=read('src/components/NewSunnahGuide.astro');
 for(const slug of slugs){
  assert.ok(names.includes("slug:'"+slug+"'"),slug);
  assert.ok(seo.includes('"'+slug+'"'));
  assert.ok(insights.includes('"'+slug+'"'));
  assert.ok(guides.includes('"'+slug+'"'));
  assert.ok(app.includes("slug==='"+slug+"'"));
  assert.ok(guide.includes("'"+slug+"'"));
  assert.match(read('public/tool-art/'+slug+'.svg'),/<svg /);
 }
});

test('CSV export adds spreadsheet-safe escaping and keeps source caveat',()=>{
 const csv=planCSV([{iso:'2026-10-30',label:'=HYPERLINK("http://example.test")'}]);
 assert.match(csv,/2026-10-30/);
 assert.match(csv,/Umm al-Qura estimate/);
 assert.ok(csv.includes("'=HYPERLINK"),'Formula-like fields must be literal text');
 assert.throws(()=>planCSV([{iso:'2026-02-30',label:'bad'}]),/Invalid/);
});
test('ninth of Muharram is labelled separately from Ashura',()=>{
 const dates=sunnahFastingPlan('2026-06-01',180,0);
 assert.ok(dates.some(item=>item.labels.some(label=>label.includes("Ninth of Muharram"))));
 assert.ok(dates.some(item=>item.labels.includes('Ashura')));
});
test('the seven source-backed deep dives have multiple structured explanations',()=>{
 const route=read('src/pages/tools/[slug].astro');
 const data=read('src/components/DeepSevenKnowledge.astro');
 assert.match(route,/import DeepSevenKnowledge/);
 assert.match(route,/<DeepSevenKnowledge slug=\{slug\}\/>/);
 for(const slug of ['hijama-date-planner','duha-prayer-time','istikhara-guide','friday-sunnah-checklist','islamic-will-planner','aqiqah-planner','sunnah-fasting-planner'])assert.ok(data.includes("'"+slug+"':{"),slug);
 for(const id of ['hijama-evidence','duha-margins','istikhara-no-dream','friday-attend','will-england','aqiqah-seventh','fast-shawwal','fast-exclusions'])assert.ok(data.includes("id:'"+id+"'"),id);
 for(const source of ['https://www.nccih.nih.gov/health/cupping','https://www.gov.uk/make-will/make-sure-your-will-is-legal','https://sunnah.com/bukhari:1166','https://sunnah.com/muslim:1164a'])assert.ok(data.includes(source),source);
});
test('all seven interactive planners include expanded practical functionality',()=>{
 const ui=read('src/components/NewSunnahTools.tsx');
 for(const item of ['hijama-lunar-dates','startBuffer','endBuffer','matter.trim()','new-tool-progress','jurisdiction','counting','fastingCategory','sunnah-fasting-reference'])assert.ok(ui.includes(item),item);
 assert.match(ui,/saveCalendar\('sunnah-fasting-reminders',valid\.map/);
});
