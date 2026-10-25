import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const base=readFileSync(new URL('../src/layouts/Base.astro',import.meta.url),'utf8');
const dark=readFileSync(new URL('../src/styles/dark.css',import.meta.url),'utf8');
const inline=base.match(/<script is:inline>([\s\S]*?)<\/script>/)?.[1];
assert.ok(inline,'early theme bootstrap must run before first paint');

function resolve(saved,prefersDark){
 const root={dataset:{}};
 const context={
  document:{documentElement:root},
  window:{matchMedia:()=>({matches:prefersDark})},
  localStorage:{getItem:()=>saved}
 };
 runInNewContext(inline,context);
 return root.dataset.theme;
}
test('saved light or dark preference overrides the system default',()=>{
 assert.equal(resolve('dark',false),'dark');
 assert.equal(resolve('light',true),'light');
});
test('system dark preference applies when no saved choice exists',()=>{
 assert.equal(resolve(null,true),'dark');
 assert.equal(resolve(null,false),'light');
 assert.equal(resolve('unexpected',true),'dark');
});
test('global theme control is accessible and persists explicit choices',()=>{
 assert.match(base,/id="theme-toggle"/);
 assert.match(base,/aria-pressed="false"/);
 assert.match(base,/aria-label="Switch to dark mode"/);
 assert.match(base,/localStorage\.setItem\(themeStorageKey,next\)/);
 assert.match(base,/themeMedia\?\.addEventListener/);
 assert.match(base,/meta\[name="theme-color"\]/);
});
test('dark palette covers all shared surfaces without altering card art',()=>{
 for(const selector of [
  'html[data-theme="dark"] body',
  'html[data-theme="dark"] .directory .tool-card',
  'html[data-theme="dark"] .tool-panel',
  'html[data-theme="dark"] .tool-inner input',
  'html[data-theme="dark"] .calendar-cell',
  'html[data-theme="dark"] .faq-detail',
  'html[data-theme="dark"] .admin-module',
  'html[data-theme="dark"] .analytics-consent'
 ])assert.ok(dark.includes(selector),'missing dark style: '+selector);
 assert.match(dark,/@media print/);
 assert.doesNotMatch(dark,/\.tool-card-visual img\s*\{\s*filter:/);
});
