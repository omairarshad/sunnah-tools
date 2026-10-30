import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../src/data/toolSeo.ts',import.meta.url),'utf8');
const entry=source.match(/export const toolSeo:Record<string,ToolSeoEntry> = (\{[\s\S]*\});/);
assert.ok(entry,'SEO data export must contain readable static JSON');
const seo=JSON.parse(entry[1]);
const tools=readFileSync(new URL('../src/data/tools.ts',import.meta.url),'utf8');
const slugs=[...tools.matchAll(/slug:'([a-z0-9-]+)'/g)].map(x=>x[1]);
const home=JSON.parse(readFileSync(new URL('../src/data/homepage.json',import.meta.url),'utf8'));
const topics=readFileSync(new URL('../src/data/toolTopics.ts',import.meta.url),'utf8');
const grouped=[...topics.matchAll(/slugs:\[([^\]]+)\]/g)].flatMap(x=>[...x[1].matchAll(/'([^']+)'/g)].map(m=>m[1]));
test('44 indexable tool pages have uniquely written, useful SEO briefs',()=>{
 assert.deepEqual(Object.keys(seo).sort(),slugs.slice().sort());
 assert.equal(new Set(Object.values(seo).map(x=>x.title)).size,44);
 for(const [slug,page] of Object.entries(seo)){
  assert.ok(page.title.length>=30&&page.title.length<90,slug+' concise title');
  assert.ok(page.h1.length>10,slug+' H1');
  assert.ok(page.description.length>=85&&page.description.length<210,slug+' accurate meta description');
  assert.ok(page.summary.length>=50&&page.details.length>=80&&page.caution.length>=60,slug+' helpfully explained');
  assert.ok(Array.isArray(page.faqs)&&page.faqs.length>=2,slug+' extra FAQs');
  for(const faq of page.faqs){assert.ok(faq.question.endsWith('?')&&faq.answer.length>=45,slug+' useful FAQ')}
 }
});
test('popular homepage tools keep prayer, Hijri, Ramadan and Zakat topics contiguous',()=>{
 const order=home.directory.cards.map(x=>x.slug);
 assert.deepEqual(order,grouped);
 assert.equal(new Set(order).size,44);
 assert.deepEqual(order.slice(0,6),['prayer-times','qibla-finder','hijri-converter','tahajjud-time','duha-prayer-time','printable-prayer-chart']);
 assert.ok(order.indexOf('fasting-times')<order.indexOf('zakat-calculator'));
 assert.ok(order.indexOf('zakat-calculator')<order.indexOf('islamic-events-calendar'));
 assert.ok(order.indexOf('fitrana-calculator')<order.indexOf('nisab-calculator'));
 assert.ok(order.indexOf('umrah-packing-checklist')<order.indexOf('tasbih-counter'));
});

test('every top-priority page has keyword-first title and a descriptive H1',()=>{
 const priorities=['hijri-converter','prayer-times','qibla-finder','zakat-calculator','fasting-times','ramadan-timetable','tahajjud-time','islamic-events-calendar','white-days-calendar','fitrana-calculator'];
 for(const slug of priorities){
  const page=seo[slug];
  assert.ok(page.title.length<65,slug+' short search title');
  assert.ok(page.title.toLowerCase().startsWith(page.h1.toLowerCase().slice(0,Math.min(page.h1.length,11))),slug+' intent-first title');
 }
});
test('tool page includes machine-readable FAQs and contextual guides',()=>{
 const page=readFileSync(new URL('../src/pages/tools/[slug].astro',import.meta.url),'utf8');
 assert.match(page,/FAQPage/);
 assert.match(page,/mainEntity:faqItems/);
 assert.match(page,/relatedGuides/);
 assert.match(page,/Calculated for \{renderedDate\}/);
});
