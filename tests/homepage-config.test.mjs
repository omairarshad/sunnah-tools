import {test} from 'node:test';
import assert from 'node:assert/strict';
import {safePromoUrl,orderedSections,validTone} from '../src/lib/homepageConfig.mjs';
import {readFileSync} from 'node:fs';
const page=JSON.parse(readFileSync(new URL('../src/data/homepage.json',import.meta.url),'utf8'));
test('homepage has prominent Arabic learning link then two other projects',()=>{
 const ids=page.promotions.cards.map(p=>p.id);
 assert.deepEqual(ids.slice(0,3),['arabic-alphabet','islamreact','meemandmoon']);
 assert.equal(page.promotions.cards[0].featured,true);
});
test('all editor external cards use valid safe https URLs',()=>{
 for(const card of page.promotions.cards){assert.ok(safePromoUrl(card.url));assert.equal(validTone(card.tone),card.tone)}
});
test('unsafe non-HTTP and credential-bearing URLs are rejected',()=>{
 for(const link of ['javascript:alert(1)','data:text/html,hi','http://example.org/','https://user:pass@example.org','not a url'])assert.equal(safePromoUrl(link),null);
});
test('section layout ignores duplicate and unknown entries and keeps tool directory',()=>{
 assert.deepEqual(orderedSections(['promotions','promotions','bogus','directory']),['promotions','directory','featured','guides']);
});
