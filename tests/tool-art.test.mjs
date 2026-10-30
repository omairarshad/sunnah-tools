import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const home=JSON.parse(readFileSync(new URL('../src/data/homepage.json',import.meta.url),'utf8'));
test('all 44 low-poly SVGs have valid finite coordinates and distinct card references',()=>{
 const cards=home.directory.cards;
 assert.equal(cards.length,44);
 assert.equal(new Set(cards.map(c=>c.slug)).size,44);
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

test('Kaffarah illustration and small icon do not contain cross-shaped emblems',()=>{
 const art=readFileSync(new URL('../public/tool-art/kaffarah-calculator.svg',import.meta.url),'utf8');
 const icons=readFileSync(new URL('../src/data/toolIcons.ts',import.meta.url),'utf8');
 assert.match(art,/A bowl of food represents the feeding component/);
 assert.match(art,/M265 190h70/);
 assert.doesNotMatch(art,/M273 190h54m-27-27v52/);
 assert.doesNotMatch(icons,/'kaffarah-calculator':\['M12 3v18','M3 12h18'/);
 assert.match(icons,/'kaffarah-calculator':\['M4 11h16'/);
 assert.doesNotMatch(icons,/'islamic-age':\['M12 2v20'/);
 assert.doesNotMatch(icons,/'tahajjud-time':\[[^\]]*'M16 3v3'/);
 assert.doesNotMatch(icons,/'laylatul-qadr-nights':\[[^\]]*'M16 3v4'/);
});
