import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const page=readFileSync(new URL('../src/pages/font-lab/index.astro',import.meta.url),'utf8');
const base=readFileSync(new URL('../src/layouts/Base.astro',import.meta.url),'utf8');
const css=readFileSync(new URL('../public/font-preview.css',import.meta.url),'utf8');
const labCss=readFileSync(new URL('../src/styles/font-lab.css',import.meta.url),'utf8');
const config=readFileSync(new URL('../astro.config.mjs',import.meta.url),'utf8');
test('noindexed font comparison offers three real Google Fonts pairs',()=>{
 assert.match(page,/noindex=\{true\}/);
 for(const key of ['petrona-karla','alegreya-family','eczar-plex']){
  assert.ok(page.includes("id:'"+key+"'"),key+' variant');
  assert.ok(css.includes('data-font-preview="'+key+'"'),key+' stylesheet');
  assert.ok(base.includes("'"+key+"':"),key+' bootstrap');
 }
 for(const font of ['Petrona','Karla','Alegreya Sans','Eczar','IBM Plex Sans'])assert.ok(page.includes(font),font);
 assert.match(config,/!page.includes\("\/font-lab\/"\)/);
 assert.match(page,/font-preview=off/);
});
test('font preview is opt-in and session-only, leaving existing typography untouched',()=>{
 assert.match(base,/sessionStorage\.setItem\(storageKey,selected\)/);
 assert.match(base,/sessionStorage\.removeItem\(storageKey\)/);
 assert.match(base,/if\(!allowed\(choice\)\)return/);
 assert.match(base,/data-font-preview/);
 assert.match(base,/\/font-preview.css/);
 assert.doesNotMatch(base,/localStorage\.setItem\('sunnah-font-preview'/);
 assert.match(css,/html\[data-font-preview\]/);
 assert.match(labCss,/fonts\.googleapis\.com/);
 assert.match(css,/@media print/);
});
