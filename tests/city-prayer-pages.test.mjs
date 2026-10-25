import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const list=read('src/data/cityPrayerPages.ts');
const page=read('src/pages/prayer-times/[city].astro');
const client=read('src/components/CityPrayerTable.tsx');
test('fifteen curated local pages have city-specific notes, dates and coordinates',()=>{
 assert.equal((list.match(/"slug":/g)||[]).length,15);
 assert.equal((list.match(/"note":/g)||[]).length,15);
 assert.match(page,/getStaticPaths/);
 assert.match(page,/city\.note/);
 assert.match(page,/city\.lat/);
 assert.match(page,/city\.tz|city\.method/);
});
test('city prayer values are calculated for the current local day, not frozen at build time',()=>{
 assert.match(client,/setInterval/);
 assert.match(client,/Intl\.DateTimeFormat/);
 assert.match(client,/new PrayerTimes/);
 assert.match(client,/HighLatitudeRule\.recommended/);
 assert.match(client,/CalculationMethod/);
 assert.match(page,/client:only="react"/);
});
