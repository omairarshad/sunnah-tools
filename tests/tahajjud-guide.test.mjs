import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
test('Tahajjud guide provides server-rendered prayer instructions and four Quranic duas',()=>{
 const guide=read('src/components/TahajjudGuide.astro');
 const page=read('src/pages/tools/[slug].astro');
 assert.match(page,/import TahajjudGuide from/);
 assert.match(page,/slug==='tahajjud-time'&&<TahajjudGuide\/>/);
 assert.match(page,/tahajjud-shortcuts/);
 for(const id of ['tahajjud-how-to-pray','tahajjud-duas','tahajjud-rakats','tahajjud-beginners','tahajjud-references'])assert.ok(guide.includes('id="'+id+'"'),id);
 for(const verse of ['Quran 2:201','Quran 3:8','Quran 21:87','Quran 20:114'])assert.ok(guide.includes(verse),verse);
 for(const hadith of ['bukhari:1137','bukhari:1145','bukhari:1154','muslim:755b','abudawud:1439'])assert.ok(guide.includes(hadith),hadith);
 assert.match(guide,/lang="ar" dir="rtl"/);
 assert.match(guide,/Transliteration:/);
 assert.match(guide,/not presented as the complete narrated formula/);
 assert.match(guide,/do not perform a second Witr/);
 assert.equal((guide.match(/transliteration:/g)||[]).length,4);
 assert.equal((guide.match(/meaning:/g)||[]).length,4);
});
test('Night prayer guidance does not promise an obligatory number or unsupported fixed dua',()=>{
 const source=read('src/components/TahajjudGuide.astro');
 assert.match(source,/Two rak'ahs/);
 assert.match(source,/There is no required spoken intention formula/);
 assert.match(source,/not required to recite a particular/);
 assert.match(source,/differ among schools/);
 assert.doesNotMatch(source,/Tahajjud must be exactly [0-9]+ rak/);
});
