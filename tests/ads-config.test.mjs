import {test} from 'node:test';
import assert from 'node:assert/strict';
import {normalizePublisherId,adsTxtLine,decideAds} from '../src/lib/adsConfig.mjs';
const id='ca-pub-1234567890123456';
test('publisher IDs require ca-pub and exactly 16 digits',()=>{
 assert.equal(normalizePublisherId(id),id);
 for(const bad of ['', 'pub-1234567890123456','ca-pub-123','ca-pub-abcdefghijklmnop','ca-pub-12345678901234567'])assert.equal(normalizePublisherId(bad),null);
});
test('ads.txt declaration contains the real configured publisher ID only',()=>{
 assert.equal(adsTxtLine(id),'google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0\n');
 assert.equal(adsTxtLine(''),null);
});
test('ads remain off by default and without certified CMP activation',()=>{
 const basic={publisherId:id,adsEnabled:'true',cmpReady:'false',homeSlot:'1234567890',toolSlot:'0987654321'};
 assert.equal(decideAds(basic).enabled,false);
 assert.equal(decideAds({...basic,cmpReady:'true',adsEnabled:'false'}).enabled,false);
 assert.equal(decideAds({...basic,cmpReady:'true',homeSlot:'not valid'}).enabled,false);
 assert.equal(decideAds({...basic,cmpReady:'true'}).enabled,false,'Must explicitly confirm Sites status Ready');
});
test('ads require all settings and never become active from undefined',()=>{
 assert.equal(decideAds({}).enabled,false);
 assert.equal(decideAds({publisherId:id,adsEnabled:'true',cmpReady:'true',siteReady:'true',homeSlot:'1234567890',toolSlot:'0987654321'}).enabled,true);
});
