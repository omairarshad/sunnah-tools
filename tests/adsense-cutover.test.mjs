import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ADSENSE_SITE_PUBLISHER_ID} from '../src/lib/adsIdentity.mjs';
import {adsTxtLine,decideAds} from '../src/lib/adsConfig.mjs';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const publisher='ca-pub-4083891573415148';
const oldPublisher='ca-pub-5803311676381609';

test('AdSense verification uses existing YouTube publisher, not rejected website signup',()=>{
 assert.equal(ADSENSE_SITE_PUBLISHER_ID,publisher);
 assert.equal(adsTxtLine(publisher),'google.com, pub-4083891573415148, DIRECT, f08c47fec0942fa0\n');
 assert.equal(decideAds({publisherId:publisher}).canVerify,true);
 assert.equal(decideAds({publisherId:publisher}).enabled,false);
});

test('HTML and seller declaration draw from one canonical ID, never a stale CI variable',()=>{
 const component=read('src/lib/siteAds.ts');
 const preparer=read('scripts/prepare-ads.mjs');
 const layout=read('src/layouts/Base.astro');
 const workflow=read('.github/workflows/publish-hostinger.yml');
 assert.match(component,/publisherId:ADSENSE_SITE_PUBLISHER_ID/);
 assert.doesNotMatch(component,/PUBLIC_ADSENSE_PUBLISHER_ID/);
 assert.match(preparer,/adsTxtLine\(ADSENSE_SITE_PUBLISHER_ID\)/);
 assert.doesNotMatch(preparer,/PUBLIC_ADSENSE_PUBLISHER_ID/);
 assert.match(layout,/name="google-adsense-account" content=\{siteAds.client\}/);
 assert.match(workflow,/dist\/ads.txt/);
 assert.match(workflow,/pub-4083891573415148/);
 assert.match(workflow,/ca-pub-4083891573415148/);
 assert.ok(!workflow.includes('vars.ADSENSE_PUBLISHER_ID'));
 assert.ok(![component,preparer,layout].some(s=>s.includes(oldPublisher)));
});
