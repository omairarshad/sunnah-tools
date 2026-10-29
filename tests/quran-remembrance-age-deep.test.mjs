import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {juzIndex,hifzAssessment,migrateHifzLegacy,validateHifzBackup,FEATURED_SURAHS,QURAN_DUAS,ADHKAR_REFERENCES,tasbihStep,TASBIH_PATTERNS,hijriAge} from '../src/lib/quranRemembranceDeep.mjs';
import {hijriToGregorian} from '../src/lib/calculations.mjs';

test('All thirty Juz textual starts are ordered and next-boundary exclusive',()=>{
 const rows=juzIndex();
 assert.equal(rows.length,30);assert.equal(rows[0].startReference,'1:1');
 assert.equal(rows[0].next.surah,2);assert.equal(rows[0].next.ayah,142);
 assert.equal(rows[1].startReference,'2:142');
 assert.equal(rows.at(-1).startReference,'78:1');assert.equal(rows.at(-1).next,null);
 assert.equal(juzIndex('JUZ 30').length,1);
 assert.equal(juzIndex('2:142')[0].number,2);
 assert.equal(juzIndex('Al-Kahf')[0].number,16);
 assert.deepEqual(juzIndex('unknown'),[]);
});
test('Curated Hifz surah verse bounds and pace are validated',()=>{
 const last=FEATURED_SURAHS.find(s=>s.number===112);
 assert.equal(last.ayahs,4);
 const result=hifzAssessment({surah:67,start:1,end:30,completed:12,days:9});
 assert.equal(result.total,30);assert.equal(result.remaining,18);
 assert.equal(result.perDay,2);assert.equal(result.nextAyah,13);
 assert.equal(hifzAssessment({surah:112,start:1,end:5,completed:0,days:7}),null);
 assert.equal(hifzAssessment({surah:67,start:1,end:30,completed:31,days:7}),null);
 assert.equal(hifzAssessment({surah:67,start:1,end:30,completed:0,days:0}),null);
 assert.equal(hifzAssessment({surah:100,start:1,end:5,completed:0,days:7}),null);
});
test('Compatible legacy Hifz plans migrate without fabricating unknown surah counts',()=>{
 const legacy={surah:'Al-Mulk',start:1,end:30,completed:13,days:14};
 assert.equal(migrateHifzLegacy(legacy).surah,67);
 assert.equal(migrateHifzLegacy({...legacy,surah:'Unknown'}),null);
 assert.equal(migrateHifzLegacy({...legacy,end:9999}),null);
 const migrated=migrateHifzLegacy(legacy);
 assert.deepEqual(validateHifzBackup(migrated),migrated);
 assert.equal(validateHifzBackup({...migrated,version:1}),null);
});
test('Quranic duas and authentic Sunnah Adhkar references remain distinct',()=>{
 assert.ok(QURAN_DUAS.length>=5);
 for(const entry of QURAN_DUAS){assert.match(entry.verse,/^\d+:\d+$/);assert.equal(entry.category,'quran');assert.ok(entry.arabic.length>=8);}
 for(const ref of ADHKAR_REFERENCES){assert.ok(ref.source.startsWith('https://sunnah.com/'));assert.ok(ref.period.length>3);}
});
test('Tasbih preset counts are not combined into an invented third formula',()=>{
 const a=TASBIH_PATTERNS['33-33-34'],b=TASBIH_PATTERNS['33-33-33'];
 assert.deepEqual(a.map(s=>s.goal),[33,33,34]);
 assert.deepEqual(b.map(s=>s.goal),[33,33,33,1]);
 assert.equal(tasbihStep('33-33-34',0,32).canAdvance,false);
 assert.equal(tasbihStep('33-33-34',0,33).canAdvance,true);
 assert.equal(tasbihStep('33-33-34',2,34).canAdvance,false);
 assert.equal(tasbihStep('33-33-34',2,34).totalGoal,100);
 assert.equal(tasbihStep('33-33-33',3,1).totalGoal,100);
 assert.equal(tasbihStep('wrong',0,1),null);
 assert.equal(tasbihStep('free',-1,2),null);
 assert.equal(tasbihStep('free',0,-1),null);
});
test('Hijri age is based on completed lunar anniversaries and rejects invalid inputs',()=>{
 const birth=hijriToGregorian(1420,9,10).toISOString().slice(0,10);
 const next=hijriToGregorian(1450,9,10).toISOString().slice(0,10);
 const result=hijriAge(birth,next);
 assert.equal(result.hijriYears,30);
 assert.equal(result.nextYear,1451);
 assert.ok(result.gregorianAge<result.hijriYears);
 assert.equal(hijriAge(next,birth),null);
 assert.equal(hijriAge('2026-02-30','2026-10-29'),null);
 assert.equal(hijriAge('2020-01-01','2026-10-29').hijriYears>0,true);
});
test('Five new interfaces and source-backed static guides are integrated',()=>{
 const app=readFileSync('src/components/ToolApp.tsx','utf8');
 const page=readFileSync('src/pages/tools/[slug].astro','utf8');
 const audit=readFileSync('scripts/audit-site.mjs','utf8');
 for(const [slug,component,guide] of [
 ['quran-juz-finder','QuranJuzDeep','QuranJuzDeepGuide'],
 ['hifz-tracker','HifzDeep','HifzDeepGuide'],
 ['daily-adhkar','DailyAdhkarDeep','DailyAdhkarDeepGuide'],
 ['tasbih-counter','TasbihDeep','TasbihDeepGuide'],
 ['islamic-age','IslamicAgeDeep','IslamicAgeDeepGuide']]){
  assert.match(app,new RegExp('if\\(slug===\\x27'+slug+'\\x27\\)return <'+component));
  assert.match(page,new RegExp(guide));
  assert.match(audit,new RegExp(slug));
  const guideSource=readFileSync('src/components/'+guide+'.astro','utf8');
  assert.match(guideSource,/three-tool-example/);
  assert.match(guideSource,/Frequently asked questions/);
  assert.match(guideSource,/three-tool-nav/);
 }
 assert.match(readFileSync('src/components/HifzDeep.tsx','utf8'),/sunnah-hifz-plan-v1/);
 assert.match(readFileSync('src/components/TasbihDeep.tsx','utf8'),/sunnah-count/);
 assert.doesNotMatch(readFileSync('src/components/IslamicAgeDeep.tsx','utf8'),/localStorage\.setItem/);
});
