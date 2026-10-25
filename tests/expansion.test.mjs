import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {FARD_RAKATS,JUZ_STARTS,FOOD_ADDITIVES,nextHawlAnniversary,dhulHijjahDays,portfolioEstimate} from '../src/lib/expansionCalculations.mjs';
test('Fard reference keeps exact daily obligatory units',()=>{
 assert.deepEqual(FARD_RAKATS.map(x=>x.fard),[2,4,4,3,4]);
});
test('all thirty Juz have valid starts and distinct numbers',()=>{
 assert.equal(JUZ_STARTS.length,30);
 assert.deepEqual(JUZ_STARTS.map(x=>x[0]),Array.from({length:30},(_,i)=>i+1));
 for(const entry of JUZ_STARTS)assert.ok(Number.isInteger(entry[1])&&Number.isInteger(entry[2])&&entry[3].length>1);
});
test('additive directory avoids classifying substances as halal or haram automatically',()=>{
 assert.ok(FOOD_ADDITIVES.length>=10);
 const codes=new Set(FOOD_ADDITIVES.map(x=>x.code));assert.equal(codes.size,FOOD_ADDITIVES.length);
 for(const x of FOOD_ADDITIVES)assert.ok(x.source.length>30&&x.check.length>25);
});
test('Zakat portfolio handles empty invalid and positive values',()=>{
 assert.equal(portfolioEstimate([1000,500,500],200)?.conditionalZakat,45);
 assert.equal(portfolioEstimate([-1,2],0),null);
 assert.equal(portfolioEstimate([3,4],-1),null);
 assert.equal(portfolioEstimate([100],200)?.conditionalZakat,0);
});
test('Hawl anniversary is a future date approximately one lunar year after the reference',()=>{
 const h=nextHawlAnniversary('2026-01-01',new Date('2026-01-02T12:00:00Z'));
 assert.ok(h?.date);
 const days=(new Date(h.date+'T12:00:00Z')-new Date('2026-01-01T12:00:00Z'))/86400000;
 assert.ok(days>=353&&days<=356,days);
 assert.equal(nextHawlAnniversary('bogus'),null);
});
test('Dhul Hijjah calendar contains ten consecutive days with Arafah on ninth',()=>{
 const days=dhulHijjahDays(1448);
 assert.equal(days.length,10);
 for(let i=1;i<10;i++)assert.equal((new Date(days[i].date)-new Date(days[i-1].date))/86400000,1);
});
test('all nine new tools are reachable from the shared React router',()=>{
 const src=readFileSync(new URL('../src/components/ExpansionTools.tsx',import.meta.url),'utf8');
 const reg=readFileSync(new URL('../src/data/tools.ts',import.meta.url),'utf8');
 for(const slug of ['prayer-rakats-chart','daily-adhkar','halal-additives-checker','zakat-anniversary-calculator','dhul-hijjah-planner','travel-prayer-guide','quran-juz-finder','zakat-stocks-crypto','hifz-tracker']){
 assert.ok(src.includes("slug==='"+slug+"'"),slug);
 assert.ok(reg.includes("slug:'"+slug+"'"),slug);
 }
});
