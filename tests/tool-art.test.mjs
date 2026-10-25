import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const home=JSON.parse(readFileSync(new URL('../src/data/homepage.json',import.meta.url),'utf8'));
test('all 37 low-poly SVGs have valid finite coordinates and distinct card references',()=>{
 const cards=home.directory.cards;
 assert.equal(cards.length,37);
 assert.equal(new Set(cards.map(c=>c.slug)).size,37);
 for(const card of cards){
  const svg=readFileSync(new URL('../public/tool-art/'+card.slug+'.svg',import.meta.url),'utf8');
  assert.match(svg,/viewBox="0 0 600 360"/,card.slug+' canvas');
  assert.match(svg,/low-poly illustration/,card.slug+' style');
  assert.ok((svg.match(/<polygon\b/g)||[]).length>=10,card.slug+' geometric shapes');
  assert.doesNotMatch(svg,/NaN|Infinity|undefined/,card.slug+' invalid coordinates');
  for(const match of svg.matchAll(/<polygon\b[^>]*\bpoints="([^"]+)"/g)){
   assert.match(match[1],/^-?(?:\d+(?:\.\d+)?|\.\d+),-?(?:\d+(?:\.\d+)?|\.\d+)(?:\s+-?(?:\d+(?:\.\d+)?|\.\d+),-?(?:\d+(?:\.\d+)?|\.\d+))*$/,card.slug+' polygon points');
  }
 }
});
