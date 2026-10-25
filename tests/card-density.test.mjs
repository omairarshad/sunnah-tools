import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const css=readFileSync(new URL('../src/styles/tool-cards.css',import.meta.url),'utf8');
const home=readFileSync(new URL('../src/pages/index.astro',import.meta.url),'utf8');
const cms=readFileSync(new URL('../.pages.yml',import.meta.url),'utf8');
test('six tools in each wide desktop row, with condensed imagery and useful summaries',()=>{
 assert.match(css,/\.directory\[data-columns="6"\] \.cards\{[\s\S]*?grid-template-columns:repeat\(6,minmax\(0,1fr\)\)/);
 assert.match(css,/aspect-ratio:5 \/ 3/);
 assert.match(css,/\.directory \.tool-card-visual\{[\s\S]*?min-height:0/);
 assert.doesNotMatch(css,/min-height:205px|height:clamp\(205px|height:220px/);
 assert.match(css,/\.directory \.tool-card-body\{[\s\S]*?min-height:119px/);
 assert.match(home,/class="tool-card-description"/);
 assert.doesNotMatch(home,/class="tool-card-category"/);
});
test('tablet and small mobile cards use responsive columns and accessible controls',()=>{
 for(const width of [1179,1023,819,619,419])assert.ok(css.includes('@media(max-width:'+width+'px)'),width+' breakpoint');
 for(const count of [5,4,3,2])assert.ok(css.includes('repeat('+count+',minmax(0,1fr))'),count+' column layout');
 assert.ok(css.includes('grid-template-columns:1fr'),'one-column small mobile layout');
 assert.match(css,/@media\(max-width:419px\)\{[\s\S]*?\.directory \.tool-card-main\{flex-direction:row/);
 assert.match(css,/\.directory \.favorite:focus-visible\{outline:3px/);
 assert.match(css,/\.directory \.favorite::before\{content:"";position:absolute;inset:-6px\}/);
 assert.match(cms,/name: 6, label: Six columns/);
});
