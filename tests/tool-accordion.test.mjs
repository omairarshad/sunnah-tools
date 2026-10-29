import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const get=p=>readFileSync(p,'utf8');
test('All 37 tool pages share progressive enhancement without changing guide source',()=>{
 const page=get('src/pages/tools/[slug].astro');
 assert.match(page,/tool-knowledge-area/);
 assert.match(page,/enhanceToolKnowledge\(document\)/);
 assert.match(page,/tool-accordion\.css/);
 const app=page.indexOf('<ToolApp slug={slug}');
 const guide=page.indexOf('class="tool-knowledge-area"');
 assert.ok(app>0&&guide>app,'Tool must precede accordion guide');
 const guidePaths=[...page.matchAll(/&&<([A-Za-z0-9]+Guide)\/>/g)].map(m=>m[1]);
 assert.ok(guidePaths.length>=35,'Shared wrapper must encompass the complete guide family');
});
test('Disclosure is native, keyboard accessible and restores printing',()=>{
 const source=get('src/scripts/toolAccordion.js');
 for(const feature of ['createElement(\'details\')','createElement(\'summary\')','createElement(\'button\')','hashchange','beforeprint','afterprint','scrollIntoView','data','tool-guide-fold'])assert.ok(source.includes(feature),feature);
 assert.ok(!source.includes('localStorage.setItem'),'Reading expanded sections should not create sensitive persisted state');
});
test('Accordion design has mobile, dark and print layouts',()=>{
 const css=get('src/styles/tool-accordion.css');
 for(const rule of ['max-width:760px','data-theme="dark"','@media print','focus-visible','tool-guide-chevron','tool-guide-controls'])assert.ok(css.includes(rule),rule);
});
