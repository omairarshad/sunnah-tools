import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('Zakat guide is server-rendered and has a complete knowledge base',()=>{
 const page=read('src/pages/tools/[slug].astro'),guide=read('src/components/ZakatGuide.astro');
 assert.match(page,/import ZakatGuide from/);
 assert.match(page,/slug==='zakat-calculator'&&<ZakatGuide\/>/);
 assert.match(page,/zakat-calculator/);
 for(const id of ['zakat-how-to-calculate','zakat-nisab-guide','zakat-assets-guide','zakat-example-guide','zakat-debt-guide','zakat-questions-guide','zakat-references'])assert.ok(guide.includes('id="'+id+'"'),id);
 for(const ref of ['quran.com/9/60','quran.com/9/103','islamic-relief.org.uk/giving/islamic-giving/zakat/hawl/','zakat-and-assets'])assert.ok(guide.includes(ref),ref);
 assert.match(guide,/This is a general educational guide/);
 assert.match(guide,/13,200/);
});
test('Zakat route uses the richer private-by-default calculator',()=>{
 const app=read('src/components/ToolApp.tsx'),component=read('src/components/ZakatCalculator.tsx');
 assert.match(app,/if\(slug==='zakat-calculator'\)return <ZakatCalculator\/>/);
 assert.doesNotMatch(app,/function Zakat\(\)/);
 for(const term of ['Show worked example','Download calculation summary','Metal','hawl','Conditional 2.5% estimate','Clear amounts'])assert.ok(component.includes(term),term);
 assert.doesNotMatch(component,/localStorage|sessionStorage/);
 const seo=JSON.parse(read('src/data/toolSeo.ts').match(/export const toolSeo:Record<string,ToolSeoEntry> = (\{[\s\S]*\});/)[1]);
 assert.ok(seo['zakat-calculator'].faqs.length>=9);
});
