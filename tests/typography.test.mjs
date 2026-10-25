import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const root=new URL('../',import.meta.url);
const load=path=>readFileSync(new URL(path,root),'utf8');
const layout=load('src/layouts/Base.astro'),style=load('src/styles/typography.css');
test('Petrona and Karla are the universal default with robust fallbacks',()=>{
 assert.match(layout,/fonts\.googleapis\.com\/css2\?family=Karla/);
 assert.match(layout,/family=Petrona/);
 assert.match(layout,/display=swap/);
 assert.match(layout,/fonts\.gstatic\.com/);
 assert.match(style,/--font-body:"Karla"/);
 assert.match(style,/--font-display:"Petrona"/);
 assert.match(style,/font-family:var\(--font-body\)/);
 assert.match(style,/font-family:var\(--font-display\)/);
 assert.match(layout,/styles\/typography\.css/);
 for(const css of ['src/styles/global.css','src/styles/premium.css']){
  assert.doesNotMatch(load(css),/font-family:Inter/);
  assert.doesNotMatch(load(css),/font-family:Georgia/);
 }
});
test('font lab and privacy notice reflect the published typography',()=>{
 const page=load('src/pages/font-lab/index.astro'),privacy=load('src/pages/privacy.astro');
 assert.match(page,/Petrona \+ Karla is the live default/);
 assert.match(page,/font-preview=off#tools/);
 assert.doesNotMatch(page,/Inter \+ Georgia typography remains the default/);
 assert.match(privacy,/Website typography \(Google Fonts\)/);
 assert.match(privacy,/Google Fonts privacy information/);
});
