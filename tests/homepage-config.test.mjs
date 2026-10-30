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
 assert.deepEqual(orderedSections(['promotions','promotions','bogus','directory']),['promotions','directory','guides']);
});

test('image banners require safe, self-hosted media assets',()=>{
 for(const url of ['https://example.com/a.svg','javascript:alert(1)','/media/../secret.svg','/media/x.svg?foo=bar','/media//img.svg'])assert.equal(safePromoImage(url),null);
 for(const url of ['/media/brands/arabic-alphabet.svg','/media/promo/shop.webp'])assert.equal(safePromoImage(url),url);
});
test('homepage no longer includes the redundant featured mini-card section',()=>{
 assert.equal('featured' in page,false);
 assert.deepEqual(page.layout.sectionOrder,['promotions','directory','guides']);
 assert.equal(page.promotions.title,'Our other projects');
});

test('all 44 tool cards have unique, safe illustration paths and descriptive alt text',()=>{
 const cards=page.directory.cards;
 assert.equal(cards.length,44);
 assert.equal(new Set(cards.map(c=>c.image)).size,44);
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
 assert.equal(page.directory.cards.length,44);
});

test('curated Islamic websites appear in a separate section after tool guides',()=>{
 const component=readFileSync(new URL('../src/components/UsefulLinks.astro',import.meta.url),'utf8');
 const homepage=readFileSync(new URL('../src/pages/index.astro',import.meta.url),'utf8');
 const resource=readFileSync(new URL('../src/data/usefulLinks.ts',import.meta.url),'utf8');
 assert.match(component,/Useful Islamic websites|usefulLinks|resources-heading/);
 assert.match(homepage,/import UsefulLinks/);
 assert.ok(homepage.indexOf('<UsefulLinks/>')>homepage.indexOf('aria-labelledby="learning-heading"'));
 for(const domain of ['https://quran.com/','https://sunnah.com/','https://corpus.quran.com/','https://umrah.nusuk.sa/'])assert.ok(resource.includes(domain),domain);
 assert.match(component,/rel="noopener noreferrer"/);
});

test('the seven additional tools have distinct routes and removed links are absent',()=>{
 const required=['hijama-date-planner','duha-prayer-time','istikhara-guide','friday-sunnah-checklist','islamic-will-planner','aqiqah-planner','sunnah-fasting-planner'];
 for(const slug of required)assert.equal(page.directory.cards.filter(c=>c.slug===slug).length,1,slug);
 const links=readFileSync(new URL('../src/data/usefulLinks.ts',import.meta.url),'utf8');
 assert.doesNotMatch(links,/quranenc\.com|seekersguidance\.org/i);
});
