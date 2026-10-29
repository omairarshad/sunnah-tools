import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('Qibla knowledge base is server-rendered and source-linked',()=>{
 const page=read('src/pages/tools/[slug].astro'),guide=read('src/components/QiblaGuide.astro');
 assert.match(page,/import QiblaGuide from/);
 assert.match(page,/slug==='qibla-finder'&&<QiblaGuide\/>/);
 assert.match(page,/qibla-calculator/);
 for(const id of ['qibla-how-to-use','qibla-without-compass','qibla-true-magnetic','qibla-geography','qibla-accuracy','qibla-references'])assert.ok(guide.includes('id="'+id+'"'),id);
 for(const link of ['quran.com/2/144','quran.com/2/150','support.google.com/faqs/answer/7364753','ncei.noaa.gov/products/magnetic-declination'])assert.ok(guide.includes(link),link);
 assert.match(guide,/magnetic bearing = true bearing/);
 assert.match(guide,/No camera access is needed/);
});
test('Qibla result adds a compass guide without removing the true north dial',()=>{
 const app=read('src/components/ToolApp.tsx'),ui=read('src/components/QiblaDetails.tsx');
 assert.match(app,/QiblaDetails bearing=\{bearing\}/);
 assert.match(app,/QiblaOrientation bearing=\{bearing\}/);
 assert.match(app,/qiblaContext\(latitude,longitude,bearing\)/);
 assert.match(ui,/verified magnetic declination/);
 assert.match(ui,/Copy Qibla direction/);
 assert.match(ui,/Print direction/);
 assert.match(ui,/details\.status==='at-kaaba'/);
 assert.match(ui,/magneticBearing\(bearing,Number\(declination\)\)/);
 const seo=JSON.parse(read('src/data/toolSeo.ts').match(/export const toolSeo:Record<string,ToolSeoEntry> = (\{[\s\S]*\});/)[1]);
 assert.ok(seo['qibla-finder'].faqs.length>=8);
});
