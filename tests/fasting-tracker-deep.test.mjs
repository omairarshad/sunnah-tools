import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateFastingPlan,migrateLegacyFastingPlan,fastingPlanStats,addCompletedFast,removeCompletedFast,fastingPlanCSV} from '../src/lib/fastingTracker.mjs';

const base={version:2,target:5,carried:2,entries:[]};
test('legacy fasting counters migrate without inventing historical dates',()=>{
 assert.deepEqual(migrateLegacyFastingPlan({total:7,done:3}),{version:2,target:7,carried:3,entries:[]});
 assert.equal(migrateLegacyFastingPlan({total:2,done:3}),null);
 assert.equal(migrateLegacyFastingPlan({total:10001,done:1}),null);
 assert.equal(migrateLegacyFastingPlan([]),null);
});
test('dated make-up and voluntary fasts remain in different counters',()=>{
 const withQada=addCompletedFast(base,{date:'2026-10-20',kind:'qada'},'2026-10-29');
 const withVoluntary=addCompletedFast(withQada,{date:'2026-10-21',kind:'voluntary'},'2026-10-29');
 assert.deepEqual(fastingPlanStats(withVoluntary),{target:5,completed:3,datedQada:1,carried:2,remaining:2,voluntary:1});
 assert.equal(withVoluntary.entries[0].kind,'voluntary');
 const afterRemove=removeCompletedFast(withVoluntary,'2026-10-20');
 assert.deepEqual(fastingPlanStats(afterRemove),{target:5,completed:2,datedQada:0,carried:2,remaining:3,voluntary:1});
 assert.equal(removeCompletedFast(afterRemove,'2026-10-20'),null);
});
test('future, repeated and impossible completion dates cannot be recorded',()=>{
 const one=addCompletedFast(base,{date:'2026-10-22',kind:'qada'},'2026-10-29');
 assert.equal(addCompletedFast(one,{date:'2026-10-22',kind:'voluntary'},'2026-10-29'),null);
 assert.equal(addCompletedFast(one,{date:'2026-10-30',kind:'qada'},'2026-10-29'),null);
 assert.equal(addCompletedFast(one,{date:'2026-02-30',kind:'qada'},'2026-10-29'),null);
 assert.equal(addCompletedFast(one,{date:'2026-10-23',kind:'other'},'2026-10-29'),null);
 assert.equal(addCompletedFast({...base,target:2},{date:'2026-10-23',kind:'qada'},'2026-10-29'),null);
});
test('import validator rejects inconsistent counts, duplicate dates and unexpected fields',()=>{
 assert.equal(validateFastingPlan({...base,carried:6}),null);
 assert.equal(validateFastingPlan({...base,version:1}),null);
 assert.equal(validateFastingPlan({...base,entries:[{date:'2026-10-21',kind:'qada'},{date:'2026-10-21',kind:'voluntary'}]}),null);
 assert.equal(validateFastingPlan({...base,entries:[{date:'2026-10-21',kind:'qada',note:'sensitive'}]}),null);
 assert.equal(validateFastingPlan({...base,entries:[{date:'2026-10-21',kind:'qada'},{date:'2026-10-20',kind:'qada'},{date:'2026-10-19',kind:'qada'},{date:'2026-10-18',kind:'qada'}]}),null);
 assert.equal(validateFastingPlan(null),null);
});
test('CSV preserves legacy status and exports one date per self-reported completion',()=>{
 const plan=addCompletedFast(addCompletedFast(base,{date:'2026-10-20',kind:'qada'},'2026-10-29'),{date:'2026-10-21',kind:'voluntary'},'2026-10-29');
 const csv=fastingPlanCSV(plan);
 assert.equal(csv.codePointAt(0),0xfeff);
 assert.match(csv,/Qada \(legacy undated\),,2,Original browser counter/);
 assert.match(csv,/Voluntary,2026-10-21,1,User recorded/);
 assert.match(csv,/Qada,2026-10-20,1,User recorded/);
 assert.match(csv,/Qada target,,5,User supplied/);
 assert.throws(()=>fastingPlanCSV({version:2,target:-1,carried:0,entries:[]}),RangeError);
});
test('tracker is wired into tool route and can restore a validated private backup',()=>{
 const src=readFileSync(new URL('../src/components/FastingTracker.tsx',import.meta.url),'utf8');
 assert.match(src,/localStorage\.getItem\('sunnah-fasts'\)/);
 assert.match(src,/validateFastingPlan\(JSON\.parse\(await file\.text\(\)\)\)/);
 assert.match(src,/window\.confirm/);
 assert.match(src,/Download private JSON backup/);
 const router=readFileSync(new URL('../src/components/ToolApp.tsx',import.meta.url),'utf8');
 assert.match(router,/if\(slug==='fasting-tracker'\)return <FastingTracker\/>/);
});
