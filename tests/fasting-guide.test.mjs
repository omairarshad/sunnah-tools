import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
test('fasting page has original, indexable sourced guide and navigable anchors',()=>{
 const template=read('src/pages/tools/[slug].astro'),guide=read('src/components/FastingTimesGuide.astro');
 assert.match(template,/import FastingTimesGuide from/);
 assert.match(template,/slug==='fasting-times'&&<FastingTimesGuide\/>/);
 assert.match(template,/fasting-calculator/);
 for(const id of ['fasting-how-to','fasting-imsak','fasting-iftar','fasting-duas','fasting-methods','fasting-questions','fasting-sources'])assert.ok(guide.includes('id="'+id+'"'),id);
 for(const ref of ['quran.com/2/187','sunnah.com/bukhari:1923','sunnah.com/bukhari:1957','sunnah.com/abudawud:2357','sunnah.com/bukhari:7248'])assert.ok(guide.includes(ref),ref);
 assert.match(guide,/lang="ar" dir="rtl"/);
 assert.match(guide,/not automatically another religious cutoff/);
 const seo=JSON.parse(read('src/data/toolSeo.ts').match(/export const toolSeo:Record<string,ToolSeoEntry> = (\{[\s\S]*\});/)[1]);
 assert.ok(seo['fasting-times'].faqs.length>=10);
});
test('fasting calculator keeps method selection and adds correct time-zone-aware date',()=>{
 const app=read('src/components/ToolApp.tsx'),panel=read('src/components/FastingTimesPanel.tsx');
 assert.match(app,/kind==='fasting-times'&&/);
 assert.match(app,/selectedTimes=\{times\}/);
 assert.match(app,/todayISO=\{dayAtZone\(tz\)\}/);
 assert.match(app,/method=\{method\}/);
 assert.match(panel,/Selected date|selectedISO/);
 assert.match(panel,/next\.name/);
 assert.match(panel,/downloadText/);
});
