import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(p,'utf8');
test('all 37 shared tools use one last-loaded graphite/sage section hierarchy',()=>{
 const base=read('src/layouts/Base.astro');
 assert.match(base,/import '\.\.\/styles\/tool-surfaces\.css';/);
 assert.ok(base.indexOf('tool-surfaces.css')>base.indexOf('identity-2026.css'));
 const css=read('src/styles/tool-surfaces.css');
 for(const key of ['--ux-canvas','--ux-work','--ux-result','--ux-guide','.tool-aside','.tool-inner .result','.tool-inner .prayers','.tool-inner .fasting-deep-stats','.tool-inner .zakat-fieldset','.tool-inner .table-wrap','.tool-guide-fold','@media(max-width:760px)','@media print'])assert.ok(css.includes(key),key);
 assert.match(css,/html\[data-theme="dark"\]\s*\.tool-screen\[data-tone\]/);
 assert.match(css,/prefers-reduced-motion/);
});
test('Playwright checks every tool in light/dark mobile/desktop with answer contrast and overflow rules',()=>{
 const script=read('scripts/audit-surfaces-ux.mjs'),workflow=read('.github/workflows/tool-page-ux.yml');
 for(const word of ['slugs.length!==37','for(const theme of','for(const [viewport,width,height]','output contrast','work surface blends into canvas','guide navigation blends into working surface','horizontal overflow']) {
  if(word==='horizontal overflow')assert.ok(script.includes("overflow '+m.overflow"),word);
  else assert.ok(script.includes(word),word);
 }
 assert.ok(workflow.includes('node scripts/audit-surfaces-ux.mjs'));
 assert.ok(workflow.includes("feature/graphite-sage-section-hierarchy-*"));
});
test('new palette keeps real neutral working and reading surfaces with accessible dark output',()=>{
 const css=read('src/styles/tool-surfaces.css');
 assert.match(css,/--ux-work:#22292b/);
 assert.match(css,/--ux-result:#e6ece5/);
 assert.match(css,/--ux-guide:#202728/);
 assert.match(css,/--ux-result-text:#18362b/);
 assert.match(css,/border:0!important;border-radius/);
});
