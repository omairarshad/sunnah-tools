import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('favourites removed from markup, script, and all theme layers',()=>{
 const home=read('src/pages/index.astro');
 for(const fragment of ['data-favorite','favoriteKey','sunnah-favorite-tools-v1','saved-filter','updateSavedButtons','selected===\'saved\''])assert.ok(!home.includes(fragment),'Unexpected favourite reference: '+fragment);
 for(const file of ['src/styles/global.css','src/styles/premium.css','src/styles/dark.css','src/styles/tool-cards.css']){
  assert.doesNotMatch(read(file),/\.favorite(?:\b|\[)|\.saved-filter\b/,'Favourites CSS remains in '+file);
 }
});
test('search, categories, card links and Recently opened remain functional',()=>{
 const home=read('src/pages/index.astro');
 assert.match(home,/class="tool-card-main" href=/);
 assert.match(home,/id="tool-search-input"/);
 assert.match(home,/data-filter=\{category\.toLowerCase\(\)\}/);
 assert.match(home,/id="recent-section"/);
 assert.match(home,/sunnah-recent-tools-v1/);
 assert.match(home,/safeWrite\(recentKey/);
 assert.match(home,/topicHeadings\.forEach/);
});
