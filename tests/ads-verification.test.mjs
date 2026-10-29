import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ADSENSE_SITE_PUBLISHER_ID} from '../src/lib/adsIdentity.mjs';
import {normalizePublisherId,adsTxtLine,decideAds} from '../src/lib/adsConfig.mjs';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
test('site verification uses the publisher ID provided by the owner',()=>{
 assert.equal(ADSENSE_SITE_PUBLISHER_ID,'ca-pub-4083891573415148');
 assert.equal(normalizePublisherId(ADSENSE_SITE_PUBLISHER_ID),ADSENSE_SITE_PUBLISHER_ID);
 assert.equal(adsTxtLine(ADSENSE_SITE_PUBLISHER_ID),'google.com, pub-4083891573415148, DIRECT, f08c47fec0942fa0\n');
 assert.match(read('src/lib/siteAds.ts'),/ADSENSE_SITE_PUBLISHER_ID/);
 assert.doesNotMatch(read('src/lib/siteAds.ts'),/PUBLIC_ADSENSE_PUBLISHER_ID/);
 assert.equal(normalizePublisherId('pub-4083891573415148'),null);
 assert.match(read('scripts/prepare-ads.mjs'),/ADSENSE_SITE_PUBLISHER_ID/);
});
test('verification never activates ads while consent and ad slots are unset',()=>{
 const result=decideAds({publisherId:ADSENSE_SITE_PUBLISHER_ID});
 assert.equal(result.canVerify,true);
 assert.equal(result.enabled,false);
 assert.equal(result.client,ADSENSE_SITE_PUBLISHER_ID);
 assert.match(read('src/layouts/Base.astro'),/google-adsense-account/);
 assert.match(read('src/layouts/Base.astro'),/siteAds\.enabled&&<script async/);
});
