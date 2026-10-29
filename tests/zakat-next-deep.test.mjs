import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {hawlReviewTimeline,hawlReviewICS,investmentZakatBreakdown,qurbaniAllocation} from '../src/lib/zakatNextDeep.mjs';
import {hijriToGregorian} from '../src/lib/calculations.mjs';

test('Hijri anniversaries advance by lunar years rather than 365 fixed solar days',()=>{
 const start=hijriToGregorian(1447,9,10).toISOString().slice(0,10);
 const plan=hawlReviewTimeline(start,new Date(start+'T12:00:00Z'),3);
 assert.ok(plan);
 assert.equal(plan.originalHijri.year,1447);
 assert.deepEqual(plan.reviews.map(x=>x.year),[1448,1449,1450]);
 assert.ok(Math.abs((Date.parse(plan.reviews[0].iso)-Date.parse(start))/86400000-354)<3);
 assert.notEqual(plan.reviews[0].iso.slice(5),start.slice(5));
});
test('Hawl day 30 fallback is explicit, shifted illustrations do not change canonical dates',()=>{
 let sample=null;
 for(let year=1444;year<1460&&!sample;year++)for(let month=1;month<=12&&!sample;month++){
  const d=hijriToGregorian(year,month,30);
  if(!d)continue;
  const next=hijriToGregorian(year+1,month,30);
  if(!next)sample=d.toISOString().slice(0,10);
 }
 assert.ok(sample,'Found a genuine calendar month-length contrast');
 const result=hawlReviewTimeline(sample,new Date(sample+'T12:00:00Z'),1,1);
 assert.ok(result);assert.equal(result.reviews[0].clamped,true);
 assert.equal(result.reviews[0].day,29);
 assert.notEqual(result.reviews[0].iso,result.reviews[0].illustrativeISO);
});
test('Hawl rejects impossible dates, future reference, shift and count',()=>{
 assert.equal(hawlReviewTimeline('2026-02-31',new Date('2026-10-29T12:00:00Z')),null);
 assert.equal(hawlReviewTimeline('2030-01-01',new Date('2026-10-29T12:00:00Z')),null);
 assert.equal(hawlReviewTimeline('2020-01-01',new Date('2026-10-29T12:00:00Z'),9),null);
 assert.equal(hawlReviewTimeline('2020-01-01',new Date('2026-10-29T12:00:00Z'),3,2),null);
});
test('Hawl .ics gives all-day review reminders, not binding due-date notifications',()=>{
 const plan=hawlReviewTimeline('2024-04-10',new Date('2026-10-29T12:00:00Z'),3);
 assert.ok(plan);
 const ics=hawlReviewICS(plan,new Date('2026-10-29T12:00:00Z'));
 assert.equal((ics.match(/BEGIN:VEVENT/g)||[]).length,3);
 assert.match(ics,/DTSTART;VALUE=DATE:/);
 assert.match(ics,/NOT an automatic Zakat obligation/);
 assert.throws(()=>hawlReviewICS(null),RangeError);
});
test('Investments distinguish resale, underlying share assets, optional proxy and token assessment',()=>{
 const result=investmentZakatBreakdown({entries:[
  {kind:'trading-share',value:3000,method:'full'},
  {kind:'long-share',value:8000,method:'proxy25'},
  {kind:'currency-crypto',value:1000,method:'full'},
  {kind:'utility-token',value:600,method:'assessed',percent:20}
 ],otherWealth:500,liabilities:500,nisab:2000});
 assert.equal(result.investmentBase,6120);assert.equal(result.net,6120);
 assert.equal(result.status,'threshold-reached');assert.equal(result.conditionalZakat,153);
 assert.equal(result.lines[3].zakatable,120);
});
test('An investment without verified Nisab has no payable output, even with a hypothetical 2.5%',()=>{
 const r=investmentZakatBreakdown({entries:[{kind:'trading-share',value:2000,method:'full'}]});
 assert.equal(r.status,'unchecked');assert.equal(r.conditionalZakat,0);assert.equal(r.hypotheticalZakat,50);
 const below=investmentZakatBreakdown({entries:[{kind:'trading-share',value:2000,method:'full'}],nisab:3000});
 assert.equal(below.status,'below-threshold');assert.equal(below.conditionalZakat,0);
});
test('Investment validation rejects absent underlying percent, bogus token defaults and negative liabilities',()=>{
 const b={entries:[{kind:'long-share',value:1000,method:'underlying'}]};
 assert.equal(investmentZakatBreakdown(b),null);
 assert.equal(investmentZakatBreakdown({entries:[{kind:'utility-token',value:500,method:'assessed'}]}),null);
 assert.equal(investmentZakatBreakdown({entries:[{kind:'trading-share',value:500,method:'full'}],liabilities:-5}),null);
 assert.equal(investmentZakatBreakdown({entries:[{kind:'long-share',value:300,method:'underlying',percent:101}]}),null);
 assert.equal(investmentZakatBreakdown({entries:[{kind:'currency-crypto',value:-2,method:'full'}]}),null);
});
test('Seven-share reservations and whole-cost financing are distinct',()=>{
 const reserved=qurbaniAllocation({animal:'cow',price:700,participants:3,mode:'shares'});
 assert.equal(reserved.capacity,7);assert.equal(reserved.selectedTotal,300);
 assert.equal(reserved.unallocated,400);assert.equal(reserved.remainingShares,4);
 const whole=qurbaniAllocation({animal:'cow',price:700,participants:3,mode:'whole'});
 assert.equal(whole.selectedTotal,700);
 assert.equal(whole.unallocated,0);
 assert.equal(Math.round(whole.allocation.reduce((s,v)=>s+v,0)*100),70000);
});
test('Qurbani pricing handles indivisible pennies, sheep limits and invalid input',()=>{
 const r=qurbaniAllocation({animal:'cow',price:100,participants:7,mode:'shares'});
 assert.equal(Math.round(r.allocation.reduce((s,v)=>s+v,0)*100),10000);
 assert.equal(r.allocation[0],14.29);assert.equal(r.allocation[6],14.28);
 const sheep=qurbaniAllocation({animal:'sheep',price:100,participants:1,mode:'shares'});
 assert.equal(sheep.capacity,1);
 assert.equal(qurbaniAllocation({animal:'sheep',price:100,participants:2,mode:'shares'}),null);
 assert.equal(qurbaniAllocation({animal:'cow',price:-2,participants:2}),null);
 assert.equal(qurbaniAllocation({animal:'camel',price:800,participants:8}),null);
});
test('All three dedicated tool routes, guides and static SEO assertions are wired up',()=>{
 const app=readFileSync('src/components/ToolApp.tsx','utf8');
 const page=readFileSync('src/pages/tools/[slug].astro','utf8');
 const audit=readFileSync('scripts/audit-site.mjs','utf8');
 for(const [slug,component,guide] of [
 ['zakat-anniversary-calculator','HawlDeep','HawlDeepGuide'],
 ['zakat-stocks-crypto','InvestmentZakatDeep','InvestmentZakatDeepGuide'],
 ['qurbani-share-calculator','QurbaniDeep','QurbaniDeepGuide']]){
  assert.match(app,new RegExp('if\\(slug===\\x27'+slug+'\\x27\\)return <'+component));
  assert.match(page,new RegExp(guide));
  assert.match(audit,new RegExp(slug));
  const guideSource=readFileSync('src/components/'+guide+'.astro','utf8');
  assert.match(guideSource,/id="[^"]+-sources"/);
  assert.match(guideSource,/three-tool-example/);
 }
});
