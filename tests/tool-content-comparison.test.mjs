import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const src=read('src/data/toolInsights.ts');
const match=src.match(/export const toolInsights:Record<string,ToolInsight> = (\{[\s\S]*\});/);
assert.ok(match,'Static insights dataset must be available for all tool pages');
const insights=JSON.parse(match[1]);
const slugs=[...read('src/data/tools.ts').matchAll(/slug:'([a-z0-9-]+)'/g)].map(x=>x[1]);
test('all 37 tool pages include original examples, distinct warnings, and comparison references',()=>{
 assert.equal(slugs.length,37);
 assert.deepEqual(Object.keys(insights).sort(),slugs.slice().sort());
 for(const [slug,info] of Object.entries(insights)){
  assert.ok(info.example.length>45,slug+' example');
  assert.ok(info.check.length>30,slug+' limitation');
  assert.ok(/^https:\/\//.test(info.benchmark.url),slug+' benchmark url');
  assert.ok(['direct','related'].includes(info.benchmark.match),slug+' benchmark distinction');
  assert.ok(info.faq.question.endsWith('?')&&info.faq.answer.length>=60,slug+' original FAQ');
 }
 assert.equal(new Set(Object.values(insights).map(x=>x.example)).size,37);
 const template=read('src/pages/tools/[slug].astro');
 assert.match(template,/insight\.example/);
 assert.match(template,/insight\.check/);
 assert.doesNotMatch(template,/save-current-tool|sunnah-favorite-tools-v1|Save this tool to favourites/);
 assert.match(template,/share-current-tool/);
 assert.match(template,/sunnah-recent-tools-v1/);
});
test('Tahajjud interface supports manual mosque times and nightly date-sensitive calculation',()=>{
 const app=read('src/components/ToolApp.tsx');
 const ui=read('src/components/TahajjudCalculator.tsx');
 assert.match(app,/if\(slug==='tahajjud-time'\)return <TahajjudCalculator\/>/);
 for(const expected of ['Enter mosque times','following morning','calculatedNightWindow','manualNightWindow','last third','Sahih al-Bukhari 1145'])assert.ok(ui.includes(expected),expected);
 const seo=JSON.parse(read('src/data/toolSeo.ts').match(/export const toolSeo:Record<string,ToolSeoEntry> = (\{[\s\S]*\});/)[1]);
 for(const slug of slugs)assert.equal(seo[slug].faqs.length>=3,true,slug+' additional question');
});
