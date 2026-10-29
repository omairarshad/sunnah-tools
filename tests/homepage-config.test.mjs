import {test} from 'node:test';
import assert from 'node:assert/strict';
import {safePromoUrl,safePromoImage,safeToolImage,orderedSections,validTone} from '../src/lib/homepageConfig.mjs';
import {readFileSync} from 'node:fs';
const page=JSON.parse(readFileSync(new URL('../src/data/homepage.json',import.meta.url),'utf8'));
test('homepage has prominent Arabic learning link then two other projects',()=>{
 const ids=page.promotions.cards.map(p=>p.id);
 assert.deepEqual(ids.slice(0,3),['arabic-alphabet','islamreact','meemandmoon']);
 assert.equal(page.promotions.cards[0].featured,true);
});
test('all editor external cards use valid safe https URLs',()=>{
 for(const card of page.promotions.cards){assert.ok(safePromoUrl(card.url));assert.equal(validTone(card.tone),card.tone);assert.ok(safePromoImage(card.image))}
});
test('unsafe non-HTTP and credential-bearing URLs are rejected',()=>{
 for(const link of ['javascript:alert(1)','data:text/html,hi','http://example.org/','https://user:pass@example.org','not a url'])assert.equal(safePromoUrl(link),null);
});
test('section layout ignores duplicate and unknown entries and keeps tool directory',()=>{
 assert.deepEqual(orderedSections(['promotions','promotions','bogus','directory']),['directory','promotions','guides']);
});

test('image banners require safe, self-hosted media assets',()=>{
 for(const url of ['https://example.com/a.svg','javascript:alert(1)','/media/../secret.svg','/media/x.svg?foo=bar','/media//img.svg'])assert.equal(safePromoImage(url),null);
 for(const url of ['/media/brands/arabic-alphabet.svg','/media/promo/shop.webp'])assert.equal(safePromoImage(url),url);
});
test('homepage no longer includes the redundant featured mini-card section',()=>{
 assert.equal('featured' in page,false);
 assert.deepEqual(page.layout.sectionOrder,['promotions','directory','guides']);
});

test('all 37 tool cards have unique, safe illustration paths and descriptive alt text',()=>{
 const cards=page.directory.cards;
 assert.equal(cards.length,37);
 assert.equal(new Set(cards.map(c=>c.image)).size,37);
 for(const card of cards){
  assert.ok(safeToolImage(card.image),'invalid tool artwork: '+card.slug);
  assert.ok(card.imageAlt.length>=22,'alt description must describe subject: '+card.slug);
  assert.equal(card.image,'/tool-art/'+card.slug+'.svg');
 }
});
test('tool imagery is restricted to local paths, not remote or executable URLs',()=>{
 for(const uri of ['https://example.com/i.svg','javascript:alert(1)','//evil.test/img.svg','/tool-art/../private.svg','/media/image.svg?next=1'])assert.equal(safeToolImage(uri),null);
 for(const uri of ['/tool-art/qibla-finder.svg','/media/uploaded/new-card.webp'])assert.equal(safeToolImage(uri),uri);
});

test('tool directory defaults to six desktop columns for faster browsing',()=>{
 assert.equal(page.directory.columns,6);
 assert.equal(page.directory.cards.length,37);
});
